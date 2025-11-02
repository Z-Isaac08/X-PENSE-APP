// Backend Proxy pour Groq API
// Sécurise la clé API et ajoute rate limiting

import Groq from 'groq-sdk';

// Initialiser Groq avec la clé API (sécurisée côté serveur)
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

// Rate limiting simple (en mémoire)
const requestCounts = new Map();
const RATE_LIMIT = 30; // 30 requêtes par heure par IP
const WINDOW_MS = 60 * 60 * 1000; // 1 heure

function checkRateLimit(ip) {
  const now = Date.now();
  const userRequests = requestCounts.get(ip) || [];
  
  // Nettoyer les anciennes requêtes
  const recentRequests = userRequests.filter(time => now - time < WINDOW_MS);
  
  if (recentRequests.length >= RATE_LIMIT) {
    return false;
  }
  
  recentRequests.push(now);
  requestCounts.set(ip, recentRequests);
  return true;
}

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Seulement POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Rate limiting par IP
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    if (!checkRateLimit(ip)) {
      return res.status(429).json({ 
        error: 'Trop de requêtes. Veuillez réessayer dans 1 heure.' 
      });
    }

    // Récupérer les messages
    const { messages, temperature, maxTokens } = req.body;

    // Validation
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Messages invalides' });
    }

    // Limiter la taille du contexte (éviter abus)
    if (messages.length > 20) {
      return res.status(400).json({ error: 'Trop de messages dans le contexte' });
    }

    // Appeler Groq
    const completion = await groq.chat.completions.create({
      messages,
      model: 'llama-3.3-70b-versatile',
      temperature: temperature || 0.7,
      max_tokens: Math.min(maxTokens || 1500, 2000), // Max 2000 tokens
      top_p: 1,
      stream: false
    });

    // Retourner la réponse
    res.status(200).json({
      content: completion.choices[0]?.message?.content || '',
      tokensUsed: completion.usage?.total_tokens
    });

  } catch (error) {
    console.error('Groq API Error:', error);
    
    // Gérer les erreurs Groq
    if (error.status === 429) {
      return res.status(429).json({ 
        error: 'Limite de requêtes atteinte. Réessayez dans quelques instants.' 
      });
    }
    
    res.status(500).json({ 
      error: 'Erreur lors de la communication avec l\'IA' 
    });
  }
}
