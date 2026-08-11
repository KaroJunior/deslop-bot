// AI buzzwords dictionary - now with phrase-level replacements
const BUZZWORDS = [
  { word: 'groundbreaking', replacement: 'new' },
  { word: 'invaluable', replacement: 'valuable' },
  { word: 'enhance', replacement: 'improve' },
  { word: 'leverage', replacement: 'use' },
  { word: 'robust', replacement: 'strong' },
  { word: 'crucial', replacement: 'important' },
  { word: 'comprehensive', replacement: 'detailed' },
  { word: 'transformative', replacement: null }, // Don't blindly replace
  { word: 'relentless', replacement: 'determined' },
  { word: 'endeavor', replacement: 'effort' },
  { word: 'enlightening', replacement: 'informative' },
  { word: 'elevate', replacement: 'improve' },
  { word: 'resonate', replacement: 'connect' },
  { word: 'systemic', replacement: 'system-wide' },
  { word: 'inherent', replacement: 'built-in' },
  { word: 'pivotal', replacement: 'key' },
  { word: 'adhere', replacement: 'follow' },
  { word: 'foster', replacement: 'encourage' },
  { word: 'multifaceted', replacement: 'complex' },
  { word: 'seamless', replacement: 'smooth' },
  { word: 'dynamic', replacement: 'active' },
  { word: 'cutting-edge', replacement: 'advanced' },
  { word: 'game-changing', replacement: 'revolutionary' },
  { word: 'revolutionary', replacement: 'innovative' },
  { word: 'explore', replacement: 'look at' },
  { word: 'embark', replacement: 'start' }
];

// AI filler phrases - prioritize removal over replacement
const FILLER_PHRASES = [
  { phrase: 'it is important to note that', replacement: '' },
  { phrase: 'it is worth noting that', replacement: '' },
  { phrase: "in today's rapidly evolving landscape", replacement: '' },
  { phrase: "in the ever-changing world of", replacement: '' },
  { phrase: 'at the end of the day', replacement: '' },
  { phrase: 'it goes without saying', replacement: '' },
  { phrase: 'as we delve into', replacement: '' },
  { phrase: "let's explore", replacement: '' },
  { phrase: 'in conclusion', replacement: '' }
];

// Phrase-based replacements (higher priority than individual words)
const PHRASE_REPLACEMENTS = [
  { phrase: 'delve into', replacement: 'look at' },
  { phrase: 'in order to', replacement: 'to' },
  { phrase: 'when it comes to', replacement: 'about' },
  { phrase: 'a wide range of', replacement: 'many' },
  { phrase: 'a plethora of', replacement: 'many' },
  { phrase: 'utilize', replacement: 'use' },
  { phrase: 'in close proximity to', replacement: 'near' },
  { phrase: 'due to the fact that', replacement: 'because' },
  { phrase: 'for the purpose of', replacement: 'to' }
];

// Transition words - keep or remove based on context
const TRANSITION_WORDS = [
  'furthermore',
  'moreover',
  'additionally',
  'however',
  'therefore',
  'consequently'
];

// Overused words - remove only when excessive
const OVERUSED_WORDS = [
  'actually',
  'basically',
  'essentially',
  'really',
  'simply',
  'clearly',
  'notably'
];

// Redundant phrases
const REDUNDANT_PHRASES = [
  { phrase: 'completely eliminate', replacement: 'eliminate' },
  { phrase: 'future plans', replacement: 'plans' },
  { phrase: 'basic fundamentals', replacement: 'fundamentals' },
  { phrase: 'advance planning', replacement: 'planning' },
  { phrase: 'collaborate together', replacement: 'collaborate' },
  { phrase: 'each and every', replacement: 'each' },
  { phrase: 'few in number', replacement: 'few' },
  { phrase: 'first began', replacement: 'began' },
  { phrase: 'honest truth', replacement: 'truth' },
  { phrase: 'new innovation', replacement: 'innovation' }
];

// Helper function to clean punctuation
function cleanPunctuation(text) {
  // Remove duplicate punctuation
  text = text.replace(/([.,!?;:])\1+/g, '$1');
  
  // Fix comma+period combinations
  text = text.replace(/,\s*\./g, '.');
  text = text.replace(/\.\s*,/g, '.');
  
  // Fix period+comma
  text = text.replace(/\.\s*,/g, '.');
  
  // Remove spaces before punctuation
  text = text.replace(/\s+([.,!?;:])/g, '$1');
  
  // Fix duplicate spaces
  text = text.replace(/\s+/g, ' ').trim();
  
  // Ensure single space after sentence punctuation
  text = text.replace(/([.!?])\s*/g, '$1 ');
  
  // Clean up accidental double periods
  text = text.replace(/\.\s*\./g, '.');
  text = text.replace(/\s*\.\s*\.\s*\./g, '...');
  
  return text;
}

// Helper to capitalize first letter of sentences
function fixCapitalization(text) {
  // Split into sentences
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
  
  const fixedSentences = sentences.map(sentence => {
    let trimmed = sentence.trim();
    if (trimmed.length > 0) {
      // Check if first character is a letter
      const firstChar = trimmed[0];
      if (firstChar >= 'a' && firstChar <= 'z') {
        // Capitalize first letter
        trimmed = trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
      }
    }
    return trimmed;
  });
  
  return fixedSentences.join(' ');
}

// Process a phrase in text with context awareness
function replacePhrase(text, phrase, replacement, caseSensitive = false) {
  const flags = caseSensitive ? 'g' : 'gi';
  
  // Only replace if it's a whole word/phrase
  const pattern = new RegExp(`\\b${phrase}\\b`, flags);
  
  // Check if the phrase exists
  if (!pattern.test(text)) return text;
  
  // Handle empty replacement (removal)
  if (replacement === '') {
    // Remove the phrase and clean up surrounding punctuation
    let result = text.replace(pattern, '');
    
    // Fix punctuation that might be orphaned
    result = result.replace(/,\s*\./g, '.');
    result = result.replace(/\.\s*,/g, '.');
    result = result.replace(/\s+([.,!?;:])/g, '$1');
    
    // If removal left a comma at the start, remove it
    result = result.replace(/^,\s*/, '');
    
    // Clean up extra spaces
    result = result.replace(/\s+/g, ' ').trim();
    return result;
  }
  
  // Standard replacement
  let result = text.replace(pattern, replacement);
  
  // Fix capitalization if replacement is at start of sentence
  const sentences = result.match(/[^.!?]+[.!?]+/g) || [result];
  if (sentences.length > 0) {
    const firstSentence = sentences[0];
    if (firstSentence.trim().startsWith(replacement.toLowerCase())) {
      // Find the first occurrence and capitalize it
      const re = new RegExp(`^\\s*${replacement}`, 'i');
      result = result.replace(re, (match) => {
        return match.charAt(0).toUpperCase() + match.slice(1);
      });
    }
  }
  
  return result;
}

// Helper to remove leading comma and fix capitalization after phrase removal
function cleanupLeadingComma(text) {
  // Remove leading comma followed by space
  text = text.replace(/^,\s*/, '');
  
  // Remove leading comma+space after a period
  text = text.replace(/\.\s*,\s*/, '. ');
  
  // Remove orphaned commas that appear after sentence starts
  text = text.replace(/([.!?])\s*,\s*/g, '$1 ');
  
  return text;
}

// Helper to avoid repetitive replacements in same sentence
function avoidRepetition(text, word, replacement) {
  // If the same replacement appears multiple times, use alternatives
  const parts = text.split(/\s+/);
  let count = 0;
  const newParts = [];
  
  for (let i = 0; i < parts.length; i++) {
    if (parts[i].toLowerCase() === replacement.toLowerCase()) {
      count++;
      if (count > 1) {
        // Use alternative for second occurrence
        const alternatives = {
          'improve': ['boost', 'increase', 'strengthen', 'better'],
          'use': ['apply', 'utilize', 'employ'],
          'important': ['key', 'essential', 'vital'],
          'valuable': ['useful', 'helpful', 'beneficial']
        };
        
        const alts = alternatives[replacement.toLowerCase()] || [];
        if (alts.length > 0) {
          // Use the next alternative, cycling if needed
          const altIndex = (count - 2) % alts.length;
          newParts.push(alts[altIndex]);
          continue;
        }
      }
    }
    newParts.push(parts[i]);
  }
  
  return newParts.join(' ');
}

// Main humanization function
function humanizeText(text) {
  if (!text || typeof text !== 'string') {
    return { text: text || '', summary: 'No text to process', changes: {} };
  }
  
  let cleanedText = text;
  let changes = {
    buzzwords: 0,
    fillerPhrases: 0,
    emDashes: 0,
    transitions: 0,
    overusedWords: 0,
    redundantPhrases: 0,
    phraseReplacements: 0
  };
  
  // 1. Handle phrase replacements first (highest priority)
  for (const phraseObj of PHRASE_REPLACEMENTS) {
    const pattern = new RegExp(`\\b${phraseObj.phrase}\\b`, 'gi');
    const matches = cleanedText.match(pattern);
    if (matches) {
      changes.phraseReplacements += matches.length;
      cleanedText = replacePhrase(cleanedText, phraseObj.phrase, phraseObj.replacement);
      cleanedText = cleanupLeadingComma(cleanedText);
    }
  }
  
  // 2. Handle filler phrases (remove them)
  for (const filler of FILLER_PHRASES) {
    const pattern = new RegExp(`\\b${filler.phrase}\\b`, 'gi');
    const matches = cleanedText.match(pattern);
    if (matches) {
      changes.fillerPhrases += matches.length;
      cleanedText = replacePhrase(cleanedText, filler.phrase, filler.replacement);
      cleanedText = cleanupLeadingComma(cleanedText);
    }
  }
  
  // 3. Handle redundant phrases
  for (const redundant of REDUNDANT_PHRASES) {
    const pattern = new RegExp(`\\b${redundant.phrase}\\b`, 'gi');
    const matches = cleanedText.match(pattern);
    if (matches) {
      changes.redundantPhrases += matches.length;
      cleanedText = replacePhrase(cleanedText, redundant.phrase, redundant.replacement);
    }
  }
  
  // 4. Handle buzzwords - only replace if we have a good alternative
  for (const buzzword of BUZZWORDS) {
    // Skip if replacement is null (leave it alone)
    if (buzzword.replacement === null) continue;
    
    // Skip if this word is part of a phrase we already handled
    const isInPhrase = PHRASE_REPLACEMENTS.some(p => 
      p.phrase.includes(buzzword.word) && cleanedText.toLowerCase().includes(p.phrase)
    );
    if (isInPhrase) continue;
    
    const pattern = new RegExp(`\\b${buzzword.word}\\b`, 'gi');
    const matches = cleanedText.match(pattern);
    if (matches) {
      // Only replace if the word is used in an AI-like way
      if (matches.length > 1 || isStylisticWord(buzzword.word, cleanedText)) {
        // Count replacements before making them
        const beforeText = cleanedText;
        
        // Check if this word appears in a natural phrase where replacement sounds odd
        const lowerText = cleanedText.toLowerCase();
        const phraseContexts = [
          'transformative potential', 'transformative change', 'transformative impact'
        ];
        
        let shouldReplace = true;
        for (const context of phraseContexts) {
          if (lowerText.includes(context) && buzzword.word === 'transformative') {
            shouldReplace = false;
            break;
          }
        }
        
        if (shouldReplace) {
          changes.buzzwords += matches.length;
          cleanedText = replacePhrase(cleanedText, buzzword.word, buzzword.replacement);
          
          // Avoid repetition
          cleanedText = avoidRepetition(cleanedText, buzzword.word, buzzword.replacement);
        }
      }
    }
  }
  
  // 5. Handle transition words - keep if needed for flow
  for (const word of TRANSITION_WORDS) {
    const pattern = new RegExp(`\\b${word}\\b`, 'gi');
    const matches = cleanedText.match(pattern);
    if (matches && matches.length > 1) {
      changes.transitions += matches.length - 1;
      let count = 0;
      cleanedText = cleanedText.replace(pattern, (match) => {
        count++;
        if (count === 1 && isTransitionNeeded(word, cleanedText)) {
          return match;
        }
        return '';
      });
      cleanedText = cleanupLeadingComma(cleanedText);
    }
  }
  
  // 6. Handle overused words - only if excessive
  for (const word of OVERUSED_WORDS) {
    const pattern = new RegExp(`\\b${word}\\b`, 'gi');
    const matches = cleanedText.match(pattern);
    if (matches && matches.length > 2) {
      changes.overusedWords += matches.length - 1;
      let count = 0;
      cleanedText = cleanedText.replace(pattern, (match) => {
        count++;
        if (count === 1) return match;
        return '';
      });
    }
  }
  
  // 7. Handle em dashes
  const emDashPattern = /—/g;
  let emDashMatches = cleanedText.match(emDashPattern);
  if (emDashMatches) {
    changes.emDashes = emDashMatches.length;
    
    const sentences = cleanedText.split(/([.!?]\s+)/);
    const processedSentences = [];
    
    for (let i = 0; i < sentences.length; i++) {
      let sentence = sentences[i];
      if (sentence.includes('—')) {
        const parts = sentence.split('—');
        if (parts.length === 2) {
          const before = parts[0].trim();
          const after = parts[1].trim();
          
          if (after.match(/^[A-Z]/) && before.match(/[.!?]$/)) {
            sentence = `${before} ${after}`;
          } else if (after.length < 30 && !after.includes(',')) {
            sentence = `${before} (${after})`;
          } else {
            sentence = `${before}, ${after}`;
          }
        } else {
          let newSentence = sentence;
          let chunks = newSentence.split('—');
          
          for (let j = 0; j < chunks.length; j++) {
            if (j > 0 && j < chunks.length - 1) {
              chunks[j] = `(${chunks[j].trim()})`;
            }
          }
          sentence = chunks.join(' ');
        }
      }
      processedSentences.push(sentence);
    }
    cleanedText = processedSentences.join('');
  }
  
  // 8. Final cleanup pass
  cleanedText = cleanPunctuation(cleanedText);
  cleanedText = cleanupLeadingComma(cleanedText);
  cleanedText = fixCapitalization(cleanedText);
  
  // Additional cleanup for common issues
  cleanedText = cleanedText.replace(/\s*,\s*,/g, ','); // Remove duplicate commas
  cleanedText = cleanedText.replace(/\s*\.\s*\./g, '.'); // Remove duplicate periods
  cleanedText = cleanedText.replace(/,\s*\./g, '.'); // Fix comma period
  cleanedText = cleanedText.replace(/\.\s*,/g, '.'); // Fix period comma
  cleanedText = cleanedText.replace(/\s+([.,!?;:])/g, '$1'); // Fix spaces before punctuation
  cleanedText = cleanedText.replace(/([.,!?;:])\s*/g, '$1 '); // Add space after punctuation
  cleanedText = cleanedText.replace(/\s+/g, ' ').trim(); // Fix multiple spaces
  
  // Ensure sentences start with capital letters
  const sentences = cleanedText.match(/[^.!?]+[.!?]+/g) || [cleanedText];
  cleanedText = sentences.map(s => s.trim()).join(' ');
  cleanedText = fixCapitalization(cleanedText);
  
  // Generate summary
  const summaryParts = [];
  if (changes.fillerPhrases > 0) summaryParts.push(`${changes.fillerPhrases} filler phrases`);
  if (changes.buzzwords > 0) summaryParts.push(`${changes.buzzwords} AI-style words`);
  if (changes.emDashes > 0) summaryParts.push(`${changes.emDashes} em dash${changes.emDashes > 1 ? 'es' : ''}`);
  if (changes.transitions > 0) summaryParts.push(`${changes.transitions} transition words`);
  if (changes.overusedWords > 0) summaryParts.push(`${changes.overusedWords} overused words`);
  if (changes.redundantPhrases > 0) summaryParts.push(`${changes.redundantPhrases} redundant phrases`);
  if (changes.phraseReplacements > 0) summaryParts.push(`${changes.phraseReplacements} phrases simplified`);
  
  // Check if text changed significantly
  const changed = cleanedText !== text;
  const summary = changed && summaryParts.length > 0 
    ? `• ${summaryParts.join('\n• ')}` 
    : 'No significant AI patterns found';
  
  return {
    text: cleanedText,
    summary: summary,
    changes: changes
  };
}

// Helper functions for context-aware decisions
function isStylisticWord(word, text) {
  const lowerText = text.toLowerCase();
  const wordLower = word.toLowerCase();
  
  // If it's in a direct quote or code block, likely not stylistic
  if (lowerText.includes(`"${wordLower}`) || lowerText.includes(`'${wordLower}`)) {
    return false;
  }
  
  // Check if it's used as a technical term
  const technicalContexts = ['systemic', 'inherent', 'robust'];
  if (technicalContexts.includes(wordLower)) {
    const regex = new RegExp(`\\b${wordLower}\\s+(issue|problem|system|architecture|design|framework)`, 'i');
    if (regex.test(lowerText)) {
      return false;
    }
  }
  
  return true;
}

function isTransitionNeeded(word, text) {
  const lowerText = text.toLowerCase();
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  
  if (sentences.length < 3) return false;
  
  const firstSentence = sentences[0];
  if (firstSentence.toLowerCase().includes(word)) {
    return true;
  }
  
  const wordsBefore = lowerText.split(word)[0];
  const wordsAfter = lowerText.split(word)[1];
  if (wordsBefore && wordsAfter) {
    const beforeSentences = wordsBefore.split(/[.!?]+/).length;
    const afterSentences = wordsAfter.split(/[.!?]+/).length;
    if (beforeSentences > 1 && afterSentences > 1) {
      return true;
    }
  }
  
  return false;
}

module.exports = { humanizeText };