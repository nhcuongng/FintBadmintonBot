const dayjs = require('dayjs');
const { URL_SEND_MESSAGE } = require('../../constant');
const { formatWithVietnameseMonth } = require('../../utils/date');

async function handleSendMonthlyCollection(params, userList, sheetId, allUser) {
    const currentDate = dayjs();
    const formattedDate = formatWithVietnameseMonth(currentDate);

    await callApiTelegramSendMessage(params, formattedDate, userList, sheetId, allUser);
}

async function callApiTelegramSendMessage(params, dateString, userList, sheetId, allUser) {
    const urlSendMessage = URL_SEND_MESSAGE;

    const moneyAmount = parseFloat(Math.round(2000000 / allUser.length / 1000) * 1000).toFixed(0);

    // Format user list with mentions
    const userMentions = userList.filter((item) => item).map(user => `@${user}`).join(' ');
    
    // Format money amount with Vietnamese currency
    const formattedAmount = new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(moneyAmount);
    
    try {
        const res = await fetch(urlSendMessage, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                ...params,
                text: `💰 Thu tiền quỹ cầu lông hàng tháng - ${dateString}\n\nSố thành viên đánh định kỳ: ${allUser.length}\n\nSố tiền mỗi thành viên phải đóng: ${formattedAmount}\n\nCác thành viên chưa đóng: ${userMentions}\n\n📊 Quỹ CLB: https://docs.google.com/spreadsheets/d/${sheetId}/`,
                'disable_notification': false
            })
        });
        
        if (res.status === 200) {
            console.log('Đã gửi thông báo thu tiền thành công!');
        } else {
            const errorData = await res.json();
            throw new Error(JSON.stringify(errorData));
        }
    } catch (error) {
        console.error('Không gửi được thông báo thu tiền:', error);
    }
}

exports.handleSendMonthlyCollection = handleSendMonthlyCollection;
exports.callApiTelegramSendMessage = callApiTelegramSendMessage;