import {
  ComponentProps,
  forwardRef,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";
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

const Content = styled.div`
  background: var(--color--white);
  border-radius: 0.8rem;
  max-width: 20rem;
  max-height: 24rem;
  overflow: auto;
`;

const Inner = styled.div`
  padding: 1rem;
`;

const ButtonBar = styled.div`
  position: sticky;
  bottom: 0;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.4rem;
  margin: -1rem 0 0;
  padding: 0.5rem 1rem 1rem;

  &[data-scrollable="true"] {
    background: var(--color--white);
    box-shadow: 0 0 1rem rgba(0, 0, 0, 0.2);
  }
`;

type DialogProps = ComponentProps<typeof Container> & {
  buttons?: ReactNode;
};

const Dialog = forwardRef(function Dialog(
  { buttons, ...props }: DialogProps,
  ref
) {
  const containerRef = useRef<HTMLDialogElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

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

  const [scrollable, setScrollable] = useState(false);
  useEffect(() => {
    const container = containerRef.current;
    const content = contentRef.current;
    if (container && content) {
      const handleScroll = () => {
        setScrollable(
          content.scrollHeight > content.scrollTop + content.clientHeight
        );
      };

      handleScroll();

      content.addEventListener("scroll", handleScroll);
      return () => content.removeEventListener("scroll", handleScroll);
    }
  }, [props.children]);

  return (
    <Container ref={mergeRefs([containerRef, ref])} {...props}>
      <Content ref={contentRef}>
        <Inner>{props.children}</Inner>
        {buttons && (
          <ButtonBar data-scrollable={scrollable}>{buttons}</ButtonBar>
        )}
      </Content>
    </Container>
  );
});

export { Dialog };
