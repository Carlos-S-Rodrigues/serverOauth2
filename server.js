const express = require('express');
const paypal = require('@paypal/checkout-server-sdk');
const {createPayPalOrder, createPayPalPayment} = require ('./helpers/paypal.js')
const {getAccessToken} = require('./helpers/oauth')
const axios = require('axios');

const app = express();
app.use(express.json());

//PayPal Sandbox Client Keys
const clientId = 'AdbJP7hO2TYVGt3ag9aOJJQHEXrN53zyRpyDrcgXuyh1mUpZJ9XX0JdWYl11Z0e9RcjKkJNrWuvyOJHD' 
const clientSecret = 'ECpKmtC_2z6U7qfXao_vz9ysBngKxNMPDF3_Cj-QpQIi7U6jkS4uvz3ojR6rQRX581Pyp0f88uX_-erR' 
const environment = new paypal.core.SandboxEnvironment(clientId, clientSecret);
const client = new paypal.core.PayPalHttpClient(environment);

app.post('/initiate-payment', async (req, res) => {
  try {
    const order = await createPayPalOrder(); 
    const response = await createPayPalPayment(order); 
    res.json(response)
  } catch (error) {
    console.error('Error initiating payment:', error);
    res.status(500).send('Error initiating payment');
  }
});

app.post('/capture-payment', async (req, res) => {
    try {
      const transactionId = await capturePayPalPayment(req.body.orderId); 
      res.json({ message: 'Payment captured successfully', transactionId });
    } catch (error) {
      console.error('Error capturing payment:', error);
      res.status(500).send('Error capturing payment');
    }
  });

  async function capturePayPalPayment(orderId) {
    const request = new paypal.orders.OrdersCaptureRequest(orderId);
    request.requestBody({});
    const response = await client.execute(request);
    return response.result.id;
  }

// Run server
const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
