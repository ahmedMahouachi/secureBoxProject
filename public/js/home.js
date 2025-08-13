  token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4OWM5ZWEzYjcwMDNkMzhiNDEyNjZjZCIsInJvbGUiOiJjbGllbnQiLCJpYXQiOjE3NTUwOTc1MzIsImV4cCI6MTc1NTEwMTEzMn0.a775C2-pzrVvv6qMY1toNLMxq4_dzRgJDv3Sh3hZ_tE"


document.addEventListener("DOMContentLoaded", () => {
  const logoutButton = document.getElementById('logout') 
  //const token = localStorage.getItem('token')


  console.log('Le token recuperé depuis le local storage est :', token);

  logoutButton.addEventListener('click', () => {
        localStorage.removeItem('token')
        window.location.href = ('login.html')
  })

  if(!token) {
        window.location.href = ('login.html')
        alert('Accès refusé')
  }

  loadFiles();

  const uploadForm = document.getElementById("uploadForm");
  uploadForm.addEventListener("submit",async (e) => {
    e.preventDefault(); // Empêche le rechargement

    const formData = new FormData(uploadForm);

    const res = await fetch("/api/files/", {
      method: "POST",
      body: formData,
      headers: {Authorization: `Bearer ${token}`}
    })
    .then(res => {
      if (!res.ok) throw new Error("Erreur lors de l'upload");
      return res.json();
    })
    .then(() => {
      uploadForm.reset(); // Vide le champ
      loadFiles(); // Rafraîchit la liste
    })
    .catch(err => console.error(err));
    
    if(res.ok) {
        afficherProfil(result)
    } else {
        window.location.href = ('login.html')
    }
  });
});

async function loadFiles() {
    if(!token) {
        window.location.href = ('login.html')
        alert('Accès refusé')
    }
  
    try{
      const res = await fetch("/api/files/", 
        {
          headers: {Authorization: `Bearer ${token}`, "Content-Type": "application/json"}
        })

        if(!res.ok) {
          const err = await res.json();
          alert(err.message || "Erreur d'accès");
          return
        }

        const files = await res.json();

        if (!Array.isArray(files)) {
          console.error("Réponse inattendue :", files);
          return;
        }

        const tbody = document.getElementById("fileTableBody");
        tbody.innerHTML = "";

        files.forEach(file => {
          const tr = document.createElement("tr");

          // Type (afficher image si c'est une image)
          const tdType = document.createElement("td");
          if (file.fileType === "image") {
            const img = document.createElement("img");
            const fileName = file.filePath.split("/").pop().split("\\").pop();
            img.src = "/uploads/" + fileName;
            img.alt = file.fileName;
            img.style.width = "50px"; // taille de la miniature
            img.style.height = "50px";
            tdType.appendChild(img);
          } else {
            tdType.textContent = file.fileType || "N/A";
          }
          tr.appendChild(tdType);

          // Nom cliquable
          const tdName = document.createElement("td");
          const link = document.createElement("a");
          link.href = `/fileDetails.html?id=${file._id}`;
          link.textContent = file.fileName;
          tdName.appendChild(link);
          tr.appendChild(tdName);

          // Action (supprimer)
          const tdAction = document.createElement("td");
          const deleteBtn = document.createElement("button");
          deleteBtn.textContent = "Supprimer";
          deleteBtn.onclick = () => deleteFile(file._id);
          tdAction.appendChild(deleteBtn);
          tr.appendChild(tdAction);

          tbody.appendChild(tr);
        });
    } catch (err) {
    console.error("Erreur chargement fichiers:", err);
    }
}

function deleteFile(id) {
  if (!confirm("Voulez-vous vraiment supprimer ce fichier ?")) return;

  fetch(`/api/files/${id}`, 
    { 
      method: "DELETE", 
      headers: {Authorization: `Bearer ${token}`, "Content-Type": "application/json"}
    })
    .then(res => {
      if (!res.ok) throw new Error("Erreur suppression");
      return res.json();
    })
    .then(() => loadFiles())
    .catch(err => console.error(err));
}