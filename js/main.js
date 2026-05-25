const menuToggle = document.getElementById('menu-toggle');
const miniMenu = document.getElementById('mini-menu');
const miniMenuLinks = document.querySelectorAll('.mini-menu-link');
const themeToggle = document.getElementById('theme-toggle');

const setMenuState = (isOpen) => {
  if (!menuToggle || !miniMenu) return;
  menuToggle.classList.toggle('is-open', isOpen);
  miniMenu.classList.toggle('is-open', isOpen);
  menuToggle.setAttribute('aria-expanded', String(isOpen));
  miniMenu.setAttribute('aria-hidden', String(!isOpen));
};

if (menuToggle && miniMenu) {
  menuToggle.addEventListener('click', (event) => {
    event.stopPropagation();
    setMenuState(!miniMenu.classList.contains('is-open'));
  });

  miniMenuLinks.forEach((link) => {
    link.addEventListener('click', () => setMenuState(false));
  });

  document.addEventListener('click', (event) => {
    if (!miniMenu.contains(event.target) && !menuToggle.contains(event.target)) {
      setMenuState(false);
    }
  });
}

themeToggle?.addEventListener('click', () => {
  document.body.classList.toggle('light-theme');
});

document.querySelectorAll('.project-card').forEach((card) => {
  card.addEventListener('mouseenter', () => card.classList.add('is-previewing'));
  card.addEventListener('mouseleave', () => card.classList.remove('is-previewing'));
  card.addEventListener('focus', () => card.classList.add('is-previewing'));
  card.addEventListener('blur', () => card.classList.remove('is-previewing'));
});

const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('is-visible');
    observer.unobserve(entry.target);
  });
}, {
  rootMargin: '0px 0px -12% 0px',
  threshold: 0.1,
});

document.querySelectorAll('.reveal-text, .reveal-elem').forEach((element) => {
  revealObserver.observe(element);
});

const canvas = document.getElementById('webgl-canvas');
if (canvas && typeof THREE !== 'undefined') {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false, powerPreference: 'low-power' });
  const geometry = new THREE.IcosahedronGeometry(4, 5);
  const material = new THREE.MeshBasicMaterial({
    color: 0x223a55,
    wireframe: true,
    transparent: true,
    opacity: 0.12,
  });
  const sphere = new THREE.Mesh(geometry, material);

  scene.add(sphere);
  camera.position.z = 15;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.25));
  renderer.setSize(window.innerWidth, window.innerHeight);

  let frameId;
  let lastTime = 0;
  const animate = (time) => {
    frameId = requestAnimationFrame(animate);
    if (time - lastTime < 33) return;
    lastTime = time;
    sphere.rotation.x += 0.0015;
    sphere.rotation.y += 0.002;
    renderer.render(scene, camera);
  };

  frameId = requestAnimationFrame(animate);

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }, { passive: true });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden && frameId) {
      cancelAnimationFrame(frameId);
      frameId = null;
    } else if (!document.hidden && !frameId) {
      frameId = requestAnimationFrame(animate);
    }
  });
}

window.portfolioInteractionsReady = true;
