import { useCallback, useEffect, useRef } from "react";
import useSelector from "../hooks/useSelector";
import useColor from "../hooks/useColor";
import { drawCircle, drawShape, floodFill, type GridData } from "../utils/gridDrawing";

const MARGIN = 2;
const CELL_SIZE = 24;

function Grid() {
  const { color } = useColor("--color-info");
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

  const paintCell = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      gridData: GridData,
      x: number,
      y: number
    ) => {
      gridData[y][x] = color ?? null;

      ctx.fillStyle = color ?? "";
      ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);

      ctx.strokeStyle = "#333";
      ctx.lineWidth = 1;
      ctx.strokeRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
    },
    [color]
  );

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

    if (selector.type === "circle") {
      drawCircle(ctx, gridData, { x: cx, y: cy }, selector.diameter, paintCell);
    } else {
      drawShape(
        ctx,
        gridData,
        { x: cx, y: cy },
        selector.sides,
        0,
        selector.diameter,
        paintCell
      );
    }

    if (selector.mode === "fill") {
      floodFill(ctx, gridData, cx, cy, color ?? "", paintCell);
    }
  }, [selector, color, paintCell]);

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