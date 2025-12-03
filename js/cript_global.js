// ------------------------------
//  SCRIPT GLOBAL DEL PORTAFOLIO
// ------------------------------

// Asegura que el DOM esté cargado
document.addEventListener("DOMContentLoaded", () => {

    console.log("%cPortafolio cargado correctamente.", "color:#7FFFD4; font-size:14px");

    // ------------------------------
    // 1. Animación futura para tarjetas (efecto suave)
    // ------------------------------
    const cards = document.querySelectorAll(".card");

    cards.forEach(card => {
        card.addEventListener("mouseenter", () => {
            card.style.transition = "0.3s ease";
            card.style.transform = "scale(1.05)";
        });

        card.addEventListener("mouseleave", () => {
            card.style.transform = "scale(1)";
        });

        // 2. Mensaje cuando se hace clic en una actividad
        card.addEventListener("click", () => {
            console.log(`Entraste a: ${card.querySelector("h2").innerText}`);
        });
    });


    // ------------------------------
    // 3. Botón de “volver arriba” (auto)
    // ------------------------------
    const scrollBtn = document.createElement("button");
    scrollBtn.innerText = "↑";
    scrollBtn.id = "scrollTopButton";

    Object.assign(scrollBtn.style, {
        position: "fixed",
        bottom: "20px",
        right: "20px",
        padding: "10px 14px",
        fontSize: "18px",
        borderRadius: "50%",
        border: "none",
        cursor: "pointer",
        background: "#ffffffbb",
        color: "#5A0E24",
        fontWeight: "bold",
        display: "none",
        transition: "0.2s",
        zIndex: "999",
        boxShadow: "0 4px 8px rgba(0,0,0,0.3)"
    });

    document.body.appendChild(scrollBtn);

    scrollBtn.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });

    window.addEventListener("scroll", () => {
        scrollBtn.style.display = window.scrollY > 300 ? "block" : "none";
    });


    // ------------------------------
    // 4. Modo Oscuro / Claro (opcional)
    // ------------------------------

    const modeBtn = document.createElement("button");
    modeBtn.innerText = "☾";
    modeBtn.id = "modeButton";

    Object.assign(modeBtn.style, {
        position: "fixed",
        top: "20px",
        right: "20px",
        padding: "8px 12px",
        fontSize: "20px",
        borderRadius: "12px",
        border: "none",
        cursor: "pointer",
        background: "#ffffffcc",
        color: "#5A0E24",
        zIndex: "999",
    });

    document.body.appendChild(modeBtn);

    modeBtn.addEventListener("click", () => {
        document.body.classList.toggle("light-mode");

        if (document.body.classList.contains("light-mode")) {
            modeBtn.innerText = "☀";
            console.log("Modo Claro activado");
        } else {
            modeBtn.innerText = "☾";
            console.log("Modo Oscuro activado");
        }
    });
    // ------------------------------
// 5. Botón "Regresar al Inicio"
// ------------------------------

if (window.location.pathname.includes("actividades")) {

    const backBtn = document.createElement("button");
    backBtn.innerText = "← Regresar";
    backBtn.id = "backButton";

    Object.assign(backBtn.style, {
        position: "fixed",
        top: "20px",
        left: "20px",
        padding: "8px 14px",
        fontSize: "16px",
        borderRadius: "12px",
        border: "none",
        cursor: "pointer",
        background: "#ffffffcc",
        color: "#5A0E24",
        fontWeight: "600",
        zIndex: "999",
        boxShadow: "0 4px 8px rgba(0,0,0,0.3)",
        transition: "0.2s"
    });

    backBtn.addEventListener("mouseenter", () => {
        backBtn.style.transform = "scale(1.07)";
    });

    backBtn.addEventListener("mouseleave", () => {
        backBtn.style.transform = "scale(1)";
    });

    backBtn.addEventListener("click", () => {
        window.location.href = "../../index.html";
    });

    document.body.appendChild(backBtn);
}

});
