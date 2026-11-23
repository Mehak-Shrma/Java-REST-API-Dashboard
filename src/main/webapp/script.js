
// Your Jersey REST API endpoint
const API_URL = "http://localhost:8080/RESTAPI/webapi/DATAs/DATA";
let editingId = null;
// Load records when dashboard opens
document.addEventListener("DOMContentLoaded", () => {
    loadRecords();

    document.getElementById("refreshBtn")
        .addEventListener("click", loadRecords);
});

// GET: Fetch all records

async function loadRecords() {
    const table = document.getElementById("dataTable");
    const totalRecords = document.getElementById("totalRecords");
    const apiStatus = document.getElementById("apiStatus");

    try {
        apiStatus.textContent = "Checking...";

        console.log("API URL:", API_URL);

        const response = await fetch(API_URL, {
            method: "GET",
            headers: {
                "Accept": "application/json"
            }
        });

        console.log("HTTP Status:", response.status);

        const text = await response.text();

        console.log("Raw response:", text);

        const records = JSON.parse(text);

        console.log("Records:", records);
        console.log("Is array:", Array.isArray(records));

        if (!Array.isArray(records)) {
            throw new Error("API did not return an array");
        }

        totalRecords.textContent = records.length;
        apiStatus.textContent = "Connected";
        table.innerHTML = "";

        if (records.length === 0) {
            table.innerHTML =
                '<tr><td colspan="5">No records found</td></tr>';
            return;
        }

        records.forEach(data => {
            const row = document.createElement("tr");

            [data.id, data.name, data.age, data.address]
                .forEach(value => {
                    const cell = document.createElement("td");
                    cell.textContent = value ?? "";
                    row.appendChild(cell);
                });

            const actionCell = document.createElement("td");
            actionCell.textContent = "Actions";
            row.appendChild(actionCell);

            table.appendChild(row);
        });

    } catch (error) {
        console.error("ACTUAL ERROR:", error);

        apiStatus.textContent = "Disconnected";

        table.innerHTML =
            `<tr><td colspan="5">${error.message}</td></tr>`;
    }
}

// POST: Add a new record

// POST and PUT: Add or Update Record

document.getElementById("dataForm").addEventListener("submit", async function(event) {

    event.preventDefault();

    const newData = {
        id: editingId !== null
            ? Number(editingId)
            : Number(document.getElementById("id").value),

        name: document.getElementById("name").value,
        age: Number(document.getElementById("age").value),
        address: document.getElementById("address").value
    };

    // Decide whether to POST or PUT
    const method = editingId !== null ? "PUT" : "POST";

    try {
        const response = await fetch(API_URL, {
            method: method,
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(newData)
        });

        if (!response.ok) {
            throw new Error("HTTP Error: " + response.status);
        }

        alert(
            editingId !== null
                ? "Record updated successfully!"
                : "Record added successfully!"
        );

        // Reset editing mode
        editingId = null;

        document.getElementById("dataForm").reset();
        document.getElementById("id").disabled = true;
        document.getElementById("submitBtn").textContent = "Add Record";

        // Refresh records
        loadRecords();

    } catch (error) {
        console.error("Error:", error);
        alert("Operation failed. Check the API.");
    }
});

// DELETE: Delete a record by ID

async function deleteRecord(id) {

    const confirmDelete = confirm(
        "Are you sure you want to delete record ID " + id + "?"
    );

    if (!confirmDelete) {
        return;
    }

    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "DELETE"
        });

        if (!response.ok) {
            throw new Error("HTTP Error: " + response.status);
        }

        alert("Record deleted successfully!");

        loadRecords();

    } catch (error) {
        console.error("Delete error:", error);
        alert("Unable to delete record.");
    }
}
/*function cancelEdit() {
    editingId = null;

    document.getElementById("dataForm").reset();
    document.getElementById("id").disabled = false;
    document.getElementById("submitBtn").textContent = "Add Record";
}
*/