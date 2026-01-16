# Clout

Clout is a mobile photo competition app where users submit photos, vote anonymously on image pairs and view results through a continuous daily competition cycle.

The project focuses on mobile-first architecture, fair voting mechanics and scalable backend design.

---

## Features

- Daily photo competitions with a rolling three-day cycle
- Anonymous image submissions and voting
- Pairwise voting (two images at a time, no repeated pairs for the same user)
- Unlimited voting with fair ranking logic
- TrueSkill-based ranking system for competition results
- Images are revealed only after a competition ends
- User profiles showing completed competition entries
- Admin dashboard for managing competitions and content

---

## Competition Flow

**Day 1 – Submit**  
Users take and submit a photo to the active competition.

**Day 2 – Vote**  
Users vote on anonymous image pairs from the previous day. The same image pair cannot be voted on twice by the same user.

**Day 3 – Results**  
The leaderboard reveals the winner and top 100 entries from two days ago and images become visible on user profiles.

Multiple competitions run in parallel to ensure continuous engagement.

---

## Tech Stack

### Mobile App
- React Native (Expo, TypeScript)
- Redux Toolkit
- React Navigation
- Reanimated & Gesture Handler

### Backend
- FastAPI
- PostgreSQL
- SQLAlchemy 2.0
- Alembic

### Admin Dashboard
- React (TypeScript)
- Material UI
- REST API integration

### Infrastructure
- Docker
- Docker Compose
- REST API

---

## Project Goals

- Build a production-style mobile application
- Practice scalable backend and database design
- Implement fair and anonymous voting mechanics
- Gain hands-on experience with React Native, FastAPI, and TrueSkill-based systems

---

## Status

🚧 Work in progress



## Some commands

# Migrations
docker-compose exec backend python manage.py makemigrations users
docker-compose exec backend python manage.py migrate

# Docker
docker-compose up --build