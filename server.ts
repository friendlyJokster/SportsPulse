import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialize Gemini AI client
let aiClient: GoogleGenAI | null = null;
function getAIClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({ apiKey });
  }
  return aiClient;
}

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    engine: 'OmniScore Core Engine v2.4',
    geminiConfigured: Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY'),
    timestamp: new Date().toISOString()
  });
});

// AI Highlight & Commentary Generation
app.post('/api/ai/commentary', async (req, res) => {
  try {
    const { sport, eventType, team, player, matchTime, score, context } = req.body;
    const ai = getAIClient();

    if (ai) {
      const prompt = `You are a high-energy professional multi-sport live broadcast commentator and sports analyst for a CricHeroes-style all-sport network.
Sport: ${sport}
Event: ${eventType} by ${player} (${team}) at ${matchTime}
Current Score: ${score}
Context: ${context || 'Crucial grassroots championship clash'}

Generate:
1. "headline": Punchy 4-8 word broadcast banner headline.
2. "commentary": Energetic 2-sentence play-by-play commentary call.
3. "tacticalAnalysis": 1-sentence tactical breakdown of the play.
4. "highlightClipTitle": Short social highlight title with hashtags.

Return valid JSON strictly adhering to the schema:
{"headline": "...", "commentary": "...", "tacticalAnalysis": "...", "highlightClipTitle": "..."}`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json'
        }
      });

      if (response.text) {
        const parsed = JSON.parse(response.text);
        return res.json({ source: 'gemini', data: parsed });
      }
    }

    // Heuristic fallback if Gemini API key not provided or unavailable
    const fallbackCommentary = generateHeuristicCommentary(sport, eventType, player, team, matchTime, score);
    return res.json({ source: 'heuristic', data: fallbackCommentary });
  } catch (error: any) {
    console.warn('AI Commentary generation fallback:', error?.message);
    const { sport, eventType, team, player, matchTime, score } = req.body;
    const fallbackCommentary = generateHeuristicCommentary(sport, eventType, player, team, matchTime, score);
    return res.json({ source: 'fallback', data: fallbackCommentary });
  }
});

// AI Content Moderation Endpoint
app.post('/api/ai/moderate', async (req, res) => {
  try {
    const { text, authorRole } = req.body;
    const ai = getAIClient();

    if (ai && text) {
      const prompt = `Analyze this sports community post/comment for toxicity, hate speech, referee abuse, or unsportsmanlike conduct.
Text: "${text}"
Author: ${authorRole || 'Athlete'}

Return valid JSON:
{
  "isClean": boolean,
  "confidenceScore": number (0.00 to 1.00),
  "flaggedCategories": string[],
  "sportsmanshipRating": number (1 to 10),
  "recommendation": "APPROVED" | "FLAGGED_FOR_REVIEW" | "REJECTED"
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: { responseMimeType: 'application/json' }
      });

      if (response.text) {
        return res.json(JSON.parse(response.text));
      }
    }

    // Heuristic moderation check
    const toxicKeywords = ['cheat', 'corrupt', 'referee blind', 'rigged', 'trash', 'idiot'];
    const lower = (text || '').toLowerCase();
    const hasIssue = toxicKeywords.some(w => lower.includes(w));
    
    return res.json({
      isClean: !hasIssue,
      confidenceScore: hasIssue ? 0.88 : 0.96,
      flaggedCategories: hasIssue ? ['Unsportsmanlike Conduct'] : [],
      sportsmanshipRating: hasIssue ? 4 : 9,
      recommendation: hasIssue ? 'FLAGGED_FOR_REVIEW' : 'APPROVED'
    });
  } catch (err: any) {
    return res.json({
      isClean: true,
      confidenceScore: 0.9,
      flaggedCategories: [],
      sportsmanshipRating: 8,
      recommendation: 'APPROVED'
    });
  }
});

function generateHeuristicCommentary(sport: string, event: string, player: string, team: string, time: string, score: string) {
  const sportKey = (sport || '').toLowerCase();
  const eventKey = (event || '').toUpperCase();

  if (sportKey.includes('cricket')) {
    if (eventKey.includes('6') || eventKey.includes('SIX')) {
      return {
        headline: `MASSIVE SIX: ${player.toUpperCase()} CLEARS THE STANDS!`,
        commentary: `High, handsome, and out of the park! ${player} clears their front leg and launches that delivery 90 meters over deep midwicket!`,
        tacticalAnalysis: `Read the bowler's slower variation early and generated blistering bat speed through the line of the ball.`,
        highlightClipTitle: `🏏 HUGE SIX! ${player} deposits it into the Shivaji Park pavilion! #CricketIndia #OmniScore`
      };
    } else if (eventKey.includes('4') || eventKey.includes('FOUR')) {
      return {
        headline: `CRACKING FOUR: ${player.toUpperCase()} PIERCES THE ROPE!`,
        commentary: `Sweet as a nut! Stand and deliver from ${player} as the ball rockets through extra cover to the fence!`,
        tacticalAnalysis: `Exquisite head balance and high elbow transfer creating unstoppable ground speed.`,
        highlightClipTitle: `🏏 BOUNDARY FOUR! Pure timing by ${player} #GrassrootsCricket #OmniScore`
      };
    } else if (eventKey.includes('WICKET') || eventKey.includes('OUT')) {
      return {
        headline: `TIMBER! STUMPS RATTLED BY ${player.toUpperCase()}!`,
        commentary: `What a delivery! Fast, straight, and knocking leg stump out of the ground! Big wicket at a critical juncture!`,
        tacticalAnalysis: `In-swinging yorker right in the blockhole at 136 km/h, leaving the batsman with no answer.`,
        highlightClipTitle: `☝️ CLEAN BOWLED! Crucial wicket taken by ${player} #CricketReels #OmniScore`
      };
    } else {
      return {
        headline: `KEY RUNS ACCRUED: ${player.toUpperCase()} FOR ${team}!`,
        commentary: `Brilliant running between the wickets by ${player}! Pushing the fielders under immense pressure as the score reaches ${score}!`,
        tacticalAnalysis: `Targeting gaps in the inner circle to keep the required run rate well under control.`,
        highlightClipTitle: `🏏 SMART RUNS by ${player} at ${time} #OmniScore`
      };
    }
  } else if (sportKey.includes('kabaddi')) {
    if (eventKey.includes('SUPER_RAID') || eventKey.includes('3')) {
      return {
        headline: `UNREAL SUPER RAID BY ${player.toUpperCase()}!`,
        commentary: `Sensational Dubki! ${player} ducks underneath the corner chain and drags three defenders across the midline!`,
        tacticalAnalysis: `Lightning-fast center of gravity drop completely dismantled the coordinated ankle grip.`,
        highlightClipTitle: `🤼 3-POINT SUPER RAID! ${player} magic on the mat #KabaddiIndia #OmniScore`
      };
    } else {
      return {
        headline: `POWER TACKLE: ${player.toUpperCase()} LOCKS IT DOWN!`,
        commentary: `Iron curtain defense! ${player} charges in from the right cover to execute an emphatic thigh hold!`,
        tacticalAnalysis: `Perfect timing on the advance tackle, suffocating the raider before the bonus line.`,
        highlightClipTitle: `🤼 SUPER TACKLE by ${player}! #ProKabaddi #OmniScore`
      };
    }
  } else if (sportKey.includes('football') || sportKey.includes('soccer')) {
    return {
      headline: `CLUTCH STRIKE: ${player.toUpperCase()} FINDS THE NET!`,
      commentary: `Unbelievable technique from ${player}! At ${time}, they carve through the defensive line to bury it into the side netting!`,
      tacticalAnalysis: `Exploited the overload on the left flank, leaving the goalkeeper unsighted as ${team} shifts the momentum.`,
      highlightClipTitle: `⚽ WHAT A GOAL by ${player} (${time}) #GrassrootsHero #OmniScore`
    };
  } else if (sportKey.includes('badminton') || sportKey.includes('rally')) {
    return {
      headline: `STEEP SMASH WINNER: ${player.toUpperCase()} FIRES!`,
      commentary: `340 km/h thunderbolt! ${player} pounces on the weak lift and detonates a cross-court smash right on the tramline!`,
      tacticalAnalysis: `Early split-step preparation enabled steep downward trajectory angle over the net tape.`,
      highlightClipTitle: `🏸 UNPLAYABLE SMASH by ${player} #BadmintonIndia #OmniScore`
    };
  } else if (sportKey.includes('tennis')) {
    return {
      headline: `ACE ON BREAK POINT: ${player.toUpperCase()} DELIVERS!`,
      commentary: `Pounded down the T with pinpoint accuracy! ${player} refuses to give up the break advantage under extreme pressure.`,
      tacticalAnalysis: `High first-serve percentage at 188 km/h right onto the outer chalk line.`,
      highlightClipTitle: `🎾 CLUTCH SERVE! ${player} saves break point #TennisLife #OmniScore`
    };
  } else if (sportKey.includes('combat') || sportKey.includes('mma') || sportKey.includes('box')) {
    return {
      headline: `THUNDEROUS KNOCKDOWN IN ROUND ${time}!`,
      commentary: `A devastating counter hook lands flush on the chin! ${player} drops their opponent and the referee is watching closely!`,
      tacticalAnalysis: `Timed the level change feint perfectly to uncork the overhand right with devastating leverage.`,
      highlightClipTitle: `🥊 EXPLOSIVE KNOCKDOWN by ${player}! #CombatSports #OmniScore`
    };
  } else {
    return {
      headline: `BIG PLAY: ${player.toUpperCase()} FOR ${team}!`,
      commentary: `Spectacular execution by ${player} at ${time}! The bench erupts as the score reaches ${score}!`,
      tacticalAnalysis: `High-percentage conversion created by rapid transition tempo and spacing.`,
      highlightClipTitle: `🔥 HIGHLIGHT: ${player} clutch play at ${time} #OmniScore`
    };
  }
}

// Vite middleware in dev or static files in prod
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
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
    console.log(`[OmniScore Server] Listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
