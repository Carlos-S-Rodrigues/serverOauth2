const paypal = require('@paypal/checkout-server-sdk');
const {getAccessToken} = require('./oauth.js')
const axios = require('axios')

async function createPayPalOrder() {
  const request = new paypal.orders.OrdersCreateRequest();
  request.prefer('return=representation');
  request.requestBody({
    intent: 'CAPTURE',
    purchase_units: [
      {
        amount: {
          currency_code: 'USD',
          value: '29.99', 
        },
      },
    ],
  });

  const response = await client.execute(request);
  console.log('createPayPalOrder Response:', response.result);
  return response.result;
  
}

async function createPayPalPayment(order) {
  const accessToken = await getAccessToken();
  const response = await axios.post(
    `https://api.sandbox.paypal.com/v2/checkout/orders/${order.id}/pay`,
    {},
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return response.data;
}

module.exports = {
  createPayPalOrder,
  createPayPalPayment,
};
