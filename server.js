require('dotenv').config();
const express = require('express');
const { handleSendPoll } = require('./controller/create-poll');
const { handleSendReminder } = require('./controller/reminder');

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(express.json());

// Health check endpoint
app.get('/', (req, res) => {
    res.json({ message: 'Cau Long Bot Server is running! 🏸' });
});

// Send poll endpoint
app.get('/send-poll', async (req, res) => {
    try {
        await handleSendPoll();
        res.json({ success: true, message: 'Poll sent successfully!' });
    } catch (error) {
        console.error('Error sending poll:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to send poll',
            error: error.message 
        });
    }
});

// Send reminder endpoint
app.get('/remind', async (req, res) => {
    try {
        await handleSendReminder();
        res.json({ success: true, message: 'Reminder sent successfully!' });
    } catch (error) {
        console.error('Error sending reminder:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to send reminder',
            error: error.message 
        });
    }
});

app.get('/health', (req, res) => {
    try {
        res.status(200).json({ 
            success: true, 
            message: 'Server is healthy',
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Health check error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Health check failed',
            error: error.message 
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
