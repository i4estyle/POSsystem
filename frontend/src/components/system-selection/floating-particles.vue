<template>
  <aside class="canvas-particles-wrapper" aria-hidden="true">
    <canvas ref="canvasRef" class="particles-canvas"></canvas>
  </aside>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

interface Ball {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color1: string;
  color2: string;
  angle: number;
  speed: number;
}

const canvasRef = ref<HTMLCanvasElement | null>(null);
let animationFrameId: number | null = null;
let mouseX = -1000;
let mouseY = -1000;

const PASTEL_PALETTES = [
  { c1: 'rgba(208, 195, 241, 0.45)', c2: 'rgba(208, 195, 241, 0)' },
  { c1: 'rgba(206, 238, 248, 0.5)', c2: 'rgba(206, 238, 248, 0)' },
  { c1: 'rgba(255, 215, 238, 0.45)', c2: 'rgba(255, 215, 238, 0)' },
  { c1: 'rgba(233, 249, 229, 0.5)', c2: 'rgba(233, 249, 229, 0)' },
  { c1: 'rgba(254, 241, 171, 0.4)', c2: 'rgba(254, 241, 171, 0)' },
];

let balls: Ball[] = [];

const createBalls = (width: number, height: number): Ball[] => {
  const count = Math.min(Math.floor((width * height) / 28000), 28);
  const list: Ball[] = [];

  for (let i = 0; i < count; i++) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    const palette = PASTEL_PALETTES[i % PASTEL_PALETTES.length] ?? PASTEL_PALETTES[0]!;
    list.push({
      x,
      y,
      vx: (Math.random() - 0.5) * 0.2,
      vy: (Math.random() - 0.5) * 0.2,
      radius: Math.random() * 10 + 6,
      color1: palette.c1,
      color2: palette.c2,
      angle: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.004 + 0.002,
    });
  }
  return list;
};

const handleResize = (): void => {
  const canvas = canvasRef.value;
  if (!canvas) return;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  if (balls.length === 0) {
    balls = createBalls(canvas.width, canvas.height);
  }
};

const handleMouseMove = (event: MouseEvent): void => {
  mouseX = event.clientX;
  mouseY = event.clientY;
};

const handleMouseLeave = (): void => {
  mouseX = -1000;
  mouseY = -1000;
};

const getCardBounds = (): Array<{
  left: number;
  top: number;
  right: number;
  bottom: number;
}> => {
  const cards = document.querySelectorAll<HTMLElement>('.system-card');
  const bounds: Array<{
    left: number;
    top: number;
    right: number;
    bottom: number;
  }> = [];

  cards.forEach((card) => {
    const r = card.getBoundingClientRect();
    bounds.push({
      left: r.left,
      top: r.top,
      right: r.right,
      bottom: r.bottom,
    });
  });

  return bounds;
};

const renderFrame = (): void => {
  const canvas = canvasRef.value;
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const width = canvas.width;
  const height = canvas.height;

  ctx.clearRect(0, 0, width, height);
  const cardBounds = getCardBounds();

  for (const b of balls) {
    if (!b) continue;

    b.angle += b.speed;
    const driftX = Math.cos(b.angle) * 0.25;
    const driftY = Math.sin(b.angle) * 0.25;

    const dx = b.x - mouseX;
    const dy = b.y - mouseY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const maxDist = 130;

    if (dist < maxDist && dist > 0) {
      const force = (maxDist - dist) / maxDist;
      const pushX = (dx / dist) * force * 2.2;
      const pushY = (dy / dist) * force * 2.2;

      b.vx += pushX * 0.08;
      b.vy += pushY * 0.08;
    }

    for (const bound of cardBounds) {
      const margin = b.radius + 10;
      if (
        b.x > bound.left - margin &&
        b.x < bound.right + margin &&
        b.y > bound.top - margin &&
        b.y < bound.bottom + margin
      ) {
        const cardCenterX = (bound.left + bound.right) / 2;
        const cardCenterY = (bound.top + bound.bottom) / 2;
        const cdx = b.x - cardCenterX;
        const cdy = b.y - cardCenterY;
        const cdist = Math.sqrt(cdx * cdx + cdy * cdy) || 1;

        b.vx += (cdx / cdist) * 0.8;
        b.vy += (cdy / cdist) * 0.8;
      }
    }

    b.vx *= 0.96;
    b.vy *= 0.96;

    b.x += b.vx + driftX;
    b.y += b.vy + driftY;

    if (b.x - b.radius < 0) {
      b.x = b.radius;
      b.vx *= -1;
    } else if (b.x + b.radius > width) {
      b.x = width - b.radius;
      b.vx *= -1;
    }

    if (b.y - b.radius < 0) {
      b.y = b.radius;
      b.vy *= -1;
    } else if (b.y + b.radius > height) {
      b.y = height - b.radius;
      b.vy *= -1;
    }

    const grad = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.radius);
    grad.addColorStop(0, b.color1);
    grad.addColorStop(1, b.color2);

    ctx.beginPath();
    ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
    ctx.fillStyle = grad;
    ctx.fill();
  }

  animationFrameId = requestAnimationFrame(renderFrame);
};

onMounted(() => {
  handleResize();
  window.addEventListener('resize', handleResize);
  window.addEventListener('mousemove', handleMouseMove);
  window.addEventListener('mouseleave', handleMouseLeave);
  animationFrameId = requestAnimationFrame(renderFrame);
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
  window.removeEventListener('mousemove', handleMouseMove);
  window.removeEventListener('mouseleave', handleMouseLeave);
  if (animationFrameId !== null) {
    cancelAnimationFrame(animationFrameId);
  }
});
</script>
