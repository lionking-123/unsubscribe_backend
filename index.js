const functions = require('@google-cloud/functions-framework');
const sgClient = require('@sendgrid/client');
sgClient.setApiKey('');//replace your api key

functions.http('helloHttp', async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return;
  }

  const email = req.query.email.replace(" ","");
  const group_id = '30807'
  if (!email) {
    return res.status(400).send('Email is required');
  }
  const request = {
    method: 'POST',
    url: `/v3/asm/groups/${group_id}/suppressions`,
    body: { recipient_emails: [email] }
  };
  try {
    const [response, body] = await sgClient.request(request);
    console.log(`Unsubscribed email: ${email}`, response, body);
    res.send(`Unsubscribed ${email} successfully`);
  } catch (error) {
    console.error('Error unsubscribing email:', error.response.body);
    res.status(500).send('Error unsubscribing email');
  }
});
