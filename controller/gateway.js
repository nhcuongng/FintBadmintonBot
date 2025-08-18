const { PollController } = require('./poll-controller');

class Gateway {
    subject = {};

    dbKey(chatId, threadId) {
        return `${chatId}_${threadId}`;
    }

    objectKey(ctx) {
        const chatId = ctx.callbackQuery?.message?.chat?.id || ctx.message?.chat?.id;
        const threadId = ctx.callbackQuery?.message?.message_thread_id || ctx.message?.message_thread_id;

        return this.dbKey(chatId, threadId);
    }

    getPollController(ctx) {
        const key = this.objectKey(ctx);

        if (!this.subject[key]) {
            this.subject[key] = new PollController();
        }

        this.subject[key].chatIdDb.setFilePath(key);
        this.subject[key].initDb();

        return this.subject[key];
    }
}

const gateway = new Gateway();

exports.gateway = gateway;