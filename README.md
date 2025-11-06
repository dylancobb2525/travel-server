# Travel Destinations Server

A Node.js/Express server that provides travel destination data via REST API.

## Features

- RESTful API endpoints for travel destinations
- Beautiful styled landing page showing available API endpoints
- CORS enabled for cross-origin requests
- JSON data for 12 popular travel destinations worldwide

## Installation

1. Install dependencies:
```bash
npm install
```

2. Add images to the `public/images/` folder (see public/images/README.md for required image names)

## Running the Server

Start the server:
```bash
npm start
```

Or:
```bash
node server.js
```

The server will run on `http://localhost:3004`

## API Endpoints

### Get All Destinations
```
GET /api/destinations
```
Returns an array of all travel destinations.

### Get Single Destination
```
GET /api/destinations/:id
```
Returns a single destination by ID (1-12).

## Data Structure

Each destination includes:
- `_id`: Unique identifier
- `name`: Destination name
- `description`: Brief description
- `country`: Country name
- `continent`: Continent
- `best_time`: Best time to visit
- `main_image`: Path to image
- `highlights`: Array of main attractions

## Deployment

This server can be deployed to Render, Heroku, or any Node.js hosting platform.

For Render:
1. Push to GitHub
2. Create new Web Service on Render
3. Connect your repository
4. Set build command: `npm install`
5. Set start command: `node server.js`

## Client Integration

To use this API in your React app:

```javascript
// Fetch all destinations
fetch('http://localhost:3004/api/destinations')
  .then(response => response.json())
  .then(data => console.log(data));

// Fetch single destination
fetch('http://localhost:3004/api/destinations/1')
  .then(response => response.json())
  .then(data => console.log(data));
```

