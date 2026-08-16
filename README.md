# DeSlop Bot

A Telegram bot that humanizes AI-generated text and provides AI-likeness estimates using rule-based algorithms. No AI APIs required.

**Telegram Username:** [@deslopbot](https://t.me/deslopbot)  
**GitHub Repository:** [KaroJunior/deslop-bot](https://github.com/KaroJunior/deslop-bot)

## 🤖 About

DeSlop helps make AI-generated text sound more natural by removing common AI-writing patterns. All processing is done locally using JavaScript rules, pattern matching, and heuristics - no external AI services are used.

### Features

- **✍️ Humanize Text**: Transform AI-generated text to sound more natural
- **🔍 Check AI-Likeness**: Get a heuristic estimate of how AI-like a piece of text appears

### What DeSlop Fixes

- **AI Buzzwords**: Detects and replaces overused AI vocabulary (delve, groundbreaking, resonate, etc.)
- **Filler Phrases**: Removes generic AI filler (e.g., "It is important to note that...")
- **Em Dashes**: Converts excessive em dashes (—) to natural punctuation
- **Repetition**: Reduces redundant words and phrases
- **Sentence Structure**: Simplifies overly formal or complicated constructions
- **Transition Words**: Removes excessive transitions while preserving necessary ones

### Important Notes

- **No AI APIs**: All processing is done locally with rule-based algorithms
- **Privacy First**: Your text is not stored or sent to any external service
- **Heuristic Estimates**: The AI-likeness checker provides an estimate, not definitive proof

## 🛠️ Technology Stack

- **Node.js** - Runtime environment
- **JavaScript** - Programming language
- **Telegraf** - Telegram Bot API framework
- **Express** - HTTP server for Render deployment
- **dotenv** - Environment variable management

## 📁 Project Structure
DeSlop Bot/
├── src/
│ ├── bot.js # Main bot logic & HTTP server
│ ├── humanizer.js # Text humanization rules
│ └── detector.js # AI-likeness analysis
├── .env.example # Environment variables template
├── .gitignore # Git ignore rules
├── package.json # Project dependencies
└── README.md # Project documentation

text

## 🚀 Local Development

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- Telegram Bot Token (get from [@BotFather](https://t.me/botfather))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/KaroJunior/deslop-bot.git
   cd deslop-bot
Install dependencies

bash
npm install
Configure environment variables

bash
cp .env.example .env
Edit .env and add your Telegram Bot Token:

text
BOT_TOKEN=your_telegram_bot_token_here
Start the bot

bash
# Development mode (with auto-restart)
npm run dev

# Production mode
npm start
Test the HTTP server (for Render compatibility)

bash
curl http://localhost:3000/health
# Should return: "DeSlop bot is running."
Verifying the Bot
Open Telegram and search for your bot

Send /start to see the welcome menu

Click "Humanize Text" or "Check AI-Likeness"

Send a text message to test the functionality

🚢 Deployment
Deploying to Render
Push your code to a Git repository (GitHub, GitLab, or Bitbucket)

Create a new Web Service on Render

Go to Render Dashboard

Click "New +" → "Web Service"

Connect your repository (https://github.com/KaroJunior/deslop-bot)

Configure the service:

Name: deslop-bot (or your preferred name)

Environment: Node

Build Command: npm install

Start Command: npm start

Health Check Path: /health (optional)

Add Environment Variables

Click "Advanced" → "Environment Variables"

Add BOT_TOKEN with your Telegram bot token

Render automatically sets PORT - no need to set it manually

Deploy

Click "Create Web Service"

Render will automatically build and deploy your bot

Deploying to Other Platforms
The bot can be deployed to any platform that supports Node.js applications:

Heroku: Add web: npm start to your Procfile

Fly.io: Use a fly.toml configuration

VPS: Use PM2 or systemd to keep the bot running

Important Deployment Notes
The bot uses polling (not webhooks), so it works with any hosting platform

The Express server is only for Render compatibility and health checks

No database or persistent storage is required

🔧 Configuration
Environment Variables
Variable	Description	Required
BOT_TOKEN	Telegram Bot Token from @BotFather	Yes
PORT	HTTP port for Render (set automatically)	No (Render only)
Bot Commands
Command	Description
/start	Show welcome menu with options
/help	Show help information
Inline Buttons
✍️ Humanize Text: Start humanization flow

🔍 Check AI-Likeness: Start analysis flow

🔙 Back to Menu: Return to main menu

📝 Customization
Adding New AI Buzzwords
Edit src/humanizer.js and add new entries to the BUZZWORDS array:

javascript
const BUZZWORDS = [
  { word: 'your_word', replacement: 'better_word' },
  // Add more words here
];
Adding New Filler Phrases
Edit src/humanizer.js and add new entries to the FILLER_PHRASES array:

javascript
const FILLER_PHRASES = [
  { phrase: 'your filler phrase', replacement: '' },
  // Add more phrases here
];
Adjusting Detector Sensitivity
Edit src/detector.js and adjust the score weights:

javascript
// Increase or decrease these values
if (buzzwordCount > 5) {
  score += 25; // Adjust this number
  signals.push('Frequent AI-style vocabulary');
}
🧪 Testing
Test Cases
Test 1 - AI-Heavy Text

text
In today's rapidly evolving landscape, it is crucial to delve into the transformative potential of artificial intelligence. Furthermore, these groundbreaking technologies offer invaluable insights that can elevate our understanding and enhance productivity.
Expected: Humanized version with AI patterns removed

Test 2 - Natural Text

text
My outlook for BTC going into the new week. That was why I closed the LINK trade earlier today on profit.
Well, don't short blindly, wait for confirmation first.
Expected: Unchanged or minimally changed

Test 3 - Em Dash

text
I started building this project — mostly because I wanted something I could finish quickly — and I'm actually enjoying it.
Expected: Converted to natural punctuation

Test 4 - Filler Removal

text
It is important to note that this project is still in development. In order to make it better, I need to test it with real users.
Expected: Filler phrases removed

Test 5 - Capitalization

text
Furthermore, the project is almost ready.
Expected: Proper capitalization maintained

📊 Performance
Processing Time: < 100ms for typical texts

Memory Usage: < 50MB

No External API Calls: All processing is local

Rate Limiting: None (handled by Telegram's API limits)

🤝 Contributing
Fork the repository (https://github.com/KaroJunior/deslop-bot/fork)

Create a feature branch (git checkout -b feature/amazing-feature)

Commit your changes (git commit -m 'Add some amazing feature')

Push to the branch (git push origin feature/amazing-feature)

Open a Pull Request to the main branch

Development Guidelines
Keep the architecture simple (3-file structure)

Add comments for non-obvious logic

Preserve existing functionality when adding new rules

Test with real AI-generated text before submitting PRs

🐛 Troubleshooting
Common Issues
Bot doesn't start

text
❌ BOT_TOKEN not found in .env file
Solution: Create .env file with BOT_TOKEN=your_token_here

Render deployment fails

text
Error: Cannot find module 'express'
Solution: Ensure express is in dependencies (not devDependencies)

Bot doesn't respond

Check if bot token is valid

Verify internet connectivity

Check Render logs for errors

Logs
Local Development

bash
# Development logs show in console
npm run dev
Render Logs

Go to Render Dashboard → Your Service → Logs

View real-time logs for debugging

📄 License
MIT License - See LICENSE file for details

🙏 Acknowledgments
Telegraf - Telegram Bot Framework

Render - Hosting Platform

@BotFather - Telegram Bot Management

📞 Support
Telegram: @deslopbot

GitHub Issues: Create an issue

Documentation: This README

🔄 Version History
v1.0.0 (Current)
Initial MVP release

Humanization with rule-based algorithms

AI-likeness detector

Render deployment support

Express HTTP server for health checks

Complete documentation



Made with ❤️ for the Telegram community
