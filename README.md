<div align="center">

# Java REST API Dashboard

### A Jakarta EE 10 / Jersey 3 REST API backed by MySQL — with a sleek, responsive single-page management dashboard.

[![Java](https://img.shields.io/badge/Java-21+-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)](https://openjdk.org/)
[![Jakarta EE](https://img.shields.io/badge/Jakarta%20EE-10-1F2937?style=for-the-badge&logo=eclipse&logoColor=white)](https://jakarta.ee/)
[![Jersey](https://img.shields.io/badge/Jersey-3.1-00B4AB?style=for-the-badge)](https://eclipse-ee4j.github.io/jersey/)
[![Tomcat](https://img.shields.io/badge/Tomcat-10.1+-F8DC75?style=for-the-badge&logo=apachetomcat&logoColor=black)](https://tomcat.apache.org/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0+-4479A1?style=for-the-badge&logo=mysql&logoColor=white)](https://www.mysql.com/)
[![Maven](https://img.shields.io/badge/Maven-3.9+-C71A36?style=for-the-badge&logo=apachemaven&logoColor=white)](https://maven.apache.org/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](#)

</div>

<p align="center">
  <img src="screenshots/Screenshot 2026-11-23 185117.png" alt="REST API Dashboard Preview" width="85%">
</p>

<div align="center">

**[Features](#-features)** · **[Project Structure](#-project-structure)** · **[Setup](#️-database-setup)** · **[Deploy](#-build--deploy)** · **[Testing](#-how-to-test)** · **[API Reference](#-api-reference)**

</div>

---

## Features

| | |
|---|---|
| **Full CRUD** | Create, read, update, and delete records via a clean JAX-RS API |
| **Live Dashboard** | Real-time record count, average age, and API connection status |
| **Instant Search** | Filter records by ID, Name, or Address on the fly |
| **CORS-Ready** | Preflight-aware filter for cross-origin frontend integration |
| **Env-Based Secrets** | No hardcoded credentials — DB password pulled from the environment |
| **Standards-Based** | Pure Jakarta EE 10 + Jersey 3, no heavyweight framework lock-in |

---

## Project Structure

```text
src/main/java/com/restapi/
├── DATA.java              # JAXB/JSON-B model (id, name, age, address)
├── DATArepo.java          # MySQL JDBC CRUD repository
├── DATAresourse.java      # JAX-RS resource (/webapi/DATAs/DATA)
├── RestApplication.java   # @ApplicationPath("webapi") ResourceConfig
└── CorsFilter.java        # CORS + OPTIONS preflight filter

src/main/webapp/
├── WEB-INF/web.xml        # Jersey ServletContainer mapping (/webapi/*)
├── index.html             # Dashboard UI
├── style.css              # Responsive dashboard styling
└── script.js              # Fetch CRUD client (relative API_URL)
```

---

## Prerequisites

- **JDK 21+**
- **Apache Maven 3.9+**
- **MySQL 8.0+**
- **Apache Tomcat 10.1+** *(Jakarta EE 10 / `jakarta.servlet` 6.0 — Tomcat 8.5 / 9.x will **not** work)*

---

## Database Setup

Create the `RESTDATA` database and `DATA` table:

```sql
CREATE DATABASE IF NOT EXISTS RESTDATA;
USE RESTDATA;

CREATE TABLE IF NOT EXISTS DATA (
    DATA_id INT PRIMARY KEY,
    DATA_name VARCHAR(255),
    DATA_age INT,
    DATA_address VARCHAR(255)
);
```

### Environment Variables

`DATArepo` reads database credentials from the environment — never hardcoded:

| Variable | Required | Default |
|---|---|---|
| `DB_PASSWORD` *(or `MYSQL_PASSWORD`, `pwd`)* | ✅ Yes | — |
| `DB_URL` | ⬜ Optional | `jdbc:mysql://localhost:3306/RESTDATA` |
| `DB_USER` | ⬜ Optional | `root` |

---

## Build & Deploy

**1. Build the WAR package**

```bash
mvn clean package
```

> Generates `target/RESTAPI.war` with compiled classes in `WEB-INF/classes/` and all dependencies in `WEB-INF/lib/`.

**2. Deploy to Tomcat 10.1+**

Copy `target/RESTAPI.war` into your Tomcat `webapps/` directory.

**3. Start Tomcat with the DB password set**

<details>
<summary><b>Windows (PowerShell)</b></summary>

```powershell
$env:DB_PASSWORD = "your_mysql_password"
$env:JAVA_HOME = "C:\path\to\jdk-21+"
$env:CATALINA_HOME = "C:\path\to\apache-tomcat-10.1.x"
& "$env:CATALINA_HOME\bin\catalina.bat" run
```

</details>

<details>
<summary><b>🐧 Linux / 🍎 macOS</b></summary>

```bash
export DB_PASSWORD="your_mysql_password"
export JAVA_HOME="/path/to/jdk-21+"
export CATALINA_HOME="/path/to/apache-tomcat-10.1.x"
"$CATALINA_HOME/bin/catalina.sh" run
```

</details>

---

## ✅ How to Test

### Option A — Browser Dashboard UI

Open **`http://localhost:8080/RESTAPI/`** and:

1. Confirm **API Status** shows **🟢 Connected**.
2. Use **Add New Record** (`POST`) → verify it appears under **All Records** and updates **Total Records** / **Average Age**.
3. Use the **Search** box to filter by ID, Name, or Address.
4. Click **Edit** (`PUT`) on a row, modify fields, then **Update Record**.
5. Click **Delete** (`DELETE`) on a row and confirm removal.

### Option B — REST API via `curl`

<details open>
<summary><b>📋 GET — fetch all records</b></summary>

```bash
curl -i http://localhost:8080/RESTAPI/webapi/DATAs/DATA
```

</details>

<details open>
<summary><b>➕ POST — create a record</b></summary>

```bash
curl -i -X POST http://localhost:8080/RESTAPI/webapi/DATAs/DATA \
  -H "Content-Type: application/json" \
  -d "{\"id\":101,\"name\":\"Aarav\",\"age\":24,\"address\":\"Bengaluru\"}"
```

</details>

<details open>
<summary><b>✏️ PUT — update a record</b></summary>

```bash
curl -i -X PUT http://localhost:8080/RESTAPI/webapi/DATAs/DATA \
  -H "Content-Type: application/json" \
  -d "{\"id\":101,\"name\":\"Aarav Sharma\",\"age\":25,\"address\":\"Mumbai\"}"
```

</details>

<details open>
<summary><b>🗑️ DELETE — remove a record</b></summary>

```bash
curl -i -X DELETE http://localhost:8080/RESTAPI/webapi/DATAs/DATA/101
```

</details>

---

## 📡 API Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/webapi/DATAs/DATA` | Fetch all records |
| `POST` | `/webapi/DATAs/DATA` | Create a new record |
| `PUT` | `/webapi/DATAs/DATA` | Update an existing record |
| `DELETE` | `/webapi/DATAs/DATA/{id}` | Delete a record by ID |


---

<div align="center">

Made with ☕ and Jakarta EE

**⭐ Star this repo if you found it useful!**

</div>