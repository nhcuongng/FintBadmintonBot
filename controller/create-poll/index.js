const dayjs = require('dayjs');
const { URL_SEND_POLL } = require('../../constant');
const { pollController } = require('../poll-controller');

async function handleSendPoll() {
    console.log('At 10:22 on Wednesday.');

    if (!pollController.isCallable) {
        pollController.continue();
        throw new Error('Không thể tạo poll được');
    };

    const urlSendPoll = URL_SEND_POLL;
    // First, let's format the date in Vietnamese style
    const nextPlayDate = dayjs().add(2, 'day');
    const formattedDate = `${nextPlayDate.format('DD/MM/YYYY')} (${nextPlayDate.day() === 0 ? 'Chủ Nhật' : `Thứ ${nextPlayDate.day() + 1}`})`;

    try {
        const res = await fetch(urlSendPoll, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                chat_id: pollController.chatId,
                question: `🏸 Anh chị em ơi! Lịch đánh cầu tuần này: ${formattedDate}. Mọi người tham gia nhé!`,
                options: ['Tham gia chắc chắn luôn! 💪', 'Xin phép bận rồi 😢', 'Có thể tham gia (xác nhận sau) 🤔'],
                'disable_notification': false,
                is_anonymous: false
            })
        });
        
        if (res.status === 200) {
            console.log('Đã gửi thăm dò thành công!');
        } else {
            const errorData = await res.json();
            throw new Error(JSON.stringify(errorData));
        }
    } catch (error) {
        console.error('Không gửi được thăm dò:', error);
    }
}

exports.handleSendPoll = handleSendPoll;
