"use client";

import {
  GameLayout,
  LeftPanel,
  CenterPanel,
  RightPanel,
} from "@/components/GameLayout";
import { ControlsPanel } from "@/components/ControlsPanel";
import { DrillingGrid } from "@/components/DrillingGrid";
import { MobileBalanceStrip } from "@/components/MobileBalanceStrip";
import { RightPanelContent } from "@/components/RightPanelContent";

export default function Home() {
  return (
    <GameLayout>
      <MobileBalanceStrip />
      <LeftPanel>
        <ControlsPanel />
      </LeftPanel>
      <CenterPanel>
        <DrillingGrid />
      </CenterPanel>
      <RightPanel>
        <RightPanelContent />
      </RightPanel>
    </GameLayout>
  );
}
