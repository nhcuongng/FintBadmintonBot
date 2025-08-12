require('dotenv').config();
const cron = require('node-cron');

const { handleSendPoll } = require('./controller/create-poll');
const { handleSendReminder } = require('./controller/reminder');

// execute the bot's tasks
require('./bot');
require('./server');

try {
    // 10h22 thứ tư hàng tuần
    // const CRON_EXPRESSION_ON_WEDNESDAY = '22 10 * * 3';
    // 22h thứ 5 hàng tuần
    // const CRON_EXPRESSION_ON_THURSDAY = '0 22 * * 4';

    const CRON_EXPRESSION_ON_WEDNESDAY = '0 23 * * 2';
    const CRON_EXPRESSION_ON_THURSDAY = '15 23 * * 2';

    // Chạy vào thứ tư hàng tuần
    cron.schedule(CRON_EXPRESSION_ON_WEDNESDAY, handleSendPoll, {
        timezone: 'Asia/Ho_Chi_Minh'
    });

    // Chạy vào thứ năm hàng tuần lúc 22 giờ chiều
    cron.schedule(CRON_EXPRESSION_ON_THURSDAY, handleSendReminder, {
        timezone: 'Asia/Ho_Chi_Minh'
    });
} catch (error) {
    console.error('cron job không thể chạy', error);
}