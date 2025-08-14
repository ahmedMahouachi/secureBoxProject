//token ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4OWRhMWI4NmQwMWM5YWQ5MGQ0ZWI1MyIsInJvbGUiOiJjbGllbnQiLCJpYXQiOjE3NTUxNzczNjksImV4cCI6MTc1NTE4MDk2OX0.SerIx9ddTVqaAnfwZzi6Gv2_7zZhExvuajIjTTsZ_mA"
  const token = localStorage.getItem('token')

document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  const fileId = params.get("id");

  if (!fileId) {
    alert("Aucun fichier sélectionné");
    return;
  }


  if(!token) {
        window.location.href = ('login.html')
        alert('Accès refusé')
  }

  try {
      const res = await fetch("/api/auth/me", {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      const user = await res.json();
      console.log(user.prenom);
      
      if (!res.ok) throw new Error(user.message || "Erreur récupération utilisateur");

      document.getElementById("userName").textContent = `${user.prenom} ${user.nom}` // met à jour le strong
    } catch (err) {
      console.error("Erreur récupération utilisateur :", err);
      document.getElementById("userName").textContent = "Inconnu";
  }

  // Charger les infos du fichier
  try{
    const res = await fetch(`/api/files/${fileId}`,
        {
            headers: {Authorization: `Bearer ${token}`, "Content-Type": "application/json"}
        })

    const file = await res.json()

    if (!res.ok) throw new Error(file.message || "Erreur chargement fichier");

    const originalName = file.fileName.split('-').slice(1).join('-');
    document.getElementById("fileName").textContent = originalName;

    const iframe = document.getElementById("filePreview");
    const img = document.getElementById("imagePreview");

    if (file.fileType === "image") {
    img.src = `/uploads/${file.fileName}`;
    img.style.display = "block";
    iframe.style.display = "none";
    } else {
    iframe.src = `/uploads/${file.fileName}`;
    iframe.style.display = "block";
    img.style.display = "none";
    }
  } catch (err) {
    console.error("Erreur chargement fichier :", err);
  }

  // Formulaire pour renommer
  const form = document.getElementById("renameForm");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const newName = document.getElementById("newName").value;
    //const fileId = form.dataset.fileId;

    try {
      const res = await fetch(`/api/files/${fileId}/rename`, {
        method: "PUT",
        headers: {Authorization: `Bearer ${token}`, "Content-Type": "application/json"},
        body: JSON.stringify({ newName })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Erreur");

      alert("Fichier renommé avec succès !");
      const displayName = data.document.fileName.split('-').slice(1).join('-');
      document.getElementById("fileName").textContent = displayName;
      document.getElementById("filePreview").src = `/uploads/${data.document.fileName}`;
      form.reset();
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  });
});