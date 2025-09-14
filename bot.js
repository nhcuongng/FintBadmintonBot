const { Telegraf } = require('telegraf');
const { chunk, find } = require('lodash');
const { gateway } = require('./controller/gateway');
const { DAY_OF_THE_WEEK } = require('./constant');

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.use(async (ctx, next) => {
    const messageInfo = (ctx.message || ctx.callbackQuery)?.from;
    
    // check quyền
    // nếu trong env có admin thì check
    // nếu ko có bypass hết, nghĩa là ko phân quyền
    if (
        process.env.ADMIN_USERNAME &&
        messageInfo?.username !== process.env.ADMIN_USERNAME
        && messageInfo?.text !== '/help'
    ) {
        // ctx.reply(`Bạn không có quyền tương tác với Bot hãy, liên hệ quản trị viên của bạn: @${process.env.ADMIN_USERNAME}`);
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

/kickoff - Khởi động bot và tạo poll tự động theo lựa chọn
/skip - Tạm dừng poll cho tuần này (nghỉ đánh)
/stop - Tắt bot và dừng tất cả poll tự động
/help - Hiển thị hướng dẫn này

💡 **Cách sử dụng:**
1. Sử dụng /kickoff để bắt đầu
2. Bot sẽ tự động tạo poll trước 2 ngày và nhắc nhở mang đồ trước một ngày
3. Sử dụng /skip nếu muốn nghỉ tuần nào đó
4. Sử dụng /stop để dừng hoàn toàn

🎯 **Mục đích:** Giúp tổ chức lịch đánh cầu lông hàng tuần một cách thuận tiện!
    `.trim();
    
    await ctx.reply(helpMessage, { parse_mode: 'Markdown' });
});

bot.command('skip', async (ctx) => {
    if (!ctx.isReply) return;

    gateway.getPollController(ctx).pause();
    if (!gateway.getPollController(ctx).isRunning) {
        await ctx.reply('Bot hiện đang bị tắt, chạy /kickoff để khởi động lại Bot', { parse_mode: 'Markdown' });
    } else {
        await ctx.reply('Tuần nghỉ đánh nhé mọi người!');
    }
});

bot.command('continue', (ctx) => {
    if (!ctx.isReply) return;
    gateway.getPollController(ctx).continue();
});

bot.command('kickoff', async (ctx) => {
    if (!ctx.isReply) return;

    await ctx.reply('Bot đã được khởi tạo, hãy chọn một ngày trong tuần để đặt lich định kỳ!', {
        reply_markup: {
            inline_keyboard: chunk(DAY_OF_THE_WEEK, 2)
        }
    });
});

bot.command('stop', async (ctx) => {
    if (!ctx.isReply) return;

    gateway.getPollController(ctx).turnOff();
    await ctx.reply('Bot đã tắt, chạy /kickoff để chạy lại Bot!', { parse_mode: 'Markdown' });
});

bot.on('callback_query', async (ctx) => {
    if (!ctx.isReply) {
        await ctx.answerCbQuery(`Đừng cố gắng vì tôi chỉ nhận lệnh từ người tạo ra tuyệt tác này 😍 @${process.env.ADMIN_USERNAME}`, {
            show_alert: true
        });
        return;
    };

    // Init the poll controller
    await gateway.getPollController(ctx).turnOn(
        ctx.callbackQuery.message.chat.id,
        ctx.callbackQuery.message.message_thread_id,
        Number(ctx.callbackQuery.data),
        ctx.callbackQuery.message.chat.title
    );

    // setup cron job base on selected day
    gateway.getPollController(ctx).setupCronJob();

    await ctx.telegram.answerCbQuery(ctx.callbackQuery.id,
        `Lịch cố định đã được đặt vào: ${find(DAY_OF_THE_WEEK, { callback_data: ctx.callbackQuery.data })?.text }`    
    );
});

bot.launch();