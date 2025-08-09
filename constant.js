const URL_BASE = `https://api.telegram.org/bot${process.env.BOT_TOKEN}`

const URL_SEND_POLL = `${URL_BASE}/sendPoll`;

const URL_SEND_MESSAGE = `${URL_BASE}/sendMessage`;

//NOTE - this is chat id for test only purpose
const CHAT_ID = "-4980809143";

module.exports = {
    URL_SEND_POLL,
    URL_SEND_MESSAGE,
    // CHAT_ID,
    URL_BASE
};