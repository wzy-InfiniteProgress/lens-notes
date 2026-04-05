"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ChevronRight, Search } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import {
  JOURNAL_CATEGORY_LABELS,
  type JournalCategory,
  type Note,
} from "@/content/site";

const CATEGORY_ACCENTS: Record<JournalCategory, string> = {
  life: "#8BA59B",
  study: "#9DA6B2",
  fragment: "#C2B8B0",
};

const FILTERS = [
  { value: "all", label: "全部" },
  { value: "life", label: JOURNAL_CATEGORY_LABELS.life },
  { value: "study", label: JOURNAL_CATEGORY_LABELS.study },
  { value: "fragment", label: JOURNAL_CATEGORY_LABELS.fragment },
] as const;

const headerVariants = {
  hidden: { opacity: 0, y: -20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" as const },
  },
};

const gridVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      duration: 0.45,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

type JournalsWorkspaceProps = {
  notes: Note[];
};

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

function stripMarkup(value: string) {
  return value.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

export function JournalsWorkspace({ notes }: JournalsWorkspaceProps) {
  const [activeTab, setActiveTab] = useState<(typeof FILTERS)[number]["value"]>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredNotes = useMemo(() => {
    return notes.filter((note) => {
      const category = note.journalCategory ?? "life";
      const matchTab = activeTab === "all" || category === activeTab;
      const searchableContent = stripMarkup(note.content).toLowerCase();
      const matchSearch =
        note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        searchableContent.includes(searchQuery.toLowerCase());
      return matchTab && matchSearch;
    });
  }, [activeTab, notes, searchQuery]);

  const filterKey = `${activeTab}:${searchQuery}`;

  return (
    <div className="min-h-screen bg-[#F4F5F7] text-[#2C2C2C] antialiased selection:bg-[#E5E9E7] selection:text-[#2C2C2C]">
      <header className="w-full pt-28 pb-20 flex flex-col items-center justify-center">
        <motion.div
          variants={headerVariants}
          initial="hidden"
          animate="show"
          className="flex flex-col items-center"
        >
          <h1 className="font-title text-4xl font-extralight tracking-[0.22em] text-[#1A1A1A] sm:text-[56px] sm:leading-none sm:ml-[0.22em]">
            WORKSPACE
          </h1>
          <div className="mt-6 flex items-center space-x-4">
            <span className="h-px w-8 bg-gray-300/50" />
            <p className="text-[13px] font-light uppercase tracking-[0.32em] text-[#888888] sm:ml-[0.32em]">
              个人笔记空间
            </p>
            <span className="h-px w-8 bg-gray-300/50" />
          </div>
        </motion.div>
      </header>

      <div className="w-full pb-28">
        <div className="mx-auto max-w-[1440px] px-6 md:px-12 lg:px-20 xl:px-24">
          <div className="mb-14 flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div className="flex flex-wrap items-center gap-4">
              {FILTERS.map((filter) => (
                <button
                  key={filter.value}
                  type="button"
                  onClick={() => setActiveTab(filter.value)}
                  className={`rounded-full px-6 py-2.5 text-[14px] font-medium transition-all duration-300 ${
                    activeTab === filter.value
                      ? "nm-pressed text-[#2C2C2C]"
                      : "nm-flat text-[#888888] hover:text-[#555555] active:scale-95"
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>

            <div className="nm-input-container group relative flex w-full items-center rounded-full md:w-auto">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-5 text-[#A0A0A0] transition-colors group-focus-within:text-[#555555]">
                <Search size={16} strokeWidth={1.5} />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="搜索笔记"
                className="w-full bg-transparent py-3 pl-12 pr-5 text-[14px] text-[#333333] placeholder-[#A0A0A0] focus:outline-none md:w-[280px]"
              />
            </div>
          </div>

          <AnimatePresence initial={false} mode="wait">
            <motion.div
              key={filterKey}
              variants={gridVariants}
              initial="hidden"
              animate="show"
              exit={{ opacity: 0, y: -6, transition: { duration: 0.14, ease: "easeOut" } }}
              className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 xl:gap-10"
            >
              {filteredNotes.map((note) => {
                const category = note.journalCategory ?? "life";

                return (
                  <Link
                    key={note.id}
                    href={`/journals/${note.slug}`}
                    className="group nm-flat nm-flat-hover flex h-[340px] flex-col justify-between rounded-[20px] p-8 xl:p-10"
                  >
                    <div>
                      <div className="mb-6 flex items-center space-x-3">
                        <span
                          className="h-2 w-2 rounded-full shadow-[inset_1px_1px_2px_rgba(0,0,0,0.1)]"
                          style={{ backgroundColor: CATEGORY_ACCENTS[category] }}
                        />
                        <span className="text-[12px] font-medium tracking-[0.08em] text-[#888888]">
                          {JOURNAL_CATEGORY_LABELS[category]}
                        </span>
                      </div>

                      <h3 className="mb-4 text-[22px] font-medium leading-snug text-[#1A1A1A] transition-colors group-hover:text-black">
                        {note.title}
                      </h3>

                      <p className="line-clamp-3 text-[14px] font-light leading-[1.8] text-[#737373]">
                        {note.excerpt}
                      </p>
                    </div>

                    <div className="mt-8 flex items-center justify-between border-t border-[#E8EAE9]/60 pt-5">
                      <span className="font-mono text-[13px] tracking-wide text-[#A0A0A0]">
                        {formatDate(note.date)}
                      </span>
                      <div className="nm-flat flex h-8 w-8 items-center justify-center rounded-full text-[#B0B0B0] transition-all duration-300 group-hover:text-[#444444]">
                        <ChevronRight
                          size={18}
                          strokeWidth={1.5}
                          className="transition-transform group-hover:translate-x-0.5"
                        />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </motion.div>
          </AnimatePresence>

          {filteredNotes.length === 0 ? (
            <div className="flex w-full flex-col items-center justify-center py-32 text-[#A0A0A0]">
              <div className="nm-pressed mb-6 rounded-full p-6">
                <Search size={32} strokeWidth={1} className="opacity-50" />
              </div>
              <p className="text-[14px] font-light tracking-wide text-[#888888]">
                {searchQuery
                  ? `未能找到匹配“${searchQuery}”的笔记`
                  : "还没有随笔，去后台新建第一篇吧"}
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
