export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, phone, quantity } = req.body;

    if (!name || !phone) {
      return res.status(400).json({ error: "Ім'я та телефон обов'язкові" });
    }

    // Вставляем ключ напрямую в кавычках
    const crmApiKey = '956efca4ce7e479e31aa80a6ad60088d';

    const crmData = new URLSearchParams({
      key: crmApiKey,
      b_name: name,
      b_phone: phone,
      'products[0][product_id]': '7',
      'products[0][quantity]': quantity || 1,
      'products[0][price]': '299'
    });

    const crmResponse = await fetch('https://deltafund.lp-crm.biz/api/v1/order/create', {
      method: 'POST',
      body: crmData,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    const result = await crmResponse.json();
    console.log('Відповідь від LP-CRM:', result);

    return res.status(200).json(result);

  } catch (error) {
    console.error('Помилка відправки в CRM:', error);
    return res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
}
