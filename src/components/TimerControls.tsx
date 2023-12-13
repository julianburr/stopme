import styled from "styled-components";

import { ButtonBar } from "@/components/ButtonBar";
import { IconButton } from "@/components/IconButton";

import RestartIcon from "@/assets/restart.svg";
import PlayIcon from "@/assets/play.svg";
import PauseIcon from "@/assets/pause.svg";
import RepeatIcon from "@/assets/repeat.svg";

const Container = styled(ButtonBar)`
  margin-top: -2.4rem;
  transform: translate3d(0, 0, 0);
`;

type TimerControlsProps = {
  type: "stopwatch" | "countdown";
  timer: any;
};

function TimerControls({ type, timer }: TimerControlsProps) {
  return (
    <Container>
      <IconButton onClick={() => timer.reset()} title="Reset">
        <RestartIcon />
      </IconButton>
      <IconButton
        title={timer.status === "running" ? "Pause" : "Start"}
        disabled={timer.status === "finished"}
        onClick={() =>
          timer.status === "running" ? timer.pause() : timer.start()
        }
      >
        {timer.status === "running" ? <PauseIcon /> : <PlayIcon />}
      </IconButton>
      <IconButton
        hidden={type !== "stopwatch"}
        onClick={() => timer.lap()}
        disabled={!timer.display}
        title="Lap"
      >
        <RepeatIcon />
      </IconButton>
    </Container>
  );
}

export { TimerControls };
