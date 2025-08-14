const API_URL = "/dashboard";
const tbody = document.querySelector("tbody");
const token = localStorage.getItem("token"); // à adapter selon ton stockage

const params = new URLSearchParams(window.location.search);
const userId = params.get("id");

let users = []; // tableau pour stocker tous les utilisateurs

// Récupérer tous les utilisateurs
async function fetchUsersList() {
    try {
        const res = await fetch("/dashboard/get_all_user");
        users = await res.json(); // on garde tout dans un tableau
    } catch (err) {
        console.error("Erreur récupération users", err);
    }
}
// Charger et afficher l'historique
async function chargerHistorique() {
    try {
        await fetchUsersList();
        const res = await fetch(`${API_URL}/get_history/${userId}`);
        const historiques = await res.json();

        tbody.innerHTML = "";

        for (const historique of historiques) {
            const historiqueUser = users.find(u => u._id === historique.userId);
            const userName = historiqueUser ? `${historiqueUser.firstName || ""} ${historiqueUser.lastName || ""}` : "Inconnu";

            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${userName || "Inconnu"}</td>

                <td>${historique.action || ""}</td>
                <td>${historique.createdAt ? new Date(historique.createdAt).toLocaleString() : ""}</td>
                <td>${historique.route || ""}</td>
                <td>${historique.method || ""}</td>
                <td>${historique.adresseIP || ""}</td>
                <td>
                    <button onclick="modifierHistorique('${historique._id}', this)">Modifier</button>
                </td>
                <td>
                    <button onclick="supprimerHistorique('${historique._id}')">Supprimer</button>
                </td>
            `;
            tbody.appendChild(tr);
        }
    } catch (err) {
        console.error("Erreur chargement historique", err);
    }
}

// Modifier une entrée inline
function modifierHistorique(historyId, bouton) {
    const tr = bouton.closest("tr");
    const tds = tr.querySelectorAll("td");

    tds[1].innerHTML = `<input value="${tds[1].innerText}">`;
    tds[3].innerHTML = `<input value="${tds[3].innerText}">`;
    tds[4].innerHTML = `<input value="${tds[4].innerText}">`;
    tds[5].innerHTML = `<input value="${tds[5].innerText}">`;

    tds[6].innerHTML = `<button onclick="enregistrerModification('${historyId}', this)">Enregistrer</button>`;
}

// Sauvegarder modif
async function enregistrerModification(historyId, bouton) {
    const tr = bouton.closest("tr");
    const tds = tr.querySelectorAll("td");

    const body = {
        action: tds[1].querySelector("input").value,
        route: tds[3].querySelector("input").value,
        method: tds[4].querySelector("input").value,
        adresseIP: tds[5].querySelector("input").value
    };

    try {
        const res = await fetch(`${API_URL}/update_history/${historyId}/${userId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(body)
        });

        if (!res.ok) {
            const errText = await res.text();
            throw new Error(errText);
        }

        // Mettre à jour la ligne sans recharger tout
        tds[1].innerText = body.action;
        tds[3].innerText = body.route;
        tds[4].innerText = body.method;
        tds[5].innerText = body.adresseIP;
        tds[6].innerHTML = `<button onclick="modifierHistorique('${historyId}', this)">Modifier</button>`;

    } catch (err) {
        console.error("Erreur modification", err);
        alert("Impossible de modifier : " + err.message);
    }
}


// Supprimer une historique
async function supprimerHistorique(historyId) {
    if (!confirm("Supprimer cette historque ?")) return;

    try {
        await fetch(`${API_URL}/delete_history/${historyId}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
        chargerHistorique();
    } catch (err) {
        console.error("Erreur suppression", err);
    }
}

document.addEventListener("DOMContentLoaded", chargerHistorique);
