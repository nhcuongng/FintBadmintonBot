const fs = require('fs');

class PollManager {
    constructor() {
        this.isStopForThisWeek = false;
        this.chat_id = '';
        this.isRunning = false;
        
        try {
            const data = fs.readFileSync('chat-id.json', 'utf8');
            const jsonData = JSON.parse(data);
            if (jsonData && jsonData.chatId) {
                this.setChatId(jsonData.chatId);
            }
        } catch (err) {
            // TODO remind user run command kickoff for save chat id
            console.error('Error reading chat-id.json:', err);
        }
    }

    setChatId(chat_id) {
        this.chat_id = chat_id;
    }

    get isCallable() {
        if (!this.isRunning) return false;

        if (this.isStopForThisWeek) return false;

        return Boolean(this.chat_id)
    }

    pause() {
        this.isStopForThisWeek = true;
    }

    continue() {
        this.isStopForThisWeek = false;
        this.isRunning = true;
    }

    turnOff() {
        this.isRunning = false;
        this.chat_id = null;
        // Remove chat-id.json file
        try {
            if (fs.existsSync('./chat-id.json')) {
                fs.unlinkSync('./chat-id.json');
                console.log('Chat ID file removed');
            }
        } catch (error) {
            console.error('Error removing chat ID file:', error);
        }
    }

    async turnOn(chatId) {
        this.setChatId(chatId)
        this.isRunning = true;

        // Save chat ID to a JSON file
        const chatData = { chatId };

        try {
        if (!fs.existsSync('./chat-id.json')) {
            fs.writeFileSync('./chat-id.json', JSON.stringify(chatData, null, 2));
            console.log('Chat ID saved to chat-id.json');
        } else {
            console.log('Chat ID file already exists, not overwriting.');
        }} catch (error) {
            throw new Error('Error saving chat ID to file:', error);
        }
    }
}

const pollManager = new PollManager();

exports.pollManager = pollManager;
