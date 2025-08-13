document.addEventListener("DOMContentLoaded", () => {
  loadFiles();

  const uploadForm = document.getElementById("uploadForm");
  uploadForm.addEventListener("submit", (e) => {
    e.preventDefault(); // Empêche le rechargement

    const formData = new FormData(uploadForm);

    fetch("/api/files/", {
      method: "POST",
      body: formData
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
  });
});

function loadFiles() {
  fetch("/api/files/")
    .then(res => res.json())
    .then(files => {
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
    })
    .catch(err => console.error("Erreur chargement fichiers:", err));
}

function deleteFile(id) {
  if (!confirm("Voulez-vous vraiment supprimer ce fichier ?")) return;

  fetch(`/api/files/${id}`, { method: "DELETE" })
    .then(res => {
      if (!res.ok) throw new Error("Erreur suppression");
      return res.json();
    })
    .then(() => loadFiles())
    .catch(err => console.error(err));
}