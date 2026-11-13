import type { SkillCategory } from './cv';

/**
 * Layout del mapa de skills según el modelo jerárquico de Cisco (3 capas):
 * core (yo) → distribución (categorías) → acceso (skills). Es una función pura, calculada en build.
 */

export interface TopoNode {
  key: string;
  skillId: string;
  categoryId: string;
  label: string;
  name: string;
  x: number;
  y: number;
}

export interface TopoCategory {
  id: string;
  label: string;
  x: number;
  y: number;
  trunkX: number;
  trunkTop: number;
  trunkBottom: number;
  /** Enlace core → distribución (curva bezier). */
  uplink: string;
  /** Bus vertical de la capa de acceso. */
  trunk: string;
}

export interface TopologyLayout {
  width: number;
  height: number;
  core: { x: number; y: number; w: number; h: number };
  dist: { w: number; h: number };
  categories: TopoCategory[];
  nodes: TopoNode[];
}

const COL_W = 180;
const CORE = { y: 46, w: 136, h: 38 };
const DIST = { y: 152, w: 152, h: 34 };
const FIRST_SKILL_Y = 226;
const STEP_Y = 40;
const TRUNK_OFFSET = 64;
/** Márgenes laterales: las etiquetas de la última columna se extienden más allá de su celda. */
const PAD_L = 12;
const PAD_R = 48;

export function computeTopology(categories: SkillCategory[]): TopologyLayout {
  const width = PAD_L + COL_W * categories.length + PAD_R;
  const core = { x: PAD_L + (COL_W * categories.length) / 2, y: CORE.y, w: CORE.w, h: CORE.h };
  const maxItems = Math.max(...categories.map((c) => c.items.length));
  const height = FIRST_SKILL_Y + (maxItems - 1) * STEP_Y + 34;

  const nodes: TopoNode[] = [];
  const cats = categories.map<TopoCategory>((cat, col) => {
    const x = PAD_L + col * COL_W + COL_W / 2;
    const trunkX = x - TRUNK_OFFSET;
    const trunkTop = DIST.y + DIST.h / 2;
    const lastY = FIRST_SKILL_Y + (cat.items.length - 1) * STEP_Y;

    cat.items.forEach((item, row) => {
      nodes.push({
        key: `${cat.id}:${item.id}`,
        skillId: item.id,
        categoryId: cat.id,
        label: item.short,
        name: item.name,
        x: trunkX + 18,
        y: FIRST_SKILL_Y + row * STEP_Y,
      });
    });

    const y1 = core.y + core.h / 2;
    const y2 = DIST.y - DIST.h / 2;
    const mid = (y1 + y2) / 2;
    return {
      id: cat.id,
      label: cat.short,
      x,
      y: DIST.y,
      trunkX,
      trunkTop,
      trunkBottom: lastY,
      uplink: `M${core.x},${y1} C${core.x},${mid + 8} ${x},${mid - 8} ${x},${y2}`,
      trunk: `M${trunkX},${trunkTop} L${trunkX},${lastY}`,
    };
  });

  return { width, height, core, dist: { w: DIST.w, h: DIST.h }, categories: cats, nodes };
}
