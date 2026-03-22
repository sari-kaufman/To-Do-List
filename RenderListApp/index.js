require('dotenv').config();
const express = require('express');

const app = express();
const port = 3000;

app.get('/services', async (req, res) => {
  try {
    // פנייה ישירה לשרת של Render בעזרת המפתח שלך
    const response = await fetch('https://api.render.com/v1/services?limit=20', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${process.env.RENDER_API_KEY}`
      }
    });
    
    const data = await response.json();
    res.json(data); // מחזיר את ה-JSON בדיוק כמו שהמורה ביקשה
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: 'Failed to fetch services' });
  }
});

app.listen(port, () => {
  console.log(`Server is running! Check it here: http://localhost:${port}/services`);
});