# Omegalol Chat Application

A real-time, anonymous chat app inspired by Omegle. Built with Next.js, Redis, Socket.IO, PostgreSQL (Prisma ORM), and Docker.


## Tech Stack

- **Frontend**: Next.js 15 (App Router), Tailwind CSS
- **Backend**: Node.js, Express, Socket.IO
- **Database**: PostgreSQL (with Prisma ORM)
- **Auth**: JWT + HTTP-only cookies
- **Caching, Redisearch, realtime changes**: Redis
- **Containerization**: Docker & Docker Compose (multi-compose setup)
Optionally:
- **Reverse Proxy + SSL**: Nginx + Certbot


## Folder Structure

- `/client` – Frontend app (Next.js)
- `/server` – Express backend for Socket.IO
- `/shared` – Shared types and Prisma schema


## Setup (Development)

1. Clone the repo  
2. Copy `.env.example` to `.env` in `/client`, `/server`, and `/shared`
3. In `/client`, rename `.env.example` to `.env.docker.local`
4. In `/server`, rename `.env.example` to `.env.docker`
5. In `/shared`, rename `.env.example` to `.env`
6. Manually  run `npm i` in `/shared`
7. In `/shared`, rename `.env.example` to `.env`
8. In `shared`,  run `npx prisma generate dev`
8. Run with Docker Compose:
   ```bash
   docker compose -f docker-compose.yml -f docker-compose-prod.yml up --build

## Note
It is a large project, it might take up to a few minutes for the containers to build (especially the first time when there is no cache).

