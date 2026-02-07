"use client";

import {
  GameLayout,
  LeftPanel,
  CenterPanel,
  RightPanel,
} from "@/components/GameLayout";
import { ControlsPanel } from "@/components/ControlsPanel";
import { DrillingGrid } from "@/components/DrillingGrid";
import { SessionStats } from "@/components/SessionStats";

export default function Home() {
  return (
    <GameLayout>
      <LeftPanel>
        <ControlsPanel />
      </LeftPanel>
      <CenterPanel>
        <DrillingGrid />
      </CenterPanel>
      <RightPanel>
        <SessionStats />
      </RightPanel>
    </GameLayout>
  );
}
