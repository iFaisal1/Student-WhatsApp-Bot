const { Client, Location, List, Buttons, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: { 
        headless: true,
        args: ['--no-sandbox'],
    }
});

const replys = {
    '!الردود': `- الردود المتاحة في البوت
    1- !المكافاة 
    2- !مواد السنة العامة
    3- !السورس 
    لسى افكر بالباقي :) `,


    '!مواد السنة العامة': `▪️مواد السنة العامة
▫️الترم الأول : 
 - أخلاقيات الحوسبة ( ساعتين )
- أساليب الكتابة العلمية ( ساعتين )
- تفاضل وتكامل 2 ( 3 ساعات )
- مقدمة في البرمجة ( 3 ساعات )
- إحصاء ( 3 ساعات )
▫️الترم الثاني :
- الجبر الخطي ( 3 ساعات )
- البرمجة الشيئية 1 ( 3 ساعات )
- ثقافة 1 ( 3 ساعات )
- رياضيات متقطعة حاسوبية ( 3 ساعات )
- فيزياء 2 ( 4 ساعات )`,


  '!السورس': 'https://github.com/iFaisal1/Student-WhatsApp-Bot'
};

client.initialize();

client.on('loading_screen', (percent, message) => {
    console.log('LOADING SCREEN', percent, message);
});

client.on('qr', qr => {
    qrcode.generate(qr, {small: true});
});

client.on('authenticated', () => {
    console.log('AUTHENTICATED');
});

client.on('auth_failure', msg => {
    console.error('AUTHENTICATION FAILURE', msg);
});

client.on('ready', () => {
    console.log('READY');
});

client.on('message', async msg => {
 const chat = await msg.getChat();
     if (chat.isGroup) {
      if (replys[msg.body]) {
        msg.reply(replys[msg.body]);
       }
      if (msg.body === "!المكافاة") {
        msg.reply(calculateTimeUntilSalary());
       }
    }
});

client.on('disconnected', (reason) => {
    console.log('Client was logged out', reason);
});

function calculateTimeUntilSalary() {
    const today = new Date();
    const salaryDay = 27;
    let nextSalaryDate = new Date(today.getFullYear(), today.getMonth(), salaryDay);

    if (nextSalaryDate.getDay() === 5) {
        nextSalaryDate.setDate(nextSalaryDate.getDate() - 1);
    } else if (nextSalaryDate.getDay() === 6) {
        nextSalaryDate.setDate(nextSalaryDate.getDate() + 1);
    }

    const timeUntilSalary = nextSalaryDate.getTime() - today.getTime();

    const days = Math.floor(timeUntilSalary / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeUntilSalary % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeUntilSalary % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeUntilSalary % (1000 * 60)) / 1000);

    return `متبقي على المكافاة: 
${days} يوم, ${hours} ساعة, ${minutes} دقيقة, ${seconds} ثانية`;
}