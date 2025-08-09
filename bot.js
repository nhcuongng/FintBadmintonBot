const { Telegraf } = require('telegraf');
const { pollController } = require('./controller/poll-controller');

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.use(async (ctx, next) => {
    // check quyền
    // nếu trong env có admin thì check
    // nếu ko có bypass hết, nghĩa là ko phân quyền
    if (
        process.env.ADMIN_USERNAME &&
        ctx.message.from.username !== process.env.ADMIN_USERNAME
        && ctx.message.text !== '/help'
    ) {
        ctx.reply(`Bạn không có quyền tương tác với Bot hãy, liên hệ quản trị viên của bạn: @${process.env.ADMIN_USERNAME}`);
        ctx.isReply = false;
    } else {
        ctx.isReply = true;
    }
    await next(); // runs next middleware
});

bot.start((ctx) => {
    const message = 'Chào mừng bạn đến với Cầu Lông Bot! 🏸\n\nSử dụng lệnh /help để xem hướng dẫn sử dụng.';
    ctx.reply(message);
});

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
    `.trim();
    
    await ctx.reply(helpMessage, { parse_mode: 'Markdown' });
});

bot.command('skip', async (ctx) => {
    if (!ctx.isReply) return;

    pollController.pause();
    if (!pollController.isRunning) {
        await ctx.reply('Bot hiện đang bị tắt, chạy /kickoff để khởi động lại Bot', { parse_mode: 'Markdown' });
    } else {
        await ctx.reply('Tuần nghỉ đánh nhé mọi người!');
    }
});

bot.command('kickoff', async (ctx) => {
    if (!ctx.isReply) return;

    await pollController.turnOn(ctx.message.chat.id);
    await ctx.reply('Bot đã được khởi tạo và sẽ tạo poll vào mỗi thứ tư hàng tuần!');
});

bot.command('stop', async (ctx) => {
    if (!ctx.isReply) return;

    pollController.turnOff();
    await ctx.reply('Bot đã tắt, chạy /kickoff để chạy lại Bot!', { parse_mode: 'Markdown' });
});

bot.launch();