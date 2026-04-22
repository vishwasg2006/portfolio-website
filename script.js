// EMAILJS
(function(){
  emailjs.init("YOUR_PUBLIC_KEY");
})();

document.getElementById("form").addEventListener("submit", function(e){
  e.preventDefault();

  emailjs.send("YOUR_SERVICE_ID","YOUR_TEMPLATE_ID",{
    from_name: document.getElementById("name").value,
    from_email: document.getElementById("email").value,
    message: document.getElementById("message").value
  }).then(()=>{
    alert("Message Sent Successfully!");
  });
});

// TYPING
new Typed("#typing", {
  strings: ["Developer","Problem Solver","IT Student"],
  typeSpeed: 80,
  backSpeed: 50,
  loop: true
});

// PARTICLES
particlesJS("particles-js", {
  particles: { number: { value: 80 }, size: { value: 3 } }
});

// IMAGE ZOOM
const heroImg = document.getElementById("heroImg");
const modal = document.getElementById("imgModal");
const modalImg = document.getElementById("modalImg");

heroImg.onclick = () => {
  modal.style.display = "flex";
  modalImg.src = heroImg.src;
};

modal.onclick = () => modal.style.display = "none";

// SCROLL
ScrollReveal().reveal('.hero-left',{origin:'left',distance:'80px'});
ScrollReveal().reveal('.hero-right',{origin:'right',distance:'80px'});
ScrollReveal().reveal('.card',{interval:200});



// PROJECT DATA
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
    desc: "Responsive UI....",
    tech: ["HTML","CSS","JS"],
    images: [
      "assets/prot1.png",
      "assets/prot2.png",
      "assets/prot3.png",
      "assets/prot4.png",
      "assets/prot5.png"
    ]
  }
];

let currentProject = 0;
let currentImage = 0;

// OPEN MODAL
function openProject(index) {
  currentProject = index;
  currentImage = 0;

  document.getElementById("projectModal").style.display = "flex";

  loadProject();
}

// LOAD DATA
function loadProject() {
  const p = projects[currentProject];

  document.getElementById("projectTitle").innerText = p.title;
  document.getElementById("projectDesc").innerText = p.desc;
  document.getElementById("projectImg").src = p.images[currentImage];

  let techHTML = "";
  p.tech.forEach(t => {
    techHTML += `<span>${t}</span>`;
  });

  document.getElementById("modalTech").innerHTML = techHTML;
}

// NEXT IMAGE
function nextImg() {
  const p = projects[currentProject];
  currentImage = (currentImage + 1) % p.images.length;
  loadProject();
}

// PREV IMAGE
function prevImg() {
  const p = projects[currentProject];
  currentImage = (currentImage - 1 + p.images.length) % p.images.length;
  loadProject();
}

// CLOSE
document.getElementById("closeBtn").onclick = () => {
  document.getElementById("projectModal").style.display = "none";
};

// AUTO LOAD CERTIFICATES
const certContainer = document.getElementById("certContainer");

// 👉 just add file names here (ONLY ONCE)
const certificates = [
  "cert1.jpeg",
  "cert2.jpeg",
  "cert3.jpeg",
  "cert4.jpeg",
  "cert5.jpeg"
];

certificates.forEach(cert => {
  certContainer.innerHTML += `
    <div class="card">
      <img src="assets/certificates/${cert}" class="cert-img">
    </div>
  `;
});

// CERTIFICATE POPUP
const certModal = document.getElementById("certModal");
const certModalImg = document.getElementById("certModalImg");

// Apply click to ALL certificates dynamically
document.addEventListener("click", function(e){
  if(e.target.classList.contains("cert-img")){
    certModal.style.display = "flex";
    certModalImg.src = e.target.src;
  }
});

// Close when clicking anywhere
certModal.onclick = () => {
  certModal.style.display = "none";
};

// IMAGE ZOOM FROM PROJECT MODAL
const imgZoomModal = document.getElementById("imgZoomModal");
const zoomedImg = document.getElementById("zoomedImg");

// when clicking project image
document.getElementById("projectImg").onclick = () => {
  imgZoomModal.style.display = "flex";
  zoomedImg.src = document.getElementById("projectImg").src;
};

// close zoom
imgZoomModal.onclick = () => {
  imgZoomModal.style.display = "none";
};

// 👉 SWIPE SUPPORT FOR PROJECT IMAGES

let startX = 0;
let endX = 0;

const projectImage = document.getElementById("projectImg");

// touch start
projectImage.addEventListener("touchstart", (e) => {
  startX = e.touches[0].clientX;
});

// touch move
projectImage.addEventListener("touchmove", (e) => {
  endX = e.touches[0].clientX;
});

// touch end
projectImage.addEventListener("touchend", () => {
  let diff = startX - endX;

  // swipe left → next
  if (diff > 50) {
    nextImg();
  }

  // swipe right → previous
  if (diff < -50) {
    prevImg();
  }
});