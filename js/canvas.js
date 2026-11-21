/* js/canvas.js — Visualisation Moléculaire Interactive : Atelier Atomique ChimieLab */

(function initAtomicCanvas() {
  const canvas = document.getElementById('atomic-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let animationId = null;
  let width = 0;
  let height = 0;

  // Respect des préférences de réduction de mouvement
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function resize() {
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = rect.width;
    height = rect.height;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);
  }

  // Particules atomiques représentant l'équilibre acide-base : HA, H3O+, A-
  const PARTICLE_COUNT = 28;
  const particles = [];
  const colors = [
    'rgba(226, 184, 116, 0.75)', // Champagne Gold (H3O+)
    'rgba(243, 216, 162, 0.65)', // Warm Ivory (A-)
    'rgba(212, 142, 60, 0.55)',  // Molten Amber (HA)
    'rgba(180, 160, 135, 0.35)'  // Solvant H2O
  ];

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push({
      x: Math.random() * (width || 400),
      y: Math.random() * (height || 300),
      radius: Math.random() * 2.8 + 1.2,
      vx: (Math.random() - 0.5) * 0.45,
      vy: (Math.random() - 0.5) * 0.45,
      color: colors[i % colors.length],
      pulse: Math.random() * Math.PI * 2,
      pulseSpeed: 0.02 + Math.random() * 0.02
    });
  }

  let mouse = { x: -1000, y: -1000, active: false };

  window.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
    mouse.active = true;
  });

  window.addEventListener('mouseleave', () => {
    mouse.active = false;
  });

  function draw() {
    ctx.clearRect(0, 0, width, height);

    // Dessin des vecteurs de liaison électrostatique entre ions voisins
    ctx.lineWidth = 0.75;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const maxDist = 95;

        if (dist < maxDist) {
          const alpha = (1 - dist / maxDist) * 0.22;
          ctx.strokeStyle = `rgba(226, 184, 116, ${alpha})`;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    // Dessin et mise à jour des particules atomiques
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      if (!prefersReducedMotion) {
        p.x += p.vx;
        p.y += p.vy;
        p.pulse += p.pulseSpeed;

        // Interaction douce avec la souris (déviation de trajectoire)
        if (mouse.active) {
          const mdx = p.x - mouse.x;
          const mdy = p.y - mouse.y;
          const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
          if (mdist < 100 && mdist > 0) {
            const force = (1 - mdist / 100) * 0.8;
            p.x += (mdx / mdist) * force;
            p.y += (mdy / mdist) * force;
          }
        }

        // Rebondissement doux sur les parois
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;
      }

      const pulseRadius = p.radius + Math.sin(p.pulse) * 0.5;

      // Halo lumineux
      const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, pulseRadius * 2.5);
      grad.addColorStop(0, p.color);
      grad.addColorStop(1, 'rgba(212, 173, 112, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(p.x, p.y, pulseRadius * 2.5, 0, Math.PI * 2);
      ctx.fill();

      // Cœur de la particule
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, Math.max(pulseRadius, 0.8), 0, Math.PI * 2);
      ctx.fill();
    }

    animationId = requestAnimationFrame(draw);
  }

  window.addEventListener('resize', () => {
    resize();
    for (let p of particles) {
      if (p.x > width) p.x = Math.random() * width;
      if (p.y > height) p.y = Math.random() * height;
    }
  });

  resize();
  draw();
})();
