import styled from "styled-components";

import { bebasNeue } from "@/fonts/bebasNeue";
import { KeyboardEvent, useCallback, useEffect, useRef, useState } from "react";

const Container = styled.div`
  width: 16rem;
  height: 16rem;
  border-radius: 50%;
  background: var(--color--main);
  color: var(--color--contrast);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--shadow--normal);
  font-family: ${bebasNeue.style.fontFamily};
  font-size: 5rem;
  transition: box-shadow .2s, transform .2s;

  &:focus-within {
    transform: scale(1.05);
    box-shadow(--shadow-dark);

    & span {
      opacity: .2;
    }
  }
`;

const Value = styled.span`
  font-variant-numeric: tabular-nums;

  &&:focus {
    outline: none;
    opacity: 1;
  }
`;

type TimerDisplayProps = {
  type: "stopwatch" | "countdown";
  timer: any;
  setDuration: (value: number) => any;
};

function TimerDisplay({ type, timer, setDuration }: TimerDisplayProps) {
  const [minutes, setMinutes] = useState(timer.display / 1000 / 60);
  const [seconds, setSeconds] = useState((timer.display / 1000) % 60);
  useEffect(() => {
    setMinutes(timer.display / 1000 / 60);
    setSeconds((timer.display / 1000) % 60);
  }, [timer.display]);

  const minutesRef = useRef<HTMLSpanElement>(null);
  const secondsRef = useRef<HTMLSpanElement>(null);
  const handleTimeChange = useCallback(() => {
    if (!minutesRef.current || !secondsRef.current) {
      return;
    }

    minutesRef.current.innerText = minutesRef.current?.innerText || "0";
    secondsRef.current.innerText = secondsRef.current?.innerText || "0";

    if (parseInt(secondsRef.current?.innerText) > 60) {
      secondsRef.current.innerText = "00";
    } else if (parseInt(secondsRef.current?.innerText) < 10) {
      secondsRef.current.innerText = secondsRef.current?.innerText
        .padStart(2, "0")
        .substring(-2);
    }

    setDuration(
      parseInt(minutesRef.current?.innerText) * 60 * 1000 +
        parseInt(secondsRef.current?.innerText) * 1000
    );
  }, [setDuration]);

  const handleKeyDown = useCallback((e: KeyboardEvent<HTMLSpanElement>) => {
    console.log({ e });
    const target = e.target as any;
    if (e.key.match(/[0-9]/)) {
      if (
        target?.getAttribute("data-label") === "seconds" &&
        target.innerText.length === 2
      ) {
        e.preventDefault();
      }
      return;
    }

    if (e.key === "Backspace") {
      return;
    }

    if (e.metaKey) {
      return;
    }

    if (e.key === "Escape" || e.key === "Enter" || e.key === "Tab") {
      target?.blur();
      return;
    }

    e.preventDefault();
  }, []);

  // Add current timer to page title if page is in the background
  const [visible, setVisible] = useState(
    window.document?.visibilityState !== "hidden"
  );
  useEffect(() => {
    const handleChange = () =>
      setVisible(window.document?.visibilityState !== "hidden");
    window.document.addEventListener("visibilitychange", handleChange);
    return () =>
      window.document.addEventListener("visibilitychange", handleChange);
  }, []);

  useEffect(() => {
    const m = Math.floor(minutes);
    const s = `${Math.floor(seconds)}`.padStart(2, "0");
    window.document.title = visible ? `stopme.io` : `${m}:${s} — stopme.io`;
  }, [visible, minutes, seconds]);

  return (
    <Container>
      <Value
        key={timer.key}
        ref={minutesRef}
        data-label="minutes"
        contentEditable={timer.status !== "running"}
        inputMode="decimal"
        onBlur={handleTimeChange}
        onKeyDown={handleKeyDown}
      >
        {Math.floor(minutes)}
      </Value>
      <span>:</span>
      <Value
        key={timer.key}
        ref={secondsRef}
        data-label="seconds"
        contentEditable={timer.status !== "running"}
        inputMode="decimal"
        onBlur={handleTimeChange}
        onKeyDown={handleKeyDown}
      >
        {`${Math.floor(seconds)}`.padStart(2, "0")}
      </Value>
    </Container>
  );
}

export { TimerDisplay };
