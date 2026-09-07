/**
 * Intent matching service — Phase 4 rule-based NLP.
 * Phase 10 will upgrade this to use an LLM.
 */

const INTENTS = {
  FIND_LOCATION:   'FIND_LOCATION',
  FIND_FACULTY:    'FIND_FACULTY',
  FIND_DEPARTMENT: 'FIND_DEPARTMENT',
  FIND_SERVICE:    'FIND_SERVICE',
  GENERAL_INFO:    'GENERAL_INFORMATION',
  UNKNOWN:         'UNKNOWN'
};

const INTENT_PATTERNS = [
  {
    intent: INTENTS.FIND_FACULTY,
    patterns: ['professor', 'prof', 'teacher', 'faculty', 'hod', 'head of department', 'meet', 'find sir', 'find madam']
  },
  {
    intent: INTENTS.FIND_DEPARTMENT,
    patterns: ['department', 'dept', 'computer engineering', 'mechanical engineering', 'civil engineering', 'cse', 'mech', 'civil']
  },
  {
    intent: INTENTS.FIND_SERVICE,
    patterns: ['fees', 'fee', 'accounts', 'pay', 'payment', 'exam', 'examination', 'hall ticket', 'result', 'library', 'canteen', 'hostel']
  },
  {
    intent: INTENTS.FIND_LOCATION,
    patterns: ['where is', 'where can i find', 'find', 'location of', 'how do i reach', 'how to reach', 'go to', 'want to go', 'looking for', 'admission', 'principal', 'office', 'room', 'reception']
  },
  {
    intent: INTENTS.GENERAL_INFO,
    patterns: ['what is', 'tell me about', 'information', 'info', 'help', 'campus', 'college', 'sanjivani']
  }
];

function detectIntent(query) {
  const q = query.toLowerCase();
  for (const { intent, patterns } of INTENT_PATTERNS) {
    if (patterns.some(p => q.includes(p))) {
      return intent;
    }
  }
  return INTENTS.UNKNOWN;
}

function searchLocations(query, locations) {
  const q = query.toLowerCase().trim();
  return locations.filter(loc => {
    // Query contains the location name or alias
    const nameFwd   = q.includes(loc.name.toLowerCase());
    const aliasMatch = loc.aliases && loc.aliases.some(a => {
      const al = a.toLowerCase();
      return q.includes(al) || al.includes(q);
    });
    // Location name contains the query word
    const nameRev   = loc.name.toLowerCase().includes(q);
    const typeMatch = loc.type && loc.type.toLowerCase().includes(q);
    return nameFwd || aliasMatch || nameRev || typeMatch;
  });
}

function searchFaculty(query, faculty) {
  const q = query.toLowerCase().trim();
  return faculty.filter(f =>
    f.name.toLowerCase().includes(q) ||
    f.designation.toLowerCase().includes(q) ||
    f.cabin.toLowerCase().includes(q)
  );
}

/**
 * Main intent processing — returns a structured response.
 */
function processQuery(query, locations, faculty) {
  const intent = detectIntent(query);

  if (intent === INTENTS.UNKNOWN) {
    return {
      intent,
      message: "I'm not sure what you're looking for. Try asking something like: 'Where is the admission office?' or 'I want to pay fees.'",
      results: [],
      suggestions: ['Admission Office', 'Library', 'Accounts Office', 'Computer Department', 'HOD Cabin']
    };
  }

  if (intent === INTENTS.FIND_FACULTY) {
    const facultyResults = searchFaculty(query, faculty);
    if (facultyResults.length > 0) {
      const locationResults = facultyResults
        .map(f => locations.find(l => l.id === f.locationId))
        .filter(Boolean);
      return {
        intent,
        message: facultyResults.length === 1
          ? `Found: ${facultyResults[0].name} (${facultyResults[0].designation}) — Room ${facultyResults[0].cabin}.`
          : `Found ${facultyResults.length} matching faculty members.`,
        results: locationResults.length > 0 ? locationResults : [],
        faculty: facultyResults
      };
    }
    // Fall through to location search for HOD etc.
  }

  const locationResults = searchLocations(query, locations);

  if (locationResults.length === 0) {
    return {
      intent,
      message: `I couldn't find a location matching your request. Did you mean Admission Office, Library, Accounts Office, or Computer Department?`,
      results: [],
      suggestions: ['Admission Office', 'Library', 'Accounts Office', 'Computer Department', 'Examination Cell']
    };
  }

  if (locationResults.length === 1) {
    return {
      intent,
      message: `Found: ${locationResults[0].name}`,
      results: locationResults,
      destination: locationResults[0]
    };
  }

  return {
    intent,
    message: `I found ${locationResults.length} locations matching your request. Please select one:`,
    results: locationResults,
    requiresClarification: true
  };
}

module.exports = { processQuery, detectIntent, INTENTS };
