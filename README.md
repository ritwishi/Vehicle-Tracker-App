# 🚗 Vehicle Tracker App - Real-Time Map Simulation

A modern, interactive web application that simulates real-time vehicle movement on a map with complete route tracking, speed calculation, and playback controls.




## ✨ Features

### Core Functionality
- 🗺️ **Interactive Map** - Powered by Leaflet with OpenStreetMap tiles
- 🚗 **Real-time Vehicle Tracking** - Smooth marker animation along predefined routes
- 📊 **Live Metadata Display** - Real-time coordinates, speed, timestamp, and ETA
- ⏯️ **Playback Controls** - Play, pause, and reset simulation
- 🎚️ **Speed Control** - Adjustable simulation speed (0.67x to 4x)
- 📈 **Progress Tracking** - Visual progress bar and percentage display

### Advanced Features
- 📍 **Route Visualization** - Complete route in gray, traveled route in red
- 🏁 **Start/End Markers** - Clear visual indicators for route endpoints
- 🧮 **Haversine Distance Calculation** - Accurate GPS-based distance measurements
- ⚡ **Speed Calculation** - Real-time km/h calculation based on distance and time
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile devices
- 🎨 **Modern UI** - Clean interface built with Tailwind CSS

---

## 🎥 Demo

**Live Application:** Running on https://ritwishi.github.io/Vehicle-Tracker-App/

**Screenshot:**
```
Map displays with:
- 🚗 Vehicle marker (animated)
- 🏁 Start marker
- 🎯 End marker
- Gray dashed line (complete route)
- Red solid line (traveled path)
- Control panel (top-right corner)
```

---

## 🛠️ Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 18.2.0+ | Frontend framework for building UI |
| **Vite** | 5.0.8+ | Lightning-fast build tool and dev server |
| **Leaflet** | 1.9.4 | Interactive map library |
| **React-Leaflet** | 4.2.1+ | React components for Leaflet |
| **Tailwind CSS** | 3.4.0+ | Utility-first CSS framework |
| **PostCSS** | 8.4.32+ | CSS processing tool |
| **Autoprefixer** | 10.4.21+ | Automatically adds vendor prefixes |

---

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16.x or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn**
- **Git** (optional, for version control)
- A modern web browser (Chrome, Firefox, Safari, Edge)

**Check your installations:**
```bash
node --version  # Should show v16.x or higher
npm --version   # Should show 8.x or higher
```

---

## 🚀 Installation

### Step 1: Clone or Create Project

```bash
# If you have the repository
git clone https://github.com/yourusername/vehicle-tracker-app.git
cd vehicle-tracker-app

# Or create from scratch
npm create vite@latest vehicle-tracker-app -- --template react
cd vehicle-tracker-app
```

### Step 2: Install Dependencies

```bash
# Install all required packages
npm install

# Install mapping libraries
npm install leaflet react-leaflet

# Install Tailwind CSS (v3 recommended)
npm install -D tailwindcss@^3.4.0 postcss autoprefixer

# Initialize Tailwind configuration
npx tailwindcss init -p
```

### Step 3: Set Up Configuration Files

**tailwind.config.js:**
```javascript
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

**src/index.css:**
```css
@import 'leaflet/dist/leaflet.css';

@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  margin: 0;
  padding: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
}

.leaflet-marker-pane > * {
  transition: transform 0.3s linear;
}

.loading-spinner {
  border: 4px solid #f3f4f6;
  border-top: 4px solid #3b82f6;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
```

### Step 4: Create Project Structure

```bash
# Create necessary directories
mkdir -p src/components src/utils
```

### Step 5: Add Route Data

Create `public/dummy-route.json` with your route coordinates:

```json
[
  {
    "latitude": 17.385544,
    "longitude": 78.487471,
    "timestamp": "2024-07-20T10:00:00Z"
  },
  {
    "latitude": 17.385694,
    "longitude": 78.487591,
    "timestamp": "2024-07-20T10:00:10Z"
  }
  // Add more points...
]
```

### Step 6: Start Development Server

```bash
npm run dev
```

Open your browser to `http://localhost:5173`

---

## 📁 Project Structure

```
vehicle-tracker-app/
├── node_modules/           # Dependencies
├── public/
│   └── dummy-route.json   # Route data (25 GPS points)
├── src/
│   ├── components/
│   │   ├── VehicleMap.jsx # Main map component
│   │   └── Controls.jsx   # Control panel component
│   ├── utils/
│   │   ├── haversine.js   # Distance calculation (Haversine formula)
│   │   └── speed.js       # Speed and ETA calculations
│   ├── App.jsx            # Root component
│   ├── main.jsx           # Entry point
│   └── index.css          # Global styles with Tailwind
├── .gitignore
├── index.html             # HTML template
├── package.json           # Dependencies and scripts
├── package-lock.json      # Locked dependencies
├── postcss.config.js      # PostCSS configuration
├── tailwind.config.js     # Tailwind CSS configuration
├── vite.config.js         # Vite build configuration
└── README.md              # This file
```

---

## 🎯 How It Works

### 1. Data Loading
- On component mount, `VehicleMap.jsx` fetches `dummy-route.json` from the public folder
- Route data is transformed into Leaflet-compatible format `{ lat, lng, timestamp }`

### 2. Map Rendering
- **Leaflet** renders an interactive map with OpenStreetMap tiles
- Map automatically fits bounds to show the entire route
- Three types of markers are placed:
  - 🏁 Start point
  - 🎯 End point
  - 🚗 Current vehicle position

### 3. Route Visualization
- **Gray dashed line**: Shows the complete planned route
- **Red solid line**: Shows the traveled portion (updates dynamically)

### 4. Animation Loop
- Uses `setInterval` with React hooks (`useState`, `useEffect`, `useRef`)
- Every 2 seconds (configurable), `currentIndex` increments
- Vehicle marker smoothly transitions to new position via CSS
- Cleanup prevents memory leaks when component unmounts

### 5. Speed Calculation
- **Haversine Formula** calculates distance between consecutive GPS points
- Time difference extracted from timestamps
- Speed = Distance (km) / Time (hours)
- Displayed in real-time on the control panel

### 6. User Controls
- **Play**: Starts the simulation
- **Pause**: Stops at current position
- **Reset**: Returns to start
- **Speed Slider**: Adjusts animation speed (500ms to 3000ms intervals)

---

## ⚙️ Configuration

### Customize Map Location

Edit `src/components/VehicleMap.jsx`:

```javascript
const INITIAL_CENTER = [YOUR_LATITUDE, YOUR_LONGITUDE];
```

### Adjust Simulation Speed

Change default speed (in milliseconds):

```javascript
const [simulationSpeed, setSimulationSpeed] = useState(2000); // 2 seconds
```

### Modify Route Data

Edit or replace `public/dummy-route.json` with your own GPS coordinates.

**Format:**
```json
{
  "latitude": 17.385544,
  "longitude": 78.487471,
  "timestamp": "2024-07-20T10:00:00Z"
}
```

### Change Map Tiles

Replace the TileLayer URL in `VehicleMap.jsx`:

```jsx
// OpenStreetMap (default)
url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"

// Dark theme
url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"

// Satellite (requires API key)
url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
```

---

## 💻 Usage

### Running the App

```bash
# Development mode (with hot reload)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```



## 📚 API Documentation

### Key Functions

#### `haversine.js`

**calculateDistanceKm(lat1, lon1, lat2, lon2)**
- Calculates the great-circle distance between two GPS coordinates
- Uses the Haversine formula
- Returns: Distance in kilometers (number)

```javascript
const distance = calculateDistanceKm(17.385, 78.486, 17.386, 78.487);
console.log(distance); // e.g., 0.152 km
```

**calculateBearing(lat1, lon1, lat2, lon2)**
- Calculates the bearing (direction) between two points
- Returns: Bearing in degrees (0-360)

#### `speed.js`

**calculateSpeedKmH(currentIndex, routeData)**
- Calculates vehicle speed based on distance and time
- Returns: Speed in km/h (string, formatted to 2 decimals)

**calculateETA(currentIndex, routeData)**
- Calculates estimated time of arrival
- Returns: Formatted time string (e.g., "4 min" or "1h 23m")

---

## 🐛 Troubleshooting

### Common Issues

#### 1. Map Not Displaying

**Problem:** Blank screen or gray box instead of map

**Solution:**
- Check if Leaflet CSS is imported **first** in `src/index.css`
- Ensure MapContainer has proper height: `className="h-full w-full"`
- Check browser console for errors

#### 2. Markers Not Showing

**Problem:** Vehicle or route markers are invisible

**Solution:**
```javascript
// Add this to VehicleMap.jsx
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});
```

#### 3. Route Data Not Loading

**Problem:** "Failed to load route data" error

**Solution:**
- Verify `dummy-route.json` exists in the `public` folder
- Check JSON syntax is valid (use a JSON validator)
- Ensure fetch URL is `/dummy-route.json` (not `./public/`)

#### 4. CSS Import Error

**Problem:** `@import must precede all other statements`

**Solution:**
Move Leaflet import to the **first line** of `src/index.css`:
```css
@import 'leaflet/dist/leaflet.css';

@tailwind base;
@tailwind components;
@tailwind utilities;
```

#### 5. Tailwind Not Working

**Problem:** Utility classes not applying styles

**Solution:**
```bash
# Reinstall Tailwind v3
npm uninstall tailwindcss
npm install -D tailwindcss@^3.4.0
npx tailwindcss init -p
```

#### 6. Animation Choppy

**Problem:** Vehicle movement is jerky

**Solution:**
- Ensure CSS transitions are applied in `index.css`
- Reduce simulation speed (increase milliseconds)
- Check browser performance (close other tabs)

#### 7. Vehicle Goes Through Buildings

**Problem:** Route doesn't follow roads

**Solution:**
- Current implementation uses straight-line dummy data
- To follow actual roads, integrate a routing API:
  - **OpenRouteService** (free): https://openrouteservice.org
  - **Mapbox Directions API**: https://www.mapbox.com
  - **Google Maps Directions API**: https://developers.google.com/maps/documentation/directions

---

## 🔧 Advanced Configuration

### Add Real Road Routing

Install routing service:

```javascript
// src/utils/routeService.js
export async function fetchRealRoute(start, end, apiKey) {
  const url = `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${apiKey}&start=${start[0]},${start[1]}&end=${end[0]},${end[1]}`;
  
  const response = await fetch(url);
  const data = await response.json();
  
  return data.features[0].geometry.coordinates.map((coord, index) => ({
    latitude: coord[1],
    longitude: coord[0],
    timestamp: new Date(Date.now() + index * 10000).toISOString()
  }));
}
```

### Enable Multiple Vehicles

Modify state to support multiple vehicles:

```javascript
const [vehicles, setVehicles] = useState([
  { id: 1, routeData: route1, currentIndex: 0, color: 'red' },
  { id: 2, routeData: route2, currentIndex: 0, color: 'blue' }
]);
```

---

