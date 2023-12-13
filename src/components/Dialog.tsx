import { ComponentProps, forwardRef, useEffect, useRef } from "react";
import { mergeRefs } from "react-merge-refs";
import styled from "styled-components";

const Container = styled.dialog`
  box-shadow: var(--shadow--dark);
  border: 0 none;
  background: transparent;
  margin: auto;
  padding: 0;

  &::backdrop {
    background: rgba(0, 0, 0, 0.5);
  }
`;

const Inner = styled.div`
  padding: 1rem;
  background: var(--color--white);
  border-radius: 0.8rem;
  max-width: 20rem;
  max-height: 20rem;
`;

const Dialog = forwardRef(function Dialog(
  props: ComponentProps<typeof Container>,
  ref
) {
  const containerRef = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const el = containerRef.current;
    const handleClick = (e: MouseEvent) => {
      if (e.target === el) {
        el?.close();
      }
    };
    el?.addEventListener("click", handleClick);
    return () => el?.removeEventListener("click", handleClick);
  }, []);

  return (
    <Container ref={mergeRefs([containerRef, ref])} {...props}>
      <Inner>{props.children}</Inner>
    </Container>
  );
});

export { Dialog };
