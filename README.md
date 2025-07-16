<div align="center">
  <h1>🗒️ Secure Notes App</h1>
  <h3>A Personal Note-Taking App with JWT Authentication</h3>
  <p>
    <em>Built with Node.js, HTML, and Tailwind CSS</em>
  </p>
</div>

---

## 📖 About the Project

**Secure Notes App** is a simple yet powerful fullstack web application designed for personal note-taking.  
This app emphasizes **secure access and data protection** using **JWT (JSON Web Token)** for authentication. Users can register, log in, create, edit, and delete their notes in a private and protected environment.

The application architecture separates the **frontend and backend responsibilities**, using JWT as a secure token to bridge the communication between client and server.

---

## 🛠️ Built With

| 🖥️ Backend | 🌐 Frontend | 🎨 Styling |
|------------|-------------|------------|
| `Node.js`  | `HTML`      | `Tailwind CSS` |
| `Express`  | `JavaScript`|              |
| `JWT`      |             |              |

---

## 🔐 Authentication & Security

- **User Registration & Login** with form validation
- **JWT-based authentication**
- **Token stored securely** and sent with each request to access protected routes
- **Sessionless communication** between client and server

---

## 🖼️ Screenshots

<p align="center">
  <img src="https://github.com/SiAnakAlim/Notes-Using-Node-JS/blob/main/img/foto1.png" width="100%" alt="Login Page" />
  <img src="https://github.com/SiAnakAlim/Notes-Using-Node-JS/blob/main/img/foto2.png" width="100%" alt="Register Page" />
  <img src="https://github.com/SiAnakAlim/Notes-Using-Node-JS/blob/main/img/foto3.png" width="100%" alt="Notes Dashboard" />
</p>

---

## 🚀 Features

- 📝 Add, edit, and delete personal notes
- 🔐 Secure login and registration system
- 🎫 JWT token handling for sessionless authentication
- 🎨 Clean and responsive UI using Tailwind CSS
- 🧩 Modular code structure (routes, controllers, views)
- 🌐 RESTful API design for secure frontend-backend interaction

---

## 📁 Project Structure

Notes-Using-Node-JS/
│
├── public/ # Static files (CSS, JS, images)
├── views/ # HTML templates
├── routes/ # Route handlers
├── controllers/ # Logic for handling routes
├── middleware/ # JWT and auth middleware
├── utils/ # Utility functions
├── img/ # Screenshots
├── .env # Environment variables
└── server.js # Main server file

---

## 📦 Installation & Run Locally

```bash
# 1. Clone the repo
git clone https://github.com/SiAnakAlim/Notes-Using-Node-JS.git
cd Notes-Using-Node-JS

# 2. Install dependencies
npm install

# 3. Create .env file and set:
#    PORT=5000
#    JWT_SECRET=your_jwt_secret_key

# 4. Run the server
node server.js

# App will run at http://localhost:5000

```


