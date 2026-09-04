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

    // Проверяем, подставился ли ключ
    if (!process.env.LP_CRM_API_KEY) {
      console.error('Помилка: не задано LP_CRM_API_KEY в переменных Vercel');
    }

    const crmData = new URLSearchParams({
      key: process.env.LP_CRM_API_KEY,
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
    
    // Выводим ответ CRM в консоль Vercel для отладки
    console.log('Відповідь від LP-CRM:', result);

    // Возвращаем реальный результат от CRM клиенту
    return res.status(200).json(result);

  } catch (error) {
    console.error('Помилка відправки в CRM:', error);
    return res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
}
