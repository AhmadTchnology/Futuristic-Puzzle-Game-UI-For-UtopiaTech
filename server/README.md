# Backend Server Setup

This directory contains the backend server for the Futuristic Puzzle Game UI.

## Prerequisites

- Node.js installed
- PostgreSQL installed and running

## Setup

1.  **Install Dependencies**:
    Navigate to this `server` directory and install dependencies:
    ```bash
    cd server
    npm install
    ```

2.  **Database Configuration**:
    - Create a `.env` file in this `server` directory by copying `.env.example`:
      ```bash
      cp .env.example .env
      ```
    - Open `.env` and fill in your PostgreSQL database credentials:
      ```env
      DB_USER=your_db_user
      DB_HOST=localhost
      DB_NAME=your_db_name
      DB_PASSWORD=your_db_password
      DB_PORT=5432
      PORT=3001
      ```

3.  **Database Schema**:
    Ensure your PostgreSQL database has a `leaderboard` table with the following columns:
    - `id` (SERIAL PRIMARY KEY)
    - `operator_name` (VARCHAR)
    - `score` (INTEGER)
    - `time_completed` (VARCHAR)
    - `created_at` (TIMESTAMP DEFAULT CURRENT_TIMESTAMP)

    Example SQL to create the table:
    ```sql
    CREATE TABLE leaderboard (
        id SERIAL PRIMARY KEY,
        operator_name VARCHAR(255) NOT NULL,
        score INTEGER NOT NULL,
        time_completed VARCHAR(50) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    ```

## Running the Server Locally

To start the server, run the following command from the `server` directory:

```bash
npm start
```

The server will start on `http://localhost:3001`.

## Deployment with Coolify

This project is configured for deployment with **Coolify**.

1.  **Push to Git**:
    Ensure your project (including the `server` directory, `server/package.json`, and `server/Dockerfile`) is pushed to your Git repository.

2.  **Create Resource in Coolify**:
    -   Go to your Coolify dashboard.
    -   Select **+ New Resource** -> **Application** -> **From Git**.
    -   Select your repository and branch.

3.  **Configuration**:
    -   **Build Pack**: Select **Docker** (it should automatically detect the `server/Dockerfile`).
    -   **Base Directory**: Set to `/server`.
    -   **Ports Exposes**: Set to `3001`.
    -   **Domains**: Set your custom domain (e.g., `https://api.yourdomain.com`). Coolify will handle the Traefik proxy and SSL automatically.

4.  **Environment Variables**:
    In the Coolify project settings, add the following environment variables:
    -   `DB_USER`: Your PostgreSQL user.
    -   `DB_HOST`: Your PostgreSQL host (if using a Coolify-managed database, use the internal service name).
    -   `DB_NAME`: Your database name.
    -   `DB_PASSWORD`: Your database password.
    -   `DB_PORT`: `5432`.
    -   `PORT`: `3001`.

5.  **Deploy**:
    Click **Deploy**.

## Frontend Configuration for Production

Once your backend is deployed:

1.  Update your frontend's `.env.local` (or build environment variables) to point to your deployed backend URL:
    ```env
    VITE_API_URL=https://api.yourdomain.com/api/leaderboard
    ```
