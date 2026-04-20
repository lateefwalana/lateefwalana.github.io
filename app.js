document.addEventListener("DOMContentLoaded", () => {
    const controls = Array.from(document.querySelectorAll(".control"));
    const themeBtn = document.querySelector(".theme-btn");

    function setSection(id) {
        const activeSection = document.querySelector(".active");
        const newSection = document.getElementById(id);
        if (!newSection) return;

        if (activeSection) activeSection.classList.remove("active");
        newSection.classList.add("active");

        const activeBtn = document.querySelector(".active-btn");
        if (activeBtn) activeBtn.classList.remove("active-btn");
        const newButton = controls.find(btn => btn.dataset.id === id);
        if (newButton) newButton.classList.add("active-btn");
    }

    controls.forEach(button => {
        button.setAttribute("tabindex", "0");
        button.addEventListener("click", () => setSection(button.dataset.id));
        button.addEventListener("keydown", (e) => {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setSection(button.dataset.id);
            }
        });
    });

    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "light") {
        document.body.classList.add("light-mode");
    }

    themeBtn.addEventListener("click", () => {
        const isLight = document.body.classList.toggle("light-mode");
        localStorage.setItem("theme", isLight ? "light" : "dark");
    });

    if (!document.querySelector(".container.active")) {
        setSection("home");
    }

    initParticles();
});

function initParticles() {
    const canvas = document.getElementById("particles-canvas");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const COUNT = 55;
    const MAX_DIST = 140;
    let W, H, particles, animId;

    function resize() {
        W = canvas.width = window.innerWidth;
        H = canvas.height = window.innerHeight;
    }

    function Particle() {
        this.reset();
    }

    Particle.prototype.reset = function () {
        this.x = Math.random() * W;
        this.y = Math.random() * H;
        this.vx = (Math.random() - 0.5) * 0.35;
        this.vy = (Math.random() - 0.5) * 0.35;
        this.r  = Math.random() * 1.5 + 0.8;
    };

    Particle.prototype.update = function () {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > W) this.vx *= -1;
        if (this.y < 0 || this.y > H) this.vy *= -1;
    };

    function isLight() {
        return document.body.classList.contains("light-mode");
    }

    function draw() {
        ctx.clearRect(0, 0, W, H);

        const light    = isLight();
        const dotColor = light ? "rgba(0,102,204,0.3)"  : "rgba(0,212,255,0.35)";
        const lineBase = light ? "0,102,204"             : "0,212,255";

        for (const p of particles) {
            p.update();
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = dotColor;
            ctx.fill();
        }

        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx   = particles[i].x - particles[j].x;
                const dy   = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < MAX_DIST) {
                    const alpha = (1 - dist / MAX_DIST) * 0.25;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(${lineBase},${alpha})`;
                    ctx.lineWidth   = 0.7;
                    ctx.stroke();
                }
            }
        }

        animId = requestAnimationFrame(draw);
    }

    resize();
    particles = Array.from({ length: COUNT }, () => new Particle());
    draw();

    window.addEventListener("resize", () => {
        cancelAnimationFrame(animId);
        resize();
        draw();
    });
}
