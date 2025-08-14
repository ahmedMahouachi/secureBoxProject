  token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4OWM5ZWEzYjcwMDNkMzhiNDEyNjZjZCIsInJvbGUiOiJjbGllbnQiLCJpYXQiOjE3NTUxMDEzMDksImV4cCI6MTc1NTEwNDkwOX0.77HAHayrv3So6qNVYgplvAFdec9tuFoo1OjYa9OYibU"


document.addEventListener("DOMContentLoaded", async () => {
  const logoutButton = document.getElementById('logout') 
  //const token = localStorage.getItem('token')

  const fileInput = document.getElementById("fileInput");
  const previewImage = document.getElementById("previewImage");
  const previewText = document.getElementById("previewText");


  console.log('Le token recuperé depuis le local storage est :', token);

  logoutButton.addEventListener('click', () => {
        localStorage.removeItem('token')
        window.location.href = ('login.html')
  })

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

  fileInput.addEventListener("change", () => {
  const file = fileInput.files[0];
  if (!file) return;

  // Si c'est une image, on affiche l'aperçu
  if (file.type.startsWith("image/")) {
    const reader = new FileReader();
    reader.onload = (e) => {
      previewImage.src = e.target.result;
      previewImage.style.display = "block";
      previewText.style.display = "none";
    };
    reader.readAsDataURL(file);
  } else {
    // Pour les autres fichiers, on affiche juste le nom et la taille
    previewImage.style.display = "none";
    previewText.textContent = `Fichier sélectionné : ${file.name} (${Math.round(file.size / 1024)} KB)`;
    previewText.style.display = "block";
  }
});

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

function getFileExtension(fileName) {
  const parts = fileName.split(".");
  return parts.length > 1 ? parts.pop().toLowerCase() : "";
}

function getFileIconByExtension(fileName) {
  const ext = getFileExtension(fileName);
  const icons = {
    jpg: "/icons/image.png",
    jpeg: "/icons/imagejpeg.png",
    png: "/icons/imagejpg.png",
    pdf: "/icons/pdf.png",
    doc: "/icons/worddoc.png",
    docx: "/icons/worddocx.png",
    xls: "/icons/excelxls.png",
    xlsx: "/icons/excelxlsx.png",
    txt: "/icons/text.png",
    //default: "/icons/file.png"
  };
  return icons[ext] || icons.default;
}

async function loadFiles() {
    //const token = localStorage.getItem("token");
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
          const icon = document.createElement("img");
          if (file.fileType === "image") {
            const img = document.createElement("img");
            const fileName = file.filePath.split("/").pop().split("\\").pop();
            img.src = "/uploads/" + fileName;
            img.alt = file.fileName;
            img.style.width = "50px"; // taille de la miniature
            img.style.height = "50px";
            tdType.appendChild(img);
          } else {
            icon.src = getFileIconByExtension(file.fileName);
            icon.alt = getFileExtension(file.fileName);
            icon.style.width = "32px";
            icon.style.height = "32px";
            tdType.appendChild(icon);
            //tdType.textContent = file.fileType || "N/A";
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