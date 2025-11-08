# CopyTube Backend Practice Project

CopyTube is a practice backend project inspired by YouTube, built with Node.js, Express, and MongoDB. It provides a RESTful API for user authentication, video management, playlists, comments, likes, subscriptions, tweets, and dashboard statistics. This project is designed for learning and experimenting with backend concepts, authentication, file uploads, and database operations.

I followed a playlist of youtuber, Chai aur Code.
Playlist was Chai aur backend

## Features
- User registration, login, logout, and profile management
- Video upload, update, delete, and view tracking
- Playlist creation and management
- Commenting on videos
- Like/unlike videos, comments, and tweets
- Subscribe/unsubscribe to channels
- Tweet creation and management
- Dashboard statistics for channels
- Health check endpoint

## Tech Stack
- Node.js
- Express.js
- MongoDB (with Mongoose)
- Cloudinary (for file uploads)
- JWT authentication
- Multer (for handling file uploads)

## Getting Started

### Prerequisites
- Node.js (v16+ recommended)
- MongoDB instance (local or cloud)
- Cloudinary account (for media uploads)

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/CopyTube.git
   cd CopyTube
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory and add the following variables:
   ```env
   PORT=8000
   MONGODB_URI=your_mongodb_connection_string
   CORS_ORIGIN=http://localhost:3000
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   JWT_SECRET=your_jwt_secret
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## API Endpoints
All endpoints are prefixed with `/api/v1/`

### Auth & User
- `POST   /users/register` — Register a new user (with avatar & cover image upload)
- `POST   /users/login` — Login
- `POST   /users/refresh-token` — Refresh JWT token
- `POST   /users/logout` — Logout (auth required)
- `POST   /users/change-password` — Change password (auth required)
- `PATCH  /users/update-user` — Update user details (auth required)
- `PATCH  /users/update-avatar` — Update avatar (auth required)
- `PATCH  /users/update-cover-image` — Update cover image (auth required)
- `GET    /users/current-user` — Get current user profile (auth required)
- `GET    /users/c/:username` — Get channel profile by username (auth required)
- `GET    /users/history` — Get user watch history (auth required)

### Videos
- `POST   /videos/` — Upload a new video (with thumbnail, auth required)
- `GET    /videos/` — List all videos
- `POST   /videos/v/update/:videoId` — Update video details
- `GET    /videos/v/:videoId` — Get a single video
- `DELETE /videos/v/:videoId` — Delete a video
- `POST   /videos/v/publish/:videoId` — Toggle publish status
- `POST   /videos/v/views/:videoId` — Increment video views
- `POST   /videos/v/history/:videoId` — Add video to watch history

### Playlists
- `POST   /playlists/` — Create a playlist
- `GET    /playlists/p/user/:userId` — Get user's playlists
- `GET    /playlists/p/:playlistId` — Get playlist by ID
- `PATCH  /playlists/p/add/:playlistId/:videoId` — Add video to playlist
- `PATCH  /playlists/p/remove/:playlistId/:videoId` — Remove video from playlist
- `DELETE /playlists/p/delete/:playlistId` — Delete playlist
- `PATCH  /playlists/p/update/:playlistId` — Update playlist

### Comments
- `POST   /comments/c/:videoId` — Add comment to video
- `GET    /comments/c/:videoId` — Get all comments for a video
- `POST   /comments/c/update/:commentId` — Update comment
- `GET    /comments/c/delete/:commentId` — Delete comment

### Likes
- `GET    /likes/l/video/:videoId` — Like/unlike a video
- `GET    /likes/l/comment/:commentId` — Like/unlike a comment
- `GET    /likes/l/tweet/:tweetId` — Like/unlike a tweet
- `GET    /likes/` — Get liked videos

### Subscriptions
- `GET    /subscriptions/s/:channelId` — Subscribe/unsubscribe to a channel
- `GET    /subscriptions/s/subscribers/:channelId` — Get channel subscribers
- `GET    /subscriptions/s/channels/:subscriberId` — Get channels a user is subscribed to

### Tweets
- `POST   /tweets/` — Create a tweet
- `GET    /tweets/` — Get user's tweets
- `POST   /tweets/t/:tweetId` — Update a tweet
- `GET    /tweets/t/:tweetId` — Delete a tweet

### Dashboard
- `GET    /dashboard/` — Get channel statistics
- `GET    /dashboard/videos` — Get channel videos

### Health Check
- `GET    /healthcheck/` — Check API health

## License
Licensed By Chai aur Backend

---
This project is for learning and practice purposes only. Contributions and suggestions are welcome!