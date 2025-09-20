require('dotenv').config();
const express = require('express');
const fs = require('fs');
const path = require('path');
const { CronExpressionParser } = require('cron-parser');
const cronstrue = require('cronstrue');
const { TIME_ZONE } = require('./constant');
const dayjs = require('dayjs');
const { formatDateWithVietnameseDay } = require('./utils/date');
const { callApiTelegramCreatePoll } = require('./controller/create-poll');
const { listUser } = require('./utils/drive');

const { gateway } = require('./controller/gateway');
const { PollController } = require('./controller/poll-controller');
const { handleSendMonthlyCollection } = require('./controller/collect-money-monthly');

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(express.json());

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './web/index.html'));
});

app.get('/get-sheetId', (req, res) => {
    try {
        const { threadId } = req.query;
        
        if (!threadId) {
            return res.status(400).json({
                success: false,
                message: 'threadId query parameter is required'
            });
        }

        const subject = gateway.getPollControllerByThreadId(threadId);
        
        if (!subject) {
            return res.status(404).json({
                success: false,
                message: 'Poll controller not found for the given threadId'
            });
        }

        res.json({
            success: true,
            sheetId: subject.sheetId
        });
    } catch (error) {
        console.error('Error getting sheetId:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get sheetId',
            error: error.message
        });
    }
});

app.post('/send-collect-notification', async (req, res) => {
    try {
        const {
            threadId
        } = req.body;

        if (threadId) {
            const subject = gateway.getPollControllerByThreadId(threadId);

            const [userFunded, allUser] = await listUser(subject.sheetId);
    
            if (userFunded.length === 0) {
                res.json({
                    success: true,
                    message: 'Mọi người đã đóng đầy đủ',
                    userFunded
                });
                return;
            }
    
            handleSendMonthlyCollection(subject.paramsBot, userFunded, subject.sheetId, allUser);

            res.json({
                success: true,
                userFunded,
                message: 'Những người chưa đóng tiền đã được nhắc nhở'
            });

            return;
        }

        res.json({
            success: false,
            message: 'No thread id found'
        });
    } catch (error) {
        res.json({
            success: false,
            message: error?.message
        });
    }

});

app.post('/update-sheet-id', (req, res) => {
    try {
        const {
            sheetId,
            threadId
        } = req.body;

        if (threadId) {
            const subject = gateway.getPollControllerByThreadId(threadId);

            if (subject) {
                subject.sheetId = sheetId;
                subject.saveState();
            }

            res.json({
                success: true,
                message: 'Update sheet id success'
            });

            return;
        }

        res.json({
            success: false,
            message: 'No thread id found'
        });
    } catch (error) {
        res.json({
            success: false,
            message: error?.message
        });
    }
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

            const closestDate = dayjs().day(pollController.selectedDay);
            const dateString = formatDateWithVietnameseDay(closestDate);

            return await callApiTelegramCreatePoll(pollController.paramsBot, dateString);
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
