export type GridData = (string | null)[][];

type PaintCellFn = (
  ctx: CanvasRenderingContext2D,
  gridData: GridData,
  x: number,
  y: number
) => void;

export type Point = {
  x: number;
  y: number;
}

export function drawCircle(
  ctx: CanvasRenderingContext2D,
  gridData: GridData,
  center: Point,
  diameter: number,
  paintCell: PaintCellFn
) {
  const radius = Math.floor(diameter / 2);
  let d = (5 - radius * 4) / 4;
  let x = 0;
  let y = radius;

  while (x <= y) {
    paintCell(ctx, gridData, center.x + x, center.y + y);
    paintCell(ctx, gridData, center.x + x, center.y - y);
    paintCell(ctx, gridData, center.x - x, center.y + y);
    paintCell(ctx, gridData, center.x - x, center.y - y);
    paintCell(ctx, gridData, center.x + y, center.y + x);
    paintCell(ctx, gridData, center.x + y, center.y - x);
    paintCell(ctx, gridData, center.x - y, center.y + x);
    paintCell(ctx, gridData, center.x - y, center.y - x);

    if (d < 0) {
      d += 2 * x + 1;
    } else {
      d += 2 * (x - y) + 1;
      y--;
    }
    x++;
  }
}

function drawLine(
  ctx: CanvasRenderingContext2D,
  gridData: GridData,
  v0: Point,
  v1: Point,
  paintCell: PaintCellFn
) {
  const dx = Math.abs(v1.x - v0.x),
    sx = v0.x < v1.x ? 1 : -1;
  const dy = Math.abs(v1.y - v0.y),
    sy = v0.y < v1.y ? 1 : -1;
  let err = (dx > dy ? dx : -dy) / 2;

  while (true) {
    paintCell(ctx, gridData, v0.x, v0.y);
    if (v0.x === v1.x && v0.y === v1.y) break;
    const e2 = err;
    if (e2 > -dx) {
      err -= dy;
      v0.x += sx;
    }
    if (e2 < dy) {
      err += dx;
      v0.y += sy;
    }
  }
}

export function drawShape(
  ctx: CanvasRenderingContext2D,
  gridData: GridData,
  center: Point,
  sides: number,
  angle0: number,
  diameter: number,
  paintCell: PaintCellFn
) {
  if (sides === 2) return;

  const radius = Math.floor(diameter / 2);
  const vertices: Point[] = [];

  for (let i = 0; i < sides; i++) {
    const xi = center.x + radius * Math.cos((2 * Math.PI * i) / sides + angle0);
    const yi = center.y + radius * Math.sin((2 * Math.PI * i) / sides + angle0);
    vertices.push({ x: Math.round(xi), y: Math.round(yi) });
  }

  for (let i = 0; i < vertices.length; i++) {
    const next = (i + 1) % vertices.length;
    drawLine(
      ctx,
      gridData,
      { ...vertices[i] },
      { ...vertices[next] },
      paintCell
    );
  }
}

export function floodFill(
  ctx: CanvasRenderingContext2D,
  gridData: GridData,
  startX: number,
  startY: number,
  color: string,
  paintCell: PaintCellFn
) {
  const height = gridData.length;
  const width = gridData[0].length;

  if (gridData[startY][startX] !== null) return;

  const queue: Point[] = [];
  gridData[startY][startX] = color;
  queue.push({ x: startX, y: startY });

  const directions = [
    { x: 0, y: -1 },
    { x: 0, y: 1 },
    { x: 1, y: 0 },
    { x: -1, y: 0 },
  ];

  while (queue.length > 0) {
    const node = queue.shift()!;
    paintCell(ctx, gridData, node.x, node.y);

    for (const dir of directions) {
      const nx = node.x + dir.x;
      const ny = node.y + dir.y;

      if (
        nx >= 0 &&
        nx < width &&
        ny >= 0 &&
        ny < height &&
        gridData[ny][nx] === null
      ) {
        gridData[ny][nx] = color;
        queue.push({ x: nx, y: ny });
      }
    }
  }
}
