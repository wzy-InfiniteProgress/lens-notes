import { Header } from "@/components/header";
import { JournalsWorkspaceMount } from "@/components/journals-workspace-mount";
import { getPublishedJournals } from "@/lib/notes/data";

export const metadata = {
  title: "随笔 | Lens Notes",
  description: "独立于照片手记之外的生活笔记、学习记录与一些被慢慢写下来的日常片段。",
};

export default async function JournalsPage() {
  const notes = await getPublishedJournals();

  return (
    <div>
      <Header />
      <JournalsWorkspaceMount notes={notes} />
    </div>
  );
}
