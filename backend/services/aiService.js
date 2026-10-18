const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini client with environment key if present
const apiKey = process.env.GEMINI_API_KEY;
const genAI = (apiKey && apiKey.trim() !== '') ? new GoogleGenerativeAI(apiKey) : null;

/**
 * Process a user message using the Gemini Generative AI API.
 * Constrained strictly to the campusLocations dataset to eliminate hallucinations.
 *
 * @param {string} userMessage - Raw message from the visitor
 * @param {Array} campusLocations - Official list of campus locations from data store
 * @returns {Promise<{ intent: string, destinationName: string|null, confidence: number, reply: string }>}
 */
async function processChatQuery(userMessage, campusLocations = []) {
  const currentKey = process.env.GEMINI_API_KEY;
  if (!currentKey || currentKey.trim() === '') {
    throw new Error('GEMINI_API_KEY is not configured in environment.');
  }

  const client = genAI || new GoogleGenerativeAI(currentKey);
  const model = client.getGenerativeModel({
    model: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
    generationConfig: {
      temperature: 0.1,
      responseMimeType: 'application/json'
    }
  });

  // Prepare structured list of valid campus locations and aliases
  const locationSummary = campusLocations.map(loc => {
    const aliasStr = loc.aliases && loc.aliases.length > 0 ? ` (aliases: ${loc.aliases.join(', ')})` : '';
    const details = [loc.building, loc.floor, loc.room ? `Room ${loc.room}` : null].filter(Boolean).join(', ');
    return `- ${loc.name}${aliasStr}${details ? ` [${details}]` : ''}`;
  }).join('\n');

  const prompt = `You are CampusConnect AI for Sanjivani College of Engineering, Kopargaon.
You assist campus visitors, prospective students, parents, and guests in finding destinations, departments, and offices on campus.

Analyze the user's message, identify their intent, and extract:
1. The intended DESTINATION location if applicable.
2. The user's CURRENT ORIGIN / STARTING location if mentioned in their message (e.g., "I am at the reception", "I see Software Lab 1", "From Language Lab to HOD", "I am standing near stairs", "Looking at water cooler").

STRICT CONSTRAINTS:
1. You must NEVER hallucinate or invent campus locations, buildings, or room numbers.
2. Only match destination and origin against the official list of Campus Locations provided below.
3. If no starting point or current location is mentioned by the user, set originLocationName to null.
4. If the user's inquiry does not match any location in the list, set destinationName to null and intent to "UNKNOWN" or "GENERAL_INFORMATION".
5. Output MUST be a valid JSON object matching the requested schema.

Official Campus Locations:
${locationSummary}

User Message: "${userMessage}"

Respond with ONLY a JSON object with this exact structure:
{
  "intent": "FIND_LOCATION" | "FIND_FACULTY" | "FIND_DEPARTMENT" | "FIND_SERVICE" | "GENERAL_INFORMATION" | "UNKNOWN",
  "destinationName": "exact location name from the provided list, or null",
  "originLocationName": "exact location name from the provided list where user is currently located/starting, or null",
  "confidence": 0.0 to 1.0,
  "reply": "helpful, polite, and concise response message for the visitor, acknowledging their starting point if provided"
}`;

  const timeoutMs = parseInt(process.env.GEMINI_TIMEOUT_MS, 10) || 7000;
  const timeoutPromise = new Promise((_, reject) =>
    setTimeout(() => reject(new Error(`Gemini API request timed out after ${timeoutMs}ms`)), timeoutMs)
  );

  const apiCall = model.generateContent(prompt).then(res => res.response.text());
  const rawText = await Promise.race([apiCall, timeoutPromise]);

  let cleaned = rawText.trim();
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '').trim();
  }

  const parsed = JSON.parse(cleaned);

  return {
    intent: parsed.intent || 'UNKNOWN',
    destinationName: parsed.destinationName || null,
    originLocationName: parsed.originLocationName || null,
    confidence: typeof parsed.confidence === 'number' ? parsed.confidence : 0.8,
    reply: parsed.reply || null
  };
}

module.exports = { processChatQuery };
