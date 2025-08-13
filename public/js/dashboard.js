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
                `;

                tableBody.appendChild(row);
            });
        } catch (error) {
            console.error(error);
        }
    }

    fetchUsers();
});
