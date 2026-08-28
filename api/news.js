// api/news.js

export default async function handler(req, res) {
    const { category = 'top' } = req.query;

    // API Key langsung dimasukkan di sisi backend
    const API_KEY = 'pub_beae432af9b04f2ea77803f34d6634e2';
    const BASE_URL = 'https://newsdata.io/api/1/latest';
    const url = `${BASE_URL}?apikey=${API_KEY}&language=id&category=${category}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        // Cross-Origin Header
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate');

        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json({ status: 'error', message: error.message });
    }
}
