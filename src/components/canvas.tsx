import { useState } from 'react';
import { Stage, Layer, Line, KonvaNodeEvents, Rect, Image } from 'react-konva';
import useImage from 'use-image';

export default function Canvas() {
  const [lines, setLines] = useState<{ points: number[]}[]>([]);

  const [image] = useImage("/test.jpg");

  const handleMouseMove: KonvaNodeEvents["onMouseMove"] = (e) => {
    // no drawing - skipping
    const stage = e.target.getStage();
    if (!stage) return;
    const point = stage.getPointerPosition();
    if (!point) return;
    const lastLine = lines[lines.length - 1] || { points: [] };
    // add point
    lastLine.points = lastLine.points.concat([point.x, point.y]);

    // replace last
    lines.splice(lines.length - 1, 1, lastLine);
    setLines(lines.concat());
  };

  return (
    <Stage
      width={window.innerWidth}
      height={window.innerHeight}
      onMouseMove={handleMouseMove}
    >
      <Layer>
        <Image
          image={image}
          x={0}
          y={0}
          width={window.innerWidth}
          height={window.innerHeight}
          globalCompositeOperation="source-over"
        />
      </Layer>
      <Layer>
        <Rect
          x={0}
          y={0}
          width={window.innerWidth}
          height={window.innerHeight}
          fill="#999"
          globalCompositeOperation="source-over"
        />

        {lines.map((line, i) => (
          <Line
            key={i}
            points={line.points}
            stroke="#FFCC00"
            strokeWidth={window.innerWidth / 10}
            tension={0.1}
            lineCap="round"
            lineJoin="round"
            globalCompositeOperation='xor'
          />
        ))}
      </Layer>
    </Stage>
  );
}