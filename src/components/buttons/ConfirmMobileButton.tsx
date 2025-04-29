import { Fragment, useCallback, useEffect, useRef, useState } from "react";

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

const WrapInput = styled.div`
  display: flex;
  flex-direction: row;
  gap: 0.3rem;
  align-items: center;
  justify-content: center;
  background: var(--color--grey);
  font-size: 1.4em;
  padding: 0.8rem;
  width: 100%;

  &:focus-within {
    outline: -webkit-focus-ring-color auto 1px;
  }
`;

const CountryCode = styled.span`
  display: flex;
  flex-shrink: 0;
  font-size: 0.8em;
  color: var(--color--dark);
  opacity: 0.5;
`;

const Input = styled.input`
  border: 0 none;
  border-radius: 0.4rem;
  font-size: 1.4em;
  background: transparent;
  width: 10rem;

  &:focus {
    outline: none;
  }
`;

const CodeInput = styled.input`
  border: 0 none;
  border-radius: 0.4rem;
  background: var(--color--grey);
  font-size: 1.4em;
  padding: 0.8rem;
  width: 100%;
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

  const handleSubmit = useCallback(() => {
    const cleanNumber = mobile.current?.value
      ?.replace(/\s/g, "")
      ?.replace(/^0/, "");
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
        body: JSON.stringify({ number: `+61${cleanNumber}` }),
      });
      setSent(true);
    }
  }, []);

  const handleVerify = useCallback(() => {
    setVerified(true);
  }, []);

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
        buttons={
          verified ? null : sent ? (
            <Button onClick={handleVerify}>Verify</Button>
          ) : (
            <Button onClick={handleSubmit}>Submit</Button>
          )
        }
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
              <CodeInput ref={code} name="code" type="number" />
            </Fragment>
          ) : (
            <Fragment key="number">
              <Label>Enter your phone number to receive OTP:</Label>
              <WrapInput>
                <CountryCode>+61</CountryCode>
                <Input
                  ref={mobile}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleSubmit();
                    }
                  }}
                  name="mobile"
                  type="tel"
                  autoComplete="mobile"
                />
              </WrapInput>
            </Fragment>
          )}
        </Content>
      </Dialog>
    </>
  );
}

export { ConfirmMobileButton };
