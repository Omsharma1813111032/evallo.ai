# Log Ingestion and Querying System

This is a full-stack take-home assignment simulating a real-world developer tool used for monitoring and debugging applications. It includes:

- A **Node.js + Express backend** that ingests and stores logs in a JSON file
- A **React frontend** to view, filter, and search logs
- **Swagger UI** for testing and documenting API endpoints

---

## 📁 Project Structure

root/

├── evallo.js # Backend server (main entry)
├── logs.json # Acts as the file-based database
├── helpers/
│ └── fileHandler.js # File read/write helpers
├── swagger.js # Swagger setup
├── frontend/ # React app (created with CRA)
│ └── src/
└── README.md

yaml
Copy
Edit

---

## 🚀 Getting Started

### 🔧 Backend Setup

1. **Install dependencies**:
   ```bash
   npm install
Run the backend server:

bash
Copy
Edit
node evallo.js
The server runs at:
http://localhost:5000

🌐 Frontend Setup
Navigate to the frontend/ folder:

bash
Copy
Edit
cd frontend
Install dependencies:

bash
Copy
Edit
npm install
Run the frontend app:

bash
Copy
Edit
npm start
The app runs at:
http://localhost:3000

📖 API Documentation
🧪 Swagger UI
The project includes Swagger at:

http://localhost:5000/api-docs

It documents:

POST /logs – Ingest a new log

GET /logs – View logs with filters & pagination

📬 Example API Request
✅ POST /logs
Sample log:

json
Copy
Edit
{
  "level": "error",
  "message": "Failed to connect to database.",
  "resourceId": "server-1234",
  "timestamp": "2023-09-15T08:00:00Z",
  "traceId": "abc-xyz-123",
  "spanId": "span-456",
  "commit": "5e5342f",
  "metadata": {
    "parentResourceId": "server-5678"
  }
}
Use Postman or Swagger to test this endpoint.

🧠 Features
✅ Full-text search (message)

✅ Filter by log level (error, warn, info, debug)

✅ Filter by resourceId

✅ Filter by timestamp range

✅ Pagination (page, limit)

✅ Swagger documentation

✅ Dynamic frontend UI built with React

✅ Debounced search input

✅ Fixed pagination at the bottom

📄 Sample Dummy Data (logs.json)
json
Copy
Edit
[
  {
    "level": "error",
    "message": "Failed to connect to database.",
    "resourceId": "server-1234",
    "timestamp": "2023-09-15T08:00:00Z",
    "traceId": "abc-xyz-123",
    "spanId": "span-456",
    "commit": "5e5342f",
    "metadata": {
      "parentResourceId": "server-5678"
    }
  }
]
⚙️ Tech Stack
Backend: Node.js, Express, Swagger

Frontend: React, Axios, Day.js, React-Select, React-DatePicker

Persistence: JSON file (logs.json) using Node fs module

✅ Design Decisions
File-based storage was used per instructions to demonstrate in-memory filtering logic

No database was used to meet constraints

Debouncing implemented for message input to prevent excessive API calls

Swagger added instead of Postman for API exploration

💡 Future Improvements
Add real-time updates using WebSockets

Add log analytics (chart view)

Dockerize backend + frontend with docker-compose

Add unit tests for backend filters

📫 Author
Om Sharma
Feel free to reach out on LinkedIn or GitHub for any questions.