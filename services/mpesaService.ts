
export const mpesaService = {
  async getAccessToken() {
    const consumerKey = import.meta.env.VITE_MPESA_CONSUMER_KEY;
    const consumerSecret = import.meta.env.VITE_MPESA_CONSUMER_SECRET;
    
    // We use the proxy defined in vite.config.ts to avoid CORS issues
    const url = '/mpesa/oauth/v1/generate?grant_type=client_credentials';
    const auth = btoa(`${consumerKey}:${consumerSecret}`);

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Basic ${auth}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Mpesa Auth Error:', errorData);
        throw new Error('Failed to get M-Pesa access token');
      }

      const data = await response.json();
      return data.access_token;
    } catch (error) {
      console.error('Error in getAccessToken:', error);
      throw error;
    }
  },

  async initiateSTKPush(phone: string, amount: number) {
    try {
      const token = await this.getAccessToken();
      const shortCode = import.meta.env.VITE_MPESA_SHORTCODE;
      const passkey = import.meta.env.VITE_MPESA_PASSKEY;
      const callbackUrl = import.meta.env.VITE_MPESA_CALLBACK_URL;

      // Format phone number: 2547XXXXXXXX
      let formattedPhone = phone.replace(/[^0-9]/g, '');
      if (formattedPhone.startsWith('0')) {
        formattedPhone = `254${formattedPhone.substring(1)}`;
      } else if (!formattedPhone.startsWith('254')) {
        formattedPhone = `254${formattedPhone}`;
      }

      const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, 14);
      const password = btoa(`${shortCode}${passkey}${timestamp}`);

      const payload = {
        BusinessShortCode: shortCode,
        Password: password,
        Timestamp: timestamp,
        TransactionType: 'CustomerPayBillOnline',
        Amount: Math.round(amount),
        PartyA: formattedPhone,
        PartyB: shortCode,
        PhoneNumber: formattedPhone,
        CallBackURL: callbackUrl,
        AccountReference: 'CinnamonLane',
        TransactionDesc: 'Bakery Order Payment'
      };

      const response = await fetch('/mpesa/mpesa/stkpush/v1/processrequest', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('STK Push Error Details:', errorData);
        throw new Error(errorData.errorMessage || 'Failed to initiate STK Push');
      }

      return await response.json();
    } catch (error) {
      console.error('Error in initiateSTKPush:', error);
      throw error;
    }
  }
};
