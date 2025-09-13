require('dotenv').config();
const express = require('express');
const fs = require('fs');
const path = require('path');
const { CronExpressionParser } = require('cron-parser');
const cronstrue = require('cronstrue');
const { TIME_ZONE } = require('./constant');

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
    res.sendFile(path.join(__dirname, './web/index.html'));
});

app.get('/index.js', (req, res) => {
    res.sendFile(path.join(__dirname, './web/index.js'));
});

app.get('/cron-list', (req, res) => {
    try {
        const groupedCronJobs = {};
        
        Object.keys(gateway.subject).forEach((key) => {
            const pollController = gateway.subject[key];
            
            // if (!pollController.isCallable) continue;
            
            const { cronExpression, badmintonFieldName: fieldNumber, paramsBot, chatTitle } = pollController;
            
            // Initialize array for this field if it doesn't exist
            groupedCronJobs[fieldNumber] = groupedCronJobs[fieldNumber] || [];
            
            // Helper function to add cron job info to the grouped jobs
            const addCronJobInfo = (type, expression) => {
                const interval = CronExpressionParser.parse(expression, { tz: TIME_ZONE });
                groupedCronJobs[fieldNumber].push({
                    type,
                    chatId: paramsBot.chat_id,
                    threadId: paramsBot.message_thread_id,
                    cronExpression: expression,
                    description: cronstrue.toString(expression),
                    theNextDayWillSend: interval.next().toDate(),
                    chatTitle,
                    badmintonFieldNumber: fieldNumber,
                    isCallable: pollController.isCallable || false
                });
            };
            
            // Add create poll job info
            addCronJobInfo('create_poll', cronExpression.CRON_EXPRESSION_CREATE_POLL);
            
            // Add reminder job info
            addCronJobInfo('reminder', cronExpression.CRON_EXPRESSION_REMIND);});
        
        res.json({ 
            success: true, 
            cronJobs: groupedCronJobs 
        });
    } catch (error) {
        console.error('Error getting cron list:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get cron list',
            error: error.message
        });
    }
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

                if (data && data.chatId && data.selectedDay) {
                    const dbKey = gateway.dbKey(data.chatId, data.threadId);
                    gateway.subject[dbKey] = new PollController();
                    gateway.subject[dbKey].chatIdDb.setFilePath(dbKey);
                    gateway.subject[dbKey].initDb();
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
