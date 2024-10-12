import { useCallback, useState } from "react";

const colors = {
  red: {
    dark: "#BD3830",
    light: "#FCB4B0",
  },
  teal: {
    dark: "#2D8273",
    light: "#A6E5DA",
  },
  blue: {
    dark: "#2D5E82",
    light: "#A0D0F3",
  },
  grey: {
    dark: "#333",
    light: "#e5e5e5",
  },
};

const fallback = {
  type: "countdown",
  duration: 30_000,
  color: colors.red.dark,
};

type State = {
  type: "stopwatch" | "countdown";
  duration: number;
  color: string;
  name?: string;
};

type SetState = (state: Partial<State>) => any;

function useParsedRoute(): [State, SetState] {
  const hash = typeof window !== "undefined" ? window.location.hash : "";
  const [params, setParams] = useState(
    hash
      ? { ...fallback, ...JSON.parse(window.atob(hash.substring(1))) }
      : fallback
  );

  const set = useCallback<SetState>(
    (state) => {
      const newValue = { ...params, ...state };
      setParams(newValue);

      const newHash = window.btoa(JSON.stringify(newValue));
      window.location.hash = newHash;
    },
    [params]
  );

  return [params, set];
}

export { colors, useParsedRoute };
