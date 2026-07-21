import * as THREE from "three";

// PRELOADER — hide once everything is ready
window.addEventListener("load", () => {
  const pre = document.getElementById("preloader");
  setTimeout(() => pre.classList.add("hide"), 400);
});

// SCROLL PROGRESS BAR
const scrollBar = document.getElementById("scrollProgress");
function updateScrollProgress() {
  const scrolled = document.documentElement.scrollTop;
  const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  scrollBar.style.width = height > 0 ? `${(scrolled / height) * 100}%` : "0%";
}
window.addEventListener("scroll", updateScrollProgress, { passive: true });

// CUSTOM CURSOR — arrow icon follows mouse directly, tilts on hover
const customCursor = document.getElementById("customCursor");

window.addEventListener("mousemove", (e) => {
  customCursor.style.left = `${e.clientX}px`;
  customCursor.style.top = `${e.clientY}px`;
});

document.querySelectorAll("a, button, .project-card, .cert-img").forEach((el) => {
  el.addEventListener("mouseenter", () => customCursor.classList.add("hovering"));
  el.addEventListener("mouseleave", () => customCursor.classList.remove("hovering"));
});

// NAV — shrink on scroll + highlight active section
const mainNav = document.getElementById("mainNav");
const navAnchors = document.querySelectorAll("#navLinks a");
const sections = [...navAnchors].map(a => document.querySelector(a.getAttribute("href")));

window.addEventListener("scroll", () => {
  mainNav.classList.toggle("scrolled", window.scrollY > 40);

  let current = sections[0];
  sections.forEach((sec) => {
    if (sec && window.scrollY >= sec.offsetTop - 140) current = sec;
  });
  navAnchors.forEach((a) => {
    a.classList.toggle("active", a.getAttribute("href") === `#${current?.id}`);
  });
}, { passive: true });

const CONTACT_EMAIL = "vishwasg9686@gmail.com";

const form = document.getElementById("form");

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const message = document.getElementById("message").value;

  const subject = encodeURIComponent(`Portfolio contact from ${name}`);
  const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`);

  window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
});

// TYPING
new Typed("#typing", {
  strings: ["Developer","Problem Solver","IT Student"],
  typeSpeed: 80,
  backSpeed: 50,
  loop: true
});

// CORE UI PANEL — animated stat counters on load
window.addEventListener("load", () => {
  const loadedEl = document.getElementById("loadedStat");
  const msEl = document.getElementById("msStat");
  let count = 0;
  const target = 6;
  const iv = setInterval(() => {
    count++;
    loadedEl.textContent = count;
    if (count >= target) clearInterval(iv);
  }, 120);
  setTimeout(() => {
    msEl.textContent = `${8 + Math.floor(Math.random() * 10)}ms`;
  }, target * 120 + 200);
});

// 3D BACKGROUND — floating wireframe shapes with slight mouse parallax
(function () {
  const container = document.getElementById("bg3d");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x150410, 6, 26);
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.z = 20;

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  container.appendChild(renderer.domElement);

  const geometries = [
    new THREE.IcosahedronGeometry(1, 0),
    new THREE.OctahedronGeometry(1, 0),
    new THREE.TorusGeometry(0.8, 0.25, 8, 16),
  ];

  const colors = [0xff2e63, 0xff6b6b, 0xff8fa3];
  const shapeCount = window.innerWidth < 768 ? 5 : 9;
  const shapes = [];

  for (let i = 0; i < shapeCount; i++) {
    const geo = geometries[Math.floor(Math.random() * geometries.length)];
    const mat = new THREE.MeshBasicMaterial({
      color: colors[Math.floor(Math.random() * colors.length)],
      wireframe: true,
      transparent: true,
      opacity: 0.09,
    });
    const mesh = new THREE.Mesh(geo, mat);

    mesh.position.set(
      (Math.random() - 0.5) * 36,
      (Math.random() - 0.5) * 24,
      (Math.random() - 0.5) * 14 - 18
    );
    const scale = 0.25 + Math.random() * 0.4;
    mesh.scale.set(scale, scale, scale);
    mesh.userData.rotSpeed = {
      x: (Math.random() - 0.5) * 0.006,
      y: (Math.random() - 0.5) * 0.006,
    };
    mesh.userData.drift = (Math.random() - 0.5) * 0.004;

    scene.add(mesh);
    shapes.push(mesh);
  }

  const mouse = { x: 0, y: 0 };
  window.addEventListener("mousemove", (e) => {
    mouse.x = (e.clientX / window.innerWidth - 0.5) * 2;
    mouse.y = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  let paused = false;
  document.addEventListener("visibilitychange", () => {
    paused = document.hidden;
    if (!paused && !reduceMotion) animate();
  });

  function animate() {
    if (paused) return;
    shapes.forEach((s) => {
      s.rotation.x += s.userData.rotSpeed.x;
      s.rotation.y += s.userData.rotSpeed.y;
      s.position.y += s.userData.drift;
      if (s.position.y > 12) s.position.y = -12;
      if (s.position.y < -12) s.position.y = 12;
    });

    camera.position.x += (mouse.x * 2 - camera.position.x) * 0.02;
    camera.position.y += (-mouse.y * 2 - camera.position.y) * 0.02;
    camera.lookAt(scene.position);

    renderer.render(scene, camera);
    if (!reduceMotion) requestAnimationFrame(animate);
  }
  animate();
  if (reduceMotion) renderer.render(scene, camera);

  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
})();

// 3D TILT ON CARDS — project cards + certificate cards
function applyTilt(selector, maxTilt) {
  document.querySelectorAll(selector).forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      const rotY = px * maxTilt;
      const rotX = -py * maxTilt;
      card.style.transform = `perspective(700px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.03)`;
    });
    card.addEventListener("mouseleave", () => {
      card.style.transform = "perspective(700px) rotateX(0deg) rotateY(0deg) scale(1)";
    });
  });
}
applyTilt(".project-card", 10);

// MOBILE NAV TOGGLE
document.getElementById("navToggle").addEventListener("click", () => {
  document.getElementById("navLinks").classList.toggle("open");
});
document.querySelectorAll("#navLinks a").forEach(a =>
  a.addEventListener("click", () => document.getElementById("navLinks").classList.remove("open"))
);

// IMAGE ZOOM (hero photo)
const heroImg = document.getElementById("heroImg");
const modal = document.getElementById("imgModal");
const modalImg = document.getElementById("modalImg");

heroImg.onclick = () => {
  modal.style.display = "flex";
  modalImg.src = heroImg.src;
};

modal.onclick = () => modal.style.display = "none";

// SCROLL REVEAL
ScrollReveal().reveal('.hero-left',{origin:'left',distance:'80px'});
ScrollReveal().reveal('.hero-right',{origin:'right',distance:'80px'});
ScrollReveal().reveal('.project-card',{interval:200});
ScrollReveal().reveal('.card',{interval:150});

// PROJECT DATA — add a new project by copying an object below
const projects = [
  {
    title: "Online Exam Portal",
    desc: "Full-stack system with login, admin dashboard, result tracking, and anti-refresh logic.",
    tech: ["HTML","CSS","JS","Node.js","MySQL"],
    images: [
      "assets/ex1.png",
      "assets/ex2.png",
      "assets/ex3.png",
      "assets/ex4.png",
      "assets/ex5.png",
      "assets/ex6.png"
    ]
  },
  {
    title: "Portfolio Website",
    desc: "Responsive personal portfolio with animations and a modern glassmorphic UI.",
    tech: ["HTML","CSS","JS"],
    images: [
      "assets/proto1.png",
      "assets/proto2.png",
      "assets/proto3.png",
      "assets/proto4.png",
      "assets/proto5.png",
      "assets/proto6.png",
      "assets/proto7.png"
    ]
  },
   {
    title: "Faculty Assignment Dashboard",
    desc:  "Full-stack dashboard for the ISE department — admin approval flow, bulk Excel uploads, automated email reminders, CSV export, live search, and a calendar view.",
    tech: ["HTML","CSS","JS","Node.js","Express.js","MySql","Deployment"],
    images: [
      "assets/FD1.png",
      "assets/FD2.png",
      "assets/FD3.png",
      "assets/FD4.png",
      "assets/FD5.png",
      "assets/FD6.png",
      "assets/FD7.png"
    ]
  }
];

let currentProject = 0;
let currentImage = 0;

function openProject(index) {
  currentProject = index;
  currentImage = 0;
  document.getElementById("projectModal").style.display = "flex";
  loadProject();
}

function loadProject() {
  const p = projects[currentProject];
  document.getElementById("projectTitle").innerText = p.title;
  document.getElementById("projectDesc").innerText = p.desc;
  document.getElementById("projectImg").src = p.images[currentImage];

  let techHTML = "";
  p.tech.forEach(t => { techHTML += `<span>${t}</span>`; });
  document.getElementById("modalTech").innerHTML = techHTML;
}

function nextImg() {
  const p = projects[currentProject];
  currentImage = (currentImage + 1) % p.images.length;
  loadProject();
}

function prevImg() {
  const p = projects[currentProject];
  currentImage = (currentImage - 1 + p.images.length) % p.images.length;
  loadProject();
}

document.getElementById("closeBtn").onclick = () => {
  document.getElementById("projectModal").style.display = "none";
};

document.querySelectorAll(".project-card").forEach((card) => {
  card.addEventListener("click", () => {
    openProject(parseInt(card.dataset.project, 10));
  });
});
document.getElementById("prevBtn").addEventListener("click", prevImg);
document.getElementById("nextBtn").addEventListener("click", nextImg);

// AUTO LOAD CERTIFICATES — add a new one by adding a filename below
const certContainer = document.getElementById("certContainer");

const certificates = [
  "cert1.jpeg",
  "cert6.jpeg",
  "cert7.jpeg",
  "cert4.jpeg",
  "cert5.jpeg",
  "cert2.jpeg",,
  "cert3.jpeg"
];

certificates.forEach(cert => {
  certContainer.innerHTML += `
    <div class="card">
      <img src="assets/certificates/${cert}" class="cert-img" alt="Certificate" loading="lazy" decoding="async">
    </div>
  `;
});
applyTilt(".card", 8);

// CERTIFICATE POPUP
const certModal = document.getElementById("certModal");
const certModalImg = document.getElementById("certModalImg");

document.addEventListener("click", function(e){
  if(e.target.classList.contains("cert-img")){
    certModal.style.display = "flex";
    certModalImg.src = e.target.src;
  }
});

certModal.onclick = () => {
  certModal.style.display = "none";
};

// IMAGE ZOOM FROM PROJECT MODAL
const imgZoomModal = document.getElementById("imgZoomModal");
const zoomedImg = document.getElementById("zoomedImg");

document.getElementById("projectImg").onclick = () => {
  imgZoomModal.style.display = "flex";
  zoomedImg.src = document.getElementById("projectImg").src;
};

imgZoomModal.onclick = () => {
  imgZoomModal.style.display = "none";
};

// SWIPE SUPPORT FOR PROJECT IMAGES
let startX = 0;
let endX = 0;
const projectImage = document.getElementById("projectImg");

projectImage.addEventListener("touchstart", (e) => {
  startX = e.touches[0].clientX;
});

projectImage.addEventListener("touchmove", (e) => {
  endX = e.touches[0].clientX;
});

projectImage.addEventListener("touchend", () => {
  let diff = startX - endX;
  if (diff > 50) nextImg();
  if (diff < -50) prevImg();
});
