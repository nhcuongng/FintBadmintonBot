const { Telegraf } = require('telegraf');
const { pollController } = require('./controller/poll-controller');
const { chunk, find } = require('lodash');

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.use(async (ctx, next) => {
    // check quyền
    // nếu trong env có admin thì check
    // nếu ko có bypass hết, nghĩa là ko phân quyền
    
    const messageInfo = (ctx.message || ctx.callbackQuery)?.from;
    
    if (
        process.env.ADMIN_USERNAME &&
        messageInfo?.username !== process.env.ADMIN_USERNAME
        && messageInfo?.text !== '/help'
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

    await ctx.reply('Bot đã được khởi tạo, hãy chọn một ngày trong tuần để đặt lich định kỳ!', {
        reply_markup: {
            inline_keyboard: chunk(pollController.dayOfTheWeek, 2)
        }
    });
});

bot.command('stop', async (ctx) => {
    if (!ctx.isReply) return;

    pollController.turnOff();
    await ctx.reply('Bot đã tắt, chạy /kickoff để chạy lại Bot!', { parse_mode: 'Markdown' });
});

bot.on('callback_query', async (ctx) => {
    if (!ctx.isReply) return;

    // Init the poll controller
    await pollController.turnOn(
        ctx.callbackQuery.message.chat.id,
        ctx.callbackQuery.message.message_thread_id,
        ctx.callbackQuery.data
    );

    // setup cron job base on selected day
    pollController.setupCronJob();

    console.info('cron job was setup!', pollController.cronExpression);

    await ctx.telegram.answerCbQuery(ctx.callbackQuery.id,
        `Lịch cố định đã được đặt vào: ${find(pollController.dayOfTheWeek, { callback_data: ctx.callbackQuery.data })?.text }`    
    );
  
    // Using context shortcut
    await ctx.answerCbQuery('done');
});

// bot.on('inline_query', async (ctx) => {
//     const result = [
//         {
//             type: 'article',
//             id: 'monday',
//             title: 'Thứ Hai',
//             input_message_content: {
//                 message_text: 'Ngày đã chọn: Thứ Hai'
//             },
//             description: 'Chọn Thứ Hai'
//         },
//         {
//             type: 'article',
//             id: 'tuesday',
//             title: 'Thứ Ba',
//             input_message_content: {
//                 message_text: 'Ngày đã chọn: Thứ Ba'
//             },
//             description: 'Chọn Thứ Ba'
//         },
//         {
//             type: 'article',
//             id: 'wednesday',
//             title: 'Thứ Tư',
//             input_message_content: {
//                 message_text: 'Ngày đã chọn: Thứ Tư'
//             },
//             description: 'Chọn Thứ Tư'
//         },
//         {
//             type: 'article',
//             id: 'thursday',
//             title: 'Thứ Năm',
//             input_message_content: {
//                 message_text: 'Ngày đã chọn: Thứ Năm'
//             },
//             description: 'Chọn Thứ Năm'
//         },
//         {
//             type: 'article',
//             id: 'friday',
//             title: 'Thứ Sáu',
//             input_message_content: {
//                 message_text: 'Ngày đã chọn: Thứ Sáu'
//             },
//             description: 'Chọn Thứ Sáu'
//         }
//     ];

//     // Explicit usage
//     await ctx.telegram.answerInlineQuery(ctx.inlineQuery.id, result);

  
//     // Using context shortcut
//     await ctx.answerInlineQuery(result);
// });

bot.launch();