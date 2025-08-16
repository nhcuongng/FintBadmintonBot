const { URL_SEND_MESSAGE } = require('../../constant');
const { pollController } = require('../poll-controller');

async function handleSendReminder() {
    console.log('Sending reminder on Thursday.', pollController.isCallable);

    if (!pollController.isCallable) {
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
                ...pollController.paramsBot,
                text: 'Mọi người nhớ chuẩn bị đồ cho ngày mai nhé 🏸',
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
    }
}

exports.handleSendReminder = handleSendReminder;