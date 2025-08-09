const URL_BASE = `https://api.telegram.org/bot${process.env.BOT_TOKEN}`;

const URL_SEND_POLL = `${URL_BASE}/sendPoll`;

const URL_SEND_MESSAGE = `${URL_BASE}/sendMessage`;

module.exports = {
    URL_SEND_POLL,
    URL_SEND_MESSAGE,
    URL_BASE
};