// Récupération du formulaire et de la zone d'alerte
const form = document.getElementById('registerForm');
const alertBox = document.getElementById('alert');

form.addEventListener('submit', async (event) => {
  event.preventDefault(); // Empêche le rechargement

  // Données à envoyer
  const payload = {
    firstName: form.firstName.value.trim(),
    email: form.email.value.trim(),
    password: form.password.value
  };

  try {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (!response.ok) {
      alertBox.textContent = data.error || 'Inscription impossible';
      alertBox.classList.remove('hidden');
      return;
    }

    // Si inscription réussie → stocker le JWT et rediriger vers login
    localStorage.setItem('token', data.token);
    window.location.href = '/login.html';
  } catch (error) {
    alertBox.textContent = 'Serveur injoignable';
    alertBox.classList.remove('hidden');
  }
});