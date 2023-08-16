const axios = require('axios');

async function getAccessToken(clientId, clientSecret) {
  
  const response = await axios.post(
    'https://api.sandbox.paypal.com/v1/oauth2/token',
    'grant_type=client_credentials',
    {
      auth: {
        username: clientId,
        password: clientSecret,
      },
    }
  );

  return response.data.access_token;
}

module.exports = {
  getAccessToken,
};
