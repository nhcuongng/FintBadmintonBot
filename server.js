require('dotenv').config();
const express = require('express');
const { handleSendPoll } = require('./controller/create-poll');
const { handleSendReminder } = require('./controller/reminder');
const { pollController } = require('./controller/poll-controller');

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(express.json());

// Health check endpoint
app.get('/', (req, res) => {
    res.json({ message: 'Cau Long Bot Server is running! 🏸' });
});

app.get('/restart-cron', (req, res) => {
    try {
        const result = pollController.restartAllCronJobs();
        
        if (result.success) {
            res.json({
                success: true,
                message: result.message,
                results: result.results
            });
        } else {
            res.status(500).json({
                success: false,
                message: result.message,
                error: result.error
            });
        }
    } catch (error) {
        console.error('Error in restart-cron endpoint:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to restart cron jobs',
            error: error.message
        });
    }
});

// Send poll endpoint
app.get('/send-poll', async (req, res) => {
    try {
        await handleSendPoll(pollController.paramsBot, pollController.range, pollController.cronExpression.CRON_EXPRESSION_CREATE_POLL);
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
        await handleSendReminder(pollController.paramsBot);
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
