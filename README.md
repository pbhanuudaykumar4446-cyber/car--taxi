# CarTaxi - Taxi Management System

A premium full-stack taxi management application built with React (Frontend) and Django (Backend).

## 🚖 Features

### 👤 Passenger Portal
- **Advanced Maps**: Interactive route selection using Leaflet & OpenStreetMap.
- **Smart Routing**: Automatic distance (KM) and travel time estimation.
- **Booking Flow**: Real-time vehicle selection with dynamic pricing.
- **Secure Auth**: Standard Username/Password authentication with session persistence.

### 🛠 Admin Dashboard
- **Fleet Management**: Add, remove, and monitor the entire taxi fleet with real-time status.
- **Driver Tracking**: Manage a pool of drivers and track their ratings/trips.
- **Booking Approval**: Review and accept/reject passenger ride requests.
- **Analytics**: Visualized revenue and booking trends.

## 🚀 Tech Stack

- **Frontend**: React, Vite, Tailwind CSS (Design Foundation), Leaflet (Maps).
- **Backend**: Python, Django, Django REST Framework.
- **Database**: SQLite (Default).

## 🛠 Installation & Setup

### 1. Backend Setup
```bash
cd backend
python -m venv venv
# Activate venv:
# Windows: .\venv\Scripts\activate
# Mac/Linux: source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python seed.py # Optional: Seeds 15 cars and 15 drivers
python manage.py runserver
```

### 2. Frontend Setup
```bash
cd cartaxi
npm install
npm run dev
```

## 🔐 Credentials
- **Admin**: `admin` / `admin123`
- **Demo User**: Create a new account via the Sign Up page.

## 📍 Environment Requirements
- Python 3.10+
- Node.js 18+
