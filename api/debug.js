export default function handler(req, res) { const key = process.env.LP_CRM_API_KEY; res.status(200).json({ hasKey: !!key, keyLength: key ? key.length : 0, keyStart: key ? key.slice(0, 6) : null }); }
