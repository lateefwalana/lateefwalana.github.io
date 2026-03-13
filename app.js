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
        button.addEventListener("keydown", (event) => {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
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

    // Fallback for initial section in case DOM was created with missing class
    if (!document.querySelector(".container.active")) {
        setSection("home");
    }
});
