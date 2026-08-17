export default async function handler(req, res) {
    
    const API_KEY = process.env.API_KEY; 
    const category = req.query.category || 'top';

    const url = `https://newsdata.io/api/1/latest?apikey=${API_KEY}&language=id&category=${category}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        
         index.html
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Gagal mengambil data dari server.' });
    }
}

