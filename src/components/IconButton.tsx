import styled from "styled-components";

const IconButton = styled.button`
  border: 0 none;
  border-radius: 0.8rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  gap: 0.1rem;
  box-shadow: 0 0.2rem 1rem rgba(0, 0, 0, 0.1);
  background: white;
  transition: var(--shadow--normal);
  height: 3.6rem;
  width: 3.6rem;

  &:hover {
    transform: scale(1.05);
    box-shadow: var(--shadow--dark);
  }

  & svg {
    height: 1.4rem;
    width: auto;
  }

  &[aria-selected="true"] {
    background: var(--color--main);
    color: var(--color--contrast);
  }

  &[hidden] {
    pointer-events: none;
    opacity: 0;
  }
`;

export { IconButton };
