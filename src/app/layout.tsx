import type { Metadata } from "next";
import { PropsWithChildren } from "react";

import { StyledComponentsRegistry } from "@/registry/StyledComponentsRegistry";

export const metadata: Metadata = {
  title: "stopme.io",
};

type RootLayoutProps = PropsWithChildren<Record<never, any>>;

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body>
        <StyledComponentsRegistry>{children}</StyledComponentsRegistry>
      </body>
    </html>
  );
}
