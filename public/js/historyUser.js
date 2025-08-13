const API_URL = "/history"; // Base de l'API
const userId = "ID_UTILISATEUR"; // À remplacer par l'ID réel
const tbody = document.querySelector("tbody");

// Charger et afficher la liste des historiques
async function chargerHistorique() {
    try {
        const res = await fetch(`${API_URL}/get_history/${userId}`);
        const historiques = await res.json();
        console.log(historiques);

        tbody.innerHTML = ""; // On vide le tableau

        for (const historique of historiques) {
            const tr = document.createElement("tr");

            tr.innerHTML = `
                <td data-label="Utilisateur">${historique.userId || ""}</td>
                <td data-label="Action">${historique.action || ""}</td>
                <td data-label="Date">${historique.createdAt ? new Date(historique.createdAt).toLocaleString() : ""}</td>
                <td data-label="Détails">
                    Route : ${historique.route || ""}<br>
                    Méthode : ${historique.method || ""}<br>
                    IP : ${historique.adresseIP || ""}
                </td>
                <td data-label="Modifier">
                    <button class="modifier" onclick="modifierHistorique('${historique._id}')">Modifier</button>
                </td>
                <td data-label="Supprimer">
                    <button class="supprimer" onclick="supprimerHistorique('${historique._id}')">Supprimer</button>
                </td>
            `;
            

            tbody.appendChild(tr);
        }
    } catch (error) {
        console.error("Erreur lors du chargement de l'historique :", error);
    }
}

// Supprimer une entrée
async function supprimerHistorique(historyId) {
    if (!confirm("Tu es sûre de vouloir supprimer cette entrée ?")) return;

    try {
        await fetch(`${API_URL}/delete_history/${historyId}`, { method: "DELETE" });
        chargerHistorique();
    } catch (error) {
        console.error("Erreur lors de la suppression :", error);
    }
}

// Modifier une entrée (placeholder pour plus tard)
function modifierHistorique(historyId) {
    alert(`Fonction modifier à implémenter pour l'ID : ${historyId}`);
}

// Lancer au chargement de la page
document.addEventListener("DOMContentLoaded", chargerHistorique);
