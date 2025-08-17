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
    #selectedDay;

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
        let CRON_EXPRESSION_CREATE_POLL = '';
        let CRON_EXPRESSION_REMIND = '';

        // Create the poll before the match
        let dayCreatePoll = this.#selectedDay - this.range;

        // Remind everyone before the match one day
        let dayRemind = this.#selectedDay - 1;

        if (dayCreatePoll <= 0) {
            dayCreatePoll = 7 + dayCreatePoll;
        }

        if (dayRemind <= 0) {
            dayRemind = 7 + dayRemind;
        }

        CRON_EXPRESSION_CREATE_POLL = `22 10 * * ${dayCreatePoll}`;

        CRON_EXPRESSION_REMIND = `0 22 * * ${dayRemind}`;

        return {
            CRON_EXPRESSION_CREATE_POLL,
            CRON_EXPRESSION_REMIND
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
        this.#selectedDay = selectedDay;

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

        const {
            CRON_EXPRESSION_CREATE_POLL,
            CRON_EXPRESSION_REMIND
        } = this.cronExpression;
        const option = {
            timezone: 'Asia/Ho_Chi_Minh',
            noOverlap: true
        };

        this.cronTasks[this.getCronName(CRON_EXPRESSION_CREATE_POLL)] = cron.schedule(
            CRON_EXPRESSION_CREATE_POLL,
            async () => {
                if (!this.isCallable) {
                    pollController.continue();
                    console.error('Không thể tạo poll được');
                    return;
                };

                await handleSendPoll(this.paramsBot,this.range, CRON_EXPRESSION_CREATE_POLL);
            },
            option
        );

        this.cronTasks[this.getCronName(CRON_EXPRESSION_REMIND)] = cron.schedule(
            CRON_EXPRESSION_REMIND,
            async () => {
                if (!pollController.isCallable) {
                    console.error('Không thể nhắc nhở được');
                    return;
                };
                await handleSendReminder(this.paramsBot);
            },
            option
        );
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
}

const pollController = new PollController();

exports.pollController = pollController;
