import { SiteLogo } from "@/components/site-logo";

export function LogoShowcase() {
  return (
    <section className="mx-auto mt-20 max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="mb-10 max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">
          Signature Mark
        </p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
          直接从手绘原图提取的签名标识
        </h2>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-500 sm:text-base">
          这一版不再做重绘和概念发散，而是直接从你提供的 PNG 原图里去背景、裁边，保留签名原本的笔势与结构。
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <article className="rounded-[2rem] border border-white/70 bg-white/80 p-6 shadow-[0_18px_56px_rgba(15,23,42,0.08)] backdrop-blur-xl">
          <div className="flex min-h-[14rem] items-center justify-center rounded-[1.6rem] bg-[linear-gradient(180deg,_#ffffff,_#f8fafc)] p-6">
            <SiteLogo className="h-24 w-[320px]" />
          </div>
          <h3 className="mt-5 text-xl font-semibold tracking-tight text-slate-900">Standard</h3>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            适合首页和常规浅色背景的标准使用方式。
          </p>
        </article>

        <article className="rounded-[2rem] border border-white/70 bg-white/80 p-6 shadow-[0_18px_56px_rgba(15,23,42,0.08)] backdrop-blur-xl">
          <div className="flex min-h-[14rem] items-center justify-center rounded-[1.6rem] bg-[linear-gradient(135deg,_#0f172a,_#334155)] p-6">
            <SiteLogo className="h-24 w-[320px]" dark />
          </div>
          <h3 className="mt-5 text-xl font-semibold tracking-tight text-slate-900">Reverse</h3>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            用于深色底图、分享图或更安静的视觉场景。
          </p>
        </article>

        <article className="rounded-[2rem] border border-white/70 bg-white/80 p-6 shadow-[0_18px_56px_rgba(15,23,42,0.08)] backdrop-blur-xl">
          <div className="flex min-h-[14rem] items-center justify-center rounded-[1.6rem] bg-[linear-gradient(180deg,_#ffffff,_#f8fafc)] p-6">
            <SiteLogo className="h-14 w-[180px]" />
          </div>
          <h3 className="mt-5 text-xl font-semibold tracking-tight text-slate-900">Header Scale</h3>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            这是导航栏中的实际缩放尺寸，用来确认小尺寸下仍然保留签名气质。
          </p>
        </article>
      </div>
    </section>
  );
}
