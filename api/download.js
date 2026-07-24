import axios from 'axios';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { url, format } = req.query;
  if (!url) {
    return res.status(400).json({ error: 'URL diperlukan' });
  }

  try {
    // ========== API 1: social-download.net (UNIVERSAL) ==========
    const apiUrl = `https://social-download.net/api/convert?url=${encodeURIComponent(url)}&format=${format === 'audio' ? 'mp3' : 'mp4'}`;
    const response1 = await axios.get(apiUrl, { timeout: 20000 });
    const data1 = response1.data;

    if (data1 && data1.success && data1.download_url) {
      return res.status(200).json({
        title: data1.title || 'Unknown',
        thumbnail: data1.thumbnail || '',
        duration: data1.duration || '00:00',
        downloadUrl: data1.download_url || data1.url || '',
        format: format || 'video'
      });
    }

    // ========== API 2: socialdownload (cadangan) ==========
    const apiUrl2 = `https://api.socialdownload.net/convert?url=${encodeURIComponent(url)}&format=${format === 'audio' ? 'mp3' : 'mp4'}`;
    const response2 = await axios.get(apiUrl2, { timeout: 20000 });
    const data2 = response2.data;

    if (data2 && data2.success && data2.download_url) {
      return res.status(200).json({
        title: data2.title || 'Unknown',
        thumbnail: data2.thumbnail || '',
        duration: data2.duration || '00:00',
        downloadUrl: data2.download_url || data2.url || '',
        format: format || 'video'
      });
    }

    // ========== API 3: social-download (v3) ==========
    const apiUrl3 = `https://social-download.net/api/v3/convert?url=${encodeURIComponent(url)}&format=${format === 'audio' ? 'mp3' : 'mp4'}`;
    const response3 = await axios.get(apiUrl3, { timeout: 20000 });
    const data3 = response3.data;

    if (data3 && data3.success && data3.download_url) {
      return res.status(200).json({
        title: data3.title || 'Unknown',
        thumbnail: data3.thumbnail || '',
        duration: data3.duration || '00:00',
        downloadUrl: data3.download_url || data3.url || '',
        format: format || 'video'
      });
    }

    // ========== Semua gagal ==========
    return res.status(500).json({ error: 'Gagal ambil data dari semua API. Coba link lain.' });

  } catch (error) {
    console.error('Error:', error.message);
    return res.status(500).json({ error: error.message || 'Terjadi kesalahan' });
  }
}
