# The Digital Pulse of Boston

This project is an interactive energy dashboard that visualizes the electricity usage of Boston City Hall. It transforms over 100,000 raw data points from the city's open database into a clean, cinematic story about how our public buildings breathe.

## What is this?
Behind the massive concrete walls of City Hall, electricity flows in patterns that tell a story. This dashboard decodes those patterns into three main views:
1. **Seasonal Shifts**: How the building battles the New England summer heat.
2. **Weekly Rhythms**: The clear difference between the busy workweek and quiet weekends.
3. **Daily Heartbeat**: A 24-hour profile of the building "waking up" and settling down.

## Technical Details
This is a lightweight, client-side web application built with:
* **HTML5 & CSS Grid**: For a modern, responsive, and "dark mode" aesthetic.
* **Vanilla JavaScript**: To parse and process the 100,000+ line CSV dataset for the live dashboard.
* **Chart.js**: To render interactive visualizations.
* **Python (Pandas & Matplotlib)**: Used for initial data analysis and pattern extraction (see `analysis.py`).

## How to Run it
Because the project loads a data file from the folder, you need to view it through a local server to avoid browser security blocks.

1. Open your terminal in this folder.
2. Run this command:
   ```bash
   python3 -m http.server
   ```
3. Open your browser and go to: `http://localhost:8000`

---
**Made by Avanith Kanamarlapudi!**
