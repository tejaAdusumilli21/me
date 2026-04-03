// Creates a Razorpay order server-side.
// Key secret stays here — never exposed to the browser.
exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  let amount;
  try {
    ({ amount } = JSON.parse(event.body));
    amount = parseInt(amount);
    if (!amount || amount < 1) throw new Error('invalid amount');
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid request body' }) };
  }

  const credentials = Buffer.from(
    process.env.RAZORPAY_KEY_ID + ':' + process.env.RAZORPAY_KEY_SECRET
  ).toString('base64');

  try {
    const response = await fetch('https://api.razorpay.com/v1/orders', {
      method : 'POST',
      headers: {
        'Content-Type' : 'application/json',
        'Authorization': 'Basic ' + credentials,
      },
      body: JSON.stringify({
        amount  : amount * 100, // paise
        currency: 'INR',
        receipt : 'coffee_' + Date.now(),
      }),
    });

    const order = await response.json();
    if (!response.ok) throw new Error(order.error?.description || 'Razorpay error');

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ order_id: order.id, amount: order.amount }),
    };
  } catch (err) {
    console.error('[create-order]', err.message);
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
