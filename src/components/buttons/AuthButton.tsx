import { useRef } from "react";
import styled from "styled-components";

import { Dialog } from "@/components/Dialog";
import { IconButton } from "@/components/IconButton";

import LogInSvg from "@/assets/log-in.svg";

const Label = styled.span`
  padding: 0.2rem 0;
  font-size: 0.8rem;
  opacity: 0.5;
`;

function AuthButton() {
  const dialog = useRef<HTMLDialogElement>(null);

  return (
    <>
      <IconButton onClick={() => dialog.current?.showModal()}>
        <LogInSvg />
      </IconButton>

      <Dialog ref={dialog}>
        <Label>Some good resources on Web Authn:</Label>
        {[
          "https://developer.mozilla.org/en-US/docs/Web/API/Web_Authentication_API",
          "https://webauthn.guide/",
        ].map((link) => (
          <p style={{ wordBreak: "break-all" }} key={link}>
            <a href={link} target="_blank">
              {link}
            </a>
          </p>
        ))}
      </Dialog>
    </>
  );
}

export { AuthButton };
