"use client";

import { useSyncExternalStore } from "react";
import type { Note } from "@/content/site";
import { JournalsWorkspace } from "@/components/journals-workspace";

type JournalsWorkspaceMountProps = {
  notes: Note[];
};

export function JournalsWorkspaceMount({ notes }: JournalsWorkspaceMountProps) {
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  if (!mounted) {
    return <div className="min-h-[70vh] bg-[#F4F5F7]" />;
  }

  return <JournalsWorkspace notes={notes} />;
}
