import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import admin from 'firebase-admin';
import firebaseConfig from './firebase-applet-config.json' assert { type: 'json' };

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import { getFirestore } from 'firebase-admin/firestore';

// Initialize Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp({
    projectId: firebaseConfig.projectId,
  });
}

const db = firebaseConfig.firestoreDatabaseId && firebaseConfig.firestoreDatabaseId !== '(default)' 
  ? getFirestore(admin.app(), firebaseConfig.firestoreDatabaseId)
  : getFirestore();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Initial Seed Data
  const SEED_DATA: any = {
    gold: { name: 'Gold', symbol: 'XAU', price: 6245.50, prevOpen: 6190.00, prevClose: 6210.25 },
    silver: { name: 'Silver', symbol: 'XAG', price: 78.40, prevOpen: 77.10, prevClose: 77.85 },
    platinum: { name: 'Platinum', symbol: 'XPT', price: 2540.00, prevOpen: 2510.00, prevClose: 2525.50 },
    palladium: { name: 'Palladium', symbol: 'XPD', price: 3120.75, prevOpen: 3080.00, prevClose: 3100.00 },
  };

  // Seed the database if it's empty
  const seedDatabase = async () => {
    const metalsRef = db.collection('metals');
    const snapshot = await metalsRef.limit(1).get();
    if (snapshot.empty) {
      console.log('Seeding database with initial metal data...');
      const batch = db.batch();
      for (const [id, data] of Object.entries(SEED_DATA)) {
        const docRef = metalsRef.doc(id);
        batch.set(docRef, {
          id,
          ...data as any,
          currency: 'INR',
          date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          change: 0,
          changePercent: 0
        });
      }
      await batch.commit();
    }
  };

  await seedDatabase();

  // API Routes
  app.get('/api/metals/:id', async (req, res) => {
    const id = req.params.id;
    
    try {
      const docRef = db.collection('metals').doc(id);
      const doc = await docRef.get();

      if (!doc.exists) {
        return res.status(404).json({ error: 'Metal not found' });
      }

      const baseData = doc.data()!;

      // Simulate live price fluctuations on the server
      const price = baseData.price + (Math.random() - 0.5) * (baseData.price * 0.01);
      const change = price - baseData.prevClose;
      const changePercent = (change / baseData.prevClose) * 100;

      const updatedData = {
        ...baseData,
        price,
        change,
        changePercent: parseFloat(changePercent.toFixed(2)),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
      };

      // Optionally update the doc in background to persist the "live" price
      // await docRef.update(updatedData);

      res.json(updatedData);
    } catch (error) {
      console.error('Error fetching metal data:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Vite integration
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
