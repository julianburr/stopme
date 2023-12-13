"use client";

import { useEffect, useState } from "react";
import { readableColor } from "polished";
import styled, { createGlobalStyle } from "styled-components";

import { staatliches } from "@/fonts/staatliches";

import { colors, useParsedRoute } from "@/utils/useParsedRoute";
import { useTimer } from "@/utils/useTimer";

import { Logo } from "@/components/Logo";
import { TypeTabs } from "@/components/TypeTabs";
import { TimerName } from "@/components/TimerName";
import { WarningBanner } from "@/components/WarningBanner";
import { TimerDisplay } from "@/components/TimerDisplay";
import { TimerControls } from "@/components/TimerControls";
import { ButtonBar } from "@/components/ButtonBar";
import { CustomiseColorButton } from "@/components/buttons/CustomiseColorButton";
import { AddContactsButton } from "@/components/buttons/AddContactsButton";
import { ShareButton } from "@/components/buttons/ShareButton";
import { ConfirmMobileButton } from "@/components/buttons/ConfirmMobileButton";

const GlobalStyles = createGlobalStyle<{ color: string }>`
  :root {
    --color--white: #fff;
    --color--dark: #333;
    --color--black: #000;
    --color--grey: #e5e5e5;

    --color--main: ${(props) => props.color};
    --color--contrast: ${(props) =>
      readableColor(props.color, "#333", "#fff", true)};

    --shadow--normal: 0 0.2rem 1.2rem rgba(0, 0, 0, 0.1);
    --shadow--dark: 0 0.2rem 1.2rem rgba(0, 0, 0, 0.2);
  }

  *,
  *:before,
  *:after {
    box-sizing: border-box;
  }

  html,
  body {
    padding: 0;
    margin: 0;
    width: 100%;
    height:100%;
    font-family: ${staatliches.style.fontFamily};
    color: var(--color--dark);

    -webkit-tap-highlight-color: transparent;
  }

  a, button, select, input {
    font: inherit;
  }

  a, button {
    cursor: pointer;
  }

  p {
    margin: .3rem 0;

    &:first-child {
      margin-top: 0;
    }

    &:last-child {
      margin-bottom: 0;
    }
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  width: 100%;
  height: 100%;
`;

const Content = styled.div`
  padding: 0.6rem;
  display: flex;
  width: 100%;
  flex-direction: column;
  flex: 1;
`;

const Main = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.8rem;
  flex: 1;
`;

const Footer = styled.footer`
  width: 100%;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export default function Home() {
  const [params, setParam] = useParsedRoute();

  const timer = useTimer({
    name: params.name,
    type: params.type,
    duration: params.duration,
  });

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <>
      <GlobalStyles color={params.color || colors.red.dark} />

      <Container>
        <WarningBanner
          duration={params.type === "countdown" ? params.duration : undefined}
        />

        <Content>
          <Logo />

          <Main>
            <TypeTabs
              type={params.type}
              setType={(value) => setParam("type", value)}
            />
            <TimerName
              name={params.name}
              setName={(value) => setParam("name", value)}
            />

            <TimerDisplay
              type={params.type}
              timer={timer}
              setDuration={(value) => setParam("duration", value)}
            />
            <TimerControls type={params.type} timer={timer} />
          </Main>

          <Footer>
            <ButtonBar>
              <CustomiseColorButton
                setColor={(value) => setParam("color", value)}
              />
              <AddContactsButton />
              <ShareButton name={params.name} />
            </ButtonBar>
            <ButtonBar>
              <ConfirmMobileButton />
            </ButtonBar>
          </Footer>
        </Content>
      </Container>
    </>
  );
}
