require('dotenv').config();
const { Telegraf, Markup } = require('telegraf');
const { humanizeText } = require('./humanizer');
const { analyzeText } = require('./detector');

// Check if bot token exists
const BOT_TOKEN = process.env.BOT_TOKEN;
if (!BOT_TOKEN) {
  console.error('❌ BOT_TOKEN not found in .env file');
  process.exit(1);
}

// Initialize bot
const bot = new Telegraf(BOT_TOKEN);

// Session management - simple in-memory store
const sessions = new Map();

function getSession(userId) {
  if (!sessions.has(userId)) {
    sessions.set(userId, { mode: null });
  }
  return sessions.get(userId);
}

// Helper to split long messages
function splitText(text, maxLength = 4000) {
  const chunks = [];
  let remaining = text;
  
  while (remaining.length > maxLength) {
    let splitIndex = remaining.lastIndexOf('. ', maxLength);
    if (splitIndex === -1) splitIndex = remaining.lastIndexOf('\n', maxLength);
    if (splitIndex === -1) splitIndex = remaining.lastIndexOf(' ', maxLength);
    if (splitIndex === -1) splitIndex = maxLength;
    
    chunks.push(remaining.substring(0, splitIndex + 1));
    remaining = remaining.substring(splitIndex + 1);
  }
  
  if (remaining.length > 0) chunks.push(remaining);
  return chunks;
}

// Main menu
async function showMainMenu(ctx) {
  const session = getSession(ctx.from.id);
  session.mode = null;
  
  const message = `
🤖 <b>Welcome to DeSlop Bot!</b>

DeSlop helps clean up common AI-writing patterns and estimate how AI-like a piece of text appears.

<b>What I can do:</b>
✍️ Humanize Text - Remove AI-writing patterns
🔍 Check AI-Likeness - Heuristic AI estimate

<b>Important:</b>
• All processing is done locally with rule-based algorithms
• No AI APIs are used
• Your text is not stored or sent to any external service

Choose an option below:
  `;

  const keyboard = Markup.inlineKeyboard([
    [Markup.button.callback('✍️ Humanize Text', 'humanize')],
    [Markup.button.callback('🔍 Check AI-Likeness', 'detect')]
  ]);

  await ctx.reply(message, {
    parse_mode: 'HTML',
    ...keyboard
  });
}

// Start command
bot.start(async (ctx) => {
  await showMainMenu(ctx);
});

// Help command
bot.help(async (ctx) => {
  const helpMessage = `
📖 <b>DeSlop Bot Help</b>

<b>Commands:</b>
/start - Show main menu
/help - Show this help message

<b>How to use:</b>
1. Click "Humanize Text" or "Check AI-Likeness"
2. Send your text when prompted
3. Get results instantly!

<b>What makes text seem AI-generated?</b>
• Overuse of AI buzzwords (delve, embark, resonate, etc.)
• Excessive em dashes (—)
• Repetitive phrases and transitions
• Uniform sentence length
• Overly formal or generic writing

<b>Note:</b> The AI-likeness checker provides a heuristic estimate, not definitive proof.
  `;

  await ctx.reply(helpMessage, {
    parse_mode: 'HTML'
  });
});

// Action handlers
bot.action('humanize', async (ctx) => {
  const session = getSession(ctx.from.id);
  session.mode = 'humanize';
  
  const message = `
✍️ <b>Humanize Text</b>

Send me the text you want to humanize. I'll make it sound more natural by:
• Removing AI buzzwords
• Fixing excessive punctuation
• Simplifying complex phrases
• Reducing repetition
• Making sentences more direct

Just paste or type your text below.
  `;

  const keyboard = Markup.inlineKeyboard([
    [Markup.button.callback('🔙 Back to Menu', 'menu')]
  ]);

  await ctx.reply(message, {
    parse_mode: 'HTML',
    ...keyboard
  });
});

bot.action('detect', async (ctx) => {
  const session = getSession(ctx.from.id);
  session.mode = 'detect';
  
  const message = `
🔍 <b>Check AI-Likeness</b>

Send me the text you want me to analyze.

<b>I'll look for:</b>
• AI buzzword frequency
• Excessive em dashes (—)
• Generic introductory phrases
• Repetitive sentence structure
• Transition-word overuse
• Unusual vocabulary patterns

<b>Note:</b> This is a heuristic estimate, not proof that a human or AI wrote the text.

Send your text below:
  `;

  const keyboard = Markup.inlineKeyboard([
    [Markup.button.callback('🔙 Back to Menu', 'menu')]
  ]);

  await ctx.reply(message, {
    parse_mode: 'HTML',
    ...keyboard
  });
});

bot.action('menu', async (ctx) => {
  await showMainMenu(ctx);
});

// Text message handler
bot.on('text', async (ctx) => {
  const session = getSession(ctx.from.id);
  const text = ctx.message.text;
  
  if (!text || text.trim().length === 0) {
    await ctx.reply('Please send some text to work with.');
    return;
  }
  
  if (session.mode === 'humanize') {
    try {
      const result = humanizeText(text);
      let response = `✍️ <b>DeSlopped:</b>\n\n${result.text}`;
      
      if (result.summary) {
        response += `\n\n<b>Cleaned up:</b>\n${result.summary}`;
      }
      
      // Split if too long
      if (response.length > 4000) {
        const chunks = splitText(response, 4000);
        for (const chunk of chunks) {
          await ctx.reply(chunk, { parse_mode: 'HTML' });
        }
      } else {
        await ctx.reply(response, { parse_mode: 'HTML' });
      }
      
      // Ask if they want to continue
      const keyboard = Markup.inlineKeyboard([
        [Markup.button.callback('✍️ Humanize More', 'humanize')],
        [Markup.button.callback('🔙 Back to Menu', 'menu')]
      ]);
      
      await ctx.reply('Want to humanize more text?', {
        ...keyboard
      });
      
    } catch (error) {
      console.error('Humanize error:', error);
      await ctx.reply('Sorry, I had trouble processing your text. Please try again.');
    }
  } else if (session.mode === 'detect') {
    try {
      const result = analyzeText(text);
      let response = `🔍 <b>AI-Likeness Estimate:</b> ${result.score}%\n\n`;
      
      if (result.signals && result.signals.length > 0) {
        response += `<b>Signals detected:</b>\n`;
        for (const signal of result.signals) {
          response += `• ${signal}\n`;
        }
        response += '\n';
      }
      
      response += `⚠️ <i>This is only a heuristic estimate. It cannot reliably prove whether text was written by AI.</i>`;
      
      // Split if too long
      if (response.length > 4000) {
        const chunks = splitText(response, 4000);
        for (const chunk of chunks) {
          await ctx.reply(chunk, { parse_mode: 'HTML' });
        }
      } else {
        await ctx.reply(response, { parse_mode: 'HTML' });
      }
      
      // Ask if they want to continue
      const keyboard = Markup.inlineKeyboard([
        [Markup.button.callback('🔍 Check More Text', 'detect')],
        [Markup.button.callback('🔙 Back to Menu', 'menu')]
      ]);
      
      await ctx.reply('Want to analyze more text?', {
        ...keyboard
      });
      
    } catch (error) {
      console.error('Detect error:', error);
      await ctx.reply('Sorry, I had trouble analyzing your text. Please try again.');
    }
  } else {
    // If not in a specific mode, show the main menu
    await showMainMenu(ctx);
  }
});

// Handle non-text messages
bot.on('message', async (ctx) => {
  if (!ctx.message.text) {
    await ctx.reply(
      'Please send me text to work with. I currently only process text messages.',
      { parse_mode: 'HTML' }
    );
  }
});

// Error handling
bot.catch((err, ctx) => {
  console.error('Bot error:', err);
  ctx.reply('Oops! Something went wrong. Please try again or use /start to restart.');
});

// ============================================
// Express HTTP server for Render compatibility
// ============================================
const express = require('express');
const app = express();

// Health check endpoint for Render
app.get('/health', (req, res) => {
  res.status(200).send('DeSlop bot is running.');
});

// Get port from environment variable (Render sets this)
const PORT = process.env.PORT || 3000;

// Start HTTP server
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ HTTP server running on port ${PORT}`);
  console.log(`   Health check: http://0.0.0.0:${PORT}/health`);
});

// ============================================
// Launch Telegram bot (polling mode)
// ============================================
bot.launch()
  .then(() => {
    console.log('✅ DeSlop bot is running!');
    console.log(`   Bot username: @${bot.botInfo.username}`);
    console.log('   Press Ctrl+C to stop');
  })
  .catch((err) => {
    console.error('❌ Failed to start bot:', err);
    process.exit(1);
  });

// Enable graceful stop
process.once('SIGINT', () => {
  bot.stop('SIGINT');
  server.close(() => {
    console.log('HTTP server closed');
  });
});

process.once('SIGTERM', () => {
  bot.stop('SIGTERM');
  server.close(() => {
    console.log('HTTP server closed');
  });
});