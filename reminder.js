const cron = require('node-cron');

const { URL_SEND_MESSAGE } = require('./constant');
const { pollManager } = require('./poll-manager');

async function handleSendReminder() {
    console.log('Sending reminder on Thursday.', pollManager.isCallable);

    if (!pollManager.isCallable) {
        throw new Error('Không thể tạo poll được');
    };

    try {
        const res = await fetch(URL_SEND_MESSAGE, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                chat_id: pollManager.chat_id,
                text: "Mọi người nhớ chuẩn bị đồ cho ngày mai nhé 🏸",
                disable_notification: false
            })
        });
        
        if (res.status === 200) {
            console.log('Đã gửi nhắc nhở thành công!');
        } else {
            const errorData = await res.json();
            throw new Error(JSON.stringify(errorData));
        }
    } catch (error) {
        console.error('Không gửi được nhắc nhở:', error);
        // throw error
    }
}

const CRON_EXPRESSION_ON_THURSDAY = '0 22 * * 4'

// Chạy vào thứ năm hàng tuần lúc 22 giờ chiều
cron.schedule(CRON_EXPRESSION_ON_THURSDAY, handleSendReminder);

exports.handleSendReminder = handleSendReminder;