require('dotenv').config();
const express = require('express');
const fs = require('fs');
const path = require('path');
const { handleSendPoll } = require('./controller/create-poll');
// const { handleSendReminder } = require('./controller/reminder');
const { gateway } = require('./controller/gateway');
const { PollController } = require('./controller/poll-controller');

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
        const dbPath = path.join(__dirname, 'db');
        
        // Check if db directory exists
        if (!fs.existsSync(dbPath)) {
            return res.status(404).json({
                success: false,
                message: 'DB directory not found'
            });
        }

        // Read all files in the db directory
        const files = fs.readdirSync(dbPath);
        const jsonFiles = files.filter(file => path.extname(file) === '.json');
        
        for (const file of jsonFiles) {
            try {
                const filePath = path.join(dbPath, file);
                const fileContent = fs.readFileSync(filePath, 'utf8');
                const data = JSON.parse(fileContent);

                if (data && data.chatId && data.selectedDay && data.isRunning) {
                    const dbKey = gateway.dbKey(data.chatId, data.threadId);
                    gateway.subject[dbKey] = new PollController();
                    gateway.subject[dbKey].chatIdDb.setFilePath(dbKey);
                    gateway.subject[dbKey].initDb();
                    // gateway.subject[dbKey].turnOn(
                    //     data.chatId,
                    //     data.threadId,
                    //     Number(data.selectedDay)
                    // );
                    gateway.subject[dbKey].setupCronJobForConfig(data);
                }


            } catch (parseError) {
                console.error(`Error parsing ${file}:`, parseError);
            }
        }
        res.json({ success: true, message: 'Cron jobs restarted successfully!' });
    } catch (error) {
        console.error('Error reading DB files:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to read DB files',
            error: error.message
        });
    }
});

// Send poll endpoint
app.get('/send-poll', async (req, res) => {
    try {
        const promises = Object.keys(gateway.subject).map(async (key) => {
            const pollController = gateway.subject[key];

            return await handleSendPoll(pollController.paramsBot, pollController.range, pollController.cronExpression.CRON_EXPRESSION_CREATE_POLL);
        });
        
        await Promise.all(promises);

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
// app.get('/remind', async (req, res) => {
//     try {
//         await handleSendReminder(pollController.paramsBot);
//         res.json({ success: true, message: 'Reminder sent successfully!' });
//     } catch (error) {
//         console.error('Error sending reminder:', error);
//         res.status(500).json({ 
//             success: false, 
//             message: 'Failed to send reminder',
//             error: error.message 
//         });
//     }
// });

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
