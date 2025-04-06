# Splitr - Receipt Parser App

Splitr is a mobile application that helps users scan and parse receipts, making it easy to split expenses with friends and family.

## Features

- Scan receipts using your device's camera
- Parse receipt data using Google Vision API
- View receipt history
- User authentication and profile management

## Tech Stack

### Frontend
- React Native
- Expo
- TypeScript

### Backend
- Python
- FastAPI
- Google Cloud Vision API

## Getting Started

### Prerequisites
- Node.js (v18 or later)
- npm or yarn
- Python 3.8 or later
- Expo CLI

### Installation

1. Clone the repository
```
git clone https://github.com/yourusername/splitr.git
cd splitr
```

2. Install frontend dependencies
```
npm install
```

3. Install backend dependencies
```
cd backend
pip install -r requirements.txt
```

4. Set up environment variables
Create a `.env` file in the root directory with the following variables:
```
GOOGLE_CLOUD_CREDENTIALS=path/to/your/credentials.json
```

### Running the App

1. Start the backend server
```
cd backend
uvicorn app:app --reload
```

2. Start the frontend
```
npx expo start
```

3. Open the app on your device using the Expo Go app

## Project Structure

```
splitr/
├── app/                  # Expo Router app directory
│   ├── (tabs)/           # Tab navigation screens
│   │   ├── index.tsx     # Home screen
│   │   ├── receipt-parser.tsx  # Receipt scanning screen
│   │   ├── history.tsx   # Receipt history screen
│   │   ├── profile.tsx   # User profile screen
│   │   └── _layout.tsx   # Tab navigation layout
│   └── _layout.tsx       # Root layout
├── assets/               # Images, fonts, etc.
├── components/           # Reusable UI components
├── constants/            # App constants
├── hooks/                # Custom React hooks
├── utils/                # Utility functions
├── backend/              # Python backend
│   ├── app.py            # FastAPI application
│   └── requirements.txt  # Python dependencies
└── package.json          # Node.js dependencies
```

## API Documentation

The FastAPI backend automatically generates interactive API documentation. When the server is running, you can access:

- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## License

This project is licensed under the MIT License - see the LICENSE file for details.
