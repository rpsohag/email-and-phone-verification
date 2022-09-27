const dotenv = require('dotenv').config();
const twilio = require('twilio')(process.env.SID, process.env.AUTH_TOKEN);


const twilio_cell = process.env.TWILIO_CELL;

// create sms
const sendSMS = (to, sms, data = {  }) => {

    twilio.messages.create({
        from : twilio_cell,
        to : to,
        body : sms
    })
    .then( res => {
        console.log('sms sent');
    })
    .catch( error => {
        console.log(error.message);
    });

}


// export sms
module.exports = sendSMS;