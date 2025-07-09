# Blogify

<div align="center">
<img src="/client/assets/readme-cover.png" alt="Demo Screenshot">
  
  <!-- Tech Stack -->
  
  <div>
  <img src="https://img.shields.io/badge/Javascript-3178C6?style=for-the-badge&logo=javascript&logoColor=yellow" alt="javascript" />
    <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="react" />
    <img src="https://img.shields.io/badge/TailwindCSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="tailwind" />
    <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="vite" />
    <img src="https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white" alt="axios" />
    <img src="https://img.shields.io/badge/Zustand-000000?style=for-the-badge&logo=zustand&logoColor=white" alt="zustand" />
    <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="node.js" />
    <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" alt="express.js" />
    <img src="https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white" alt="JWT" />
  </div>
</div>

<br />
<br />

[![Status](https://img.shields.io/badge/Status-InProgress-yellow)]()
[![License](https://img.shields.io/badge/License-MIT-lightgrey)]()
[![Live Demo](https://img.shields.io/badge/Live-Demo-orange)](https://x-clone319.vercel.app/)

---

## 📖 Description

X-Clone is a full-stack clone of the X (formerly Twitter) platform, allowing users to post updates, like and repost content, follow others, and engage in real-time social interactions. The app replicates the core experience of X with features like timelines, user profiles, and dynamic feeds—bringing microblogging to life in a familiar, modern interface.

---

## 🚀 Features

- 🔒 Authentication
- 📦 Full Social Media Functionality
- 🌐 Fully responsive UI
- ⚙️ Deployment via Render + Vercel

---

## 🧠 What I Learned

This project challenged and taught me:

- ✅ Infinite Scrolling
- ✅ Optimistic Updates & UI

---

## 🔧 Technologies Used

| Frontend | Backend              | Database           | Other                  |
| -------- | -------------------- | ------------------ | ---------------------- |
| React    | Node.js (Express.js) | MongoDB (Mongoose) | JWT, Axios, Vite, etc. |

---

## 🖥️ Live Demo

🌐 [Click here to view the app](https://x-clone319.vercel.app/)

---

## 🧪 Installation & Setup

```bash
# Clone the repository
git clone https://github.com/moamenzz/X-Clone.git

# Navigate to project folder
cd X-Clone

# Install dependencies for both frontend and backend
cd client && npm install
cd ../server && npm install

# Add .env files in both folders as per .env.example

# Run the project
npm start

```

## 🤫 .env.example

client .env:

```
VITE_BACKEND_API=
```

server .env:

```
PORT=
NODE_ENV=
MONGODB_URI=
ACCESS_TOKEN_SECRET=
REFRESH_TOKEN_SECRET=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```
