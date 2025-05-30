const twilio = require('twilio');
const dotenv = require('dotenv');
dotenv.config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

const client = twilio(accountSid, authToken);

const sendWhatsApp = async (to, message) => {
    try {
        const response = await client.messages.create({
            body: message,
            from: process.env.TWILIO_WHATSAPP_NUMBER,
            to: `whatsapp:${to}`
        });
        console.log('WhatsApp sent successfully:');
    } catch (error) {
        console.error('Error sending SMS:', error);
    }
};

module.exports = sendWhatsApp;