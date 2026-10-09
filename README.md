# 🌿 WanderWise — AI-Powered Eco Travel Planning Platform

> **Plan smarter. Travel greener. Explore deeper.**

WanderWise is an AI-powered travel planning platform that creates personalized, budget-aware, and weather-conscious travel itineraries based on a user's destination, travel dates, budget, interests, transportation preferences, and accommodation choices.

Instead of manually searching through dozens of websites to plan a trip, WanderWise brings the planning process into one intelligent platform and generates a structured day-by-day travel plan.

---

## ✨ Why WanderWise?

Planning a trip usually requires switching between multiple platforms for:

- 📍 Tourist attractions
- 🌦️ Weather information
- 🗺️ Routes and travel distances
- 🍴 Restaurants
- 🏨 Accommodation
- 💰 Budget planning
- 📅 Daily scheduling

WanderWise combines these requirements into a single AI-assisted travel planning workflow.

The platform considers the user's preferences and generates an itinerary that aims to be:

**Personalized + Budget-conscious + Weather-aware + Location-optimized**

---

# 🚀 Key Features

### 🤖 AI-Powered Trip Generation

Generate a complete itinerary using AI based on:

- Destination
- Starting location
- Travel dates
- Number of travelers
- Budget
- Travel interests
- Transportation preference
- Accommodation preference

---

### 🗓️ Day-by-Day Itinerary

WanderWise organizes the trip into structured daily plans containing:

- Activities
- Recommended attractions
- Suggested timings
- Duration
- Meals
- Estimated daily cost

---

### 🌦️ Weather-Aware Planning

Weather information can be incorporated into itinerary generation.

For example:

```text
Sunny Day
   ↓
Outdoor attractions

Rainy Day
   ↓
Indoor attractions
Restaurants
Museums
🗺️ Smart Location & Route Planning
The platform can use map and location services to consider:
- Distance between places
- Travel time
- Nearby attractions
- Routes
- Geographic grouping of activities
Instead of unnecessarily moving across a city multiple times, nearby locations can be grouped together.
💰 Budget Optimization
WanderWise estimates the overall trip cost by considering:
Transportation
+ Accommodation
+ Food
+ Activities
+ Miscellaneous
-------------------------
Estimated Trip Cost

The AI can also help modify an itinerary when the estimated cost exceeds the user's budget.
🎯 Personalized Travel Style
Users can select interests such as:
- 🌲 Nature
- 🏔️ Adventure
- 🍴 Food
- 📸 Photography
- 🏛️ Culture
- 🛍️ Shopping
- 🏖️ Relaxation
- 💎 Luxury
- 💰 Budget Travel
The generated itinerary adapts to these preferences.
✨ AI Trip Refinement
Users can refine an existing itinerary with options such as:
Make it cheaper
Add more adventure
Make it more relaxing
Add food experiences
Regenerate a day

Instead of creating the entire trip again, the system can modify the required portion.
💾 Save & Manage Trips
Users can:
- Save trips
- View previous trips
- Edit itineraries
- Delete trips
- Manage multiple travel plans
🔗 Trip Sharing
Generated itineraries can be shared with friends or travel companions using a shareable trip link.
📄 Trip Export
Users can export their itinerary as a PDF for offline access while travelling.
🧠 How WanderWise Works
The application follows an AI-assisted travel planning pipeline.
                    👤 USER
                       │
                       ▼
              ┌─────────────────┐
              │  Trip Preferences│
              └────────┬────────┘
                       │
                       ▼
              ┌─────────────────┐
              │ React Frontend  │
              └────────┬────────┘
                       │
                       ▼
              ┌─────────────────┐
              │ Express Backend │
              └────────┬────────┘
                       │
          ┌────────────┼─────────────┐
          │            │             │
          ▼            ▼             ▼
     🗺️ Places      🌦️ Weather    📍 Maps
          │            │             │
          └────────────┼─────────────┘
                       │
                       ▼
              ┌─────────────────┐
              │ AI Trip Planner │
              │    OpenAI API   │
              └────────┬────────┘
                       │
                       ▼
              ┌─────────────────┐
              │ Itinerary       │
              │ Validation &     │
              │ Optimization     │
              └────────┬────────┘
                       │
                       ▼
              ┌─────────────────┐
              │    MongoDB      │
              └────────┬────────┘
                       │
                       ▼
              ┌─────────────────┐
              │ Trip Details UI │
              └─────────────────┘

🔄 Trip Generation Workflow
A typical trip generation request follows this flow:
1. User enters trip preferences
              ↓
2. Frontend validates the form
              ↓
3. Request sent to Express backend
              ↓
4. Backend validates user input
              ↓
5. Travel data is retrieved
              ↓
6. Weather and location information
   are processed
              ↓
7. AI receives structured travel context
              ↓
8. AI generates itinerary JSON
              ↓
9. Backend validates AI response
              ↓
10. Budget and itinerary checks
              ↓
11. Trip stored in MongoDB
              ↓
12. Personalized itinerary displayed

🏗️ Architecture
WanderWise follows a modular full-stack architecture.
┌─────────────────────────────────────────────┐
│                FRONTEND                     │
│                                             │
│ React + Vite + Tailwind CSS                 │
│ React Router + TanStack Query + Zustand     │
└──────────────────────┬──────────────────────┘
                       │
                       │ REST API
                       ▼
┌─────────────────────────────────────────────┐
│                BACKEND                      │
│                                             │
│ Node.js + Express.js                        │
│ Authentication + Trip Management            │
│ API Integration + Business Logic            │
└───────────────┬─────────────┬───────────────┘
                │             │
                │             │
                ▼             ▼
       ┌─────────────┐  ┌──────────────┐
       │  MongoDB    │  │  AI Service  │
       │   Atlas     │  │   OpenAI     │
       └─────────────┘  └──────┬───────┘
                               │
                     ┌─────────┼─────────┐
                     ▼         ▼         ▼
                  Places     Maps      Weather

🛠️ Tech Stack
Frontend
Technology	Purpose
React.js	User interface
Vite	Frontend build tool
Tailwind CSS	Styling
React Router	Routing
Axios	API communication
TanStack Query	Server state management
Zustand	Client state management


Backend
Technology	Purpose
Node.js	Backend runtime
Express.js	REST API framework
Mongoose	MongoDB ODM
JWT	Authentication
bcrypt	Password hashing


AI & External Services
Technology	Purpose
OpenAI API	AI itinerary generation
Google Maps	Maps and routing
Google Places	Places and attractions
Weather API	Weather information


Database & Tools
MongoDB Atlas
Git
GitHub
Postman
VS Code

📂 Project Structure
Trip-Planner/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── features/
│   │   ├── services/
│   │   ├── store/
│   │   ├── hooks/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── .env.example
│   └── package.json
│
├── server/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── middleware/
│   │   ├── utils/
│   │   ├── app.js
│   │   └── server.js
│   │
│   ├── .env.example
│   └── package.json
│
├── .gitignore
└── README.md

🗄️ Database Design
WanderWise uses MongoDB Atlas for storing application data.
Users
User
 ├── name
 ├── email
 ├── password
 └── createdAt

Trips
Trip
 ├── userId
 ├── title
 ├── destination
 ├── startLocation
 ├── startDate
 ├── endDate
 ├── travelers
 ├── budget
 ├── preferences
 ├── estimatedCost
 ├── itinerary
 ├── shareId
 └── createdAt

Saved Places
SavedPlace
 ├── userId
 ├── placeId
 ├── name
 ├── location
 ├── type
 └── rating

🔐 Authentication
WanderWise uses secure authentication with:
User
 ↓
Register
 ↓
Password Hashing
 ↓
MongoDB
 ↓
Login
 ↓
JWT Token
 ↓
Protected Routes

Passwords are never stored as plain text.
🤖 AI Architecture
The AI planning process is designed around structured information rather than sending a simple prompt such as:
"Plan a trip to Goa."

Instead, WanderWise provides the AI with structured context:
{
  "destination": "Goa",
  "days": 4,
  "travelers": 2,
  "budget": 25000,
  "interests": [
    "beaches",
    "food",
    "photography"
  ],
  "transport": "car",
  "accommodation": "budget"
}

Additional travel data can then be supplied:
Places
Weather
Routes
Distances
Travel preferences
Budget constraints

The AI generates a structured itinerary which is then validated by the backend before being stored.
📡 API Structure
Authentication
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me

Trips
POST   /api/trips
GET    /api/trips
GET    /api/trips/:id
PUT    /api/trips/:id
DELETE /api/trips/:id

AI
POST /api/trips/:id/generate
POST /api/trips/:id/regenerate
POST /api/trips/:id/optimize

Places
GET /api/places/search
GET /api/places/:id

Weather
GET /api/weather

Sharing
POST /api/trips/:id/share
GET  /api/shared/:shareId

⚙️ Environment Variables
Backend
Create:
server/.env

PORT=5000

MONGODB_URI=

JWT_SECRET=

OPENAI_API_KEY=

GOOGLE_MAPS_API_KEY=

OPENWEATHER_API_KEY=

CLIENT_URL=http://localhost:5173

Frontend
Create:
client/.env

VITE_API_URL=http://localhost:5000/api

VITE_GOOGLE_MAPS_API_KEY=

⚠️ Never commit .env files or expose secret API keys in the frontend or GitHub repository.

API integration notes:
- `OPENAI_API_KEY` powers itinerary generation and regeneration. The server uses the `gpt-4o-mini` chat model and falls back to a demo itinerary when unavailable.
- `GOOGLE_MAPS_API_KEY` powers geocoding, Places search for attractions/restaurants/hotels, and route distance. Hotel results are Google Places results with estimated nightly prices; this is not a hotel-booking API.
- `OPENWEATHER_API_KEY` powers destination geocoding and forecast data. The server falls back to simulated weather when unavailable.
- `MONGODB_URI` connects the server to MongoDB for users and trips; `JWT_SECRET` signs login tokens; `CLIENT_URL` configures CORS.

💻 Local Development
1. Clone the repository
git clone https://github.com/Haarishcsbs016/Trip-Planner.git

2. Navigate into the project
cd Trip-Planner

3. Install frontend dependencies
cd client
npm install

4. Install backend dependencies
cd ../server
npm install

5. Configure environment variables
Create the required .env files using the .env.example templates.
6. Start the backend
cd server
npm run dev

7. Start the frontend
Open another terminal:
cd client
npm run dev

The application will be available at:
http://localhost:5173

🔒 Security Practices
WanderWise follows basic application security practices:
- JWT-based authentication
- bcrypt password hashing
- Protected API routes
- Environment-based secrets
- Backend-only AI API access
- Input validation
- Centralized error handling
- API key protection
- MongoDB credentials kept outside source code
🌱 Eco-Travel Vision
WanderWise is designed with a broader goal than simply generating itineraries.
Future versions can encourage responsible tourism through:
- 🚆 Public transportation recommendations
- 🚶 Walking-friendly routes
- 🚲 Bicycle-friendly activities
- 🌱 Eco-friendly accommodations
- ♻️ Sustainable travel suggestions
- 🌍 Local experiences
- 📊 Estimated travel carbon footprint
The goal is to help travelers explore more while travelling responsibly.
🔮 Future Enhancements
Planned improvements include:
- 🧑‍🤝‍🧑 Collaborative trip planning
- 💬 AI travel assistant
- 💳 Expense tracking
- 🌍 Multi-country trip planning
- 📍 Real-time location-based recommendations
- 🌱 Carbon footprint estimation
- 🚆 Public transport optimization
- 🔔 Travel reminders
- 📱 Progressive Web App / mobile application
- 🧠 More advanced agentic travel planning
- 🌐 Multi-language support
🎯 Project Goals
WanderWise aims to demonstrate how modern web technologies and generative AI can work together to solve a practical problem.
The project combines:
Full-Stack Development
        +
Generative AI
        +
External APIs
        +
Database Management
        +
Data Processing
        +
Personalization
        +
Travel Optimization

👨‍💻 Developer
Haarish Guru
B.Tech — Computer Science and Business Systems
Built using:
React
Node.js
Express
MongoDB
OpenAI
Tailwind CSS
