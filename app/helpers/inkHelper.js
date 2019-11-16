function Point(x, y) {
  this.x = typeof x === 'undefined' ? 0 : x;
  this.y = typeof y === 'undefined' ? 0 : y;
  this.toArray = function() {
    return [this.x, this.y];
  };
}

export function Rect(x, y, w, h) {
  this.x = typeof x === 'undefined' ? 0 : x;
  this.y = typeof y === 'undefined' ? 0 : y;
  this.w = typeof w === 'undefined' ? 0 : w;
  this.h = typeof h === 'undefined' ? 0 : h;
}

function InkStroke(points) {
  // Stroke ID is auto-generated and unique in an analysis session
  InkStroke.prototype.getNextId = function() {
    InkStroke.counter += 1;
    return InkStroke.counter;
  };

  // Members
  this.points = typeof points === 'undefined' ? [] : points;
  this.id = this.getNextId();

  // Convert to InkRecognizer service compliant format
  InkStroke.prototype.toJsonString = function(scale, digits) {
    const scaleFactor = typeof scale === 'undefined' ? 1.0 : scale;
    const nDigits = typeof digits === 'undefined' ? 4 : digits;

    return this.points
      .map(function(pt) {
        return pt
          .toArray()
          .map(function(item) {
            return (item * scaleFactor).toFixed(nDigits);
          })
          .join();
      })
      .join();
  };

  InkStroke.prototype.fillWithString = function(pointsStr, scale) {
    const str = typeof pointsStr === 'undefined' || !pointsStr ? '' : pointsStr;
    const scaleFactor = typeof scale === 'undefined' ? 1.0 : scale;
    if (str === '') {
      this.points = [];
    } else {
      // Split string based on comma or whitespace
      const XYs = str.split(/[, ]+/);
      for (let i = 0; i < XYs.length; i += 2) {
        const x = parseFloat(XYs[i]) * scaleFactor;
        const y = parseFloat(XYs[i + 1]) * scaleFactor;
        this.points.push(new Point(x, y));
      }
    }
  };
}

InkStroke.counter = 0;

// InkCanvas is a thin wrapper of <canvas>, and unit of the coordinates is pixel
function InkCanvas(canvasElementId) {
  // Canvas related members
  this.canvas = document.getElementById(canvasElementId);
  this.width = this.canvas.width;
  this.height = this.canvas.height;
  this.ctx = this.canvas.getContext('2d');

  // Stroke related members
  this.points = [];
  this.strokes = [];
  this.strokeStarted = false;

  // Register event handlers
  const that = this;
  [
    'pointerdown',
    'pointerup',
    'pointermove',
    'pointerout',
    'touchdown',
    'touchmove',
    'touchend',
    'touchleave',
  ].forEach(function(e) {
    that.canvas.addEventListener(
      e,
      function(evt) {
        that.handlePointerEvent(e, evt);
      },
      false,
    );
  });

  InkCanvas.prototype.handlePointerEvent = function(res, e) {
    e.preventDefault();

    const offsetX = this.canvas.getBoundingClientRect().left;
    const offsetY = this.canvas.getBoundingClientRect().top;
    const { pageXOffset } = window;
    const { pageYOffset } = window;
    const point = new Point(pageXOffset - offsetX, pageYOffset - offsetY);

    if (res.indexOf('touch') === 0) {
      point.x += e.touches[0].clientX;
      point.y += e.touches[0].clientY;
    } else {
      point.x += e.clientX;
      point.y += e.clientY;
    }

    if (res === 'pointerdown' || res === 'touchdown') {
      this.points = [];
      this.points.push(point);
      this.drawLine(point, point);
      this.strokeStarted = true;
    } else if (res === 'pointermove' || res === 'touchmove') {
      if (this.strokeStarted) {
        const size = this.points.length;
        if (size > 0) {
          const prevPoint = this.points[size - 1];
          this.drawLine(prevPoint, point);
        }
        this.points.push(point);
      }
    } else if (
      res === 'pointerup' ||
      res === 'pointerout' ||
      res === 'touchleave' ||
      res === 'touchend'
    ) {
      if (this.strokeStarted) {
        const stroke = new InkStroke(this.points);
        this.strokes.push(stroke);
      }
      this.strokeStarted = false;
    }
  };

  // Rendering utilities
  InkCanvas.prototype.clear = function() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.points = [];
    this.strokes = [];
  };

  InkCanvas.prototype.setStrokeStyle = function(color, lineWidth, dash) {
    const strokeDash = typeof dash === 'undefined' ? [] : dash;

    this.ctx.strokeStyle = typeof color === 'undefined' ? 'black' : color;
    this.ctx.lineWidth = typeof lineWidth === 'undefined' ? 2 : lineWidth;
    this.ctx.setLineDash(strokeDash);
    this.ctx.font = '18px Arial';
    this.ctx.fillStyle = color;
  };
  this.setStrokeStyle();

  InkCanvas.prototype.drawStroke = function(s) {
    const pts = s.points;
    this.drawPath(pts);
  };

  InkCanvas.prototype.drawLine = function(p1, p2) {
    this.ctx.beginPath();
    this.ctx.moveTo(p1.x, p1.y);
    this.ctx.lineTo(p2.x, p2.y);
    this.ctx.stroke();
  };

  InkCanvas.prototype.drawRect = function(rect, scale) {
    const scaleFactor = typeof scale === 'undefined' ? 1.0 : scale;
    this.ctx.beginPath();
    this.ctx.rect(
      rect.x * scaleFactor,
      rect.y * scaleFactor,
      rect.w * scaleFactor,
      rect.h * scaleFactor,
    );
    this.ctx.stroke();
    this.ctx.closePath();
  };

  InkCanvas.prototype.drawPath = function(pts, scale, cp) {
    const scaleFactor = typeof scale === 'undefined' ? 1.0 : scale;
    const closePath = typeof cp !== 'undefined';
    if (pts.length > 0) {
      this.ctx.beginPath();
      this.ctx.moveTo(pts[0].x * scaleFactor, pts[0].y * scaleFactor);
      for (let i = 1; i < pts.length; i += 1) {
        this.ctx.lineTo(pts[i].x * scaleFactor, pts[i].y * scaleFactor);
      }
      if (closePath) {
        this.ctx.lineTo(pts[0].x * scaleFactor, pts[0].y * scaleFactor);
      }
      this.ctx.stroke();
    }
  };

  InkCanvas.distance = function(p1, p2) {
    const dx = p1.x - p2.x;
    const dy = p1.y - p2.y;
    return Math.sqrt(dx * dx + dy * dy);
  };

  InkCanvas.prototype.drawEllipse = function(pts, scale) {
    const scaleFactor = typeof scale === 'undefined' ? 1.0 : scale;
    const cx = ((pts[0].x + pts[2].x) * scaleFactor) / 2.0;
    const cy = ((pts[0].y + pts[2].y) * scaleFactor) / 2.0;
    const w = InkCanvas.distance(pts[0], pts[2]) * scaleFactor;
    const h = InkCanvas.distance(pts[1], pts[3]) * scaleFactor;
    const rotationAngle = Math.atan2(pts[2].y - pts[0].y, pts[2].x - pts[0].x);

    this.ctx.beginPath();
    this.ctx.ellipse(cx, cy, w / 2.0, h / 2.0, rotationAngle, 0, 2 * Math.PI);
    this.ctx.stroke();
  };

  InkCanvas.prototype.drawCircle = function(pts, scale) {
    const scaleFactor = typeof scale === 'undefined' ? 1.0 : scale;
    const cx = ((pts[0].x + pts[2].x) * scaleFactor) / 2.0;
    const cy = ((pts[0].y + pts[2].y) * scaleFactor) / 2.0;
    const r = (InkCanvas.distance(pts[0], pts[2]) * scaleFactor) / 2.0;

    this.ctx.beginPath();
    this.ctx.arc(cx, cy, r, 0, 2 * Math.PI);
    this.ctx.stroke();
  };

  InkCanvas.prototype.drawText = function(text, pos, scale, color) {
    const scaleFactor = typeof scale === 'undefined' ? 1.0 : scale;
    const textContent = typeof text === 'undefined' ? '' : text;

    if (textContent !== '') {
      this.ctx.fillStyle = color;
      this.ctx.fillText(textContent, pos.x * scaleFactor, pos.y * scaleFactor);
    }
  };
}

window.InkCanvas = InkCanvas;
