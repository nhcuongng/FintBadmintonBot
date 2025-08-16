const { URL_SEND_MESSAGE } = require('../../constant');

async function handleSendReminder(params) {
    try {
        const res = await fetch(URL_SEND_MESSAGE, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                ...params,
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