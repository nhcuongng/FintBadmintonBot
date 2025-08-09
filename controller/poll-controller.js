const JsonDatabase = require('../db');

class PollController {
    constructor() {
        this.isStopForThisWeek = false;
        this.chatId = '';
        this.isRunning = false;
        this.chatIdDb = new JsonDatabase();
        
        try {
            const jsonData = this.chatIdDb.readData();
            if (jsonData) {
                if (jsonData.chatId) {
                    this.setChatId(jsonData.chatId);
                }
                if (jsonData.isRunning !== undefined) {
                    this.isRunning = jsonData.isRunning;
                }
                if (jsonData.isStopForThisWeek !== undefined) {
                    this.isStopForThisWeek = jsonData.isStopForThisWeek;
                }
            }
        } catch (err) {
            // TODO remind user run command kickoff for save chat id
            console.error('Error reading chat-id.json:', err);
        }
    }

    setChatId(chatId) {
        this.chatId = chatId;
    }

    get isCallable() {
        if (!this.isRunning) return false;

        if (this.isStopForThisWeek) return false;

        return Boolean(this.chatId);
    }

    pause() {
        this.isStopForThisWeek = true;
        this.saveState();
    }

    continue() {
        this.isStopForThisWeek = false;
        this.isRunning = true;
        this.saveState();
    }

    turnOff() {
        this.isRunning = false;
        this.chatId = null;
        this.chatIdDb.removeFile();
    }

    turnOn(chatId) {
        this.setChatId(chatId);
        this.isRunning = true;

        // Save all state to JSON file
        const stateData = { 
            chatId,
            isRunning: this.isRunning,
            isStopForThisWeek: this.isStopForThisWeek
        };

        try {
            if (!this.chatIdDb.fileExists()) {
                this.chatIdDb.writeData(stateData);
            } else {
                this.chatIdDb.updateData(stateData);
            }
        } catch (error) {
            throw new Error('Error saving state to file:', error);
        }
    }

    saveState() {
        const stateData = {
            chatId: this.chatId,
            isRunning: this.isRunning,
            isStopForThisWeek: this.isStopForThisWeek
        };

        try {
            if (this.chatIdDb.fileExists()) {
                this.chatIdDb.updateData(stateData);
            } else {
                this.chatIdDb.writeData(stateData);
            }
        } catch (error) {
            console.error('Error saving state:', error);
        }
    }
}

const pollController = new PollController();

exports.pollController = pollController;
