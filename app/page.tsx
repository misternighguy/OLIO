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
import { ChatPanel } from "@/components/ChatPanel";

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
        <div className="flex flex-col gap-6">
          <SessionStats />
          <ChatPanel />
        </div>
      </RightPanel>
    </GameLayout>
  );
}
