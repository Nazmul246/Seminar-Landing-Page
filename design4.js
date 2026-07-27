// --- GLOBAL VARIABLES & STATE ---
const seminarDate = new Date("September 22, 2026 09:00:00").getTime();
let bgCanvas, bgCtx, bgParticles = [];
const maxBgDistance = 100;
let mouse = { x: null, y: null, radius: 120 };

// Inline Canvases State & Handlers
const inlineSimulators = {};
let frameCount = 0;

// --- INITIALIZATION ---
window.addEventListener('DOMContentLoaded', () => {
  initBgParticles();
  initCountdown();
  initScrollReveal();
  initSmoothScroll();
  initInlineSimulators();
  initModals();
  initBookingForm();
});

// --- PART 1: FAINT NEURAL NODE BACKDROP ---
function initBgParticles() {
  bgCanvas = document.getElementById('bg-canvas');
  if (!bgCanvas) return;
  bgCtx = bgCanvas.getContext('2d');
  
  resizeBgCanvas();
  window.addEventListener('resize', resizeBgCanvas);
  
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });
  window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
  });

  // Create backdrop nodes
  let count = Math.floor((bgCanvas.width * bgCanvas.height) / 18000);
  count = Math.min(Math.max(count, 30), 80);
  for (let i = 0; i < count; i++) {
    bgParticles.push({
      x: Math.random() * bgCanvas.width,
      y: Math.random() * bgCanvas.height,
      dx: (Math.random() - 0.5) * 0.3,
      dy: (Math.random() - 0.5) * 0.3,
      size: Math.random() * 1.2 + 0.8,
      color: Math.random() > 0.5 ? 'rgba(99, 102, 241, 0.15)' : 'rgba(0, 242, 254, 0.15)'
    });
  }

  animateBgParticles();
}

function resizeBgCanvas() {
  bgCanvas.width = window.innerWidth;
  bgCanvas.height = window.innerHeight;
}

function animateBgParticles() {
  bgCtx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);
  
  // Update & Draw
  bgParticles.forEach(p => {
    p.x += p.dx;
    p.y += p.dy;

    if (p.x < 0 || p.x > bgCanvas.width) p.dx = -p.dx;
    if (p.y < 0 || p.y > bgCanvas.height) p.dy = -p.dy;

    // Mouse magnetic pull
    if (mouse.x && mouse.y) {
      let dx = p.x - mouse.x;
      let dy = p.y - mouse.y;
      let dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < mouse.radius) {
        p.x -= dx * 0.02;
        p.y -= dy * 0.02;
      }
    }

    bgCtx.beginPath();
    bgCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    bgCtx.fillStyle = p.color;
    bgCtx.fill();
  });

  // Draw lines
  for (let i = 0; i < bgParticles.length; i++) {
    for (let j = i + 1; j < bgParticles.length; j++) {
      let dx = bgParticles[i].x - bgParticles[j].x;
      let dy = bgParticles[i].y - bgParticles[j].y;
      let dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < maxBgDistance) {
        let opacity = (1 - dist / maxBgDistance) * 0.08;
        bgCtx.strokeStyle = `rgba(99, 102, 241, ${opacity})`;
        bgCtx.lineWidth = 0.5;
        bgCtx.beginPath();
        bgCtx.moveTo(bgParticles[i].x, bgParticles[i].y);
        bgCtx.lineTo(bgParticles[j].x, bgParticles[j].y);
        bgCtx.stroke();
      }
    }
  }

  requestAnimationFrame(animateBgParticles);
}

// --- PART 2: COUNTDOWN ---
function initCountdown() {
  const daysEl = document.getElementById('cd-days');
  const hoursEl = document.getElementById('cd-hours');
  const minsEl = document.getElementById('cd-mins');
  const secsEl = document.getElementById('cd-secs');

  function update() {
    const now = new Date().getTime();
    const diff = seminarDate - now;

    if (diff < 0) {
      document.getElementById('countdown-wrapper').innerHTML = `
        <div style="font-family: 'Outfit', sans-serif; font-size: 1.25rem; font-weight:600; color: var(--accent-cyan);">
          SEMINAR SESSION IS LIVE
        </div>`;
      return;
    }

    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((diff % (1000 * 60)) / 1000);

    daysEl.textContent = String(d).padStart(2, '0');
    hoursEl.textContent = String(h).padStart(2, '0');
    minsEl.textContent = String(m).padStart(2, '0');
    secsEl.textContent = String(s).padStart(2, '0');
  }

  update();
  setInterval(update, 1000);
}

// --- PART 3: SCROLL REVEAL ---
function initScrollReveal() {
  const elements = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('revealed');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });
  elements.forEach(el => observer.observe(el));
}

// --- PART 4: DIRECTORY SMOOTH SCROLL BINDINGS ---
function initSmoothScroll() {
  const cards = document.querySelectorAll('.directory-card');
  cards.forEach(card => {
    card.addEventListener('click', (e) => {
      const href = card.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          const offset = 80; // height gap
          const bodyRect = document.body.getBoundingClientRect().top;
          const targetRect = target.getBoundingClientRect().top;
          const targetPosition = targetRect - bodyRect;
          const offsetPosition = targetPosition - offset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }
    });
  });
}

// --- PART 5: VIEWPORT-AWARE INLINE SIMULATORS ---
function initInlineSimulators() {
  const keys = ['erp', 'soundcam', 'counting', 'vision', 'sealing', 'maintenance', 'dashboard', 'iot'];
  
  keys.forEach(k => {
    const el = document.getElementById(`canvas-${k}`);
    if (!el) return;

    const ctx = el.getContext('2d');
    inlineSimulators[k] = {
      el: el,
      ctx: ctx,
      width: 0,
      height: 0,
      visible: false,
      state: {} // custom simulation local state
    };
    
    setupCanvasResolution(inlineSimulators[k]);
  });

  // Watch for resizing to keep context mappings correct
  window.addEventListener('resize', () => {
    Object.keys(inlineSimulators).forEach(k => setupCanvasResolution(inlineSimulators[k]));
  });

  // Run simulation frame loop
  animateInlineSimulators();
}

function setupCanvasResolution(sim) {
  const rect = sim.el.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;
  
  sim.el.width = rect.width * dpr;
  sim.el.height = rect.height * dpr;
  
  sim.ctx.scale(dpr, dpr);
  sim.width = rect.width;
  sim.height = rect.height;
}

function animateInlineSimulators() {
  frameCount++;
  
  Object.keys(inlineSimulators).forEach(k => {
    const sim = inlineSimulators[k];
    
    // Viewport visibility check
    const rect = sim.el.getBoundingClientRect();
    const isVisible = (rect.top < window.innerHeight && rect.bottom > 0);
    
    if (isVisible) {
      sim.visible = true;
      drawSimulation(k, sim);
    } else {
      sim.visible = false;
    }
  });

  requestAnimationFrame(animateInlineSimulators);
}

// --- PART 6: SIMULATION RENDERING LOOPS ---
function drawSimulation(key, sim) {
  const ctx = sim.ctx;
  const w = sim.width;
  const h = sim.height;
  
  ctx.clearRect(0, 0, w, h);
  
  // Standard UI Background border
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.02)';
  ctx.lineWidth = 1;
  ctx.strokeRect(10, 10, w - 20, h - 20);

  // High tech HUD overlay
  ctx.fillStyle = 'rgba(255, 255, 255, 0.015)';
  ctx.fillRect(10, 10, w - 20, 25);
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
  ctx.beginPath();
  ctx.moveTo(10, 35);
  ctx.lineTo(w - 10, 35);
  ctx.stroke();

  // Status Badge
  ctx.fillStyle = 'rgba(0, 242, 254, 0.15)';
  ctx.beginPath();
  ctx.arc(25, 22, 3, 0, Math.PI * 2);
  ctx.fill();

  ctx.font = 'bold 8px "Outfit", sans-serif';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
  ctx.fillText("LIVE FEED // SECURE_CON", 35, 25);
  ctx.fillText("SIM_RUN: 30FPS", w - 85, 25);

  switch (key) {
    case 'erp':
      drawErpSim(ctx, w, h, sim.state);
      break;
    case 'soundcam':
      drawSoundcamSim(ctx, w, h, sim.state);
      break;
    case 'counting':
      drawCountingSim(ctx, w, h, sim.state);
      break;
    case 'vision':
      drawVisionSim(ctx, w, h, sim.state);
      break;
    case 'sealing':
      drawSealingSim(ctx, w, h, sim.state);
      break;
    case 'maintenance':
      drawMaintenanceSim(ctx, w, h, sim.state);
      break;
    case 'dashboard':
      drawDashboardSim(ctx, w, h, sim.state);
      break;
    case 'iot':
      drawIotSim(ctx, w, h, sim.state);
      break;
  }
}

// 1. ERP Database Sync Flow
function drawErpSim(ctx, w, h, state) {
  // DB on Left, Warehouse on Right, nodes stream between
  const leftX = 60;
  const rightX = w - 60;
  const centerY = h / 2 + 10;

  // Draw DB server outline
  ctx.strokeStyle = '#6366f1';
  ctx.strokeRect(leftX - 20, centerY - 30, 40, 60);
  ctx.fillStyle = 'rgba(99, 102, 241, 0.05)';
  ctx.fillRect(leftX - 20, centerY - 30, 40, 60);
  ctx.font = '7px "Outfit", sans-serif';
  ctx.fillStyle = '#6366f1';
  ctx.fillText("ERP_CORE", leftX - 18, centerY - 35);
  
  // Database shelves
  ctx.strokeStyle = 'rgba(99, 102, 241, 0.3)';
  ctx.strokeRect(leftX - 15, centerY - 20, 30, 10);
  ctx.strokeRect(leftX - 15, centerY - 5, 30, 10);
  ctx.strokeRect(leftX - 15, centerY + 10, 30, 10);

  // Draw Factory Warehouse outline
  ctx.strokeStyle = '#00f2fe';
  ctx.strokeRect(rightX - 20, centerY - 30, 40, 60);
  ctx.fillStyle = 'rgba(0, 242, 254, 0.05)';
  ctx.fillRect(rightX - 20, centerY - 30, 40, 60);
  ctx.fillStyle = '#00f2fe';
  ctx.fillText("FAC_LOGI", rightX - 18, centerY - 35);

  // Box silhouettes
  ctx.fillStyle = 'rgba(0, 242, 254, 0.2)';
  ctx.fillRect(rightX - 12, centerY - 20, 10, 10);
  ctx.fillRect(rightX + 2, centerY - 20, 10, 10);
  ctx.fillRect(rightX - 12, centerY - 5, 10, 10);

  // Stream data packets
  if (!state.packets) {
    state.packets = [];
  }
  
  // Add new packet occasionally
  if (frameCount % 45 === 0) {
    state.packets.push({ x: leftX + 20, progress: 0, speed: 0.015, color: '#00f2fe' });
  }

  // Draw packet flows
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
  ctx.beginPath();
  ctx.moveTo(leftX + 20, centerY);
  ctx.lineTo(rightX - 20, centerY);
  ctx.stroke();

  state.packets.forEach((p, idx) => {
    p.progress += p.speed;
    let currX = (leftX + 20) + (rightX - leftX - 40) * p.progress;
    
    ctx.beginPath();
    ctx.arc(currX, centerY, 3, 0, Math.PI * 2);
    ctx.fillStyle = p.color;
    ctx.fill();
    ctx.shadowBlur = 4;
    ctx.shadowColor = p.color;
    ctx.beginPath();
    ctx.arc(currX, centerY, 1.5, 0, Math.PI * 2);
    ctx.fillStyle = '#fff';
    ctx.fill();
    ctx.shadowBlur = 0; // reset
  });

  // Filter out completed packages
  state.packets = state.packets.filter(p => p.progress < 1);
}

// 2. SoundCam Acoustic Spectrum Map
function drawSoundcamSim(ctx, w, h, state) {
  // Machine outline in center
  const centerX = w / 2;
  const centerY = h / 2 + 10;
  
  ctx.strokeStyle = 'rgba(255,255,255,0.06)';
  ctx.strokeRect(centerX - 80, centerY - 40, 160, 80);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.01)';
  ctx.fillRect(centerX - 80, centerY - 40, 160, 80);

  // Acoustic heat rings
  let scale = Math.sin(frameCount * 0.08) * 10 + 25;
  let opacity = Math.sin(frameCount * 0.08) * 0.2 + 0.5;

  ctx.shadowBlur = 15;
  ctx.shadowColor = 'rgba(168, 85, 247, 0.8)';
  ctx.strokeStyle = `rgba(168, 85, 247, ${opacity})`;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(centerX + 20, centerY - 10, scale, 0, Math.PI * 2);
  ctx.stroke();

  ctx.strokeStyle = `rgba(0, 242, 254, ${opacity * 0.8})`;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(centerX + 20, centerY - 10, scale * 0.6, 0, Math.PI * 2);
  ctx.stroke();
  ctx.shadowBlur = 0; // reset

  // Crosshair
  ctx.strokeStyle = 'rgba(0, 242, 254, 0.4)';
  ctx.lineWidth = 0.8;
  ctx.beginPath();
  ctx.moveTo(centerX + 20 - 45, centerY - 10);
  ctx.lineTo(centerX + 20 + 45, centerY - 10);
  ctx.moveTo(centerX + 20, centerY - 10 - 45);
  ctx.lineTo(centerX + 20, centerY - 10 + 45);
  ctx.stroke();

  ctx.font = '8px "Outfit", sans-serif';
  ctx.fillStyle = '#a855f7';
  ctx.fillText("ANOMALY LOCATED [SLOT B1]", centerX - 70, centerY + 30);
  ctx.fillStyle = '#00f2fe';
  ctx.fillText("FREQ peak: 32.4 kHz", centerX - 70, centerY - 25);
}

// 3. AI Counting System Packaging Conveyor
function drawCountingSim(ctx, w, h, state) {
  const lineY = h / 2 + 15;

  // Conveyor Belt
  ctx.strokeStyle = 'rgba(255,255,255,0.06)';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(30, lineY + 15);
  ctx.lineTo(w - 30, lineY + 15);
  ctx.stroke();

  // Draw vertical support pins
  for (let x = 40; x < w; x += 60) {
    ctx.fillRect(x, lineY + 15, 2, 8);
  }

  // Items
  const spacing = 100;
  if (state.count === undefined) {
    state.count = 210;
  }
  
  let currentOffset = (frameCount * 1.5) % spacing;

  for (let i = -1; i < 4; i++) {
    let itemX = 30 + i * spacing + currentOffset;
    if (itemX < 20 || itemX > w - 40) continue;

    // Package block
    ctx.fillStyle = 'rgba(168, 85, 247, 0.35)';
    ctx.strokeStyle = '#a855f7';
    ctx.lineWidth = 1;
    ctx.fillRect(itemX, lineY - 20, 22, 30);
    ctx.strokeRect(itemX, lineY - 20, 22, 30);

    // Sensor line scanning area
    if (itemX > w / 2 - 20 && itemX < w / 2 + 20) {
      ctx.strokeStyle = '#00f2fe';
      ctx.lineWidth = 1.2;
      ctx.strokeRect(itemX - 3, lineY - 24, 28, 38);
      
      ctx.fillStyle = 'rgba(0, 242, 254, 0.05)';
      ctx.fillRect(itemX - 3, lineY - 24, 28, 38);

      ctx.fillStyle = '#00f2fe';
      ctx.font = 'bold 7px "Outfit", sans-serif';
      ctx.fillText("VALIDATED", itemX - 4, lineY - 28);
      
      // Update count trigger on exit boundary
      if (itemX > w / 2 + 10 && itemX < w / 2 + 13) {
        state.count++;
      }
    }
  }

  // Sensor beam lines
  ctx.strokeStyle = 'rgba(0, 242, 254, 0.15)';
  ctx.beginPath();
  ctx.moveTo(w / 2, 45);
  ctx.lineTo(w / 2, lineY + 12);
  ctx.stroke();

  // Statistics overlay
  ctx.fillStyle = '#00f2fe';
  ctx.font = '16px "Outfit", sans-serif';
  ctx.fillText(`COUNT: ${state.count}`, 30, h - 35);
  ctx.font = '8px "Inter", sans-serif';
  ctx.fillStyle = 'rgba(255,255,255,0.4)';
  ctx.fillText("SPEED: 18 BATCH/MIN", 30, h - 22);
}

// 4. AI Vision Defect Sorter
function drawVisionSim(ctx, w, h, state) {
  // Outline of Circuit board
  const boardX = 40;
  const boardY = 60;
  const boardW = w - 80;
  const boardH = h - 100;

  ctx.strokeStyle = 'rgba(255,255,255,0.06)';
  ctx.strokeRect(boardX, boardY, boardW, boardH);
  ctx.fillStyle = 'rgba(168, 85, 247, 0.02)';
  ctx.fillRect(boardX, boardY, boardW, boardH);

  // Draw circuitry lines
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.02)';
  ctx.beginPath();
  ctx.moveTo(boardX + 20, boardY + 20);
  ctx.lineTo(boardX + boardW - 20, boardY + boardH - 20);
  ctx.moveTo(boardX + boardW - 30, boardY + 15);
  ctx.lineTo(boardX + 30, boardY + boardH - 15);
  ctx.stroke();

  // Chip outline
  ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
  ctx.strokeRect(boardX + boardW / 2 - 20, boardY + boardH / 2 - 15, 40, 30);
  ctx.fillRect(boardX + boardW / 2 - 20, boardY + boardH / 2 - 15, 40, 30);

  // Laser sweep line
  let sweepY = boardY + ((frameCount * 1.5) % boardH);
  ctx.strokeStyle = 'rgba(168, 85, 247, 0.6)';
  ctx.lineWidth = 1.5;
  ctx.shadowBlur = 8;
  ctx.shadowColor = '#a855f7';
  ctx.beginPath();
  ctx.moveTo(boardX, sweepY);
  ctx.lineTo(boardX + boardW, sweepY);
  ctx.stroke();
  ctx.shadowBlur = 0; // reset

  // Defect target
  const defectX = boardX + 30;
  const defectY = boardY + boardH / 2 + 10;
  
  if (sweepY > defectY - 15) {
    ctx.strokeStyle = '#ff8a00';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(defectX - 10, defectY - 10, 20, 20);
    ctx.fillStyle = '#ff8a00';
    ctx.font = 'bold 7px "Outfit", sans-serif';
    ctx.fillText("FLAW: COMP_ALIGN", defectX - 25, defectY - 15);
  }

  ctx.fillStyle = '#a855f7';
  ctx.font = '8px "Outfit", sans-serif';
  ctx.fillText("SORT CONFIDENCE: 99.85%", 40, h - 22);
}

// 5. AI Sealing Inspection Thermal Profile
function drawSealingSim(ctx, w, h, state) {
  const barX = 40;
  const barY = h / 2 - 10;
  const barW = w - 80;
  const barH = 30;

  // Background thermography gradient block
  let grad = ctx.createLinearGradient(barX, 0, barX + barW, 0);
  grad.addColorStop(0, '#10b981');
  grad.addColorStop(0.2, '#10b981');
  grad.addColorStop(0.5, '#ff8a00');
  grad.addColorStop(0.55, '#ef4444');
  grad.addColorStop(0.6, '#ff8a00');
  grad.addColorStop(0.8, '#10b981');
  grad.addColorStop(1, '#10b981');

  ctx.fillStyle = grad;
  ctx.fillRect(barX, barY, barW, barH);
  
  // Highlight target area
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 1.2;
  ctx.strokeRect(barX + barW * 0.5 - 20, barY - 4, 40, barH + 8);
  
  ctx.font = '8px "Outfit", sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.fillText("SEAL CORE", barX + barW * 0.5 - 22, barY - 10);

  // Status logs
  ctx.fillStyle = '#10b981';
  ctx.font = '9px "Outfit", sans-serif';
  ctx.fillText("TEMP PROFILE: STABLE [174°C]", 40, h - 35);
  
  let scalePressure = 98.4 + Math.sin(frameCount * 0.08) * 0.3;
  ctx.fillText(`HYDRAULIC PRESSURE: ${scalePressure.toFixed(1)} PSI`, 40, h - 22);
}

// 6. Predictive Maintenance RUL Graph
function drawMaintenanceSim(ctx, w, h, state) {
  const graphX = 40;
  const graphY = 60;
  const graphW = w - 80;
  const graphH = h - 100;

  // Draw chart axes
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(graphX, graphY);
  ctx.lineTo(graphX, graphY + graphH);
  ctx.lineTo(graphX + graphW, graphY + graphH);
  ctx.stroke();

  // Dynamic RUL curve
  ctx.strokeStyle = '#10b981';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(graphX, graphY + 15);
  
  for (let i = 0; i < graphW; i++) {
    let factor = i / graphW;
    let wave = Math.sin((i + frameCount * 1.2) * 0.08) * 4;
    // Downward trend representing component decay
    let decay = factor * factor * (graphH - 30);
    ctx.lineTo(graphX + i, graphY + 15 + wave + decay);
  }
  ctx.stroke();

  // Threshold alert line
  ctx.strokeStyle = 'rgba(239, 68, 68, 0.3)';
  ctx.lineWidth = 0.8;
  ctx.setLineDash([4, 4]);
  ctx.beginPath();
  ctx.moveTo(graphX, graphY + graphH - 20);
  ctx.lineTo(graphX + graphW, graphY + graphH - 20);
  ctx.stroke();
  ctx.setLineDash([]); // reset

  ctx.fillStyle = '#ef4444';
  ctx.font = '7px "Outfit", sans-serif';
  ctx.fillText("CRITICAL_WARN_LIMIT", graphX + graphW - 85, graphY + graphH - 24);

  ctx.fillStyle = '#10b981';
  ctx.font = '8px "Outfit", sans-serif';
  ctx.fillText("RUL Remaining: 420 hrs", 40, h - 22);
}

// 7. Smart Factory Gauges
function drawDashboardSim(ctx, w, h, state) {
  // Gauges (2 circles)
  const g1X = w / 3;
  const g2X = (w / 3) * 2;
  const centerY = h / 2 + 10;
  const rad = 26;

  // Gauge 1 (OEE)
  let oeeVal = 92.4;
  let oeeAngle = (oeeVal / 100) * 1.5 * Math.PI;

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(g1X, centerY, rad, 0.75 * Math.PI, 2.25 * Math.PI);
  ctx.stroke();

  ctx.strokeStyle = '#10b981';
  ctx.beginPath();
  ctx.arc(g1X, centerY, rad, 0.75 * Math.PI, 0.75 * Math.PI + oeeAngle);
  ctx.stroke();

  ctx.fillStyle = '#fff';
  ctx.font = 'bold 10px "Outfit", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(`${oeeVal}%`, g1X, centerY + 3);
  ctx.font = '7px "Inter", sans-serif';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
  ctx.fillText("OEE RATIO", g1X, centerY + 45);

  // Gauge 2 (EFFICIENCY)
  let effVal = 87.2 + Math.sin(frameCount * 0.05) * 0.8;
  let effAngle = (effVal / 100) * 1.5 * Math.PI;

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
  ctx.beginPath();
  ctx.arc(g2X, centerY, rad, 0.75 * Math.PI, 2.25 * Math.PI);
  ctx.stroke();

  ctx.strokeStyle = '#00f2fe';
  ctx.beginPath();
  ctx.arc(g2X, centerY, rad, 0.75 * Math.PI, 0.75 * Math.PI + effAngle);
  ctx.stroke();

  ctx.fillStyle = '#fff';
  ctx.font = 'bold 10px "Outfit", sans-serif';
  ctx.fillText(`${effVal.toFixed(1)}%`, g2X, centerY + 3);
  ctx.font = '7px "Inter", sans-serif';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
  ctx.fillText("FAC_SPEED", g2X, centerY + 45);
  
  ctx.textAlign = 'left'; // reset alignment helper
}

// 8. Industrial IoT Hub Mesh Network
function drawIotSim(ctx, w, h, state) {
  const cx = w / 2;
  const cy = h / 2 + 10;

  if (!state.nodes) {
    state.nodes = [];
    // Spawn 6 hubs
    for (let i = 0; i < 6; i++) {
      let angle = (i / 6) * Math.PI * 2;
      state.nodes.push({
        x: cx + Math.cos(angle) * 45,
        y: cy + Math.sin(angle) * 35,
        rad: 3,
        color: i % 2 === 0 ? '#10b981' : '#6366f1',
        pulse: 0
      });
    }
  }

  // Draw connections
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
  ctx.lineWidth = 0.8;
  for (let i = 0; i < state.nodes.length; i++) {
    for (let j = i + 1; j < state.nodes.length; j++) {
      ctx.beginPath();
      ctx.moveTo(state.nodes[i].x, state.nodes[i].y);
      ctx.lineTo(state.nodes[j].x, state.nodes[j].y);
      ctx.stroke();
    }
  }

  // Draw center hub database node
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.arc(cx, cy, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#00f2fe';
  ctx.lineWidth = 1;
  ctx.stroke();

  // Update & Draw nodes
  state.nodes.forEach(n => {
    n.pulse += 0.06;
    let pulseR = 3 + (Math.sin(n.pulse) + 1) * 3;
    
    ctx.fillStyle = `rgba(${n.color === '#10b981' ? '16,185,129' : '99,102,241'}, 0.15)`;
    ctx.beginPath();
    ctx.arc(n.x, n.y, pulseR, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = n.color;
    ctx.beginPath();
    ctx.arc(n.x, n.y, n.rad, 0, Math.PI * 2);
    ctx.fill();
  });

  ctx.font = '8px "Outfit", sans-serif';
  ctx.fillStyle = '#10b981';
  ctx.fillText("OPC_UA CONNECTIONS: SECURE", 40, h - 22);
}

// --- PART 7: DYNAMIC VIDEO & BROCHURE MODALS ---
function initModals() {
  const videoModal = document.getElementById('video-modal');
  const docModal = document.getElementById('doc-modal');
  const videoClose = document.getElementById('video-modal-close');
  const docClose = document.getElementById('doc-modal-close');
  const playBtns = document.querySelectorAll('.play-video-btn');
  const docBtns = document.querySelectorAll('.view-doc-btn');
  
  // Close triggers
  videoClose.addEventListener('click', () => closeModal(videoModal));
  docClose.addEventListener('click', () => closeModal(docModal));
  
  window.addEventListener('click', (e) => {
    if (e.target === videoModal) closeModal(videoModal);
    if (e.target === docModal) closeModal(docModal);
  });

  // Play Video triggers
  playBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const type = btn.getAttribute('data-video-type');
      const src = btn.getAttribute('data-video-src');
      const title = btn.getAttribute('data-title');
      
      document.getElementById('video-modal-title').textContent = title;
      const container = document.getElementById('video-player-container');
      container.innerHTML = '';
      
      videoModal.classList.add('active');

      if (type === 'youtube') {
        container.innerHTML = `
          <iframe src="https://www.youtube.com/embed/${src}?autoplay=1&rel=0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowfullscreen></iframe>`;
      } else {
        // Enlarge visual simulation fallback modal
        const modalCanvas = document.createElement('canvas');
        modalCanvas.style.width = '100%';
        modalCanvas.style.height = '100%';
        modalCanvas.style.position = 'absolute';
        modalCanvas.style.top = '0';
        modalCanvas.style.left = '0';
        modalCanvas.style.background = '#020205';
        container.appendChild(modalCanvas);
        
        startEnlargedModalSimulation(src, modalCanvas);
      }
    });
  });

  // Document triggers
  docBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const docType = btn.getAttribute('data-doc');
      const docTitle = btn.textContent.trim();
      
      document.getElementById('doc-modal-title').textContent = docTitle;
      const container = document.getElementById('doc-viewer-container');
      container.innerHTML = getDocumentHTML(docType);
      
      docModal.classList.add('active');
    });
  });
}

function closeModal(modal) {
  modal.classList.remove('active');
  
  setTimeout(() => {
    const container = document.getElementById('video-player-container');
    if (container) container.innerHTML = '';
    if (modalActiveInterval) {
      clearInterval(modalActiveInterval);
      modalActiveInterval = null;
    }
  }, 250);
}

// Custom simulated enlarged panels in Modals
let modalActiveInterval = null;
function startEnlargedModalSimulation(key, canvas) {
  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  ctx.scale(dpr, dpr);

  let w = rect.width;
  let h = rect.height;
  let frame = 0;
  
  let localState = {};
  
  modalActiveInterval = setInterval(() => {
    frame++;
    ctx.clearRect(0, 0, w, h);
    
    // Core Panel Border
    ctx.strokeStyle = 'rgba(0, 242, 254, 0.15)';
    ctx.lineWidth = 1;
    ctx.strokeRect(10, 10, w - 20, h - 20);

    // Frame grids
    ctx.strokeStyle = 'rgba(255,255,255,0.015)';
    ctx.lineWidth = 0.5;
    for (let x = 30; x < w; x += 40) {
      ctx.beginPath(); ctx.moveTo(x, 10); ctx.lineTo(x, h - 10); ctx.stroke();
    }
    for (let y = 30; y < h; y += 40) {
      ctx.beginPath(); ctx.moveTo(10, y); ctx.lineTo(w - 10, y); ctx.stroke();
    }

    ctx.font = 'bold 11px "Outfit", sans-serif';
    ctx.fillStyle = '#00f2fe';
    ctx.fillText("MODAL PRESENTATION MODE // SIMULATOR", 25, 30);
    
    // Render specific frame
    if (key === 'erp_demo') {
      ctx.fillStyle = 'rgba(255,255,255,0.6)';
      ctx.font = '12px "Inter", sans-serif';
      ctx.fillText("Dynamic Enterprise Resource Logistics Syncing Module", 25, 60);

      // Simulate listings
      ctx.font = '9px "Inter", sans-serif';
      ctx.fillStyle = 'rgba(255,255,255,0.4)';
      ctx.fillText("REGISTRY_ID", 25, 90);
      ctx.fillText("MODULE_REF", 120, 90);
      ctx.fillText("SYNC_LATENCY", 220, 90);
      ctx.fillText("STATUS", 320, 90);

      const items = [
        { id: "TX_4201", ref: "INVENTORY_BOO", latency: "1.2ms", status: "SYNCED" },
        { id: "TX_4202", ref: "WAREHOUSE_01", latency: "2.4ms", status: "SYNCED" },
        { id: "TX_4203", ref: "FINANCIALS_DB", latency: "1.8ms", status: "SYNCED" },
        { id: "TX_4204", ref: "BILLING_CORE", latency: "4.2ms", status: "SYNCING" }
      ];

      items.forEach((item, index) => {
        let yOffset = 110 + index * 22;
        ctx.fillStyle = '#ffffff';
        ctx.fillText(item.id, 25, yOffset);
        ctx.fillText(item.ref, 120, yOffset);
        ctx.fillText(item.latency, 220, yOffset);
        ctx.fillStyle = item.status === 'SYNCED' ? '#10b981' : '#ff8a00';
        ctx.fillText(item.status, 320, yOffset);
      });
      
    } else if (key === 'soundcam_demo') {
      ctx.fillStyle = 'rgba(255,255,255,0.6)';
      ctx.font = '12px "Inter", sans-serif';
      ctx.fillText("SoundCam Acoustic Frequencies & Leak Map", 25, 60);

      // Spectrogram waves
      ctx.beginPath();
      ctx.strokeStyle = '#a855f7';
      ctx.lineWidth = 1.8;
      for (let i = 0; i < w - 50; i++) {
        let amp = Math.sin((i + frame) * 0.05) * 12;
        if (i > w/2 - 50 && i < w/2 + 50) {
          amp += (Math.random() - 0.5) * 40; // noise anomaly spikes
        }
        ctx.lineTo(25 + i, h / 2 + 10 + amp);
      }
      ctx.stroke();

      ctx.strokeStyle = '#00f2fe';
      ctx.strokeRect(w/2 - 40, h/2 - 40, 80, 80);
      ctx.fillStyle = '#00f2fe';
      ctx.font = 'bold 8px "Outfit", sans-serif';
      ctx.fillText("ANOMALY FOCUS LOCK", w/2 - 35, h/2 - 25);
      
    } else {
      // General feedback simulator
      ctx.fillStyle = 'rgba(255,255,255,0.7)';
      ctx.font = '14px "Outfit", sans-serif';
      ctx.fillText("System Demo Feed OK // Monitoring Pipeline", 25, 70);
      
      let waveVal = Math.sin(frame * 0.1) * 30 + 50;
      ctx.fillStyle = '#10b981';
      ctx.fillRect(25, 100, waveVal * 2.5, 8);
      ctx.fillText(`PIPELINE LOAD: ${waveVal.toFixed(1)}%`, 25, 125);
    }
  }, 33);
}

// In-app document mockups
function getDocumentHTML(type) {
  if (type === 'erp_brochure') {
    return `
      <div class="doc-viewer">
        <div class="doc-hero">
          <svg class="doc-hero-icon" viewBox="0 0 24 24">
            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
          </svg>
          <h3 style="font-family:'Outfit';">ThaiBiz360 ERP</h3>
          <p style="color:var(--text-secondary); font-size:0.85rem;">Modern Enterprise Planning Prospectus</p>
        </div>
        
        <div class="doc-section">
          <h4>Unified Database Flow</h4>
          <p>ThaiBiz360 ERP consolidates manufacturing statistics, billing pipelines, supply logs, and personnel assignments into one responsive cloud register. Sync updates in real-time across your headquarters and your factory floor.</p>
        </div>

        <div class="doc-section">
          <h4>Features & Modules</h4>
          <p>Features material requisition requests, inventory trigger margins, billing templates, batch numbers validation, and dynamic barcode/QR reader support.</p>
        </div>

        <div class="doc-highlight-grid">
          <div class="doc-highlight-card">
            <h5>+30% Efficiency</h5>
            <p>Reduction in office bookkeeping and processing latency.</p>
          </div>
          <div class="doc-highlight-card">
            <h5>Zero Sync Lag</h5>
            <p>Instant syncing between shipping bays and accounting books.</p>
          </div>
        </div>
      </div>`;
  } else if (type === 'soundcam_case') {
    return `
      <div class="doc-viewer">
        <div class="doc-hero">
          <svg class="doc-hero-icon" viewBox="0 0 24 24">
            <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
          </svg>
          <h3 style="font-family:'Outfit';">SoundCam AI Case Study</h3>
          <p style="color:var(--text-secondary); font-size:0.85rem;">Compressor Leaks Diagnostic Survey</p>
        </div>

        <div class="doc-section">
          <h4>The Problem</h4>
          <p>A manufacturing plant was losing valuable pressure volume and facing huge electrical expenses due to slow air leaks in compressor pipelines that weren't visible or audibly loud to staff.</p>
        </div>

        <div class="doc-section">
          <h4>SoundCam Acoustic Solution</h4>
          <p>By scanning panels using acoustic sensory maps, the SoundCam AI isolated ultrasonic noise profiles, catching valve seal degradation weeks before mechanical failures or pressure drops occurred.</p>
        </div>

        <div class="doc-highlight-grid">
          <div class="doc-highlight-card">
            <h5>$24,000 / Year</h5>
            <p>Electric cost reduction by plugging silent compressed air leaks.</p>
          </div>
          <div class="doc-highlight-card">
            <h5>Early Warnings</h5>
            <p>Technicians received warnings and repair requests directly on their phones.</p>
          </div>
        </div>
      </div>`;
  }
  return `<p>Document not found.</p>`;
}

// --- PART 8: BOOKING FORM VALIDATOR ---
function initBookingForm() {
  const form = document.getElementById('booking-form');
  const successEl = document.getElementById('booking-success');
  
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    resetValidationErrors();

    const name = document.getElementById('form-name');
    const email = document.getElementById('form-email');
    const phone = document.getElementById('form-phone');
    const company = document.getElementById('form-company');
    const msg = document.getElementById('form-msg');
    
    let hasError = false;

    if (!name.value.trim()) { highlightError(name); hasError = true; }
    if (!validateEmail(email.value)) { highlightError(email); hasError = true; }
    if (!phone.value.trim()) { highlightError(phone); hasError = true; }
    if (!company.value.trim()) { highlightError(company); hasError = true; }
    if (!msg.value.trim()) { highlightError(msg); hasError = true; }

    if (hasError) return;

    // Simulate database progression states
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    submitBtn.disabled = true;
    submitBtn.textContent = "VERIFYING SLOTS...";
    submitBtn.style.background = "#6366f1";
    submitBtn.style.color = "#ffffff";

    setTimeout(() => {
      submitBtn.textContent = "REGISTERING SYSTEM DEMO...";
      
      setTimeout(() => {
        // Log leads locally
        const leadData = {
          name: name.value,
          email: email.value,
          phone: phone.value,
          company: company.value,
          message: msg.value,
          date: new Date().toISOString()
        };

        form.reset();
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
        submitBtn.style.background = '';
        submitBtn.style.color = '';
        
        successEl.style.display = 'flex';
        successEl.scrollIntoView({ behavior: 'smooth', block: 'center' });

        const leads = JSON.parse(localStorage.getItem('tb360_leads') || '[]');
        leads.push(leadData);
        localStorage.setItem('tb360_leads', JSON.stringify(leads));
        
        setTimeout(() => {
          successEl.style.display = 'none';
        }, 10000);
      }, 1500);
    }, 800);
  });
}

function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
}

function highlightError(el) {
  el.style.borderColor = 'rgba(239, 68, 68, 0.4)';
  el.style.boxShadow = '0 0 10px rgba(239, 68, 68, 0.05)';
  
  el.addEventListener('input', function clear() {
    el.style.borderColor = '';
    el.style.boxShadow = '';
    el.removeEventListener('input', clear);
  });
}

function resetValidationErrors() {
  const inputs = document.querySelectorAll('.form-input');
  inputs.forEach(el => {
    el.style.borderColor = '';
    el.style.boxShadow = '';
  });
}
