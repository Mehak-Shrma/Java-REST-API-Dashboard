// Relative to the deployed WAR context root (must match web.xml / @ApplicationPath("webapi"))
const API_URL = "webapi/DATAs/DATA";

let editingId = null;
let cachedRecords = [];

document.addEventListener("DOMContentLoaded", () => {
    loadRecords();

    document.getElementById("refreshBtn").addEventListener("click", loadRecords);
    document.getElementById("cancelEditBtn").addEventListener("click", cancelEdit);
    document.getElementById("searchInput").addEventListener("input", renderFilteredTable);
});

function showToast(message, type = "success") {
    const container = document.getElementById("toastContainer");
    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    toast.textContent = message;
    container.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 3200);
}

function setApiStatus(state, subtitle) {
    const apiStatus = document.getElementById("apiStatus");
    const statusDot = document.getElementById("statusDot");
    const lastSynced = document.getElementById("lastSynced");

    statusDot.className = `status-dot ${state}`;
    if (state === "connected") {
        apiStatus.textContent = "Connected";
    } else if (state === "disconnected") {
        apiStatus.textContent = "Disconnected";
    } else {
        apiStatus.textContent = "Checking...";
    }
    lastSynced.textContent = subtitle;
}

// GET: Fetch all records
async function loadRecords() {
    const table = document.getElementById("dataTable");
    const totalRecords = document.getElementById("totalRecords");
    const avgAge = document.getElementById("avgAge");

    try {
        setApiStatus("checking", "Syncing with server...");

        const response = await fetch(API_URL, {
            method: "GET",
            headers: { "Accept": "application/json" }
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const records = await response.json();
        if (!Array.isArray(records)) {
            throw new Error("API did not return an array");
        }

        cachedRecords = records;
        totalRecords.textContent = records.length;

        if (records.length > 0) {
            const sum = records.reduce((acc, r) => acc + (Number(r.age) || 0), 0);
            avgAge.textContent = (sum / records.length).toFixed(1);
        } else {
            avgAge.textContent = "—";
        }

        const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
        setApiStatus("connected", `Synced at ${now}`);
        renderFilteredTable();

    } catch (error) {
        console.error("Error loading records:", error);
        setApiStatus("disconnected", error.message);
        table.innerHTML = `<tr><td colspan="5" class="empty-state">${error.message}</td></tr>`;
    }
}

function renderFilteredTable() {
    const table = document.getElementById("dataTable");
    const query = document.getElementById("searchInput").value.trim().toLowerCase();

    const filtered = cachedRecords.filter(d => {
        if (!query) return true;
        return String(d.id).includes(query)
            || (d.name || "").toLowerCase().includes(query)
            || (d.address || "").toLowerCase().includes(query);
    });

    table.innerHTML = "";

    if (filtered.length === 0) {
        table.innerHTML = `<tr><td colspan="5" class="empty-state">${
            cachedRecords.length === 0 ? "No records found. Add your first record above!" : "No matching records."
        }</td></tr>`;
        return;
    }

    filtered.forEach(data => {
        const row = document.createElement("tr");

        const idCell = document.createElement("td");
        const idPill = document.createElement("span");
        idPill.className = "id-pill";
        idPill.textContent = `#${data.id}`;
        idCell.appendChild(idPill);
        row.appendChild(idCell);

        const nameCell = document.createElement("td");
        nameCell.textContent = data.name ?? "";
        row.appendChild(nameCell);

        const ageCell = document.createElement("td");
        const agePill = document.createElement("span");
        agePill.className = "age-pill";
        agePill.textContent = `${data.age ?? ""} yrs`;
        ageCell.appendChild(agePill);
        row.appendChild(ageCell);

        const addressCell = document.createElement("td");
        addressCell.textContent = data.address ?? "";
        row.appendChild(addressCell);

        const actionCell = document.createElement("td");
        const group = document.createElement("div");
        group.className = "action-group";

        const editBtn = document.createElement("button");
        editBtn.type = "button";
        editBtn.className = "btn-edit";
        editBtn.textContent = "Edit";
        editBtn.addEventListener("click", () => startEdit(data));

        const deleteBtn = document.createElement("button");
        deleteBtn.type = "button";
        deleteBtn.className = "btn-delete";
        deleteBtn.textContent = "Delete";
        deleteBtn.addEventListener("click", () => deleteRecord(data.id));

        group.appendChild(editBtn);
        group.appendChild(deleteBtn);
        actionCell.appendChild(group);
        row.appendChild(actionCell);

        table.appendChild(row);
    });
}

function startEdit(data) {
    editingId = data.id;
    document.getElementById("id").value = data.id;
    document.getElementById("id").disabled = true;
    document.getElementById("name").value = data.name ?? "";
    document.getElementById("age").value = data.age ?? "";
    document.getElementById("address").value = data.address ?? "";

    document.getElementById("formTitle").textContent = `Edit Record #${data.id}`;
    document.getElementById("modeBadge").textContent = "PUT";
    document.getElementById("submitBtn").textContent = "Update Record";
    document.getElementById("cancelEditBtn").classList.remove("hidden");

    document.getElementById("add-record").scrollIntoView({ behavior: "smooth" });
}

function cancelEdit() {
    editingId = null;
    document.getElementById("dataForm").reset();
    document.getElementById("id").disabled = false;
    document.getElementById("formTitle").textContent = "Add New Record";
    document.getElementById("modeBadge").textContent = "POST";
    document.getElementById("submitBtn").textContent = "Add Record";
    document.getElementById("cancelEditBtn").classList.add("hidden");
}

// POST / PUT: Add or Update Record
document.getElementById("dataForm").addEventListener("submit", async function(event) {
    event.preventDefault();

    const payload = {
        id: editingId !== null
            ? Number(editingId)
            : Number(document.getElementById("id").value),
        name: document.getElementById("name").value.trim(),
        age: Number(document.getElementById("age").value),
        address: document.getElementById("address").value.trim()
    };

    const isEditing = editingId !== null;
    const method = isEditing ? "PUT" : "POST";

    try {
        const response = await fetch(API_URL, {
            method,
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status}`);
        }

        showToast(isEditing ? `Record #${payload.id} updated!` : `Record #${payload.id} added!`, "success");
        cancelEdit();
        loadRecords();

    } catch (error) {
        console.error("Save error:", error);
        showToast("Operation failed. Check the API.", "error");
    }
});

// DELETE: Delete a record by ID
async function deleteRecord(id) {
    if (!confirm(`Are you sure you want to delete record #${id}?`)) {
        return;
    }

    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "DELETE"
        });

        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status}`);
        }

        if (editingId === id) {
            cancelEdit();
        }

        showToast(`Record #${id} deleted!`, "success");
        loadRecords();

    } catch (error) {
        console.error("Delete error:", error);
        showToast("Unable to delete record.", "error");
    }
}
