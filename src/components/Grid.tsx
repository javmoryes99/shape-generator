import { useCallback, useEffect, useRef } from "react";
import useSelector from "../hooks/useSelector";

type GridData = (string | null)[][];

interface Point {
  x: number;
  y: number;
}

const MARGIN = 2;
const CELL_SIZE = 24;
const CURRENT_COLOR = "#00d9ff";

function Grid() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const gridDataRef = useRef<GridData>([]);
  const { selector } = useSelector();

  function clearCanvas(
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    width: number,
    height: number
  ): void {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "#333";
    ctx.lineWidth = 1;
    for (let x = 0; x <= width; x++) {
      ctx.beginPath();
      ctx.moveTo(x * CELL_SIZE, 0);
      ctx.lineTo(x * CELL_SIZE, height * CELL_SIZE);
      ctx.stroke();
    }
    for (let y = 0; y <= height; y++) {
      ctx.beginPath();
      ctx.moveTo(0, y * CELL_SIZE);
      ctx.lineTo(width * CELL_SIZE, y * CELL_SIZE);
      ctx.stroke();
    }
  }

  function paintCell(
    ctx: CanvasRenderingContext2D,
    gridData: GridData,
    x: number,
    y: number
  ): void {
    gridData[y][x] = CURRENT_COLOR;
    ctx.fillStyle = CURRENT_COLOR;
    ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
  }

  const drawCircle = useCallback((
    ctx: CanvasRenderingContext2D,
    gridData: GridData,
    center: Point,
    diameter: number
  ) => {
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
  }, [])

  const drawLine = useCallback((
    ctx: CanvasRenderingContext2D,
    gridData: GridData,
    v0: Point,
    v1: Point
  ) => {
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
  }, [])

  const drawShape = useCallback((
    ctx: CanvasRenderingContext2D,
    gridData: GridData,
    center: Point,
    sides: number,
    angle0: number,
    diameter: number
  ) => {
    if (sides === 2) return;

    const radius = Math.floor(diameter / 2);
    const vertices: Point[] = [];

    for (let i = 0; i < sides; i++) {
      const xi =
        center.x + radius * Math.cos((2 * Math.PI * i) / sides + angle0);
      const yi =
        center.y + radius * Math.sin((2 * Math.PI * i) / sides + angle0);
      vertices.push({ x: Math.round(xi), y: Math.round(yi) });
    }

    for (let i = 0; i < vertices.length; i++) {
      const next = (i + 1) % vertices.length;
      drawLine(ctx, gridData, { ...vertices[i] }, { ...vertices[next] });
    }
  }, [drawLine])

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    ctxRef.current = canvas.getContext("2d");
    const ctx = ctxRef.current;
    if (!ctx) return;

    const width = selector.diameter + MARGIN * 2;
    const height = selector.diameter + MARGIN * 2;

    const gridData: GridData = Array(height)
      .fill(null)
      .map(() => Array(width).fill(null));

    gridDataRef.current = gridData;

    canvas.width = width * CELL_SIZE;
    canvas.height = height * CELL_SIZE;

    clearCanvas(ctx, canvas, width, height);

    const cx = Math.floor(width / 2);
    const cy = Math.floor(height / 2);

    const startTime = performance.now();
    console.log("WASD", selector);
    if (selector.type === 'circle') {
        drawCircle(ctx, gridData, { x: cx, y: cy }, selector.diameter);
    } else {
        drawShape(ctx, gridData, { x: cx, y: cy }, selector.sides, 0, selector.diameter);
    }
    const endTime = performance.now();
    console.log(`Elapsed time: ${endTime - startTime} milliseconds`);
  }, [selector.diameter, selector.sides, selector.type, drawCircle, drawShape]);

  return (
    <div className="card w-full bg-base-200 card-md shadow-sm mt-5">
      <div className="overflow-x-auto py-4">
        <div className="flex justify-center px-4 w-max min-w-full">
          <canvas ref={canvasRef} className="pixel-canvas" />
        </div>
      </div>
    </div>
  );
}

export default Grid;