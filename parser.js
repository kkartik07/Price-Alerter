const axios = require('axios')
const cheerio = require('cheerio')
require('dotenv').config()

const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const args = process.argv.slice(2)
const url = args[0]
const minPrice = args[1]

checkPrice();

async function checkPrice() {
  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    const priceElement = $('.a-price-whole');
    const priceString = priceElement.text().trim();
    const priceNumber = parseFloat(priceString.replace(/[^0-9.]/g, '')) / 1;

    if (priceNumber < minPrice) {
      await sendEmail(
        'Price Is Low',
        `The price of product <a> ${url} </a> has <b>dropped</b> below Rs.${minPrice}`
      )
    }
  } catch (e) {
    await sendEmail('Amazon Price Checker Error', e.message)
    throw e;
  }
}

function sendEmail(subject, body) {
  const msg = {
    to: 'iwymkvs803@tempmailn.com',
    from: 'kartikkankurte7@gmail.com',
    subject: subject,
    html: body,
  };

  sgMail.send(msg)
    .then(() => {
      console.log("Alert email sent");
    })
    .catch((err) => {
      console.log(err);
    });
}
