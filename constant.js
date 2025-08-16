const URL_BASE = `https://api.telegram.org/bot${process.env.BOT_TOKEN}`;

const URL_SEND_POLL = `${URL_BASE}/sendPoll`;

const URL_SEND_MESSAGE = `${URL_BASE}/sendMessage`;

const DAY_OF_THE_WEEK = [
    { text: 'Thứ Hai', callback_data: '1' },
    { text: 'Thứ Ba', callback_data: '2' },
    { text: 'Thứ Tư', callback_data: '3' },
    { text: 'Thứ Năm', callback_data: '4' },
    { text: 'Thứ Sáu', callback_data: '5' }
];

module.exports = {
    URL_SEND_POLL,
    URL_SEND_MESSAGE,
    URL_BASE,
    DAY_OF_THE_WEEK
};