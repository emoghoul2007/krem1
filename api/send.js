export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, message: 'Method not allowed' });
    }

    const { name, phone, quantity } = req.body;

    if (!name || !phone) {
        return res.status(400).json({ success: false, message: "Ім'я та телефон обов'язкові" });
    }

    try {
        // URL вашего развернутого веб-приложения Google Apps Script
        const scriptUrl = process.env.GOOGLE_SCRIPT_URL; 

        const response = await fetch(scriptUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, phone, quantity: quantity || 1 })
        });

        const result = await response.json();

        if (result.success) {
            return res.status(200).json({ success: true });
        } else {
            throw new Error(result.error || 'Google Script error');
        }
    } catch (error) {
        console.error('Помилка надсилання в Google Таблицю:', error);
        return res.status(500).json({ success: false, message: 'Помилка сервера' });
    }
}
