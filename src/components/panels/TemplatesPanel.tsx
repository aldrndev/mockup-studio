import React, { useState } from "react";
import { Sparkles, Check, ArrowRight, Smartphone } from "lucide-react";
import { PLAYSTORE_TEMPLATES } from "../../utils/playstoreTemplates";
import { useEditorStore } from "../../store/useEditorStore";

const CATEGORIES = ["All", "Fintech", "Productivity", "Fitness", "Social", "Minimal", "Banner"] as const;

export const TemplatesPanel: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const { applyTemplate } = useEditorStore();
  const [appliedId, setAppliedId] = useState<string | null>(null);

  const filteredTemplates =
    selectedCategory === "All"
      ? PLAYSTORE_TEMPLATES
      : PLAYSTORE_TEMPLATES.filter((t) => t.category === selectedCategory);

  const handleApply = (id: string) => {
    applyTemplate(id);
    setAppliedId(id);
    setTimeout(() => setAppliedId(null), 1500);
  };

  return (
    <div className="p-4 space-y-4 font-sans select-none">
      {/* Title & Description */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="w-4 h-4 text-indigo-400" />
          <h2 className="text-xs font-bold text-zinc-200 uppercase tracking-wider">
            Design Templates
          </h2>
        </div>
        <p className="text-[11px] text-zinc-400 leading-relaxed">
          1-Click curated styles optimized for high conversion and showcase.
        </p>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap gap-1 pb-1">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
              selectedCategory === cat
                ? "bg-indigo-600 text-white shadow-sm ring-1 ring-white/10"
                : "bg-zinc-900/80 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 border border-zinc-800/80"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Templates Grid */}
      <div className="space-y-3">
        {filteredTemplates.map((tpl) => {
          const isApplied = appliedId === tpl.id;

          return (
            <div
              key={tpl.id}
              onClick={() => handleApply(tpl.id)}
              className="group relative rounded-xl bg-zinc-900/70 border border-zinc-800/90 hover:border-indigo-500/50 p-3 transition-all cursor-pointer hover:shadow-xl hover:shadow-indigo-500/10 overflow-hidden"
            >
              {/* Top Gradient Banner Preview */}
              <div
                className="h-20 rounded-lg mb-2.5 flex items-center justify-between px-3.5 relative overflow-hidden border border-white/10 shadow-inner"
                style={{
                  background: `linear-gradient(135deg, ${tpl.previewGradient[0]}, ${tpl.previewGradient[1]})`,
                }}
              >
                {/* Left Tag */}
                <div className="z-10 flex flex-col gap-1">
                  <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-black/50 text-white/95 backdrop-blur-md border border-white/10 self-start shadow-sm">
                    {tpl.category}
                  </span>
                  <span className="text-[10px] font-medium text-white/80 line-clamp-1 drop-shadow">
                    {tpl.headline.text}
                  </span>
                </div>

                {/* Right Device Silhouette */}
                <div className="z-10 flex items-center gap-1 bg-black/40 px-2 py-1 rounded-md backdrop-blur-md border border-white/10">
                  <Smartphone size={12} className="text-white/80" />
                  <span className="text-[9px] font-semibold text-white/90">
                    {tpl.deviceType === "android" ? "S25 Ultra" : "iPhone"}
                  </span>
                </div>

                {/* Ambient glow highlight */}
                <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-white/10 rounded-full blur-xl pointer-events-none" />
              </div>

              {/* Template Info */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-white group-hover:text-indigo-300 transition-colors">
                    {tpl.name}
                  </h3>
                  <div
                    className={`flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded transition-all ${
                      isApplied
                        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                        : "text-indigo-400 group-hover:translate-x-0.5"
                    }`}
                  >
                    {isApplied ? (
                      <>
                        <Check size={11} />
                        Applied
                      </>
                    ) : (
                      <>
                        Apply
                        <ArrowRight size={10} />
                      </>
                    )}
                  </div>
                </div>
                <p className="text-[11px] text-zinc-400 leading-snug">
                  {tpl.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
