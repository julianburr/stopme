import { useMemo, useRef } from "react";
import styled from "styled-components";

import { IconButton } from "@/components/IconButton";
import { Dialog } from "@/components/Dialog";

import PaintBucketSvg from "@/assets/paint-bucket.svg";
import PipetteSvg from "@/assets/pipette.svg";
import { colors } from "@/utils/useParsedRoute";

const ColorGrid = styled.div`
  display: grid;
  gap: 0.3rem;
  grid-template-columns: 1fr 1fr 1fr 1fr;
`;

const ColorButton = styled.button<{ background?: string }>`
  border: 0 none;
  width: 2.4rem;
  height: 2.4rem;
  border-radius: 50%;
  background: ${(props) => props.background || "var(--color--grey)"};
  transition: transform 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover,
  &:focus,
  &:active {
    outline: none;
    transform: scale(1.05);
  }

  & svg {
    height: 1.2em;
    width: auto;
  }
`;

type CustomiseColorButtonProps = {
  setColor: (value: string) => any;
};

function CustomiseColorButton({ setColor }: CustomiseColorButtonProps) {
  const dialog = useRef<HTMLDialogElement>(null);

  const choices = useMemo(() => {
    const choices = [
      colors.red.dark,
      colors.teal.dark,
      colors.blue.dark,
      colors.grey.dark,
      colors.red.light,
      colors.teal.light,
      colors.blue.light,
      colors.grey.light,
    ];
    return window.EyeDropper ? choices.slice(0, -1) : choices;
  }, []);

  return (
    <>
      <IconButton
        title="Customise color"
        onClick={() => dialog.current?.showModal()}
      >
        <PaintBucketSvg />
      </IconButton>

      <Dialog ref={dialog}>
        <ColorGrid>
          {choices.map((color) => (
            <ColorButton
              key={color}
              background={color}
              onClick={() => {
                setColor(color);
                dialog.current?.close();
              }}
            />
          ))}
          {window.EyeDropper && (
            <ColorButton
              onClick={() => {
                const eyeDropper = new window.EyeDropper();
                eyeDropper.open().then((result: any) => {
                  setColor(result.sRGBHex);
                  dialog.current?.close();
                });
              }}
            >
              <PipetteSvg />
            </ColorButton>
          )}
        </ColorGrid>
      </Dialog>
    </>
  );
}

export { CustomiseColorButton };
