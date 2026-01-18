
export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { token, payload } = req.body;

  if (!token || !payload) {
    return res.status(400).json({ error: 'Missing token or payload' });
  }

  const url = 'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest';

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    
    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    return res.status(200).json(data);
  } catch (error: any) {
    console.error('STK Push Error:', error);
    return res.status(500).json({ error: error.message });
  }
}
