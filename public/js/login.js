let googleButton = document.getElementById('google-auth');
document.getElementById('loginForm').addEventListener('submit', function(event) {
  event.preventDefault(); // Stoppe le rechargement automatique

  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;

  if (!email || !password) {
    alert("Merci de remplir tous les champs.");
    return;
  }

  console.log("Email :", email);
  console.log("Mot de passe :", password);

  // Ici, envoie les données à ton serveur, par exemple avec fetch
});

googleButton.addEventListener('click', (e) => {
  window.location.href = 'http://localhost:3000/api/auth/google'  
});
