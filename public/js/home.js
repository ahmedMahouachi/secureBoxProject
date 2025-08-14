//token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4OWRhMWI4NmQwMWM5YWQ5MGQ0ZWI1MyIsInJvbGUiOiJjbGllbnQiLCJpYXQiOjE3NTUxNzczNjksImV4cCI6MTc1NTE4MDk2OX0.SerIx9ddTVqaAnfwZzi6Gv2_7zZhExvuajIjTTsZ_mA"
  const token = localStorage.getItem('token')

document.addEventListener("DOMContentLoaded", async () => {
  const logoutButton = document.getElementById('logout') 
  const previewContainer = document.getElementById("previewContainer");


  const fileInput = document.getElementById("fileInput");


  console.log('Le token recuperé depuis le local storage est :', token);


  logoutButton.addEventListener('click', () => {
    localStorage.removeItem('token');
    window.location.href = 'login.html';
  });


  if (!token) {
    alert('Accès refusé');
    window.location.href = 'login.html';
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


  fileInput.addEventListener("change", function (event) {
    
    //const file = fileInput.files[0];
    const files = event.target.files
    previewContainer.innerHTML = '';

    Array.from(files).forEach(file => {
      const previewItem = document.createElement('div');
      previewItem.classList.add('preview-item');

      const fileType = file.type;    

      if(fileType.startsWith('image/')) {
        // Preview des images
        const img = document.createElement('img');
        img.src = URL.createObjectURL(file);
        //img.style.width = '100%'
        img.style.height = '200px'
        previewItem.appendChild(img);
        const caption = document.createElement('div')
        caption.textContent = file.name;
        previewItem.appendChild(caption);
      } else if(fileType === 'application/pdf') {
        // Preview des PDF
        const embed = document.createElement('embed');
        embed.src = URL.createObjectURL(file) + '#toolbar=0&navpanes=0&scrollbar=0'
        embed.type = 'application/pdf'
        embed.with = '100%'
        embed.height = '200px'
        previewItem.appendChild(embed)
        const caption = document.createElement('div')
        caption.textContent = file.name;
        previewItem.appendChild(caption);
      } else if(
        file.name.endsWith('.doc') || file.name.endsWith('.docx') ||
        file.name.endsWith('.xls') || file.name.endsWith('.xlsx') ||
        file.name.endsWith('.txt')
      ) {
        // Icone pour Word, Excel et Text
        const icon = document.createElement('img')
        icon.classList.add('file-icon')
        if (file.name.endsWith('.doc')) {
          icon.src = '/icons/worddoc.png'
        } else if(file.name.endsWith('.docx')) {
          icon.src = '/icons/worddocx.png'
        } else if(file.name.endsWith('.xls')) {
          icon.src = '/icons/excelxls.png'
        } else if(file.name.endsWith('.xlsx')) {
          icon.src = '/icons/excelxlsx.png'
        } else if(file.name.endsWith('.txt')) {
          icon.src = '/icons/text.png'
        }
        previewItem.appendChild(icon)
        const caption = document.createElement('div')
        caption.textContent = file.name;
        previewItem.appendChild(caption);
      }
      previewContainer.appendChild(previewItem);

    })
  

  });

  loadFiles();


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


      const result = await res.json();

      if (res.ok) {
        uploadForm.reset();
        loadFiles();
        previewContainer.innerHTML = '';
        console.log("Fichier uploadé avec succès !");
      } else {
        alert(result.message || "Erreur lors de l'upload");
      }
    } catch (err) {
      console.error("Erreur upload :", err);
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

    alert('Accès refusé');
    window.location.href = 'login.html';

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


      // Nom cliquable

      const tdName = document.createElement("td");
      const link = document.createElement("a");
      link.href = `/fileDetails.html?id=${file._id}`;
      link.textContent = file.fileName;
      tdName.appendChild(link);
      tr.appendChild(tdName);


      // Actions (icônes télécharger et supprimer)
      const tdAction = document.createElement("td");

      const downloadIcon = document.createElement("img");
      downloadIcon.src = "/icons/telechargement-direct.png";
      downloadIcon.alt = "Télécharger";
      downloadIcon.style.width = "20px";
      downloadIcon.style.height = "20px";
      downloadIcon.style.cursor = "pointer";
      downloadIcon.style.marginRight = "10px";
      downloadIcon.title = "Télécharger";

      downloadIcon.onclick = () => {
        const fileName = file.filePath.split("/").pop().split("\\").pop();
        const link = document.createElement("a");
        link.href = `/uploads/${fileName}`;
        link.download = file.fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      };
      tdAction.appendChild(downloadIcon);

      const deleteIcon = document.createElement("img");
      deleteIcon.src = "/icons/bouton-supprimer.png";
      deleteIcon.alt = "Supprimer";
      deleteIcon.style.width = "20px";
      deleteIcon.style.height = "20px";
      deleteIcon.style.cursor = "pointer";
      deleteIcon.title = "Supprimer";

      deleteIcon.onclick = () => deleteFile(file._id);
      tdAction.appendChild(deleteIcon);


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


