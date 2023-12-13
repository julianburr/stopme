import styled from "styled-components";

import { staatliches } from "@/fonts/staatliches";

const Container = styled.div`
  line-height: 0.9;
  font-size: 2rem;
  color: var(--color--grey);
`;

function Logo() {
  return (
    <Container>
      STOP
      <br />
      ME.IO
    </Container>
  );
}

export { Logo };
