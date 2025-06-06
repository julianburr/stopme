import { useEffect, useState } from "react";
import styled from "styled-components";

import BatterySvg from "@/assets/battery-warning.svg";
import AlertSvg from "@/assets/alert-circle.svg";

const Container = styled.div`
  width: 100%;
  padding: 0.3rem;
  background: #333;
  color: #fff;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;

  & svg {
    height: 1.4em;
    width: auto;
  }
`;

type WarningBannerProps = {
  duration?: number;
};

function WarningBanner({ duration = 0 }: WarningBannerProps) {
  // Warning if battery level is not enough to finish the current timer
  const [showBatteryWarning, setShowBatteryWarning] = useState(false);
  useEffect(() => {
    navigator?.getBattery?.()?.then((battery: any) => {
      const handleChange = () => {
        // NOTE: just for demo purposes bypass actual battery check
        if (duration > 9999 * 60_000) {
          setShowBatteryWarning(true);
        } else {
          setShowBatteryWarning(
            !battery.charging && duration / 1000 >= battery.dischargingTime
          );
        }
      };
      handleChange();
      battery.addEventListener("chargingchange", handleChange);
      battery.addEventListener("dischargingtimechange", handleChange);
    });
  }, [duration]);

  // Separate warning if user is offline
  const [showNetworkWarning, setShowNetworkWarning] = useState(
    !navigator.onLine
  );
  useEffect(() => {
    const handleChange = () => setShowNetworkWarning(!navigator.onLine);
    navigator.connection?.addEventListener?.("change", handleChange);
    return () =>
      navigator.connection?.removeEventListener?.("change", handleChange);
  }, []);

  if (showBatteryWarning) {
    return (
      <Container>
        <BatterySvg />
        <span>Your battery might not last</span>
      </Container>
    );
  }

  if (showNetworkWarning) {
    return (
      <Container>
        <AlertSvg />
        <span>You are currently offline</span>
      </Container>
    );
  }

  return null;
}

export { WarningBanner };
