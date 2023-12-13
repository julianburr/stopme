import { Fragment, useRef, useState } from "react";

import { IconButton } from "@/components/IconButton";
import { Dialog } from "@/components/Dialog";

import BadgeCheckSvg from "@/assets/badge-check.svg";
import styled from "styled-components";

const Content = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const Label = styled.span`
  padding: 0.2rem;
  font-size: 0.8rem;
`;

const Input = styled.input`
  border: 0 none;
  border-radius: 0.4rem;
  background: var(--color--grey);
  padding: 0.8rem;
  font-size: 1.4em;
`;

const Button = styled.button`
  border: 0 none;
  border-radius: 0.4rem;
  background: var(--color--main);
  color: var(--color--contrast);
  padding: 0.8rem;
  width: 100%;
  margin-top: 0.8rem;
  transition: transform 0.2s;

  &:hover,
  &:focus {
    transform: scale(1.02);
  }
`;

type ConfirmMobileButtonProps = {
  name?: string;
};

function ConfirmMobileButton({ name }: ConfirmMobileButtonProps) {
  const dialog = useRef<HTMLDialogElement>(null);

  const mobile = useRef<HTMLInputElement>(null);
  const code = useRef<HTMLInputElement>(null);

  const [sent, setSent] = useState(false);
  const [verified, setVerified] = useState(false);

  return (
    <>
      <IconButton
        title="Confirm mobile number"
        onClick={() => dialog.current?.showModal()}
      >
        <BadgeCheckSvg />
      </IconButton>

      <Dialog
        ref={dialog}
        onClose={() => {
          setSent(false);
          setVerified(false);
        }}
      >
        <Content>
          {verified ? (
            <>
              <p>Good job!</p>
              <p>
                I&apos;m not actually checking the code you might have manually
                entered, but still, good job!
              </p>
            </>
          ) : sent ? (
            <Fragment key="code">
              <Label>Enter verification code:</Label>
              <Input ref={code} name="code" type="number" />
              <Button onClick={() => setVerified(true)}>Verify</Button>
            </Fragment>
          ) : (
            <Fragment key="number">
              <Label>Enter your mobile number:</Label>
              <Input
                ref={mobile}
                name="mobile"
                type="tel"
                autoComplete="mobile"
              />
              <Button
                onClick={() => {
                  const cleanNumber = mobile.current?.value
                    ?.replace(/\s/g, "")
                    ?.replace(/^0/, "+61");
                  if (cleanNumber) {
                    if (navigator.credentials) {
                      const ac = new AbortController();
                      (navigator.credentials as any)
                        .get({
                          otp: { transport: ["sms"] },
                          signal: ac.signal,
                        })
                        .then((otp: any) => {
                          if (otp.code && code.current) {
                            code.current.value = otp.code;
                          }
                        });
                    }
                    fetch("/api/send-sms", {
                      method: "POST",
                      body: JSON.stringify({ number: cleanNumber }),
                    });
                    setSent(true);
                  }
                }}
              >
                Submit
              </Button>
            </Fragment>
          )}
        </Content>
      </Dialog>
    </>
  );
}

export { ConfirmMobileButton };
