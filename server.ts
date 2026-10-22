import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// Initialize Google GenAI client if key exists
let ai: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Emergency Crisis Resources Data
const CRISIS_HELPLINES = [
  {
    country: 'India',
    flag: '🇮🇳',
    resources: [
      {
        name: 'Tele-MANAS (Govt. of India 24/7 National Mental Health Helpline)',
        number: '14416 / 1800-891-4416',
        tollFree: true,
        hours: '24/7',
        description: 'Free, confidential tele-mental health support across all Indian states in 20+ regional languages.',
      },
      {
        name: 'KIRAN (Govt. of India Mental Health Rehabilitation)',
        number: '1800-599-0019',
        tollFree: true,
        hours: '24/7',
        description: 'Ministry of Social Justice 24/7 mental health helpline for anxiety, distress & suicide prevention.',
      },
      {
        name: 'Vandrevala Foundation Helpline',
        number: '+91 9999 666 555',
        tollFree: false,
        hours: '24/7',
        description: 'Free counseling support by trained clinical psychologists and counselors.',
      },
      {
        name: 'AASRA Suicide Prevention Helpline',
        number: '+91 98204 66726',
        tollFree: false,
        hours: '24/7',
        description: 'Crisis intervention and suicide prevention helpline.',
      },
    ],
  },
  {
    country: 'United States & Canada',
    flag: '🇺🇸 🇨🇦',
    resources: [
      {
        name: '988 Suicide & Crisis Lifeline',
        number: '988 (Call or Text)',
        tollFree: true,
        hours: '24/7',
        description: 'Free and confidential support for people in distress, prevention and crisis resources.',
      },
      {
        name: 'Crisis Text Line',
        number: 'Text HOME to 741741',
        tollFree: true,
        hours: '24/7',
        description: 'Free 24/7 text support with trained crisis counselors.',
      },
      {
        name: 'The Trevor Project (LGBTQ Youth)',
        number: '1-866-488-7386 or Text START to 678-678',
        tollFree: true,
        hours: '24/7',
        description: 'Confidential suicide prevention and crisis intervention for LGBTQ young people.',
      },
    ],
  },
  {
    country: 'United Kingdom',
    flag: '🇬🇧',
    resources: [
      {
        name: 'NHS Mental Health Services',
        number: '111',
        tollFree: true,
        hours: '24/7',
        description: 'Call 111 for urgent mental health assessment and NHS crisis team support.',
      },
      {
        name: 'Samaritans',
        number: '116 123',
        tollFree: true,
        hours: '24/7',
        description: 'Whatever you are going through, a Samaritan will face it with you 24/7.',
      },
    ],
  },
  {
    country: 'International / Worldwide',
    flag: '🌍',
    resources: [
      {
        name: 'Befrienders Worldwide',
        number: 'befrienders.org',
        tollFree: true,
        hours: '24/7',
        description: 'Find a confidential helpline near your country across 30+ nations.',
      },
      {
        name: 'Find A Helpline',
        number: 'findahelpline.com',
        tollFree: true,
        hours: '24/7',
        description: 'Free, confidential support from local crisis centers around the globe.',
      },
    ],
  },
];

// Helper to check for crisis keywords
function detectCrisisRisk(text: string): boolean {
  const normalized = text.toLowerCase();
  const crisisPatterns = [
    /\b(kill|ending?)\s+(my\s*life|myself)\b/,
    /\bend(ing)?\s+(it\s+all|everything|my\s*life)\b/,
    /\bhurt(ing)?\s+myself\b/,
    /\bharm(ing)?\s+myself\b/,
    /\bself[\s-]harm\b/,
    /\bsuicid(e|al)\b/,
    /\bwant to (die|disappear|end my life|not exist)\b/,
    /\bno reason to live\b/,
    /\bdon'?t want to (wake up|live|be here)\b/,
    /\bbetter off (without me|dead)\b/,
    /\bcan'?t go on\b/,
    /\bcutting myself\b/,
  ];
  return crisisPatterns.some((pattern) => pattern.test(normalized));
}

// System instruction for MindCare AI
const MINDCARE_SYSTEM_INSTRUCTION = `You are MindCare AI, a gentle, compassionate, and empathetic mental wellness and emotional support companion.

Core Guidelines:
1. Tone: Warm, grounded, calming, validating, and completely non-judgmental. Avoid clinical coldness, excessive jargon, or toxic positivity.
2. Approach:
   - Validate the user's emotional experience first ("It is completely understandable to feel overwhelmed by that...").
   - Offer practical, evidence-based coping micro-tools (e.g., Box breathing 4-4-4, 5-4-3-2-1 sensory grounding, cognitive reframing, bedtime wind-down, gentle self-compassion).
   - Ask 1 gentle, reflective open question to help the user unpack what they are carrying, unless they are in acute distress.
3. Crucial Boundaries & Safety Protocol:
   - You are an emotional support companion, NOT a medical doctor, psychiatrist, or licensed clinical therapist.
   - Do NOT provide medical diagnoses (e.g., "You have Major Depressive Disorder") or prescribe medication or dosages.
   - If the user expresses thoughts of suicide, severe self-harm, or immediate danger:
     a) Immediately respond with deep warmth, care, and seriousness.
     b) Encourage them to stay safe and reach out right now to a trusted person or emergency services.
     c) Provide immediate helpline options:
        - In India: Tele-MANAS (14416 / 1800-891-4416, 24/7 toll-free) or AASRA (+91 98204 66726).
        - In the US/Canada: 988 Suicide & Crisis Lifeline (call/text 988) or Crisis Text Line (Text HOME to 741741).
        - In the UK: NHS 111 or Samaritans (116 123).
        - International: findahelpline.com
     d) Clearly remind them: "You matter, and there is support available right now. Please connect with someone who can support you in this moment."
4. Format:
   - Keep answers readable, structured, and easy to absorb (use short paragraphs, optional subtle bullet points for coping steps).
   - Do not overwhelm someone who is feeling anxious or tired with walls of text. Keep responses around 100-220 words unless deeper reflection is requested.`;

// API Routes
app.get('/api/helplines', (_req, res) => {
  res.json({ helplines: CRISIS_HELPLINES });
});

app.post('/api/chat', async (req, res) => {
  try {
    const { message, history = [], topic = 'general' } = req.body;

    if (!message || typeof message !== 'string') {
      res.status(400).json({ error: 'Message is required.' });
      return;
    }

    const isCrisis = detectCrisisRisk(message);

    // If no Gemini key is provided, return rich empathetic fallback with crisis safety
    if (!ai) {
      let fallbackReply = `I hear you, and thank you for trusting me with this. `;

      if (isCrisis) {
        fallbackReply = `I care about your safety deeply, and I want to make sure you get the support you deserve right now. Please know you are not alone and things can get better.

Please reach out immediately to a trusted friend, family member, or a free, confidential crisis professional:
• In India: Tele-MANAS (14416 / 1800-891-4416) or AASRA (+91 98204 66726)
• In US/Canada: Call or text 988 (Lifeline) or text HOME to 741741
• In UK: Call 111 (NHS) or 116 123 (Samaritans)
• International: visit findahelpline.com

Please connect with someone right away. You matter.`;
      } else {
        const fallbacks: Record<string, string> = {
          stress: `It sounds like things are weighing heavily on you today. Stress often signals that you've been carrying too much for too long. Let's take a slow, deep breath together right now. What feels like the heaviest thing on your plate at this moment?`,
          overthinking: `Overthinking is exhausting—it’s like a browser with 50 tabs open in your mind. A quick grounding check: can you name three physical objects around you right now? Let's bring your awareness back to the present moment, one step at a time.`,
          sleep: `Preparing for sleep when your mind is racing is tough. Try dimming your screen, placing one hand on your chest and one on your belly, and taking three slow 4-count breaths. Would you like to try a short body scan exercise before sleeping?`,
          relationships: `Relationships can stir up our deepest emotions. Taking a pause to identify your own needs and boundaries before reacting is often very empowering. What part of the situation feels most challenging for you right now?`,
          general: `I'm here with you. Whatever you're going through, it's valid, and you don't have to navigate it alone. Take all the time you need—what has been on your mind lately?`,
        };
        fallbackReply = fallbacks[topic] || fallbacks.general;
      }

      res.json({
        reply: fallbackReply,
        crisisDetected: isCrisis,
        model: 'mindcare-offline-empathetic',
      });
      return;
    }

    // Format chat contents for Gemini
    const contents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];

    // Add recent history (up to last 6 messages)
    const recentHistory = Array.isArray(history) ? history.slice(-6) : [];
    for (const msg of recentHistory) {
      if (msg.role === 'user' || msg.role === 'model') {
        contents.push({
          role: msg.role,
          parts: [{ text: msg.content || msg.text || '' }],
        });
      }
    }

    // Add current user message with topic context
    const enrichedPrompt = topic && topic !== 'general'
      ? `[Context Topic: ${topic}] ${message}`
      : message;

    contents.push({
      role: 'user',
      parts: [{ text: enrichedPrompt }],
    });

    // Call Gemini with an 8-second timeout guard
    const generatePromise = ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents,
      config: {
        systemInstruction: MINDCARE_SYSTEM_INSTRUCTION,
        temperature: 0.7,
        topP: 0.9,
      },
    });

    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('Model generation timeout (high demand)')), 7500)
    );

    const response = await Promise.race([generatePromise, timeoutPromise]);
    const reply = response.text || "I am here with you. Take a slow breath, and whenever you're ready, let me know what you'd like to talk through.";

    res.json({
      reply,
      crisisDetected: isCrisis,
      model: 'gemini-3.8-flash',
    });
  } catch (error: any) {
    console.error('Error generating AI response:', error);

    // Crisis detection in user message even if API threw error
    const isCrisis = detectCrisisRisk(req.body?.message || '');
    let fallbackReply = `I hear you, and thank you for taking this moment to share what is on your heart. Even when there's high demand on the network, please know you are supported and what you are feeling is valid.

Let's pause together for a gentle 4-second breath. What is one small, kind thing you could do for yourself right now?`;

    if (isCrisis) {
      fallbackReply = `I care about your safety deeply, and I want to make sure you get the support you deserve right now. Please know you are not alone and things can get better.

Please reach out immediately to a trusted friend, family member, or a free, confidential crisis professional:
• In India: Tele-MANAS (14416 / 1800-891-4416) or AASRA (+91 98204 66726)
• In US/Canada: Call or text 988 (Lifeline) or text HOME to 741741
• In UK: Call 111 (NHS) or 116 123 (Samaritans)
• International: visit findahelpline.com

Please connect with someone right away. You matter.`;
    }

    res.json({
      reply: fallbackReply,
      crisisDetected: isCrisis,
      model: 'mindcare-fallback',
      notice: 'Served with care during temporary high network demand.',
    });
  }
});

async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`MindCare server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
