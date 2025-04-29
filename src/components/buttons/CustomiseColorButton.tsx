import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import styled from "styled-components";

import { IconButton } from "@/components/IconButton";
import { Dialog } from "@/components/Dialog";

import PaintBucketSvg from "@/assets/paint-bucket.svg";
import PipetteSvg from "@/assets/pipette.svg";
import { colors } from "@/utils/useParsedRoute";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

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

const InputContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 0.3rem;
`;

const Input = styled.input`
  border: 0 none;
  border-radius: 0.4rem;
  background: var(--color--grey);
  padding: 0.6rem;
  font-size: 1.4em;
  width: 6.4rem;
`;

const Button = styled.button`
  border: 0 none;
  border-radius: 0.4rem;
  background: var(--color--main);
  color: var(--color--contrast);
  padding: 0.8rem;
  transition: transform 0.2s;

  &:hover,
  &:focus {
    transform: scale(1.02);
  }
`;

type CustomiseColorButtonProps = {
  color: string;
  setColor: (value: string) => any;
};

function CustomiseColorButton({ color, setColor }: CustomiseColorButtonProps) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [value, setValue] = useState(color);

  useEffect(() => {
    setValue(color);
  }, [color]);

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

  const handleSet = useCallback(() => {
    if (!/^#([0-9A-F]{3}){1,2}$/i.test(value)) {
      return;
    }
    setColor(value);
    setValue(value);
    dialog.current?.close();
  }, [value, setColor]);

  return (
    <>
      <IconButton
        title="Customise color"
        onClick={() => dialog.current?.showModal()}
      >
        <PaintBucketSvg />
      </IconButton>

      <Dialog ref={dialog}>
        <Container>
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

          <InputContainer>
            <Input
              type="text"
              placeholder="#"
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
            <Button onClick={handleSet}>Set</Button>
          </InputContainer>
        </Container>
      </Dialog>
    </>
  );
}

export { CustomiseColorButton };
