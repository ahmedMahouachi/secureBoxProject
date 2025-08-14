token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4OWRiNTIwNzFkN2ZlYmM1YjZmY2RhZSIsInJvbGUiOiJjbGllbnQiLCJpYXQiOjE3NTUxNjY1NTAsImV4cCI6MTc1NTE3MDE1MH0.AVBvwjozHOOA_Ow8O9Bgi7yyjoVj4_lvNdphRLsVSjE";

document.addEventListener("DOMContentLoaded", async () => {
  const logoutButton = document.getElementById('logout');
  const fileInput = document.getElementById("fileInput");
  const previewImage = document.getElementById("previewImage");
  const previewText = document.getElementById("previewText");

  logoutButton.addEventListener('click', () => {
    localStorage.removeItem('token');
    window.location.href = 'login.html';
  });

  if (!token) {
    window.location.href = 'login.html';
    alert('Accès refusé');
    return;
  }

  try {
    const res = await fetch("/api/auth/me", {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });

    const user = await res.json();
    if (!res.ok) throw new Error(user.message || "Erreur récupération utilisateur");
    document.getElementById("userName").textContent = `${user.prenom} ${user.nom}`;
  } catch (err) {
    console.error("Erreur récupération utilisateur :", err);
    document.getElementById("userName").textContent = "Inconnu";
  }

  fileInput.addEventListener("change", () => {
    const file = fileInput.files[0];
    if (!file) return;

    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        previewImage.src = e.target.result;
        previewImage.style.display = "block";
        previewText.style.display = "none";
      };
      reader.readAsDataURL(file);
    } else {
      previewImage.style.display = "none";
      previewText.textContent = `Fichier sélectionné : ${file.name} (${Math.round(file.size / 1024)} KB)`;
      previewText.style.display = "block";
    }
  });

  const uploadForm = document.getElementById("uploadForm");
  uploadForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(uploadForm);

    try {
      const res = await fetch("/api/files/", {
        method: "POST",
        body: formData,
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!res.ok) throw new Error("Erreur lors de l'upload");

      await res.json();
      uploadForm.reset();
      previewImage.style.display = "none";
      previewText.style.display = "none";
      loadFiles();
    } catch (err) {
      console.error("Erreur lors de l'upload :", err);
    }
  });

  loadFiles();
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
  };
  return icons[ext] || "/icons/file.png";
}

async function loadFiles() {
  if (!token) {
    alert("Accès refusé");
    window.location.href = "login.html";
    return;
  }

  try {
    const res = await fetch("/api/files/", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });

    if (!res.ok) {
      const err = await res.json();
      alert(err.message || "Erreur d'accès");
      return;
    }

    const files = await res.json();
    const tbody = document.getElementById("fileTableBody");

    tbody.innerHTML = "";

    if (files.length === 0) {
      const tr = document.createElement("tr");
      const td = document.createElement("td");
      td.colSpan = 3;
      td.textContent = "Aucun document";
      td.style.textAlign = "center";
      td.style.fontStyle = "italic";
      tr.appendChild(td);
      tbody.appendChild(tr);
      return;
    }

    files.forEach(file => {
      const tr = document.createElement("tr");

      // Type
      const tdType = document.createElement("td");
      if (file.fileType === "image") {
        const img = document.createElement("img");
        const fileName = file.filePath.split("/").pop().split("\\").pop();
        img.src = "/uploads/" + fileName;
        img.alt = file.fileName;
        img.style.width = "50px";
        img.style.height = "50px";
        tdType.appendChild(img);
      } else {
        const icon = document.createElement("img");
        icon.src = getFileIconByExtension(file.fileName);
        icon.alt = getFileExtension(file.fileName);
        icon.style.width = "32px";
        icon.style.height = "32px";
        tdType.appendChild(icon);
      }
      tr.appendChild(tdType);

      // Nom
      const tdName = document.createElement("td");
      const link = document.createElement("a");
      link.href = `/fileDetails.html?id=${file._id}`;
      link.textContent = file.fileName;
      tdName.appendChild(link);
      tr.appendChild(tdName);

      // Action
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

  fetch(`/api/files/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  })
    .then(res => {
      if (!res.ok) throw new Error("Erreur suppression");
      return res.json();
    })
    .then(() => loadFiles())
    .catch(err => console.error(err));
}
