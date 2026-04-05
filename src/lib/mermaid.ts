"use client";

let mermaidInitialized = false;

export async function ensureMermaid() {
  const mermaid = (await import("mermaid")).default;

  if (!mermaidInitialized) {
    mermaid.initialize({
      startOnLoad: false,
      theme: "neutral",
    });
    mermaidInitialized = true;
  }

  return mermaid;
}
