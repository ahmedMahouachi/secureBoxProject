document.addEventListener("DOMContentLoaded", () => {
    const tableBody = document.querySelector("#usersTable tbody");
    let allUsers = [];
    
    async function fetchUsers() {
        try {
            const response = await fetch("/dashboard/get_all_user");
            if (!response.ok) throw new Error("Erreur lors de la récupération des utilisateurs");
            
            allUsers = await response.json(); // on stocke les users
            displayUsers(allUsers); // affiche tout au départ
        } catch (error) {
            console.error(error);
        }
    }

    function displayUsers(users) {
        tableBody.innerHTML = "";
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
    }

        // Boutons de filtre
        document.getElementById("showClientsBtn").addEventListener("click", () => {
            const clients = allUsers.filter(u => u.role === "client");
            displayUsers(clients);
        });

        document.getElementById("showAdminsBtn").addEventListener("click", () => {
            const admins = allUsers.filter(u => u.role === "admin");
            displayUsers(admins);
        });

        document.getElementById("showAllBtn").addEventListener("click", () => {
            displayUsers(allUsers);
        });
        

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

    
    createUserForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const formData = new FormData(createUserForm);
        const data = {
            nom: formData.get("lastName"),     
            prenom: formData.get("firstName"), 
            email: formData.get("email"),
            password: formData.get("password")
        };

        try {
            const res = await fetch("/api/auth/uregisterAdmin", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });

            const result = await res.json();

            if (res.ok && result.success) {
                alert("Administrateur créé !");
                modal.style.display = "none";
                createUserForm.reset();
                fetchUsers();
            } else {
                alert(`Erreur : ${result.message || "Impossible de créer l'utilisateur"}`);
            }
        } catch (err) {
            console.error(err);
            alert("Une erreur est survenue.");
        }
    });

    fetchUsers();
});
