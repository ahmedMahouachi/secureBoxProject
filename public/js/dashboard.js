document.addEventListener("DOMContentLoaded", () => {
    const tableBody = document.querySelector("#usersTable tbody");
    
    async function fetchUsers() {
        try {
            const response = await fetch("/dashboard/get_all_user");
            if (!response.ok) throw new Error("Erreur lors de la récupération des utilisateurs");
            
            const users = await response.json();
            tableBody.innerHTML = ""; // vider le tableau

            users.forEach(user => {
                const row = document.createElement("tr");

                row.innerHTML = `
                    <td>${user.firstName || ""}</td>
                    <td>${user.lastName || ""}</td>
                    <td>${user.email}</td>
                    <td>${user.role}</td>
                    <td><a href="historyUser.html?id=${user._id}" class="history-link">Voir</a></td>
                    <td><button class="delete-btn" data-id="${user._id}">X</button></td>
                `;

                tableBody.appendChild(row);
            });
        } catch (error) {
            console.error(error);
        }
    }

    tableBody.addEventListener("click", async (event) => {
        if (event.target.classList.contains("delete-btn")) {
            const userId = event.target.dataset.id;
            if (confirm("Voulez-vous vraiment supprimer cet utilisateur ?")) {
                try {
                    const res = await fetch(`/dashboard/delete_user_by_id/${userId}`, { method: "DELETE" });
                    if (res.ok) {
                        alert("Utilisateur supprimé avec succès");
                        fetchUsers(); // rafraîchir la liste
                    } else {
                        const err = await res.json();
                        alert(`Erreur : ${err.message || "Impossible de supprimer"}`);
                    }
                } catch (err) {
                    console.error(err);
                }
            }
        }
    });

    /********************************************************************
     * ********************
     *                      MODAL CREATE USER
     *                                        ****************************
     * *******************************************************************
     */

    const modal = document.getElementById("userModal");
    const openModalBtn = document.getElementById("openModalBtn");
    const closeModal = document.querySelector(".close");
    const createUserForm = document.getElementById("createUserForm");

    // Afficher la modal
    openModalBtn.addEventListener("click", () => {
        modal.style.display = "block";
    });

    // Fermer la modal
    closeModal.addEventListener("click", () => {
        modal.style.display = "none";
    });

    window.addEventListener("click", (e) => {
        if (e.target === modal) modal.style.display = "none";
    });

    /*
    createUserForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const formData = new FormData(createUserForm);
        const data = Object.fromEntries(formData.entries());

        try {
            const res = await fetch("/api/auth/registerAdmin", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });

            if (res.ok) {
                alert("Utilisateur créé !");
                modal.style.display = "none";
                createUserForm.reset();
                fetchUsers();
            } else {
                const err = await res.json();
                alert(`Erreur : ${err.message || "Impossible de créer l'utilisateur"}`);
            }
        } catch (err) {
            console.error(err);
        }
    });*/

    fetchUsers();
});
