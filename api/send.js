export default async function handler(req, res) {
  // Разрешаем CORS, чтобы ваш сайт мог отправлять сюда запросы
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
    // Получаем данные из формы сайта
    const { name, phone, quantity } = req.body;

    if (!name || !phone) {
      return res.status(400).json({ error: "Ім'я та телефон обов'язкові" });
    }

    // Данные для отправки в LP-CRM (ключ берется из переменных окружения Vercel)
    const crmData = new URLSearchParams({
      key: process.env.LP_CRM_API_KEY, // Скрытый ключ
      b_name: name,
      b_phone: phone,
      // Добавьте структуру продуктов согласно API вашей CRM
      'products[0][product_id]': '7',
      'products[0][quantity]': quantity || 1,
      'products[0][price]': '299'
    });

// Отправляем запрос в вашу персональную LP-CRM с серверов Vercel
    const crmResponse = await fetch('https://deltafund.lp-crm.biz/api/v1/order/create', {
      method: 'POST',
      body: crmData,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    const result = await crmResponse.json();

    return res.status(200).json({ success: true, result });
  } catch (error) {
    console.error('Помилка відправки в CRM:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}