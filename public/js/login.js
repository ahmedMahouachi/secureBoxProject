const loginForm = document.getElementById("loginForm");
const errorLogin = document.getElementById("errorLogin");
let googleButton = document.getElementById("google-auth");

if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Récupération et nettoyage des champs
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    // Vérification des champs vides
    if (!email || !password) {
      errorLogin.textContent = "Veuillez remplir tous les champs";
      errorLogin.style.display = "block";
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const result = await res.json();
      console.log("Réponse API :", result); // 🔍 Pour vérifier la réponse backend

      if (res.ok && result.token) {
        // Stockage du token
        localStorage.setItem("token", result.token);

        // Vérification sécurisée du rôle (avec gestion des majuscules)
        const role = result.role?.toLowerCase();
        if (role === "client") {
          window.location.href = "home.html";
        } else {
          window.location.href = "dashboard.html";
        }
      } else if (res.status === 404) {
        errorLogin.textContent = "Utilisateur non trouvé";
        errorLogin.style.display = "block";
      } else if (res.status === 401) {
        errorLogin.textContent = "Mot de passe incorrect";
        errorLogin.style.display = "block";
      } else {
        errorLogin.textContent = "Erreur dans l'identifiant ou le mot de passe";
        errorLogin.style.display = "block";
      }
    } catch (error) {
      console.error("Erreur de connexion :", error);
      errorLogin.textContent = "Une erreur est survenue. Veuillez réessayer.";
      errorLogin.style.display = "block";
    }
  });
}

if (googleButton) {
  googleButton.addEventListener("click", () => {
    window.location.href = "http://localhost:3000/api/auth/google";
  });
}
