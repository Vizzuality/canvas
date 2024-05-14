import { KonvaEventObject } from 'konva/lib/Node';
import { useCallback, useRef, useState } from 'react';
import { Stage, Layer, Rect, Image } from 'react-konva';
import useImage from 'use-image';

type Point = {
  x: number;
  y: number;
  s: number;
  r?: number;
};

function distanceBetween(point1: Pick<Point, "x" | "y">, point2: Pick<Point, "x" | "y">) {
  return Math.sqrt(Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2));
}

function angleBetween(point1: Pick<Point, "x" | "y">, point2: Pick<Point, "x" | "y">) {
  return Math.atan2( point2.x - point1.x, point2.y - point1.y );
}

export default function Canvas() {
  const lastPointRef = useRef<Point | null>(null);
  const [points, setPoints] = useState<Point[]>([]);

  const [image] = useImage("/test.jpg");
  const [brush] = useImage("/brush.png");

  const handleMouseMove = useCallback((e: KonvaEventObject<MouseEvent>) => {
    // no drawing - skipping
    const stage = e.target.getStage();
    if (!stage) return;
    const point = stage.getPointerPosition();
    if (!point) return;

    let lastPoint = lastPointRef.current;
    if (!lastPoint) {
      lastPoint = { x: point.x + 0.01, y: point.y + 0.01, r: 0, s: 1 };
    }
    const dist = distanceBetween(lastPoint, point);
    const angle = angleBetween(lastPoint, point);
    const newPoints: Point[] = [];

    for (let i = 0; i < dist; i += 20) {
      if (!lastPoint) return;

      const x = lastPoint.x + (Math.sin(angle) * i) - 25;
      const y = lastPoint.y + (Math.cos(angle) * i) - 25;
      const r = Math.random() * 360;
      const s = Math.random() * 0.5 + 1;
      newPoints.push({ x, y, r, s });
      lastPointRef.current = { x, y, r, s };
    }

    setPoints((prev) => prev.concat(newPoints));
  }, []);

  return (
    <Stage
      width={window.innerWidth}
      height={window.innerHeight}
      onMouseMove={handleMouseMove}
    >
      <Layer listening={false}>
        <Image
          image={image}
          x={0}
          y={0}
          width={window.innerWidth}
          height={window.innerHeight}
          globalCompositeOperation="source-over"
        />
      </Layer>
      <Layer listening={false}>
        <Rect
          x={0}
          y={0}
          width={window.innerWidth}
          height={window.innerHeight}
          fill="#999"
          globalCompositeOperation="source-over"
        />

        {points.map((point, j) => {
          return (
            <Image
              key={`${j}`}
              image={brush}
              x={point.x}
              y={point.y}
              width={window.innerHeight / 3}
              height={window.innerHeight / 3}
              opacity={0.1}
              offsetX={window.innerHeight / 6}
              offsetY={window.innerHeight / 6}
              rotation={point.r}
              scale={{ x: point.s, y: point.s }}
              globalCompositeOperation="destination-out"
              perfectDrawEnabled={false}
            />
          );
        })}
      </Layer>
    </Stage>
  );
}