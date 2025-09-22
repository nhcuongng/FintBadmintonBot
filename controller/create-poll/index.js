const dayjs = require('dayjs');
const { URL_SEND_POLL } = require('../../constant');
const { formatDateWithVietnameseDay } = require('../../utils/date');

async function handleSendPoll(params, range) {
    const nextPlayDate = dayjs().add(range, 'day');
    const formattedDate = formatDateWithVietnameseDay(nextPlayDate);

    return await callApiTelegramCreatePoll(params, formattedDate);
}

async function callApiTelegramCreatePoll(params, dateString) {
    const urlSendPoll = URL_SEND_POLL;

    try {
        const res = await fetch(urlSendPoll, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                ...params,
                question: `🏸 Anh chị em ơi! Lịch đánh cầu tuần này: ${dateString}. Mọi người tham gia nhé!`,
                options: ['Tham gia chắc chắn luôn! 💪', 'Xin phép bận rồi 😢'],
                'disable_notification': false,
                is_anonymous: false
            })
        });

        if (res.status === 200) {
            const body = await res.json();
            const messageId = body.result.message_id;
            console.log('Đã gửi thăm dò thành công!');
            return messageId;
        } else {
            const errorData = await res.json();
            throw new Error(JSON.stringify(errorData));
        }
    } catch (error) {
        console.error('Không gửi được thăm dò:', error);
    }
}

exports.handleSendPoll = handleSendPoll;
exports.callApiTelegramCreatePoll =callApiTelegramCreatePoll;
