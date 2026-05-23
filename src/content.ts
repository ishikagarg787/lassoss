function startLassoSS() {
console.log("LassoSS started");

// CREATE CANVAS
const canvas = document.createElement("canvas");

canvas.width = window.innerWidth;

canvas.height = window.innerHeight;

canvas.style.position = "fixed";

canvas.style.top = "0";

canvas.style.left = "0";

canvas.style.width = "100vw";

canvas.style.height = "100vh";

canvas.style.zIndex = "999999";

canvas.style.cursor = "crosshair";

canvas.style.pointerEvents = "auto";
// ADD TO PAGE
document.body.appendChild(canvas);
// TOOLBAR
const toolbar = document.createElement("div");

toolbar.style.position = "fixed";

toolbar.style.top = "20px";

toolbar.style.right = "20px";

toolbar.style.zIndex = "1000000";

toolbar.style.display = "flex";

toolbar.style.gap = "10px";

// DOWNLOAD BUTTON
const downloadBtn =
  document.createElement("button");

downloadBtn.innerText = "Download";

downloadBtn.style.padding = "10px 16px";

downloadBtn.style.background = "#22c55e";

downloadBtn.style.color = "white";

downloadBtn.style.border = "none";

downloadBtn.style.borderRadius = "8px";

downloadBtn.style.cursor = "pointer";

// CANCEL BUTTON
const cancelBtn =
  document.createElement("button");

cancelBtn.innerText = "Cancel";

cancelBtn.style.padding = "10px 16px";

cancelBtn.style.background = "#ef4444";

cancelBtn.style.color = "white";

cancelBtn.style.border = "none";

cancelBtn.style.borderRadius = "8px";

cancelBtn.style.cursor = "pointer";

// ADD BUTTONS
toolbar.appendChild(downloadBtn);

toolbar.appendChild(cancelBtn);

document.body.appendChild(toolbar);
document.body.style.userSelect = "none";

const ctx = canvas.getContext("2d")!;


// DRAW DARK OVERLAY
ctx.fillStyle = "rgba(0,0,0,0.5)";

ctx.fillRect(0, 0, canvas.width, canvas.height);

// DRAWING STATE
let isDrawing = false;

let points: { x: number; y: number }[] = [];

// START DRAWING
canvas.addEventListener("mousedown", (e) => {
  isDrawing = true;

  points = [];

  const point = {
    x: e.clientX,
    y: e.clientY,
  };

  points.push(point);

  redraw();
});

// DRAW
canvas.addEventListener("mousemove", (e) => {
  if (!isDrawing) return;

  const point = {
    x: e.clientX,
    y: e.clientY,
  };

  points.push(point);

  redraw();
});

// STOP DRAWING
canvas.addEventListener("mouseup", () => {
  isDrawing = false;
});

// REDRAW FUNCTION
function redraw() {
  // CLEAR
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // DARK OVERLAY
  ctx.fillStyle = "rgba(0,0,0,0.5)";

  ctx.fillRect(0, 0, canvas.width, canvas.height);

  if (points.length < 2) return;

  // CREATE PATH
  ctx.beginPath();

  ctx.moveTo(points[0].x, points[0].y);

  points.forEach((point) => {
    ctx.lineTo(point.x, point.y);
  });
  ctx.closePath();

  // CUT TRANSPARENT AREA
  ctx.globalCompositeOperation =
    "destination-out";

  ctx.fill();

  // RESET
  ctx.globalCompositeOperation =
    "source-over";

  // RED BORDER
  ctx.strokeStyle = "red";

  ctx.lineWidth = 3;

  ctx.stroke();
}

// CLEANUP
function cleanup() {
  canvas.remove();

  toolbar.remove();

  document.body.style.userSelect = "";
}

// ESC CLOSE
window.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    cleanup();
  }
});

// CANCEL BUTTON
cancelBtn.addEventListener("click", () => {
  cleanup();
});

// DOWNLOAD SCREENSHOT
downloadBtn.addEventListener(
  "click",
  async () => {
    if (points.length < 2) return;

    // HIDE UI
    canvas.style.display = "none";
    toolbar.style.display = "none";

    chrome.runtime.sendMessage(
      {
        type: "CAPTURE_TAB",
      },

      (response: any) => {
        if (!response.success) {
          alert("Capture failed");
          return;
        }

        const image = new Image();

        image.src = response.dataUrl;

        image.onload = () => {

          // SHOW UI AGAIN
          canvas.style.display = "block";
          toolbar.style.display = "flex";

          // ===== FIND BOUNDING BOX =====

          const xs = points.map((p) => p.x);

          const ys = points.map((p) => p.y);

          const minX = Math.min(...xs);

          const maxX = Math.max(...xs);

          const minY = Math.min(...ys);

          const maxY = Math.max(...ys);

          const width = maxX - minX;

          const height = maxY - minY;

          // ===== CREATE CROPPED CANVAS =====

          const exportCanvas =
            document.createElement("canvas");

          exportCanvas.width = width;

          exportCanvas.height = height;

          const exportCtx =
            exportCanvas.getContext("2d")!;

          // ===== CREATE CROPPED PATH =====

          exportCtx.beginPath();

          exportCtx.moveTo(
            points[0].x - minX,
            points[0].y - minY
          );

          points.forEach((point) => {
            exportCtx.lineTo(
              point.x - minX,
              point.y - minY
            );
          });

          exportCtx.closePath();

          // ===== CLIP =====

          exportCtx.clip();

          // ===== DRAW ONLY CROPPED AREA =====

          exportCtx.drawImage(
            image,

            minX,
            minY,
            width,
            height,

            0,
            0,
            width,
            height
          );

          // ===== EXPORT =====

          const imageUrl =
            exportCanvas.toDataURL("image/png");

          const link =
            document.createElement("a");

          link.href = imageUrl;

          link.download =
            "lasso-screenshot.png";

          link.click();

          cleanup();
        };
      }
    );
  }
);
}
chrome.runtime.onMessage.addListener(
  (message) => {
    if (message.type === "START_LASSO") {
      startLassoSS();
    }
  }
);