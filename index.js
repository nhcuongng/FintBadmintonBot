require('dotenv').config()
const cron = require('node-cron');

const { handleSendPoll } = require('./controller/create-poll');
const { handleSendReminder } = require('./controller/reminder');

// execute the bot's tasks
require('./bot')

try {
    const CRON_EXPRESSION_ON_WEDNESDAY = '22 10 * * 3'
    const CRON_EXPRESSION_ON_THURSDAY = '0 22 * * 4'

    // Chạy vào thứ tư hàng tuần
    cron.schedule(CRON_EXPRESSION_ON_WEDNESDAY, handleSendPoll);

    // Chạy vào thứ năm hàng tuần lúc 22 giờ chiều
    cron.schedule(CRON_EXPRESSION_ON_THURSDAY, handleSendReminder);
} catch (error) {
    console.error('cron job không thể chạy', error)
}