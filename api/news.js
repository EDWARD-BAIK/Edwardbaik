// api/news.js

export default async function handler(req, res) {
    const { category = 'top' } = req.query;

    // Membaca API Key yang sudah disave di Vercel
    const API_KEY = process.env.NEWSDATA_API_KEY;

    if (!API_KEY) {
        return res.status(500).json({ status: 'error', message: 'API Key belum diset di Vercel.' });
    }

    const BASE_URL = 'https://newsdata.io/api/1/latest';
    const url = `${BASE_URL}?apikey=${API_KEY}&language=id&category=${category}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate');

        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json({ status: 'error', message: error.message });
    }
}
