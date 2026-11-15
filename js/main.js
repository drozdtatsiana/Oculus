
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');


const WIDTH = canvas.width;
const HEIGHT = canvas.height;


const dpr = window.devicePixelRatio || 1;
canvas.style.width = `${WIDTH}px`;
canvas.style.height = `${HEIGHT}px`;
canvas.width = WIDTH * dpr;
canvas.height = HEIGHT * dpr;
ctx.scale(dpr, dpr);

const SPACING = 20;
const DOT_RADIUS = 2.5;
const DOT_COLOR = 'rgba(46, 108, 189, 1)';

const FORCE_RADIUS = 40;
const FORCE_STRENGTH = 0.08;
const RETURN_FORCE = 0.05;
const FRICTION = 0.85;

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const mouse = { x: null, y: null };
const dots = [];

for (let y = SPACING; y < HEIGHT; y += SPACING) {
  for (let x = SPACING; x < WIDTH; x += SPACING) {
    dots.push({ x, y, ox: x, oy: y, vx: 0, vy: 0 });
  }
}

canvas.addEventListener('pointermove', (e) => {
  const rect = canvas.getBoundingClientRect();
  
  mouse.x = (e.clientX - rect.left) * (WIDTH / rect.width);
  mouse.y = (e.clientY - rect.top) * (HEIGHT / rect.height);
});

function resetMouse() {
  mouse.x = null;
  mouse.y = null;
}

canvas.addEventListener('pointerleave', resetMouse);
canvas.addEventListener('pointercancel', resetMouse);

function update() {
  for (const dot of dots) {
    if (mouse.x !== null) {
      const dx = mouse.x - dot.x;
      const dy = mouse.y - dot.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < FORCE_RADIUS) {
        const force = (FORCE_RADIUS - dist) / FORCE_RADIUS;
        dot.vx -= dx * force * FORCE_STRENGTH;
        dot.vy -= dy * force * FORCE_STRENGTH;
      }
    }

    dot.vx += (dot.ox - dot.x) * RETURN_FORCE;
    dot.vy += (dot.oy - dot.y) * RETURN_FORCE;

    dot.vx *= FRICTION;
    dot.vy *= FRICTION;

    dot.x += dot.vx;
    dot.y += dot.vy;
  }
}

function draw() {
  ctx.clearRect(0, 0, WIDTH, HEIGHT);
  ctx.fillStyle = DOT_COLOR;
  ctx.beginPath();

  for (const dot of dots) {
    ctx.moveTo(dot.x + DOT_RADIUS, dot.y);
    ctx.arc(dot.x, dot.y, DOT_RADIUS, 0, Math.PI * 2);
  }

  ctx.fill();
}

function animate() {
  update();
  draw();
  requestAnimationFrame(animate);
}

if (reduceMotion) {
  draw(); 
} else {
  animate();
}


const menuBtn = document.querySelector('.header__btn');
const menuList = document.querySelector('.menu__list');

if (menuBtn && menuList) {
  function toggleMenu(open) {
    const isOpen = menuList.classList.toggle('menu__open', open);
    menuBtn.classList.toggle('header__btn--active', isOpen);
    menuBtn.setAttribute('aria-expanded', isOpen);
    menuBtn.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
  }

  menuBtn.addEventListener('click', () => {
    toggleMenu();
  });

  menuList.querySelectorAll('.menu__link').forEach((link) => {
    link.addEventListener('click', () => {
      toggleMenu(false);
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      toggleMenu(false);
    }
  });
}