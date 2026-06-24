#!/usr/bin/env python3
"""
LiDAR CSV → DotMatrix TypeScript converter for Dot Heritage.

Reads segmented point cloud CSVs from the Sample dataset and outputs
a TypeScript file with 4 tactile-layer functions (silhouette/structure/detail/focus).

Usage:
  python scripts/convert_sample.py \\
    --input ~/Downloads/Sample/02.라벨링데이터 \\
    --output src/engine/tactile/createKoreanPalace.ts \\
    --name KoreanPalace \\
    --ko "경복궁 근정전" \\
    --en "Gyeongbokgung Geunjeongjeon" \\
    --period "조선 · 1395년" \\
    --site EC_01

Options:
  --input    Directory containing CSV files from Sample dataset
  --output   Path for output TypeScript file
  --name     PascalCase component name (used for function names)
  --ko       Korean heritage name for comment header
  --en       English heritage name for comment header
  --period   Historical period string
  --site     Site prefix filter (e.g. EC_01). Omit to include all files.
  --sample   Sample every N-th point (default: 20). Higher = faster but sparser.
  --view     Projection view: front (XZ) | top (XY) | side (YZ). Default: front.
  --ascii    Print ASCII preview of each layer after generation.
"""

import csv
import os
import sys
import re
import argparse
from pathlib import Path
from collections import defaultdict
from typing import Dict, List, Tuple, Optional

GRID_W = 60
GRID_H = 40

# Label code → tactile layer
LABEL_TO_LAYER: Dict[str, str] = {
    'VE': 'silhouette',  # Building volume → overall outer silhouette
    'PA': 'structure',   # Pillar (기둥) → structural skeleton
    'PI': 'structure',   # Inner pillar → structural skeleton
    'ST': 'structure',   # Stone/stair (초석·계단) → structural base
    'RO': 'detail',      # Roof (지붕) → architectural character
    'EA': 'detail',      # Eaves/bracket (공포·처마) → architectural character
    'WA': 'focus',       # Wall (벽) → fine detail layer
    'DO': 'focus',       # Door (문) → fine detail layer
}

LAYER_ORDER = ['silhouette', 'structure', 'detail', 'focus']

# When --primary-only: one representative label per layer (most points, clearest shape)
PRIMARY_LABEL: Dict[str, str] = {
    'silhouette': 'VE',  # Building volume
    'structure':  'PA',  # Pillars (기둥) — tall, clearly shaped
    'detail':     'RO',  # Roof (지붕) — dominant architectural element
    'focus':      'WA',  # Wall (벽) — planar surface pattern
}

LAYER_LABELS = {
    'silhouette': ('외관 실루엣', 'Overall silhouette from building volume (VE)'),
    'structure':  ('구조 요소',   'Structural elements: pillars (PA/PI) and stone base (ST)'),
    'detail':     ('건축 세부',   'Architectural detail: roof (RO) and eave brackets (EA)'),
    'focus':      ('촉각 포커스', 'Fine focus: walls (WA) and doors (DO)'),
}


# ─── CSV loading ──────────────────────────────────────────────────────────────

def load_csv_sampled(
    filepath: str,
    sample_every: int = 20,
) -> List[Tuple[float, float, float]]:
    """Return XYZ tuples from CSV, keeping 1 in every `sample_every` rows."""
    points: List[Tuple[float, float, float]] = []
    with open(filepath, 'r', encoding='utf-8', errors='replace') as f:
        reader = csv.reader(f)
        first = next(reader, None)
        if first:
            try:
                # No header — first row is data
                x, y, z = float(first[0]), float(first[1]), float(first[2])
                points.append((x, y, z))
            except (ValueError, IndexError):
                pass  # Header row — skip it
        for i, row in enumerate(reader, start=1):
            if i % sample_every != 0:
                continue
            try:
                points.append((float(row[0]), float(row[1]), float(row[2])))
            except (ValueError, IndexError):
                continue
    return points


# ─── File grouping ────────────────────────────────────────────────────────────

def get_label_code(filename: str) -> Optional[str]:
    """EC_01_01_PA_001.csv → 'PA'"""
    m = re.search(r'_([A-Z]{2})_\d+\.csv$', filename, re.IGNORECASE)
    return m.group(1).upper() if m else None


def get_site_prefix(filename: str) -> Optional[str]:
    """EC_01_01_PA_001.csv → 'EC_01'"""
    m = re.match(r'^([A-Z]{2}_\d+)_', filename, re.IGNORECASE)
    return m.group(1).upper() if m else None


def get_group_number(filename: str) -> Optional[int]:
    """EC_01_01_PA_003.csv → 3  (the trailing file number)."""
    m = re.search(r'_([A-Z]{2})_(\d+)\.csv$', filename, re.IGNORECASE)
    return int(m.group(2)) if m else None


def collect_files_by_label_layer(
    input_dir: str,
    site_filter: Optional[str],
    group: Optional[int] = None,
    primary_only: bool = False,
) -> Dict[str, Dict[str, List[str]]]:
    """
    Scan input_dir and group CSV paths by layer → label → [files].

    Returns:  { 'silhouette': {'VE': [paths...]},
                'structure':  {'PA': [paths...], 'PI': [...], 'ST': [...]}, ... }

    If `group` is set, only include files with that trailing number.
    """
    result: Dict[str, Dict[str, List[str]]] = {l: {} for l in LAYER_ORDER}
    for fname in sorted(os.listdir(input_dir)):
        if not fname.lower().endswith('.csv'):
            continue
        if site_filter:
            site = get_site_prefix(fname)
            if not site or not site.startswith(site_filter.upper()):
                continue
        if group is not None:
            gnum = get_group_number(fname)
            if gnum != group:
                continue
        label = get_label_code(fname)
        if label and label in LABEL_TO_LAYER:
            layer = LABEL_TO_LAYER[label]
            if primary_only and label != PRIMARY_LABEL.get(layer):
                continue
            result[layer].setdefault(label, []).append(os.path.join(input_dir, fname))
    return result


def collect_files_by_layer(
    input_dir: str,
    site_filter: Optional[str],
    group: Optional[int] = None,
    primary_only: bool = False,
) -> Dict[str, List[str]]:
    """Flat version kept for compatibility — delegates to label-aware version."""
    nested = collect_files_by_label_layer(input_dir, site_filter, group, primary_only)
    flat: Dict[str, List[str]] = {}
    for layer, label_files in nested.items():
        flat[layer] = [f for files in label_files.values() for f in files]
    return flat


# ─── Projection ───────────────────────────────────────────────────────────────

Bounds = Tuple[float, float, float, float, float, float]  # xmin xmax ymin ymax zmin zmax


def compute_bounds(points: List[Tuple[float, float, float]]) -> Bounds:
    xs = [p[0] for p in points]
    ys = [p[1] for p in points]
    zs = [p[2] for p in points]
    return min(xs), max(xs), min(ys), max(ys), min(zs), max(zs)


def project(
    points: List[Tuple[float, float, float]],
    bounds: Bounds,
    view: str = 'front',
) -> List[List[int]]:
    """
    Project to 60×40 grid and return raw density counts.

    front (XZ): X = horizontal, Z = vertical (most natural for buildings)
    top   (XY): X = horizontal, Y = depth (bird's-eye view)
    side  (YZ): Y = horizontal, Z = vertical (side profile)
    """
    xmin, xmax, ymin, ymax, zmin, zmax = bounds

    if view == 'front':
        h_vals = [p[0] for p in points]  # X
        v_vals = [p[2] for p in points]  # Z
        h_min, h_max = xmin, xmax
        v_min, v_max = zmin, zmax
    elif view == 'top':
        h_vals = [p[0] for p in points]  # X
        v_vals = [p[1] for p in points]  # Y
        h_min, h_max = xmin, xmax
        v_min, v_max = ymin, ymax
    elif view == 'side':
        h_vals = [p[1] for p in points]  # Y
        v_vals = [p[2] for p in points]  # Z
        h_min, h_max = ymin, ymax
        v_min, v_max = zmin, zmax
    else:
        raise ValueError(f"Unknown view: {view!r}. Use front/top/side.")

    h_span = h_max - h_min or 1.0
    v_span = v_max - v_min or 1.0

    density = [[0] * GRID_W for _ in range(GRID_H)]
    for h, v in zip(h_vals, v_vals):
        col = int((h - h_min) / h_span * (GRID_W - 1))
        row = GRID_H - 1 - int((v - v_min) / v_span * (GRID_H - 1))
        col = max(0, min(GRID_W - 1, col))
        row = max(0, min(GRID_H - 1, row))
        density[row][col] += 1

    return density


def normalize(density: List[List[int]]) -> List[List[int]]:
    """Map raw counts → DotCell values 0–3 using percentile thresholds."""
    counts = sorted(d for row in density for d in row if d > 0)
    if not counts:
        return [[0] * GRID_W for _ in range(GRID_H)]

    n = len(counts)
    p33 = counts[n // 3]
    p66 = counts[(n * 2) // 3]

    result = []
    for row in density:
        cells = []
        for d in row:
            if d == 0:
                cells.append(0)
            elif d <= p33:
                cells.append(1)
            elif d <= p66:
                cells.append(2)
            else:
                cells.append(3)
        result.append(cells)
    return result


# ─── ASCII preview ─────────────────────────────────────────────────────────────

DENSITY_CHARS = ' ░▒█'


def ascii_preview(grid: List[List[int]], label: str) -> str:
    """Render grid as a bordered ASCII art block."""
    top = f"┌── {label} {'─' * max(0, GRID_W - len(label) - 4)}┐"
    bottom = '└' + '─' * GRID_W + '┘'
    rows = ['│' + ''.join(DENSITY_CHARS[c] for c in row) + '│' for row in grid]
    return '\n'.join([top] + rows + [bottom])


# ─── TypeScript output ────────────────────────────────────────────────────────

def grid_to_ts_function(
    cells: List[List[int]],
    fn_name: str,
    ko_label: str,
    en_label: str,
) -> str:
    rows_lines = ['    [' + ','.join(str(c) for c in row) + ']' for row in cells]
    cells_str = ',\n'.join(rows_lines)
    return (
        f"/** {ko_label} — {en_label} */\n"
        f"export function {fn_name}(): DotMatrix {{\n"
        f"  return {{\n"
        f"    width: {GRID_W},\n"
        f"    height: {GRID_H},\n"
        f"    cells: [\n"
        f"{cells_str}\n"
        f"    ],\n"
        f"  }};\n"
        f"}}\n"
    )


def build_ts_file(
    layer_grids: Dict[str, List[List[int]]],
    component_name: str,
    heritage_ko: str,
    heritage_en: str,
    period: str,
    view: str,
) -> str:
    header = '\n'.join([
        "import type { DotMatrix } from '../../types/heritage';",
        "",
        f"// Auto-generated from LiDAR point cloud data — do not edit by hand.",
        f"// Heritage : {heritage_ko} ({heritage_en})",
        f"// Period   : {period}",
        f"// Source   : Sample/02.라벨링데이터, projection={view}, grid=60×40",
        f"// Layers   : silhouette(VE) · structure(PA/PI/ST) · detail(RO/EA) · focus(WA/DO)",
        "",
    ])

    fn_map = {
        'silhouette': f'create{component_name}Silhouette',
        'structure':  f'create{component_name}Structure',
        'detail':     f'create{component_name}Detail',
        'focus':      f'create{component_name}Focus',
    }

    functions = []
    for layer in LAYER_ORDER:
        grid = layer_grids.get(layer, [[0] * GRID_W for _ in range(GRID_H)])
        ko, en = LAYER_LABELS[layer]
        functions.append(grid_to_ts_function(grid, fn_map[layer], ko, en))

    return header + '\n'.join(functions)


# ─── Main ─────────────────────────────────────────────────────────────────────

def main() -> None:
    parser = argparse.ArgumentParser(
        description='Convert LiDAR CSV → DotMatrix TypeScript for Dot Heritage',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=__doc__,
    )
    parser.add_argument('--input',  required=True, help='02.라벨링데이터 directory path')
    parser.add_argument('--output', required=True, help='Output .ts file path')
    parser.add_argument('--name',   default='KoreanPalace', help='PascalCase name')
    parser.add_argument('--ko',     default='한국 전통 건축', help='Korean heritage name')
    parser.add_argument('--en',     default='Korean Traditional Architecture', help='English name')
    parser.add_argument('--period', default='조선', help='Period string')
    parser.add_argument('--site',   default=None, help='Site prefix filter e.g. EC_01')
    parser.add_argument('--group',  type=int, default=None,
                        help='Pick only files with this trailing number (1–5). '
                             'Isolates one physical structure for denser, better-aligned output.')
    parser.add_argument('--sample', type=int, default=20,
                        help='Keep 1 in every N points (default 20)')
    parser.add_argument('--view',   default='front', choices=['front', 'top', 'side'],
                        help='Projection axis (default: front = XZ)')
    parser.add_argument('--primary-only', dest='primary_only', action='store_true',
                        help='Use only the primary label per layer (VE/PA/RO/WA). '
                             'Gives denser, more representative patterns per layer.')
    parser.add_argument('--local-norm', dest='local_norm', action='store_true',
                        help='Normalise each layer to its own bounding box (fills the grid; '
                             'loses cross-layer spatial alignment but gives denser patterns)')
    parser.add_argument('--ascii',  action='store_true',
                        help='Print ASCII preview of each layer to stdout')
    args = parser.parse_args()

    input_dir = os.path.expanduser(args.input)

    # ── 1. Discover files ──────────────────────────────────────────────────────
    print(f"\n[1/4] Scanning {input_dir}")
    layer_label_files = collect_files_by_label_layer(
        input_dir, site_filter=args.site, group=args.group, primary_only=args.primary_only
    )
    total_files = sum(len(f) for ld in layer_label_files.values() for f in ld.values())
    if total_files == 0:
        print("ERROR: No matching CSV files found. Check --input and --site.")
        sys.exit(1)
    for layer in LAYER_ORDER:
        ld = layer_label_files.get(layer, {})
        summary = ', '.join(f"{lb}×{len(fs)}" for lb, fs in sorted(ld.items()))
        print(f"  {layer:12s}: {sum(len(f) for f in ld.values())} file(s)  [{summary}]")

    # ── 2. Load & project per label (then merge) ───────────────────────────────
    print(f"\n[2/4] Loading points  (sample every {args.sample})")
    all_points: List[Tuple[float, float, float]] = []

    # First pass: collect all points for global bounds
    label_point_cache: Dict[str, List[Tuple[float, float, float]]] = {}
    for layer in LAYER_ORDER:
        for label, files in sorted(layer_label_files.get(layer, {}).items()):
            pts: List[Tuple[float, float, float]] = []
            for fpath in files:
                loaded = load_csv_sampled(fpath, sample_every=args.sample)
                pts.extend(loaded)
                print(f"    {Path(fpath).name:40s}  {len(loaded):>7,} pts")
            label_point_cache[label] = pts
            all_points.extend(pts)

    if not all_points:
        print("ERROR: No points loaded.")
        sys.exit(1)
    print(f"  → Total sampled: {len(all_points):,} points")

    # ── 3. Project & merge grids ───────────────────────────────────────────────
    print(f"\n[3/4] Projecting  view={args.view}  grid={GRID_W}×{GRID_H}  "
          f"norm={'per-label' if args.local_norm else 'global'}")
    global_bounds = compute_bounds(all_points)
    xmin, xmax, ymin, ymax, zmin, zmax = global_bounds
    print(f"  Global bounds  X: {xmin:.2f}–{xmax:.2f}  "
          f"Y: {ymin:.2f}–{ymax:.2f}  "
          f"Z: {zmin:.2f}–{zmax:.2f}")

    layer_grids: Dict[str, List[List[int]]] = {}
    for layer in LAYER_ORDER:
        ld = layer_label_files.get(layer, {})
        if not ld:
            layer_grids[layer] = [[0] * GRID_W for _ in range(GRID_H)]
            print(f"  {layer:12s}: (no data — empty grid)")
            continue

        if args.local_norm:
            # Per-label: normalize each label independently then merge via max
            merged = [[0] * GRID_W for _ in range(GRID_H)]
            for label in sorted(ld.keys()):
                pts = label_point_cache.get(label, [])
                if not pts:
                    continue
                bounds = compute_bounds(pts)
                raw = project(pts, bounds, view=args.view)
                grid = normalize(raw)
                # Merge: take max per cell so each label contributes its pattern
                for r in range(GRID_H):
                    for c in range(GRID_W):
                        if grid[r][c] > merged[r][c]:
                            merged[r][c] = grid[r][c]
                sub_occ = sum(1 for row in grid for v in row if v > 0)
                print(f"    {label:4s}→{layer:12s}: {sub_occ:4d} cells  "
                      f"({sub_occ / (GRID_W * GRID_H) * 100:.1f}%)")
            occupied = sum(1 for row in merged for v in row if v > 0)
            pct = occupied / (GRID_W * GRID_H) * 100
            print(f"  {layer:12s}: {occupied:4d} / {GRID_W * GRID_H} merged  ({pct:.1f}%)")
            layer_grids[layer] = merged
        else:
            # Global norm: combine all labels for this layer into one projection
            pts_all: List[Tuple[float, float, float]] = []
            for label in sorted(ld.keys()):
                pts_all.extend(label_point_cache.get(label, []))
            raw = project(pts_all, global_bounds, view=args.view)
            grid = normalize(raw)
            occupied = sum(1 for row in grid for c in row if c > 0)
            pct = occupied / (GRID_W * GRID_H) * 100
            print(f"  {layer:12s}: {occupied:4d} / {GRID_W * GRID_H} cells occupied  ({pct:.1f}%)")
            layer_grids[layer] = grid

    # ── 4. Write TypeScript ────────────────────────────────────────────────────
    print(f"\n[4/4] Writing output")
    ts_content = build_ts_file(
        layer_grids,
        component_name=args.name,
        heritage_ko=args.ko,
        heritage_en=args.en,
        period=args.period,
        view=args.view,
    )

    output_path = Path(args.output)
    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(ts_content, encoding='utf-8')
    size_kb = output_path.stat().st_size / 1024
    print(f"  → {output_path}  ({size_kb:.1f} KB)")

    # ── Optional ASCII preview ─────────────────────────────────────────────────
    if args.ascii:
        print()
        for layer in LAYER_ORDER:
            ko, _ = LAYER_LABELS[layer]
            print(ascii_preview(layer_grids[layer], f"{layer} · {ko}"))
            print()

    # ── Usage hint ─────────────────────────────────────────────────────────────
    n = args.name
    print(f"""
Done!  Add to your heritage data:

  import {{
    create{n}Silhouette,
    create{n}Structure,
    create{n}Detail,
    create{n}Focus,
  }} from '../engine/tactile/create{n}';

  // In HERITAGE_LIST:
  {{
    korean:  '{args.ko}',
    english: '{args.en}',
    period:  '{args.period}',
    emoji:   '🏛',
    matrix:  create{n}Silhouette(),
    braille: ['{args.ko}', '{args.period}'],
  }}
""")


if __name__ == '__main__':
    main()
