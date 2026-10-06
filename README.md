🏗️ GeoClimate 3D — Climate-Adaptive Generative Architectural Platform
> \*\*A Next-Gen AI Architectural \& Spatial Planning Engine for Sustainable, Location-Aware Housing Infrastructure.\*\*
> \*Submitted for National Level Hackathon 2026\*
---
📌 Executive Summary
Urban planning and residential construction often neglect localized micro-climates, solar trajectories, and regional material sustainability. GeoClimate 3D solves this by converting raw land images and location data into fully optimized, climate-resilient 3D architectural floor plans—complete with infrastructure mapping, sustainable material breakdowns, and interactive WebGL renders.
---
🌟 Key Features
📐 Computer Vision Land Segmentation: Automatic boundary detection, terrain profiling, and aspect ratio calculation using OpenCV / Segment Anything Model (SAM).
☀️ Solar Trajectory & Vastu Alignment: Orientation intelligence for cross-ventilation, daylight optimization, and spatial direction compliance.
🌡️ Micro-Climate Profiling: Live integration with weather APIs to extract historical temperature, rain vectors, and solar radiation patterns.
🧱 Sustainable Material Engine: Recommends low-carbon, regionally available construction materials tailored to specific weather stresses.
⚡ Infrastructure Overlays: Auto-generated schematics for electrical layout, solar panel yield, rainwater harvesting, and plumbing routes.
🎨 Interactive 3D Web Visualizer: In-browser WebGL render (`.gltf`/`.glb`) powered by Three.js allowing real-time material toggling and floor plan inspection.
---
🛠️ Tech Stack & Architecture
System Architecture
```
\[ Land Photo / GPS ]
       │
       ▼
\[ Vision \& Geo Engine ] ──► (OpenCV / OpenStreetMap API)
       │
       ▼
\[ Climate Analytics ] ──► (Open-Meteo API / NASA POWER Data)
       │
       ▼
\[ Generative AI Logic ] ──► (Python / LangChain / Gemini API)
       │
       ▼
\[ 3D WebGL Renderer ] ──► (Next.js / React Three Fiber / Three.js)
```
Layer	Technology Used
Frontend UI	Next.js 14, React, Tailwind CSS
3D Rendering	Three.js, React Three Fiber, GLTF Viewer
Computer Vision / AI	Python, FastAPI, OpenCV, PyTorch / SAM
Climate & Map APIs	Open-Meteo REST API, Google Maps / OpenStreetMap API
Database & Storage	Supabase / Firebase
---
🚀 Getting Started
Prerequisites
Node.js: `v18.x` or higher
Python: `v3.10` or higher
Git
Installation
Clone the Repository
```bash
   git clone https://github.com/your-org/geoclimate-3d.git
   cd geoclimate-3d
   ```
Frontend Setup
```bash
   cd client
   npm install
   npm run dev
   ```
Backend Setup
```bash
   cd ../server
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\\Scripts\\activate
   pip install -r requirements.txt
   uvicorn main:app --reload
   ```
Environment Variables
Create a `.env` file in the root directory and add the following keys:
```env
   NEXT\_PUBLIC\_MAPS\_API\_KEY=your\_maps\_key
   OPENAI\_API\_KEY=your\_llm\_key
   DATABASE\_URL=your\_database\_url
   ```
---
📂 Project Structure
```
geoclimate-3d/
├── client/                 # Next.js Frontend \& 3D Canvas
│   ├── components/         # UI \& Three.js Canvas components
│   ├── pages/              # App routes \& Dashboard
│   └── public/models/      # Static 3D mesh assets
├── server/                 # FastAPI Backend Services
│   ├── cv\_engine/          # OpenCV land contour detection
│   ├── climate\_service/    # Open-Meteo \& weather calculations
│   └── prompt\_pipeline/    # LLM layout \& material selection logic
├── docs/                   # Architecture diagrams \& hackathon deck
└── README.md
```
---
📊 Roadmap & Future Scope
[x] Land boundary extraction from uploaded images.
[x] Live micro-climate data fetching via Open-Meteo API.
[x] Generative material matrix based on regional weather constraints.
[x] 3D WebGL mesh rendering and floor navigation.
[ ] AR (Augmented Reality) site placement using WebXR.
[ ] Exportable CAD/BIM drawing files (`.dxf` format).
---
👥 Team
Member	Role	Responsibilities
Team Lead	Full Stack & AI	Architecture, System Design & Integration
Member 2	Frontend & 3D	Next.js UI, Three.js WebGL Rendering
Member 3	CV & Backend	OpenCV Pipeline, Climate API Integration
---
📄 License
Distributed under the MIT License. See `LICENSE` for more information.
