"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus, Trash2, Workflow, X } from "lucide-react";
import { MermaidPreview } from "@/components/mermaid-preview";

type MindmapBranch = {
  id: string;
  title: string;
  childrenText: string;
};

type MindmapComposerModalProps = {
  open: boolean;
  onClose: () => void;
  onSave: (code: string) => void;
};

function createBranch(): MindmapBranch {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    title: "新的分支",
    childrenText: "要点 A\n要点 B",
  };
}

function indentNode(value: string, depth: number) {
  return `${"  ".repeat(depth)}${value}`;
}

function buildMindmapCode(rootTitle: string, branches: MindmapBranch[]) {
  const lines = ["mindmap", indentNode(`root((${rootTitle || "新的主题"}))`, 1)];

  branches.forEach((branch) => {
    const branchTitle = branch.title.trim() || "未命名分支";
    lines.push(indentNode(branchTitle, 2));

    branch.childrenText
      .split("\n")
      .map((child) => child.trim())
      .filter(Boolean)
      .forEach((child) => {
        lines.push(indentNode(child, 3));
      });
  });

  return lines.join("\n");
}

export function MindmapComposerModal({
  open,
  onClose,
  onSave,
}: MindmapComposerModalProps) {
  const [rootTitle, setRootTitle] = useState("新的主题");
  const [branches, setBranches] = useState<MindmapBranch[]>([
    {
      id: "branch-1",
      title: "方向一",
      childrenText: "要点 A\n要点 B",
    },
    {
      id: "branch-2",
      title: "方向二",
      childrenText: "要点 C",
    },
  ]);

  useEffect(() => {
    if (!open) {
      return;
    }

    function handleKeydown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, [onClose, open]);

  const code = useMemo(() => buildMindmapCode(rootTitle, branches), [branches, rootTitle]);

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-slate-950/45 px-4 py-8 backdrop-blur-sm">
      <div className="flex max-h-[92vh] w-full max-w-7xl flex-col overflow-hidden rounded-[2rem] border border-white/80 bg-white shadow-[0_30px_80px_rgba(15,23,42,0.28)]">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-white">
              <Workflow className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-semibold tracking-tight text-slate-950">思维导图编辑器</h2>
              <p className="mt-1 text-sm text-slate-500">在左侧组织主题与分支，右侧会实时生成图形预览。</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-slate-200 bg-white p-2 text-slate-500 transition hover:text-slate-950"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="grid min-h-0 flex-1 gap-0 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
          <div className="min-h-0 overflow-y-auto border-b border-slate-200 px-6 py-6 lg:border-b-0 lg:border-r">
            <div className="space-y-6">
              <label className="block space-y-2">
                <span className="text-sm font-medium text-slate-700">中心主题</span>
                <input
                  value={rootTitle}
                  onChange={(event) => setRootTitle(event.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-slate-900"
                  placeholder="输入导图中心主题"
                />
              </label>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-slate-700">一级分支</h3>
                  <button
                    type="button"
                    onClick={() => setBranches((current) => [...current, createBranch()])}
                    className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 transition hover:border-slate-900 hover:text-slate-950"
                  >
                    <Plus className="h-4 w-4" />
                    添加分支
                  </button>
                </div>

                <div className="space-y-4">
                  {branches.map((branch, index) => (
                    <div
                      key={branch.id}
                      className="rounded-[1.5rem] border border-slate-200 bg-slate-50/80 p-4"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-sm font-semibold text-slate-900">分支 {index + 1}</p>
                        <button
                          type="button"
                          onClick={() =>
                            setBranches((current) =>
                              current.length === 1 ? current : current.filter((item) => item.id !== branch.id),
                            )
                          }
                          className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-500 transition hover:border-red-200 hover:text-red-500"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          删除
                        </button>
                      </div>

                      <div className="mt-4 space-y-3">
                        <label className="block space-y-2">
                          <span className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
                            分支标题
                          </span>
                          <input
                            value={branch.title}
                            onChange={(event) =>
                              setBranches((current) =>
                                current.map((item) =>
                                  item.id === branch.id ? { ...item, title: event.target.value } : item,
                                ),
                              )
                            }
                            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-slate-900"
                            placeholder="例如：学习计划"
                          />
                        </label>

                        <label className="block space-y-2">
                          <span className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
                            子节点
                          </span>
                          <textarea
                            value={branch.childrenText}
                            onChange={(event) =>
                              setBranches((current) =>
                                current.map((item) =>
                                  item.id === branch.id
                                    ? { ...item, childrenText: event.target.value }
                                    : item,
                                ),
                              )
                            }
                            className="min-h-28 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm leading-7 text-slate-900 outline-none transition focus:border-slate-900"
                            placeholder={"每行一个子节点\n例如：\n目标\n步骤\n提醒"}
                          />
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="min-h-0 overflow-y-auto bg-slate-50/70 px-6 py-6">
            <div className="space-y-5">
              <div className="rounded-[1.5rem] border border-slate-200 bg-white px-5 py-4">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">实时预览</p>
                <p className="mt-2 text-sm leading-7 text-slate-600">
                  这里会根据左侧的结构自动生成导图。保存后会把 Mermaid 代码插入正文，前台会渲染成同样的图形。
                </p>
              </div>

              <MermaidPreview code={code} />

              <div className="rounded-[1.5rem] border border-slate-200 bg-white px-5 py-4">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Mermaid 源码</p>
                <pre className="mt-3 overflow-x-auto rounded-[1.25rem] bg-slate-950 px-4 py-4 text-sm leading-7 text-slate-100">
                  <code>{code}</code>
                </pre>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-slate-200 px-6 py-5">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-600 transition hover:text-slate-950"
          >
            取消
          </button>
          <button
            type="button"
            onClick={() => onSave(code)}
            className="rounded-full bg-slate-950 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
          >
            插入到正文
          </button>
        </div>
      </div>
    </div>
  );
}
