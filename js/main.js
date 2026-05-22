// ===== Custom Cursor =====
const cursorDot = document.getElementById('cursor-dot');
const cursorOutline = document.getElementById('cursor-outline');

window.addEventListener('mousemove', (e) => {
  const posX = e.clientX;
  const posY = e.clientY;

  cursorDot.style.left = `${posX}px`;
  cursorDot.style.top = `${posY}px`;

  // Use requestAnimationFrame for smoother outline following
  cursorOutline.animate({
    left: `${posX}px`,
    top: `${posY}px`
  }, { duration: 150, fill: "forwards" });
});

// Cursor hover effects on links/buttons
const hoverables = document.querySelectorAll('a, .menu-toggle, .bento-item');
hoverables.forEach(el => {
  el.addEventListener('mouseenter', () => cursorOutline.classList.add('cursor-hover'));
  el.addEventListener('mouseleave', () => cursorOutline.classList.remove('cursor-hover'));
});

// Magnetic Buttons
const magnetics = document.querySelectorAll('.menu-toggle, .scroll-down');
magnetics.forEach(btn => {
  btn.addEventListener('mousemove', (e) => {
    const rect = btn.getBoundingClientRect();
    const h = rect.width / 2;
    const x = e.clientX - rect.left - h;
    const y = e.clientY - rect.top - h;
    gsap.to(btn, { x: x * 0.4, y: y * 0.4, duration: 0.4, ease: "power2.out" });
  });
  btn.addEventListener('mouseleave', () => {
    gsap.to(btn, { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1, 0.3)" });
  });
});

// Bento Box Spotlight Effect
document.querySelectorAll('.bento-item').forEach(item => {
  item.addEventListener('mousemove', (e) => {
    const rect = item.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    item.style.setProperty('--mouse-x', `${x}px`);
    item.style.setProperty('--mouse-y', `${y}px`);
  });
});

// ===== Navigation Menu =====
const menuToggle = document.getElementById('menu-toggle');
const menuClose = document.getElementById('menu-close');
const overlayMenu = document.getElementById('overlay-menu');
const menuLinks = document.querySelectorAll('.menu-link');

menuToggle.addEventListener('click', () => {
  overlayMenu.classList.add('active');
  gsap.fromTo(menuLinks, 
    { y: 50, opacity: 0 }, 
    { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: "power4.out", delay: 0.2 }
  );
});

menuClose.addEventListener('click', () => {
  overlayMenu.classList.remove('active');
});

menuLinks.forEach(link => {
  link.addEventListener('click', () => {
    overlayMenu.classList.remove('active');
  });
});

// ===== GSAP Scroll Animations =====
gsap.registerPlugin(ScrollTrigger, TextPlugin);

// Initialize Lenis Smooth Scroll
if (typeof Lenis !== 'undefined') {
  const lenis = new Lenis({
    duration: 0.7,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
    infinite: false,
  });

  // Sync Lenis with GSAP ScrollTrigger
  lenis.on('scroll', ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });

  gsap.ticker.lagSmoothing(0);
}

// ===== Hero Initial Animations =====
// Typewriting effect for Hero Title
const typeTexts = document.querySelectorAll('.type-text');
const typeTl = gsap.timeline({ delay: 0.3 });
typeTexts.forEach((span, index) => {
  const textContent = span.getAttribute('data-text');
  typeTl.to(span, {
    duration: textContent.length * 0.08,
    text: textContent,
    ease: "none"
  });
});

const heroTexts = document.querySelectorAll('.hero .reveal-text');
gsap.fromTo(heroTexts, 
  { y: 40, opacity: 0, filter: "blur(10px)" },
  { 
    y: 0, 
    opacity: 1, 
    filter: "blur(0px)",
    duration: 1.5, 
    ease: "power3.out",
    stagger: 0.1,
    delay: 0.1
  }
);

const heroElems = document.querySelectorAll('.hero .reveal-elem');
gsap.fromTo(heroElems,
  { y: 50, opacity: 0, scale: 0.95 },
  { y: 0, opacity: 1, scale: 1, duration: 1.5, ease: "power3.out", stagger: 0.1, delay: 0.3 }
);

// ===== Scroll-Triggered Reveal Animations (Apple Style) =====
const revealTexts = document.querySelectorAll('section:not(.hero) .reveal-text');
revealTexts.forEach(text => {
  gsap.fromTo(text, 
    { y: 50, opacity: 0, filter: "blur(10px)" },
    { 
      y: 0, 
      opacity: 1, 
      filter: "blur(0px)",
      duration: 1.5, 
      ease: "power3.out",
      scrollTrigger: {
        trigger: text,
        start: "top 85%",
      }
    }
  );
});

// Element Fade Up Animation (Bento boxes, stats)
const revealElems = document.querySelectorAll('section:not(.hero) .reveal-elem');
revealElems.forEach((elem, index) => {
  gsap.fromTo(elem, 
    { y: 60, opacity: 0, scale: 0.96 },
    {
      y: 0,
      opacity: 1,
      scale: 1,
      duration: 1.2,
      ease: "power2.out",
      scrollTrigger: {
        trigger: elem,
        start: "top 85%",
      }
    }
  );
});



// Fast Zoom In & Shake for Contact Title and Info
const contactTitle = document.querySelector('.huge-title');
const contactInfo = document.querySelector('.contact-info');
if (contactTitle) {
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: contactTitle,
      start: "top 85%",
    }
  });

  tl.fromTo(contactTitle, 
    { scale: 0, opacity: 0, rotation: -5 }, 
    { scale: 1, opacity: 1, rotation: 0, duration: 0.5, ease: "back.out(2)" }
  )
  .to(contactTitle, {
    x: 15, duration: 0.05, yoyo: true, repeat: 5, ease: "rough({ template: none.out, strength: 1, points: 20, taper: 'none', randomize: true, clamp: false})"
  })
  .to(contactTitle, { x: 0, duration: 0.05 });

  if (contactInfo) {
    tl.fromTo(contactInfo, 
      { y: 20, opacity: 0 }, 
      { y: 0, opacity: 1, duration: 0.4, ease: "power2.out" },
      "<" // start exactly when the shake starts
    );
  }
}

// 3D Parallax Depth Effect
const parallaxElements = document.querySelectorAll('[data-speed]');
parallaxElements.forEach(el => {
  const speed = parseFloat(el.getAttribute('data-speed'));
  gsap.to(el, {
    y: () => (1 - speed) * ScrollTrigger.maxScroll(window),
    ease: "none",
    scrollTrigger: {
      trigger: "body",
      start: "top top",
      end: "bottom bottom",
      scrub: 1,
      invalidateOnRefresh: true
    }
  });
});

// ===== Three.js Morphing Sphere =====
const canvas = document.getElementById('webgl-canvas');
if (canvas && typeof THREE !== 'undefined') {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
  
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // optimize for high dpi
  renderer.setSize(window.innerWidth, window.innerHeight);
  
  camera.position.z = 15;

  // Lights
  const ambientLight = new THREE.AmbientLight(0x404040, 2);
  scene.add(ambientLight);
  const pointLight = new THREE.PointLight(0xffffff, 2);
  pointLight.position.set(10, 10, 10);
  scene.add(pointLight);

  // Geometry: Icosahedron with high detail for morphing
  const geometry = new THREE.IcosahedronGeometry(4, 32);
  
  // Material: Sleek dark wireframe/solid mix
  const material = new THREE.MeshStandardMaterial({ 
    color: 0x222222,
    wireframe: true,
    roughness: 0.1,
    metalness: 0.8,
    transparent: true,
    opacity: 0.15
  });

  const sphere = new THREE.Mesh(geometry, material);
  scene.add(sphere);

  // Store original vertices for morphing animation
  const positionAttribute = geometry.attributes.position;
  const vertex = new THREE.Vector3();
  const originalVertices = [];
  for (let i = 0; i < positionAttribute.count; i++) {
    vertex.fromBufferAttribute(positionAttribute, i);
    originalVertices.push(vertex.clone());
  }

  // Animation Loop
  let time = 0;
  function animate() {
    requestAnimationFrame(animate);
    time += 0.01;

    // Slowly rotate
    sphere.rotation.x += 0.001;
    sphere.rotation.y += 0.002;

    // Morph vertices using Sine waves to create a liquid/breathing effect
    for (let i = 0; i < positionAttribute.count; i++) {
      const v = originalVertices[i];
      // Calculate a noise-like displacement based on position and time
      const displacement = 0.3 * Math.sin(v.x * 2 + time) * Math.cos(v.y * 2 + time * 0.8);
      
      vertex.copy(v).normalize().multiplyScalar(4 + displacement);
      positionAttribute.setXYZ(i, vertex.x, vertex.y, vertex.z);
    }
    positionAttribute.needsUpdate = true;

    renderer.render(scene, camera);
  }
  animate();

  // Resize handler
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  // GSAP ScrollTrigger Integration for 3D Scene
  // Scale and rotate the sphere based on scroll
  gsap.to(sphere.scale, {
    x: 1.5,
    y: 1.5,
    z: 1.5,
    ease: "none",
    scrollTrigger: {
      trigger: "body",
      start: "top top",
      end: "bottom bottom",
      scrub: 1
    }
  });

  gsap.to(sphere.rotation, {
    z: Math.PI,
    ease: "none",
    scrollTrigger: {
      trigger: "body",
      start: "top top",
      end: "bottom bottom",
      scrub: 2
    }
  });

  // Color Evolution
  gsap.to(material.color, {
    r: 0.1,
    g: 0.3,
    b: 0.8, // Shift to deep blue
    ease: "none",
    scrollTrigger: {
      trigger: "body",
      start: "top top",
      end: "bottom bottom",
      scrub: true
    }
  });
}

// ===== About Section 3D Model Integration =====
const initAbout3DModel = () => {
  const canvas = document.getElementById('about-3d-canvas');
  if (!canvas) return;

  const scene = new THREE.Scene();
  scene.background = null;

  const camera = new THREE.PerspectiveCamera(45, 1, 0.0001, 1000000);
  camera.position.z = 5;

  const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
  // The canvas width and height might be 0 initially due to CSS loading, so wait for next frame
  setTimeout(() => {
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
  }, 100);

  // Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
  directionalLight.position.set(10, 10, 10);
  scene.add(directionalLight);
  
  const directionalLight2 = new THREE.DirectionalLight(0x00e5ff, 0.5); // Neon blue rim light
  directionalLight2.position.set(-10, -10, -10);
  scene.add(directionalLight2);

  // Controls
  const controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableZoom = false; // Prevent zooming the entire page unintentionally
  controls.enablePan = false;
  controls.autoRotate = true; 
  controls.autoRotateSpeed = 2.0;

  // Loaders
  const textureLoader = new THREE.TextureLoader();
  const objLoader = new THREE.OBJLoader();

  // Load OBJ First
  objLoader.load(
    'assets/model.obj',
    (object) => {
      // Center the object
      const box = new THREE.Box3().setFromObject(object);
      const center = box.getCenter(new THREE.Vector3());
      object.position.x += (object.position.x - center.x);
      object.position.y += (object.position.y - center.y);
      object.position.z += (object.position.z - center.z);
      
      // Scale it to fit the camera
      const size = box.getSize(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z) || 1;
      const fov = camera.fov * (Math.PI / 180);
      let cameraZ = Math.abs(maxDim / (2 * Math.tan(fov / 2)));
      camera.position.z = cameraZ * 1.5;

      scene.add(object);

      // Apply Premium Material
      const premiumMat = new THREE.MeshStandardMaterial({
        color: 0x111111, // Dark base
        roughness: 0.3,
        metalness: 0.8, // Highly reflective
        side: THREE.DoubleSide
      });
      
      object.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.material = premiumMat;
        }
      });
    },
    undefined,
    (error) => console.error('Error loading model.obj:', error)
  );

  // Resize Handler
  window.addEventListener('resize', () => {
    if (canvas.clientWidth === 0) return;
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
  });

  // Render Loop
  const animate = () => {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
  };
  animate();
};

initAbout3DModel();
