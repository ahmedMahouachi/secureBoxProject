const API_URL = "/history"; // base de l'API
const userId = "ID_UTILISATEUR"; // remplacer par l'ID réel
const historiqueContainer = document.getElementById("historiqueContainer");

async function chargerHistorique() {

    const res = await fetch(`${API_URL}/get_history/${userId}`);
    const historique = await res.json();
    console.log(historique);

    historiqueContainer.innerHTML = "";

    for (const entry of historique) {
      const div = document.createElement("div");
      div.className = "history-table";

      div.innerHTML = `
        <h3></h3>
        <p>Action : ${entry.action || ""}</p>
        <small>Créé le ${new Date(entry.createdAt).toLocaleDateString()}</small>
        <p>Détails : ${entry.details || ""}</p>
        <button onclick="supprimerHistorique('${entry._id}')">Supprimer</button>
      `;

      historiqueContainer.appendChild(div);
    }

}

/*// Supprimer une entrée
async function supprimerHistorique(historyId) {
  if (!confirm("Tu es sûre de vouloir supprimer cette entrée ?")) return;

  try {
    await fetch(`${API_URL}/delete_history/${historyId}`, { method: "DELETE" });
    chargerHistorique(); // recharge l'historique après suppression
  } catch (err) {
    console.error("Erreur lors de la suppression :", err);
  }
}*/

// Initialisation
document.addEventListener("DOMContentLoaded", chargerHistorique);
