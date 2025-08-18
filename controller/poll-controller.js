const JsonDatabase = require('../db');
const cron = require('node-cron');
const { isFunction, get } = require('lodash');

const { handleSendPoll } = require('../controller/create-poll');
const { handleSendReminder } = require('../controller/reminder');

class PollController {
    #isStopForThisWeek;
    #chatId;
    #threadId;
    #isRunning;
    chatIdDb;
    selectedDay;

    // the count of the day from selected day
    range = 3;
    cronTasks = {};

    constructor() {
        this.#isStopForThisWeek = false;
        this.#chatId = '';
        this.#threadId = '';
        this.#isRunning = false;
        this.chatIdDb = new JsonDatabase();
    }

    initDb() {
        try {
            const jsonData = this.chatIdDb.readData();
            if (jsonData) {
                if (jsonData.chatId) {
                    this.setChatId(jsonData.chatId);
                }
                if (jsonData.threadId) {
                    this.#threadId = jsonData.threadId;
                }
                if (jsonData.selectedDay) {
                    this.selectedDay = jsonData.selectedDay;
                }
                if (jsonData.isRunning !== undefined) {
                    this.#isRunning = jsonData.isRunning;
                }
                if (jsonData.isStopForThisWeek !== undefined) {
                    this.#isStopForThisWeek = jsonData.isStopForThisWeek;
                }
            }
        } catch (err) {
            // TODO remind user run command kickoff for save chat id
            console.error('Error reading chat-id.json:', err);
        }
    }

    get paramsBot() {
        return {
            message_thread_id: this.#threadId,
            chat_id: this.#chatId
        };
    };

    get cronExpression() {
        return this.calculateCronExpressions(this.selectedDay);
    }

    /**
     * Calculate cron expressions for given selected day
     */
    calculateCronExpressions(selectedDay) {
        let dayCreatePoll = selectedDay - this.range;
        let dayRemind = selectedDay - 1;

        if (dayCreatePoll <= 0) {
            dayCreatePoll = 7 + dayCreatePoll;
        }

        if (dayRemind <= 0) {
            dayRemind = 7 + dayRemind;
        }

        return {
            CRON_EXPRESSION_CREATE_POLL: `22 10 * * ${dayCreatePoll}`,
            CRON_EXPRESSION_REMIND: `0 22 * * ${dayRemind}`
        };
    }

    setChatId(chatId) {
        this.#chatId = chatId;
    }

    get isCallable() {
        if (!this.#isRunning) return false;

        if (this.#isStopForThisWeek) return false;

        return Boolean(this.#chatId);
    }

    /**
     * Check if operations are callable for given config
     */
    isCallableForConfig(config) {
        const { isRunning, isStopForThisWeek, chatId } = config;
        return isRunning && !isStopForThisWeek && Boolean(chatId);
    }

    pause() {
        this.#isStopForThisWeek = true;
        this.saveState();
    }

    continue() {
        this.#isStopForThisWeek = false;
        this.#isRunning = true;
        this.saveState();
    }

    turnOff() {
        this.#isRunning = false;
        this.#chatId = null;
        this.chatIdDb.removeFile();
    }

    turnOn(chatId, threadId, selectedDay) {
        this.setChatId(chatId);
        this.#threadId = threadId;
        this.#isRunning = true;
        this.selectedDay = selectedDay;

        // Save all state to JSON file
        const stateData = {
            selectedDay, 
            threadId,
            chatId,
            isRunning: this.#isRunning,
            isStopForThisWeek: this.#isStopForThisWeek
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

    cleanPrevCronJob() {
        Object.keys(this.cronTasks).forEach((key) => {
            const threadIdInCron = get(key.split('_'), 0, '');
            const expressionInCron = get(key.split('_'), 1, '');
            if (Number(threadIdInCron) === this.#threadId) {
                if (isFunction(this.cronTasks?.[key]?.stop)) {
                    this.cronTasks?.[key]?.stop();
                    delete this.cronTasks?.[key];
                    console.info('clean the job', expressionInCron, 'for', threadIdInCron);
                }
            }
            
        });
    }

    /**
     * 
     * @param {*} cronExpression 
     * @returns name for cron job
     */
    getCronName(cronExpression) {
        const prefix = this.#threadId || this.#chatId;
        return `${prefix}_${cronExpression}`;
    }

    setupCronJob() {
        this.cleanPrevCronJob();
        const config = {
            chatId: this.#chatId,
            threadId: this.#threadId,
            selectedDay: this.selectedDay,
            isRunning: this.#isRunning,
            isStopForThisWeek: this.#isStopForThisWeek
        };
        this.setupCronJobForConfig(config);
    }

    saveState() {
        const stateData = {
            chatId: this.#chatId,
            threadId: this.#threadId,
            isRunning: this.#isRunning,
            isStopForThisWeek: this.#isStopForThisWeek
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

    /**
     * Setup cron job for a specific configuration
     */
    setupCronJobForConfig(config) {
        const { chatId, threadId, selectedDay, isRunning, isStopForThisWeek } = config;
        
        if (!isRunning || isStopForThisWeek) {
            return;
        }

        const { CRON_EXPRESSION_CREATE_POLL, CRON_EXPRESSION_REMIND } = 
            this.calculateCronExpressions(selectedDay);

        const paramsBot = {
            message_thread_id: threadId,
            chat_id: chatId
        };

        const option = {
            timezone: 'Asia/Ho_Chi_Minh',
            noOverlap: true
        };

        // Create unique cron job names for this config
        const pollCronName = `${threadId || chatId}_${CRON_EXPRESSION_CREATE_POLL}`;
        const reminderCronName = `${threadId || chatId}_${CRON_EXPRESSION_REMIND}`;

        console.info('cron job was setup!', { pollCronName, reminderCronName });

        this.cronTasks[pollCronName] = cron.schedule(
            CRON_EXPRESSION_CREATE_POLL,
            async () => {
                if (!this.isCallableForConfig(config)) {
                    console.error('Không thể tạo poll được cho', chatId);
                    return;
                }
                await handleSendPoll(paramsBot, this.range, CRON_EXPRESSION_CREATE_POLL);
            },
            option
        );

        this.cronTasks[reminderCronName] = cron.schedule(
            CRON_EXPRESSION_REMIND,
            async () => {
                if (!this.isCallableForConfig(config)) {
                    console.error('Không thể nhắc nhở được cho', chatId);
                    return;
                }
                await handleSendReminder(paramsBot);
            },
            option
        );

        console.log(`Setup cron jobs for chatId: ${chatId}, threadId: ${threadId}`);
    }
}

exports.PollController = PollController;
