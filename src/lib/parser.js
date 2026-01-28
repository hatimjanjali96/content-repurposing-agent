import mammoth from 'mammoth';
import pdfParse from 'pdf-parse';

export async function parseBrandGuidelines(file) {
  const buffer = await file.arrayBuffer();
  const buf = Buffer.from(buffer);

  let text = '';

  try {
    if (file.type === 'application/pdf') {
      const data = await pdfParse(buf);
      text = data.text;
    } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      const result = await mammoth.extractRawText({ buffer: buf });
      text = result.value;
    } else {
      // Plain text
      text = buf.toString('utf-8');
    }

    return {
      rawText: text,
      sections: extractSections(text),
      tone: extractTone(text),
      platforms: extractPlatformRules(text),
      voice: extractVoiceGuidelines(text)
    };

  } catch (error) {
    throw new Error(`Failed to parse brand guidelines: ${error.message}`);
  }
}

function extractSections(text) {
  const sections = {};
  const lines = text.split('\n');
  let currentSection = 'general';

  lines.forEach(line => {
    const lowerLine = line.toLowerCase();
    if (lowerLine.match(/brand voice|tone of voice|voice guidelines/i)) currentSection = 'voice';
    if (lowerLine.match(/linkedin/i)) currentSection = 'linkedin';
    if (lowerLine.match(/instagram/i)) currentSection = 'instagram';
    if (lowerLine.match(/twitter|x\s|x\./i)) currentSection = 'twitter';
    if (lowerLine.match(/facebook/i)) currentSection = 'facebook';
    if (lowerLine.match(/youtube/i)) currentSection = 'youtube';
    if (lowerLine.match(/newsletter|substack/i)) currentSection = 'newsletter';
    if (lowerLine.match(/hashtag/i)) currentSection = 'hashtags';
    if (lowerLine.match(/emoji/i)) currentSection = 'emojis';

    if (!sections[currentSection]) sections[currentSection] = [];
    if (line.trim()) {
      sections[currentSection].push(line.trim());
    }
  });

  return sections;
}

function extractTone(text) {
  const toneWords = [
    'professional', 'casual', 'friendly', 'authoritative', 'conversational',
    'formal', 'informal', 'witty', 'serious', 'playful', 'educational',
    'inspirational', 'empathetic', 'bold', 'humble', 'confident'
  ];
  const found = toneWords.filter(word => text.toLowerCase().includes(word));
  return found.length ? found : ['professional', 'helpful'];
}

function extractVoiceGuidelines(text) {
  const voicePatterns = {
    personality: [],
    doUse: [],
    dontUse: []
  };

  const lines = text.split('\n');
  let currentContext = '';

  lines.forEach(line => {
    const lowerLine = line.toLowerCase();
    if (lowerLine.includes('do use') || lowerLine.includes('do:')) {
      currentContext = 'doUse';
    } else if (lowerLine.includes("don't use") || lowerLine.includes('do not') || lowerLine.includes("don't:")) {
      currentContext = 'dontUse';
    } else if (lowerLine.includes('personality') || lowerLine.includes('brand personality')) {
      currentContext = 'personality';
    }

    if (currentContext && line.trim().startsWith('-')) {
      voicePatterns[currentContext].push(line.trim().substring(1).trim());
    }
  });

  return voicePatterns;
}

function extractPlatformRules(text) {
  const lowerText = text.toLowerCase();

  return {
    linkedin: {
      hashtags: text.match(/linkedin.*?(\d+).*?hashtag/i)?.[1] || '3-5',
      emojis: lowerText.includes('minimal') ? 'minimal' : 'moderate',
      length: lowerText.includes('linkedin') && lowerText.includes('short') ? 'short' : 'standard'
    },
    instagram: {
      hashtags: text.match(/instagram.*?(\d+).*?hashtag/i)?.[1] || '8-15',
      emojis: lowerText.includes('abundant') || lowerText.includes('expressive') ? 'abundant' : 'moderate'
    },
    twitter: {
      hashtags: text.match(/twitter.*?(\d+).*?hashtag/i)?.[1] || '1-2',
      emojis: 'minimal'
    },
    facebook: {
      hashtags: text.match(/facebook.*?(\d+).*?hashtag/i)?.[1] || '2-3',
      emojis: 'moderate'
    }
  };
}

// Default brand guidelines if none provided
export function getDefaultBrandGuidelines() {
  return {
    rawText: '',
    sections: {},
    tone: ['professional', 'helpful', 'engaging'],
    platforms: {
      linkedin: { hashtags: '3-5', emojis: 'moderate' },
      instagram: { hashtags: '8-15', emojis: 'moderate' },
      twitter: { hashtags: '1-2', emojis: 'minimal' },
      facebook: { hashtags: '2-3', emojis: 'moderate' }
    },
    voice: {
      personality: ['knowledgeable', 'approachable', 'innovative'],
      doUse: ['clear language', 'active voice', 'relevant examples'],
      dontUse: ['jargon', 'passive voice', 'clickbait']
    }
  };
}
