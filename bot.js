const { Telegraf } = require('telegraf')
const { v4: uuidV4 } = require('uuid')
const { message } = require('telegraf/filters')
const { pollManager } = require('./poll-manager')
const fs = require('fs');

const bot = new Telegraf(process.env.BOT_TOKEN)

bot.start((ctx) => {
    let message = `Chào mừng bạn đến với Cầu Lông Bot! 🏸\n\nSử dụng lệnh /help để xem hướng dẫn sử dụng.`
    ctx.reply(message)
})

bot.command('help', async (ctx) => {
    const helpMessage = `
🏸 **CẦU LÔNG BOT - HƯỚNG DẪN SỬ DỤNG**

📋 **Các lệnh có sẵn:**

/kickoff - Khởi động bot và tạo poll tự động mỗi thứ tư
/skip - Tạm dừng poll cho tuần này (nghỉ đánh)
/stop - Tắt bot và dừng tất cả poll tự động
/help - Hiển thị hướng dẫn này

💡 **Cách sử dụng:**
1. Sử dụng /kickoff để bắt đầu
2. Bot sẽ tự động tạo poll mỗi thứ tư
3. Sử dụng /skip nếu muốn nghỉ tuần nào đó
4. Sử dụng /stop để dừng hoàn toàn

🎯 **Mục đích:** Giúp tổ chức lịch đánh cầu lông hàng tuần một cách thuận tiện!
    `.trim()
    
    await ctx.reply(helpMessage, { parse_mode: 'Markdown' })
})

bot.command('skip', async (ctx) => {
    pollManager.pause();
        if (!pollManager.isRunning) {
            await ctx.reply('Bot hiện đang bị tắt, chạy /kickoff để khởi động lại Bot', { parse_mode: 'Markdown' })
        } else {
            await ctx.reply('Tuần nghỉ đánh nhé mọi người!')
        }
})

bot.command('kickoff', async (ctx) => {
    await pollManager.turnOn(ctx.message.chat.id);
    await ctx.reply('Bot đã được khởi tạo và sẽ tạo poll vào mỗi thứ tư hàng tuần!')
})

bot.command('stop', async (ctx) => {
    pollManager.turnOff();
    await ctx.reply('Bot đã tắt, chạy /kickoff để chạy lại Bot!', { parse_mode: 'Markdown' })
})

bot.launch()