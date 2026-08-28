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

Add the following:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

Do not upload the `.env` file to GitHub.

The `.env` file contains private database credentials and authentication secrets.

---

## 🗄️ MongoDB

The application uses MongoDB for storing:

* Users
* Videos
* Channels
* Comments

Mongoose is used to connect the Node.js backend with MongoDB.

---

## 🔑 Authentication Flow

1. User registers using username, email, and password.
2. Password is hashed using bcryptjs.
3. User logs in using email and password.
4. Backend verifies the credentials.
5. Backend generates a JWT token.
6. Token is stored on the frontend.
7. Protected API requests include the JWT token.
8. Authentication middleware verifies the token before allowing protected operations.

---

# 📡 API Endpoints

## Authentication

| Method | Endpoint             | Description         |
| ------ | -------------------- | ------------------- |
| POST   | `/api/auth/register` | Register a new user |
| POST   | `/api/auth/login`    | Login user          |

---

## Videos

| Method | Endpoint                  | Description                            |
| ------ | ------------------------- | -------------------------------------- |
| GET    | `/api/videos`             | Fetch videos                           |
| GET    | `/api/videos/:id`         | Fetch a single video                   |
| PUT    | `/api/videos/:id/view`    | Increase video views                   |
| PUT    | `/api/videos/:id/like`    | Like or remove like from a video       |
| PUT    | `/api/videos/:id/dislike` | Dislike or remove dislike from a video |
| PUT    | `/api/videos/:id`         | Update video                           |
| DELETE | `/api/videos/:id`         | Delete video                           |

---

## Channels

| Method | Endpoint                      | Description                      |
| ------ | ----------------------------- | -------------------------------- |
| POST   | `/api/channels`               | Create a channel                 |
| GET    | `/api/channels/my-channel`    | Get the logged-in user's channel |
| GET    | `/api/channels/:id`           | Get channel information          |
| PUT    | `/api/channels/:id/subscribe` | Subscribe or unsubscribe         |
| PUT    | `/api/channels/:id`           | Update channel                   |

---

## Comments

| Method | Endpoint                       | Description              |
| ------ | ------------------------------ | ------------------------ |
| POST   | `/api/comments`                | Add a comment            |
| GET    | `/api/comments/video/:videoId` | Get comments for a video |
| PUT    | `/api/comments/:id`            | Update a comment         |
| DELETE | `/api/comments/:id`            | Delete a comment         |

Protected endpoints require a valid JWT token.

---

## 🔎 Search and Filter

### Search

Users can search videos using the header search bar.

The application filters videos based on their title.

### Category Filter

Users can select category buttons to display videos belonging to the selected category.

---

## ▶️ Video Interaction

Users can:

* Open a video from the home page
* Watch a video
* Increase the view count
* Like a video
* Dislike a video
* Subscribe to a channel
* Read comments
* Add comments
* Edit their comments
* Delete their comments

---

## 📺 Channel

Authenticated users can create a channel.

A channel contains:

* Channel name
* Channel description
* Channel banner
* Subscriber count
* Channel videos

The channel page displays videos associated with the channel.

---

## 📱 Responsive Design

The application includes responsive layouts for:

* Desktop screens
* Tablets
* Mobile phones

CSS media queries are used to adjust:

* Video grid columns
* Sidebar layout
* Search bar
* Video player
* Comments
* Channel page
* Forms and buttons

---

## ▶️ Running the Complete Application

Open two terminals.

### Terminal 1 – Backend

```bash
cd server
npm install
npm run dev
```

### Terminal 2 – Frontend

```bash
cd client
npm install
npm run dev
```

Then open the frontend URL provided by Vite.

---

## 🔒 Security

The project implements:

* JWT authentication
* Password hashing with bcryptjs
* Protected backend routes
* Authorization checks for user-owned comments
* Authorization checks for user-owned videos
* Authorization checks for channel ownership
* Environment variables for sensitive configuration

---

## 📌 Project Purpose

This project was developed as a Full Stack MERN application to demonstrate practical knowledge of:

* React frontend development
* REST API development
* Node.js and Express.js
* MongoDB database integration
* JWT authentication
* CRUD operations
* API integration using Axios
* Responsive web design
* Git and GitHub

---

## 🎥 Project Demo

A short video demonstration can showcase:

1. User registration
2. User login
3. Home page
4. Search functionality
5. Category filtering
6. Video playback
7. Like/dislike
8. Subscribe functionality
9. Comment creation
10. Comment editing
11. Comment deletion
12. Channel creation
13. Channel page
14. Responsive design
15. Logout

---

