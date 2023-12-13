import { useRef } from "react";
import styled from "styled-components";

import { IconButton } from "@/components/IconButton";
import { Dialog } from "@/components/Dialog";

import ShareSvg from "@/assets/share.svg";

const Label = styled.span`
  padding: 0.2rem;
  font-size: 0.8rem;
`;

type ShareButtonProps = {
  name?: string;
};

function ShareButton({ name }: ShareButtonProps) {
  const dialog = useRef<HTMLDialogElement>(null);

  return (
    <>
      <IconButton
        title="Share"
        onClick={() =>
          navigator.share
            ? navigator.share({
                title: "stopme.io",
                text: name || "Untitled timer",
                url: window.location.href,
              })
            : dialog.current?.showModal()
        }
      >
        <ShareSvg />
      </IconButton>

      <Dialog ref={dialog}>
        <Label>Copy the following URL:</Label>
        <p style={{ wordBreak: "break-all" }}>{window.location.href}</p>
      </Dialog>
    </>
  );
}

export { ShareButton };
