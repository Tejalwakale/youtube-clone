# YouTube Clone – MERN Stack

A full-stack YouTube Clone application built using the MERN stack: MongoDB, Express.js, React, and Node.js.

The application allows users to register and log in, browse videos, search and filter videos, watch videos, like/dislike videos, subscribe to channels, create channels, and manage comments.

---

## 🚀 Features

### Home Page

* YouTube-style header
* Toggleable sidebar
* Video category filters
* Responsive video grid
* Video thumbnails
* Video titles
* Channel names
* View counts
* Search videos by title

### User Authentication

* User registration
* User login
* JWT-based authentication
* Password hashing using bcryptjs
* Login session using localStorage
* Protected routes and features
* Sign in and logout functionality

### Video Player

* Video playback
* Video title and description
* Channel information
* View count
* Like button
* Dislike button
* Subscribe/unsubscribe functionality

### Comments

* Add comments
* Display comments for a video
* Edit own comments
* Delete own comments
* Comments stored in MongoDB
* JWT protection for comment modification

### Channel Management

* Create a channel after login
* View channel information
* Display channel banner
* Display channel description
* Display subscriber count
* Display videos belonging to the channel
* Edit and delete videos
* Subscribe and unsubscribe from channels

### Search and Filter

* Search videos by title
* Filter videos by category
* Dynamic results on the home page

### Responsive Design

The application is designed to work across:

* Desktop
* Tablet
* Mobile devices

---

## 🛠️ Technologies Used

### Frontend

* React
* React Router
* Axios
* Vite
* CSS

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT
* bcryptjs
* CORS
* dotenv

### Development Tools

* Git
* GitHub
* VS Code
* MongoDB Atlas

---

## 📁 Project Structure

```text
youtube-clone/
│
├── client/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── CategoryFilter.jsx
│   │   │   ├── Header.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   └── VideoCard.jsx
│   │   │
│   │   ├── pages/
│   │   │   ├── Channel.jsx
│   │   │   ├── CreateChannel.jsx
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   └── VideoPlayer.jsx
│   │   │
│   │   ├── services/
│   │   │   └── api.js
│   │   │
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   │
│   ├── package.json
│   └── vite.config.js
│
├── server/
│   ├── config/
│   │   └── db.js
│   │
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── channelController.js
│   │   ├── commentController.js
│   │   └── videoController.js
│   │
│   ├── middleware/
│   │   └── authMiddleware.js
│   │
│   ├── models/
│   │   ├── Channel.js
│   │   ├── Comment.js
│   │   ├── User.js
│   │   └── Video.js
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── channelRoutes.js
│   │   ├── commentRoutes.js
│   │   └── videoRoutes.js
│   │
│   ├── package.json
│   └── server.js
│
├── .gitignore
└── README.md
```

---

## ⚙️ Installation

### 1. Clone the repository

```bash
git clone https://github.com/Tejalwakale/youtube-clone.git
```

Move into the project:

```bash
cd youtube-clone
```

---

## 🖥️ Frontend Setup

Move into the client folder:

```bash
cd client
```

Install dependencies:

```bash
npm install
```

Start the React development server:

```bash
npm run dev
```

The frontend normally runs at:

```text
http://localhost:5173
```

---

## 🖥️ Backend Setup

Open another terminal and move into the server folder:

```bash
cd server
```

Install dependencies:

```bash
npm install
```

Start the backend:

```bash
npm run dev
```

The backend runs on:

```text
http://localhost:5000
```

---

## 🔐 Environment Variables

Create a `.env` file inside the `server` folder.

Example:

```env
PORT=5000
MONGO
```
