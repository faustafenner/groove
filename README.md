# Groove - Music Review & Album Discovery App

A full-stack music review application built with Next.js and Express.js, featuring Spotify integration, user profiles, album reviews, and crate collections.

## Features

- Search and discover albums via Spotify API
- Rate and review albums
- Create crates (collections) of albums (PRO feature)
- User profiles with customizable avatars
- User authentication with sessions
- PRO membership system
- Follow other users
- Like reviews
- Browse recent reviews and top crates

## Tech Stack

### Frontend

- **Next.js 16.0.7** - React framework with App Router
- **TypeScript** - Type-safe development
- **Redux Toolkit** - State management
- **Bootstrap 5** - UI styling
- **Axios** - HTTP client

### Backend

- **Express.js** - Node.js web framework
- **MongoDB** - NoSQL database
- **express-session** - Session management
- **Spotify Web API** - Music data integration

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- MongoDB database
- Spotify Developer Account (for API credentials)

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd groove
   ```

2. **Install dependencies**

   ```bash
   # Install server dependencies
   cd server
   npm install

   # Install client dependencies
   cd ../client
   npm install
   ```

3. **Environment Setup**

   Create `.env` file in the `server` directory:

   ```env
   MONGODB_URI=your_mongodb_connection_string
   SESSION_SECRET=your_session_secret
   SPOTIFY_CLIENT_ID=your_spotify_client_id
   SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
   PORT=5050
   ```

   Create `.env.local` file in the `client` directory:

   ```env
   NEXT_PUBLIC_HTTP_SERVER=http://localhost:5050
   ```

4. **Run the application**

   Start the backend server:

   ```bash
   cd server
   npm start
   ```

   Start the frontend (in a new terminal):

   ```bash
   cd client
   npm run dev
   ```

   The app will be available at `http://localhost:3000`
