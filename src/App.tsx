import { useEffect, useRef, useState } from "react";

import sampleImage from "./assets/sample.jpeg";

type Point = {
  x: number;
  y: number;
};

function App() {
  // BACKGROUND IMAGE CANVAS
  const backgroundCanvasRef =
    useRef<HTMLCanvasElement | null>(null);

  // DRAWING OVERLAY CANVAS
  const overlayCanvasRef =
    useRef<HTMLCanvasElement | null>(null);

  const imageRef = useRef<HTMLImageElement | null>(null);

  const [isDrawing, setIsDrawing] = useState(false);

  const [points, setPoints] = useState<Point[]>([]);
  const [selectionConfirmed, setSelectionConfirmed] =
  useState(false);

  // LOAD IMAGE
  useEffect(() => {
    const image = new Image();

    image.src = sampleImage;

    image.onload = () => {
      imageRef.current = image;

      const canvas = backgroundCanvasRef.current;

      if (!canvas) return;

      const ctx = canvas.getContext("2d");

      if (!ctx) return;

      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    };
  }, []);

  // DRAWING SYSTEM
  useEffect(() => {
    const canvas = overlayCanvasRef.current;

    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    ctx.lineWidth = 3;

    ctx.lineCap = "round";

    ctx.strokeStyle = "red";

    // START DRAWING
    const startDrawing = (e: MouseEvent) => {
      setIsDrawing(true);

      const startPoint = {
        x: e.offsetX,
        y: e.offsetY,
      };

      setPoints([startPoint]);

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.beginPath();

      ctx.moveTo(startPoint.x, startPoint.y);
    };

    // DRAW
    const draw = (e: MouseEvent) => {
      if (!isDrawing) return;

      const newPoint = {
        x: e.offsetX,
        y: e.offsetY,
      };

      setPoints((prev) => [...prev, newPoint]);

      ctx.lineTo(newPoint.x, newPoint.y);

      ctx.stroke();
    };

    // STOP DRAWING
    const stopDrawing = () => {
      setIsDrawing(false);
    };

    canvas.addEventListener("mousedown", startDrawing);

    canvas.addEventListener("mousemove", draw);

    canvas.addEventListener("mouseup", stopDrawing);

    return () => {
      canvas.removeEventListener("mousedown", startDrawing);

      canvas.removeEventListener("mousemove", draw);

      canvas.removeEventListener("mouseup", stopDrawing);
    };
  }, [isDrawing]);

  // CANCEL
  const handleCancel = () => {
    const overlayCanvas = overlayCanvasRef.current;

    if (!overlayCanvas) return;

    const ctx = overlayCanvas.getContext("2d");

    if (!ctx) return;

    // Clear ONLY overlay
    ctx.clearRect(
      0,
      0,
      overlayCanvas.width,
      overlayCanvas.height
    );

    setPoints([]);
    setSelectionConfirmed(false);

  };

  // EXPORT PNG
  const handleOk = () => {
    const overlayCanvas = overlayCanvasRef.current;

    if (!overlayCanvas) return;

    const ctx = overlayCanvas.getContext("2d");

    if (!ctx) return;

    if (points.length < 2) return;

    // CLEAR OLD DRAWINGS
    ctx.clearRect(
      0,
      0,
      overlayCanvas.width,
      overlayCanvas.height
    );

    // DARK OVERLAY
    ctx.fillStyle = "rgba(0,0,0,0.6)";

    ctx.fillRect(
      0,
      0,
      overlayCanvas.width,
      overlayCanvas.height
    );

    // CREATE SELECTION SHAPE
    ctx.beginPath();

    ctx.moveTo(points[0].x, points[0].y);

    points.forEach((point) => {
      ctx.lineTo(point.x, point.y);
    });

    ctx.closePath();

    // CUT TRANSPARENT HOLE
    ctx.globalCompositeOperation =
      "destination-out";

    ctx.fill();

    // RESET MODE
    ctx.globalCompositeOperation =
      "source-over";

    // DRAW BORDER
    ctx.strokeStyle = "red";

    ctx.lineWidth = 3;

    ctx.stroke();

    setSelectionConfirmed(true);

    console.log("Selection Preview Created");
  };


  const handleDownload = () => {
  const image = imageRef.current;

  if (!image) return;

  if (points.length < 2) return;

  // CREATE EXPORT CANVAS
  const exportCanvas =
    document.createElement("canvas");

  exportCanvas.width = 700;

  exportCanvas.height = 400;

  const exportCtx =
    exportCanvas.getContext("2d");

  if (!exportCtx) return;

  // CREATE PATH
  exportCtx.beginPath();

  exportCtx.moveTo(points[0].x, points[0].y);

  points.forEach((point) => {
    exportCtx.lineTo(point.x, point.y);
  });

  exportCtx.closePath();

  // CLIP SELECTION
  exportCtx.clip();

  // DRAW IMAGE
  exportCtx.drawImage(image, 0, 0, 700, 400);

  // EXPORT PNG
  const imageURL =
    exportCanvas.toDataURL("image/png");

  // DOWNLOAD
  const link = document.createElement("a");

  link.href = imageURL;

  link.download = "freeform-selection.png";

  link.click();

  console.log("PNG Downloaded");
};


  return (
  <div
    style={{
      minHeight: "100vh",

      backgroundColor: "#0f172a",

      display: "flex",

      justifyContent: "center",

      alignItems: "center",

      padding: "30px",

      fontFamily: "Arial",
    }}
  >
    <div
      style={{
        backgroundColor: "#1e293b",

        padding: "25px",

        borderRadius: "20px",

        boxShadow:
          "0px 10px 30px rgba(0,0,0,0.5)",

        width: "fit-content",
      }}
    >
      {/* HEADER */}
      <div
        style={{
          display: "flex",

          justifyContent: "space-between",

          alignItems: "center",

          marginBottom: "20px",
        }}
      >
        <h1
          style={{
            color: "white",

            margin: 0,

            fontSize: "32px",
          }}
        >
          LassoSS
        </h1>

        {/* BUTTONS */}
        <div
          style={{
            display: "flex",

            gap: "10px",
          }}
        >
          {/* CANCEL */}
          <button
            onClick={handleCancel}
            style={{
              backgroundColor: "#ef4444",

              color: "white",

              border: "none",

              padding: "10px 18px",

              borderRadius: "10px",

              cursor: "pointer",

              fontWeight: "bold",
            }}
          >
            Cancel
          </button>

          {/* OK */}
          <button
            onClick={handleOk}
            style={{
              backgroundColor: "#3b82f6",

              color: "white",

              border: "none",

              padding: "10px 18px",

              borderRadius: "10px",

              cursor: "pointer",

              fontWeight: "bold",
            }}
          >
            Preview
          </button>

          {/* DOWNLOAD */}
          {selectionConfirmed && (
            <button
              onClick={handleDownload}
              style={{
                backgroundColor: "#22c55e",

                color: "white",

                border: "none",

                padding: "10px 18px",

                borderRadius: "10px",

                cursor: "pointer",

                fontWeight: "bold",
              }}
            >
              Download
            </button>
          )}
        </div>
      </div>

      {/* CANVAS CONTAINER */}
      <div
        style={{
          position: "relative",

          width: "700px",
          height: "400px",

          borderRadius: "15px",

          overflow: "hidden",

          border: "2px solid #334155",
        }}
      >
        {/* BACKGROUND CANVAS */}
        <canvas
          ref={backgroundCanvasRef}
          width={700}
          height={400}
          style={{
            position: "absolute",

            top: 0,

            left: 0,
          }}
        />

        {/* OVERLAY CANVAS */}
        <canvas
          ref={overlayCanvasRef}
          width={700}
          height={400}
          style={{
            position: "absolute",

            top: 0,

            left: 0,

            cursor: "crosshair",
          }}
        />
      </div>
    </div>
  </div>
);
}
export default App;