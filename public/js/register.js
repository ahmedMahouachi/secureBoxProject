
const form = document.getElementById('registerForm');
const alertBox = document.getElementById('alert');
const show = (m, ok=false) => { alertBox.textContent = m; alertBox.classList.remove('hidden'); alertBox.style.color = ok ? 'green':'red'; };

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const payload = {
    nom: form.nom.value.trim(),
    prenom: form.prenom.value.trim(),
    email: form.email.value.trim(),
    password: form.password.value
  };

  // email côté front (UX)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(payload.email)) {
    show("Email invalide.");
    return;
  }

  // ... suite identique (fetch POST vers /api/auth/register)
  try {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();

    if (!res.ok || data.success === false) {
      show(data.message || "Inscription impossible.");
      return;
    }
    show(data.message || "Utilisateur créé.", true);
    setTimeout(() => (window.location.href = '/login.html'), 800);
  } catch {
    show("Erreur serveur ou API injoignable.");
  }
});