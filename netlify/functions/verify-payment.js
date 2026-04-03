// Verifies Razorpay payment signature using HMAC-SHA256.
// Key secret stays here — never exposed to the browser.
const crypto = require('crypto');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  let razorpay_order_id, razorpay_payment_id, razorpay_signature;
  try {
    ({ razorpay_order_id, razorpay_payment_id, razorpay_signature } = JSON.parse(event.body));
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) throw new Error();
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: 'Missing payment fields' }) };
  }

  const expected = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(razorpay_order_id + '|' + razorpay_payment_id)
    .digest('hex');

  if (expected !== razorpay_signature) {
    console.warn('[verify-payment] Signature mismatch', { razorpay_payment_id });
    return { statusCode: 400, body: JSON.stringify({ verified: false, error: 'Invalid signature' }) };
  }

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ verified: true, payment_id: razorpay_payment_id }),
  };
};
