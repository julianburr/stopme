import { ButtonBar } from "@/components/ButtonBar";
import { IconButton } from "@/components/IconButton";

import HourglassSvg from "@/assets/hourglass.svg";
import TimerSvg from "@/assets/timer.svg";

type Type = "stopwatch" | "countdown";

type TypeTabsProps = {
  type: Type;
  setType: (value: Type) => any;
};

function TypeTabs({ type, setType }: TypeTabsProps) {
  return (
    <ButtonBar>
      <IconButton
        title="Stopwatch"
        aria-selected={type === "stopwatch"}
        onClick={() => setType("stopwatch")}
      >
        <HourglassSvg />
      </IconButton>
      <IconButton
        title="Countdown"
        aria-selected={type === "countdown"}
        onClick={() => setType("countdown")}
      >
        <TimerSvg />
      </IconButton>
    </ButtonBar>
  );
}

export { TypeTabs };
