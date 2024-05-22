require('dotenv').config();
const { Bot, GrammyError, HttpError, Keyboard, InlineKeyboard } = require('grammy');

const { hydrate } = require('@grammyjs/hydrate');

const bot = new Bot(process.env.botToken);

bot.use(hydrate());

bot.api.setMyCommands([
    {
        command: 'start',
        description: 'Launch the bot'
    },
    {
        command: 'say_hello',
        description: 'Show greeting message'
    },
    {
        command: 'mood',
        description: 'Get question'
    },
    {
        command: 'inline_keyboard',
        description: 'Inline keyboard'
    }
]);

// bot.on('message', async (ctx) => {
//     await ctx.reply('We need to think about it...')
// });

// bot.command(['say_hello', 'hello', 'say_hi'], async (ctx) => {
//     await ctx.reply('Hello!');
// });

bot.command('start', async (ctx) => {
    await ctx.react('🔥');
    await ctx.reply('Hello\\! I am a bot\\. TG channel: [this is a link](https://t.me/istorichnost_ne_predel)', {
        parse_mode: 'MarkdownV2',
        disable_web_page_preview: true
    });
});

bot.command('mood', async (ctx) => {
    const keyboard = new Keyboard().text('Good').row().text('Normal').row().text('Bad').resized();
    // const labels = ['good', 'normal', 'bad'];
    // const buttonRows = labels.map((label) => [Keyboard.text(label)]);
    // const keyboard = Keyboard.from(buttonRows).resized();
    await ctx.reply('How are you?', {
        reply_markup: keyboard
    });
});

bot.command('share', async (ctx) => {
    const shareKeyboard = new Keyboard().requestLocation('Geolocation').row().requestContact('Contact').row().requestPoll('Poll').placeholder('Input data').resized();

    await ctx.reply('What do you want to share?', {
        reply_markup: shareKeyboard
    });
});

bot.command('inline_keyboard', async (ctx) => {
    // const inlineKeyboard = new InlineKeyboard()
    // .text('1', 'button-1').row()
    // .text('2', 'button-2').row()
    // .text('3', 'button-3')

    const inlineKeyboard2 = new InlineKeyboard()
    .url('Go to the channel', 'https://t.me/istorichnost_ne_predel');

    await ctx.reply('Press button.', {
        reply_markup: inlineKeyboard2
    });
});

bot.callbackQuery(/button-[1-3]/, async (ctx) => {
    await ctx.answerCallbackQuery();
    await ctx.reply(`You have pressed a button: ${ctx.callbackQuery.data}`);
});

// bot.on('callback_query:data', async (ctx) => {
//     await ctx.answerCallbackQuery();
//     await ctx.reply(`You have pressed a button: ${ctx.callbackQuery.data}`);
// });

bot.on(':contact', async (ctx) => {
    await ctx.reply('Data received.');
});

bot.hears('Good', async (ctx) => {
    await ctx.reply('👍', {
        reply_markup: {remove_keyboard: true}
    });
});



bot.catch((err) => {
    const ctx = err.ctx;
    console.error('Error while handling update ${ctx.update_id}:');
    const e = err.error;

    if (e instanceof GrammyError) {
        console.error('Error in request:', e.description);
    } else if (e instanceof HttpError) {
        console.error('Cloud not contact Telegram:', e);
    } else {
        console.error('Unknown error:', e);
    }
});

bot.start();
