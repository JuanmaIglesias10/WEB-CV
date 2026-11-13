import { useEffect, useMemo, useState, type KeyboardEvent } from 'react';
import type { TopologyLayout } from '../lib/topology';

export interface TopologySource {
  id: string;
  label: string;
  skills: string[];
}

interface Props {
  layout: TopologyLayout;
  sources: TopologySource[];
  /** Categorías destacadas por el enfoque activo. */
  emphasis: string[];
  categoryNames: Record<string, string>;
  labels: {
    title: string;
    filter: string;
    all: string;
    usedIn: string;
    area: string;
    hint: string;
    notUsed: string;
    core: string;
  };
}

function useReducedMotion() {
  const [reduced, setReduced] = useState(true);
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);
  return reduced;
}

export default function Topology({ layout, sources, emphasis, categoryNames, labels }: Props) {
  const [hovered, setHovered] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [source, setSource] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const reducedMotion = useReducedMotion();

  useEffect(() => setHydrated(true), []);

  const activeSkill = hovered ?? selected;
  const sourceSkills = useMemo(
    () => (source ? new Set(sources.find((s) => s.id === source)?.skills ?? []) : null),
    [source, sources],
  );

  // Conjunto de skills resaltadas (por nodo activo o por filtro de experiencia/proyecto).
  const lit = useMemo<Set<string> | null>(() => {
    if (activeSkill) return new Set([activeSkill]);
    return sourceSkills;
  }, [activeSkill, sourceSkills]);

  const litCategories = useMemo(() => {
    if (!lit) return null;
    return new Set(layout.nodes.filter((n) => lit.has(n.skillId)).map((n) => n.categoryId));
  }, [lit, layout.nodes]);

  const detailSkill = activeSkill;
  const detail = useMemo(() => {
    if (!detailSkill) return null;
    const nodes = layout.nodes.filter((n) => n.skillId === detailSkill);
    if (!nodes.length) return null;
    return {
      name: nodes[0].name,
      areas: [...new Set(nodes.map((n) => categoryNames[n.categoryId]))],
      usedIn: sources.filter((s) => s.skills.includes(detailSkill)).map((s) => s.label),
    };
  }, [detailSkill, layout.nodes, categoryNames, sources]);

  const onNodeKey = (e: KeyboardEvent, skillId: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setSelected((cur) => (cur === skillId ? null : skillId));
    } else if (e.key === 'Escape') {
      setSelected(null);
    }
  };

  const dim = (on: boolean) => (lit ? (on ? 1 : 0.22) : 1);
  const { core, dist } = layout;

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2" role="group" aria-label={labels.filter}>
        <span className="label-mono mr-1">{labels.filter}</span>
        <button
          type="button"
          aria-pressed={source === null}
          onClick={() => setSource(null)}
          className={`rounded-md border px-2.5 py-1 font-mono text-xs transition-colors ${
            source === null ? 'border-accent bg-accent-soft text-fg' : 'border-line text-muted hover:text-fg'
          }`}
        >
          {labels.all}
        </button>
        {sources.map((s) => (
          <button
            key={s.id}
            type="button"
            aria-pressed={source === s.id}
            onClick={() => {
              setSelected(null);
              setSource((cur) => (cur === s.id ? null : s.id));
            }}
            className={`rounded-md border px-2.5 py-1 font-mono text-xs transition-colors ${
              source === s.id
                ? 'border-accent bg-accent-soft text-fg'
                : 'border-line text-muted hover:text-fg'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      <div className="panel mt-4 overflow-hidden">
        <svg
          viewBox={`0 0 ${layout.width} ${layout.height}`}
          className="block h-auto w-full"
          role="group"
          aria-label={labels.title}
          onMouseLeave={() => setHovered(null)}
        >
          {/* Uplinks core → distribución */}
          {layout.categories.map((cat) => {
            const on = !litCategories || litCategories.has(cat.id);
            return (
              <path
                key={`up-${cat.id}`}
                id={`uplink-${cat.id}`}
                d={cat.uplink}
                fill="none"
                stroke={lit && on ? 'var(--accent)' : 'var(--line-strong)'}
                strokeWidth={lit && on ? 2 : 1.5}
                opacity={dim(on)}
                style={{ transition: 'opacity 200ms, stroke 200ms' }}
              />
            );
          })}

          {/* Paquetes animados (solo tras hidratar y si el usuario no pidió menos movimiento) */}
          {hydrated &&
            !reducedMotion &&
            layout.categories.map((cat, i) => {
              const on = !litCategories || litCategories.has(cat.id);
              if (!on) return null;
              return (
                <g key={`pk-${cat.id}`}>
                  <circle r="3" fill="var(--accent)">
                    <animateMotion
                      dur="2.6s"
                      begin={`${i * 0.45}s`}
                      repeatCount="indefinite"
                      path={cat.uplink}
                    />
                  </circle>
                  <circle r="2.5" fill="var(--ok)" opacity="0.85">
                    <animateMotion
                      dur="3.2s"
                      begin={`${1.2 + i * 0.5}s`}
                      repeatCount="indefinite"
                      path={cat.trunk}
                    />
                  </circle>
                </g>
              );
            })}

          {/* Core */}
          <g>
            <rect
              x={core.x - core.w / 2}
              y={core.y - core.h / 2}
              width={core.w}
              height={core.h}
              rx="8"
              fill="var(--bg-sunken)"
              stroke="var(--accent)"
              strokeWidth="1.5"
            />
            <circle cx={core.x - core.w / 2 + 16} cy={core.y} r="4" fill="var(--ok)" />
            <text
              x={core.x + 6}
              y={core.y + 4.5}
              textAnchor="middle"
              className="font-mono"
              fontSize="13"
              fontWeight="600"
              fill="var(--fg)"
            >
              jmi-{labels.core}
            </text>
          </g>

          {/* Distribución + bus de acceso */}
          {layout.categories.map((cat) => {
            const on = !litCategories || litCategories.has(cat.id);
            const emphasized = emphasis.includes(cat.id);
            return (
              <g key={cat.id} opacity={dim(on)} style={{ transition: 'opacity 200ms' }}>
                <path d={cat.trunk} stroke="var(--line-strong)" strokeWidth="1.5" fill="none" />
                <rect
                  x={cat.x - dist.w / 2}
                  y={cat.y - dist.h / 2}
                  width={dist.w}
                  height={dist.h}
                  rx="7"
                  fill="var(--bg-elev)"
                  stroke={emphasized || (lit && on) ? 'var(--accent)' : 'var(--line-strong)'}
                  strokeWidth={emphasized ? 1.75 : 1.25}
                />
                <text
                  x={cat.x}
                  y={cat.y + 4}
                  textAnchor="middle"
                  className="font-mono"
                  fontSize="11.5"
                  fontWeight="600"
                  letterSpacing="0.06em"
                  fill={emphasized ? 'var(--accent)' : 'var(--fg-muted)'}
                >
                  {cat.label.toUpperCase()}
                </text>
              </g>
            );
          })}

          {/* Acceso: skills */}
          {layout.nodes.map((node) => {
            const on = !lit || lit.has(node.skillId);
            const isActive = activeSkill === node.skillId;
            const isSelected = selected === node.skillId;
            return (
              <g
                key={node.key}
                role="button"
                tabIndex={0}
                aria-label={`${node.name} · ${categoryNames[node.categoryId]}`}
                aria-pressed={isSelected}
                onMouseEnter={() => setHovered(node.skillId)}
                onFocus={() => setHovered(node.skillId)}
                onBlur={() => setHovered(null)}
                onClick={() => setSelected((cur) => (cur === node.skillId ? null : node.skillId))}
                onKeyDown={(e) => onNodeKey(e, node.skillId)}
                opacity={dim(on)}
                className="cursor-pointer outline-none [&:focus-visible>rect]:stroke-[var(--accent)]"
                style={{ transition: 'opacity 200ms' }}
              >
                <rect
                  x={node.x - 26}
                  y={node.y - 15}
                  width="158"
                  height="30"
                  rx="6"
                  fill={isActive ? 'var(--accent-soft)' : 'transparent'}
                  stroke="transparent"
                  strokeWidth="1.5"
                />
                <line
                  x1={node.x - 18}
                  y1={node.y}
                  x2={node.x - 5}
                  y2={node.y}
                  stroke={isActive ? 'var(--accent)' : 'var(--line-strong)'}
                  strokeWidth="1.5"
                />
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={isActive ? 5.5 : 4.5}
                  fill={isActive || (lit && on) ? 'var(--accent)' : 'var(--bg-elev)'}
                  stroke={isActive || (lit && on) ? 'var(--accent)' : 'var(--fg-subtle)'}
                  strokeWidth="1.5"
                />
                <text
                  x={node.x + 11}
                  y={node.y + 4.5}
                  fontSize="12.5"
                  fontWeight={isActive ? 600 : 450}
                  fill={isActive ? 'var(--fg)' : 'var(--fg-muted)'}
                >
                  {node.label}
                </text>
              </g>
            );
          })}
        </svg>

        <div
          className="flex min-h-14 flex-wrap items-center gap-x-6 gap-y-2 border-t border-line bg-sunken px-5 py-3 text-sm"
          aria-live="polite"
        >
          {detail ? (
            <>
              <span className="font-mono font-semibold text-fg">
                <span className="text-accent">›</span> {detail.name}
              </span>
              <span className="text-muted">
                <span className="label-mono mr-2">{labels.area}</span>
                {detail.areas.join(' · ')}
              </span>
              <span className="text-muted">
                <span className="label-mono mr-2">{labels.usedIn}</span>
                {detail.usedIn.length ? detail.usedIn.join(' · ') : labels.notUsed}
              </span>
            </>
          ) : (
            <span className="font-mono text-subtle">{labels.hint}</span>
          )}
        </div>
      </div>
    </div>
  );
}
