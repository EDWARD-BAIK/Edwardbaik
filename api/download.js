import axios from 'axios';

export default async function handler(req, res) {
  // CORS
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
    // API 1: SocialDownload (NO WATERMARK)
    const apiUrl = `https://api.socialdownload.net/convert?url=${encodeURIComponent(url)}&format=${format === 'audio' ? 'mp3' : 'mp4'}`;
    const response1 = await axios.get(apiUrl, { timeout: 15000 });
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

    // API 2: Y2Mate (fallback)
    const y2mateUrl = `https://api.y2mate.com/analyze?url=${encodeURIComponent(url)}`;
    const response2 = await axios.get(y2mateUrl, { timeout: 15000 });
    const data2 = response2.data;

    if (data2 && data2.video && data2.video.download_url) {
      return res.status(200).json({
        title: data2.video.title || 'Unknown',
        thumbnail: data2.video.thumb || '',
        duration: data2.video.duration || '00:00',
        downloadUrl: data2.video.download_url || data2.video.url || '',
        format: format || 'video'
      });
    }

    // API 3: SaveFrom (fallback terakhir)
    const saveFromUrl = `https://api.savefrom.net/2?url=${encodeURIComponent(url)}&format=${format === 'audio' ? 'mp3' : 'mp4'}`;
    const response3 = await axios.get(saveFromUrl, { timeout: 15000 });
    const data3 = response3.data;

    if (data3 && data3.video && data3.video.download_url) {
      return res.status(200).json({
        title: data3.video.title || 'Unknown',
        thumbnail: data3.video.thumb || '',
        duration: data3.video.duration || '00:00',
        downloadUrl: data3.video.download_url || data3.video.url || '',
        format: format || 'video'
      });
    }

    // Semua API gagal
    return res.status(500).json({ error: 'Semua API gagal. Coba link lain.' });

  } catch (error) {
    console.error('Error:', error.message);
    return res.status(500).json({ error: error.message || 'Terjadi kesalahan pada server' });
  }
}
