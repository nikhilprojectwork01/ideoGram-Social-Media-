Instagram Clone

Overview

This is a full-stack Instagram Clone built using the MERN stack. It includes real-time messaging, a follow/unfollow system, photo uploads via Cloudinary, comments, and authentication using Redux.

Features

User Authentication: Login and Signup with Redux.

Post Management:

Upload photos via Cloudinary.

Like and comment on posts.

Real-Time Messaging: Chat with other users using Socket.io.

Follow/Unfollow Users: Manage connections between users.

Responsive UI: Designed for  desktop 

Tech Stack

Frontend: React, Redux, TailwindCSS

Backend: Node.js, Express.js

Database: MongoDB

Real-Time Communication: Socket.io

Image Storage: Cloudinary

Authentication: JWT (JSON Web Token)

Installation

1. Clone the repository



2. Install dependencies

Backend

cd server
npm install

Frontend

cd client
npm install

3. Set up environment variables

Create a .env file in the server directory and add:

MONGO_URI=your_mongodb_connection_string
SECRET_KEY=your_secret_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

4. Run the project

Start Backend

cd server
npm start

Start Frontend
cd client
npm start
