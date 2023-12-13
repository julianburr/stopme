import { useEffect, useRef } from "react";
import styled from "styled-components";

const Container = styled.div`
  font-size: 1.6rem;
  text-align: center;
  min-width: 10rem;
  padding: 0.4rem 0.8rem;
  border-radius: 0.8rem;
  box-shadow: var(--shadow--normal);
  transition: box-shadow 0.2s;
  margin-bottom: 0.8rem;

  &:focus {
    box-shadow: var(--shadow--dark);
  }

  &:empty {
    color: var(--color--grey);

    &:before {
      content: "Untitled timer";
    }

    &:focus:before {
      content: "";
    }
  }

  &:focus {
    outline: none;
  }
`;

type TimerNameProps = {
  name?: string;
  setName: (value: string) => any;
};

function TimerName({ name, setName }: TimerNameProps) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = ref.current;
    const handleInput: EventListener = () => setName(element?.innerText || "");
    element?.addEventListener("blur", handleInput);
    return () => element?.removeEventListener("blur", handleInput);
  }, [setName]);

  return (
    <Container ref={ref} contentEditable>
      {name}
    </Container>
  );
}

export { TimerName };
