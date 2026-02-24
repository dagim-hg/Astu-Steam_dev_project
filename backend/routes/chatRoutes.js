import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

let rules = [];
try {
    const rulesPath = path.join(__dirname, '../data/chatbotRules.json');
    const rawData = fs.readFileSync(rulesPath, 'utf-8');
    rules = JSON.parse(rawData);
} catch (error) {
    console.error('Error loading chatbot rules:', error);
}

// @desc    Process a chat message
// @route   POST /api/chat
// @access  Public
router.post('/', (req, res) => {
    const { message } = req.body;

    if (!message) {
        return res.status(400).json({ response: "Please provide a message." });
    }

    const lowerCaseMessage = message.toLowerCase();
    let matchedResponse = "I'm sorry, I don't understand that question yet. Please try asking about submitting a complaint, tracking status, or general academic/facility categories.";

    for (const rule of rules) {
        // Check if any keyword in the rule matches the message
        if (rule.keywords.some(keyword => lowerCaseMessage.includes(keyword.toLowerCase()))) {
            matchedResponse = rule.response;
            break;
        }
    }

    res.json({ response: matchedResponse });
});

export default router;
