// AI buzzwords - same as humanizer
const BUZZWORDS = [
  'groundbreaking', 'invaluable', 'enhance', 'leverage', 'robust',
  'crucial', 'comprehensive', 'transformative', 'relentless',
  'endeavor', 'enlightening', 'elevate', 'resonate', 'systemic',
  'inherent', 'pivotal', 'adhere', 'foster', 'multifaceted',
  'seamless', 'dynamic', 'cutting-edge', 'game-changing',
  'revolutionary', 'explore', 'embark', 'delve'
];

// Phrase-level patterns
const PHRASE_PATTERNS = [
  'delve into', 'in order to', 'when it comes to',
  'a wide range of', 'a plethora of', 'utilize',
  'in close proximity to', 'due to the fact that',
  'for the purpose of'
];

// AI filler phrases
const FILLER_PHRASES = [
  'it is important to note that',
  'it is worth noting that',
  "in today's rapidly evolving landscape",
  "in the ever-changing world of",
  'at the end of the day',
  'it goes without saying',
  'as we delve into',
  "let's explore",
  'in conclusion'
];

// Transition words
const TRANSITION_WORDS = [
  'however', 'therefore', 'consequently', 'meanwhile',
  'subsequently', 'furthermore', 'moreover', 'additionally',
  'nevertheless', 'nonetheless', 'conversely', 'accordingly'
];

// Overused words
const OVERUSED_WORDS = [
  'actually', 'basically', 'essentially', 'really',
  'simply', 'clearly', 'notably'
];

function analyzeText(text) {
  if (!text || typeof text !== 'string') {
    return { score: 0, signals: ['No text to analyze'] };
  }
  
  let signals = [];
  let score = 0;
  const lowerText = text.toLowerCase();
  
  // 1. Check for phrase patterns (high weight)
  let phraseCount = 0;
  for (const phrase of PHRASE_PATTERNS) {
    const pattern = new RegExp(`\\b${phrase}\\b`, 'gi');
    const matches = text.match(pattern);
    if (matches) {
      phraseCount += matches.length;
    }
  }
  if (phraseCount > 0) {
    if (phraseCount > 3) {
      score += 25;
      signals.push('Frequent AI-style phrases');
    } else if (phraseCount > 1) {
      score += 18;
      signals.push('Several AI-style phrases');
    } else {
      score += 10;
      signals.push('AI-style phrases detected');
    }
  }
  
  // 2. Check for buzzwords (high weight)
  let buzzwordCount = 0;
  for (const word of BUZZWORDS) {
    const pattern = new RegExp(`\\b${word}\\b`, 'gi');
    const matches = text.match(pattern);
    if (matches) {
      buzzwordCount += matches.length;
    }
  }
  
  if (buzzwordCount > 0) {
    if (buzzwordCount > 5) {
      score += 25;
      signals.push('Frequent AI-style vocabulary');
    } else if (buzzwordCount > 3) {
      score += 20;
      signals.push('Noticeable AI-style vocabulary');
    } else if (buzzwordCount > 1) {
      score += 12;
      signals.push('Some AI-style vocabulary');
    } else {
      score += 8;
      signals.push('AI-style vocabulary present');
    }
  }
  
  // 3. Check for filler phrases (high weight)
  let fillerCount = 0;
  for (const phrase of FILLER_PHRASES) {
    const pattern = new RegExp(`\\b${phrase}\\b`, 'gi');
    const matches = text.match(pattern);
    if (matches) {
      fillerCount += matches.length;
    }
  }
  
  if (fillerCount > 0) {
    if (fillerCount > 2) {
      score += 20;
      signals.push('Excessive generic filler phrases');
    } else if (fillerCount > 1) {
      score += 15;
      signals.push('Multiple generic filler phrases');
    } else {
      score += 10;
      signals.push('Generic filler phrase detected');
    }
  }
  
  // 4. Check for transition words (medium weight)
  let transitionCount = 0;
  for (const word of TRANSITION_WORDS) {
    const pattern = new RegExp(`\\b${word}\\b`, 'gi');
    const matches = text.match(pattern);
    if (matches) {
      transitionCount += matches.length;
    }
  }
  
  if (transitionCount > 0) {
    if (transitionCount > 4) {
      score += 15;
      signals.push('Frequent transition word usage');
    } else if (transitionCount > 2) {
      score += 10;
      signals.push('Moderate transition word usage');
    } else if (transitionCount > 1) {
      score += 5;
      signals.push('Some transition words');
    }
  }
  
  // 5. Check for em dashes (medium weight)
  const emDashCount = (text.match(/—/g) || []).length;
  if (emDashCount > 2) {
    score += 15;
    signals.push('Excessive em dash usage');
  } else if (emDashCount > 0) {
    score += 8;
    signals.push('Em dash usage detected');
  }
  
  // 6. Check for overused words (medium weight)
  let overusedCount = 0;
  for (const word of OVERUSED_WORDS) {
    const pattern = new RegExp(`\\b${word}\\b`, 'gi');
    const matches = text.match(pattern);
    if (matches) {
      overusedCount += matches.length;
    }
  }
  
  if (overusedCount > 3) {
    score += 12;
    signals.push('Excessive qualifiers (actually, really, etc.)');
  } else if (overusedCount > 1) {
    score += 6;
    signals.push('Frequent qualifiers');
  }
  
  // 7. Check sentence structure (medium weight)
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  if (sentences.length > 5) {
    const lengths = sentences.map(s => s.trim().split(/\s+/).length);
    const avgLength = lengths.reduce((a, b) => a + b, 0) / lengths.length;
    const variance = lengths.reduce((a, b) => a + Math.pow(b - avgLength, 2), 0) / lengths.length;
    
    if (variance < 8) {
      score += 12;
      signals.push('Uniform sentence structure');
    } else if (variance < 15) {
      score += 8;
      signals.push('Somewhat uniform sentence structure');
    }
  }
  
  // 8. Check for generic structure (medium weight)
  if (lowerText.includes('introduction') || lowerText.includes('firstly') || lowerText.includes('to begin')) {
    score += 8;
    signals.push('Generic introductory structure');
  }
  
  if (lowerText.includes('conclusion') || lowerText.includes('in summary') || lowerText.includes('to summarize')) {
    score += 8;
    signals.push('Generic concluding structure');
  }
  
  // 9. Check for unusual vocabulary density (low weight)
  const words = text.split(/\s+/);
  const longWords = words.filter(w => w.length > 10).length;
  if (longWords > 5 && words.length > 30) {
    score += 8;
    signals.push('High density of complex vocabulary');
  }
  
  // 10. Check for repetitive phrasing (medium weight)
  const wordFrequency = {};
  for (const word of words) {
    const w = word.toLowerCase().replace(/[^a-z]/g, '');
    if (w.length > 3) {
      wordFrequency[w] = (wordFrequency[w] || 0) + 1;
    }
  }
  
  let repeatedWords = 0;
  for (const [w, count] of Object.entries(wordFrequency)) {
    if (count > 5 && words.length > 20) {
      repeatedWords++;
    }
  }
  
  if (repeatedWords > 2) {
    score += 8;
    signals.push('Repetitive vocabulary patterns');
  }
  
  // Calculate final score with caps
  let finalScore = Math.min(Math.round(score), 98);
  
  // If text is very short, reduce score
  if (words.length < 15) {
    finalScore = Math.min(finalScore, 30);
  }
  
  // If text has no AI signals but is long enough
  if (finalScore < 10 && words.length > 20) {
    finalScore = Math.floor(Math.random() * 10) + 8;
    signals.push('Limited AI-writing patterns detected');
  }
  
  // Add a small random element (5%) to make it feel like a heuristic
  const randomVariation = Math.floor(Math.random() * 6) - 3;
  finalScore = Math.min(Math.max(finalScore + randomVariation, 0), 98);
  
  // Sort signals by significance (put more important ones first)
  const signalPriority = {
    'Frequent AI-style phrases': 1,
    'Excessive generic filler phrases': 2,
    'Frequent AI-style vocabulary': 3,
    'Uniform sentence structure': 4,
    'Excessive em dash usage': 5,
    'Excessive qualifiers': 6,
    'Generic introductory structure': 7,
    'Generic concluding structure': 8
  };
  
  signals.sort((a, b) => {
    const priorityA = signalPriority[a] || 999;
    const priorityB = signalPriority[b] || 999;
    return priorityA - priorityB;
  });
  
  // Limit to top 5 signals for readability
  if (signals.length > 5) {
    signals = signals.slice(0, 5);
  }
  
  return {
    score: finalScore,
    signals: signals
  };
}

module.exports = { analyzeText };