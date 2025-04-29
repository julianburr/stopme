import { useCallback, useEffect, useRef, useState } from "react";

type Status = "idle" | "running" | "paused" | "finished";

const themes = {
  __default: [500, 200, 500, 200, 500],
  mario: [125, 75, 125, 275, 200, 275, 125, 75, 125, 275, 200, 600, 200, 600],
  bond: [
    200, 100, 200, 275, 425, 100, 200, 100, 200, 275, 425, 100, 75, 25, 75, 125,
    75, 25, 75, 125, 100, 100,
  ],
  starwars: [
    500, 110, 500, 110, 450, 110, 200, 110, 170, 40, 450, 110, 200, 110, 170,
    40, 500,
  ],
  sos: [
    100, 30, 100, 30, 100, 200, 200, 30, 200, 30, 200, 200, 100, 30, 100, 30,
    100,
  ],
};

type UseTimerArg = {
  name?: string;
  type: "stopwatch" | "countdown";
  duration: number;
};

function useTimer({ type, duration = 0, name }: UseTimerArg) {
  const [status, setStatus] = useState<Status>("idle");
  const [display, setDisplay] = useState(type === "stopwatch" ? 0 : duration);

  const timer = useRef<NodeJS.Timeout>();
  const wakeLock = useRef<any>();

  const started = useRef<Date>(new Date());
  const startedDuration = useRef<number>(duration);

  const pause = useCallback(async (status: Status = "paused") => {
    // Clear timer
    clearInterval(timer.current);
    setStatus(status);

    // Clean wake lock
    await wakeLock.current?.release?.();
    wakeLock.current = undefined;
  }, []);

  const reset = useCallback(async () => {
    // Clear timer
    clearInterval(timer.current);
    startedDuration.current = duration;
    setDisplay(type === "stopwatch" ? 0 : duration);
    setStatus("idle");

    // Clean wake lock
    await wakeLock.current?.release?.();
    wakeLock.current = undefined;
  }, [duration, type]);

  const start = useCallback(
    async (d = display) => {
      clearInterval(timer.current);

      setStatus("running");
      started.current = new Date();
      startedDuration.current = d;

      // Start screen lock if we can, to avoid the phone going to screen lock
      // while the timer is running
      wakeLock.current = await navigator.wakeLock
        .request("screen")
        .catch(() => {
          // Do nothing...
        });

      // Run interval for the actual timer
      timer.current = setInterval(() => {
        const diff = new Date().getTime() - started.current.getTime();
        const newValue =
          type === "stopwatch"
            ? Math.max(startedDuration.current + diff, 0)
            : Math.max(startedDuration.current - diff, 0);
        setDisplay(newValue);
        if (!newValue) {
          pause("finished");
          if (name?.toLowerCase().includes("mario")) {
            navigator.vibrate(themes.mario);
          } else if (name?.toLowerCase().includes("bond")) {
            navigator.vibrate(themes.bond);
          } else if (name?.toLowerCase().includes("starwars")) {
            navigator.vibrate(themes.starwars);
          } else if (name?.toLowerCase() === "sos") {
            navigator.vibrate(themes.sos);
          } else {
            navigator.vibrate(themes.__default);
          }
        }
      }, 10);
    },
    [display, pause, name, type]
  );

  const lap = useCallback(async () => {
    start(0);
  }, [start]);

  const lastType = useRef(type);
  const lastDuration = useRef(duration);
  useEffect(() => {
    if (type !== lastType.current || duration !== lastDuration.current) {
      reset();
    }
    lastType.current = type;
    lastDuration.current = duration;
  }, [type, duration, reset]);

  return { display, status, start, pause, reset, lap };
}

export { useTimer };
