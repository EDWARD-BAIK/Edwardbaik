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
    // ========== API 1: SaveFrom (UNIVERSAL) ==========
    const sfUrl = `https://api.savefrom.net/2?url=${encodeURIComponent(url)}&format=${format === 'audio' ? 'mp3' : 'mp4'}`;
    const sfRes = await axios.get(sfUrl, { timeout: 15000 });
    const sfData = sfRes.data;

    if (sfData && sfData.video && sfData.video.download_url) {
      return res.status(200).json({
        title: sfData.video.title || 'Unknown',
        thumbnail: sfData.video.thumb || '',
        duration: sfData.video.duration || '00:00',
        downloadUrl: sfData.video.download_url || sfData.video.url || '',
        format: format || 'video'
      });
    }

    // ========== API 2: yt-dl (YouTube & beberapa platform) ==========
    const ytdlUrl = `https://api.yt-dl.org/download?url=${encodeURIComponent(url)}&format=${format === 'audio' ? 'mp3' : 'mp4'}`;
    const ytdlRes = await axios.get(ytdlUrl, { timeout: 15000 });
    const ytdlData = ytdlRes.data;

    if (ytdlData && ytdlData.success && ytdlData.download_url) {
      return res.status(200).json({
        title: ytdlData.title || 'Unknown',
        thumbnail: ytdlData.thumbnail || '',
        duration: ytdlData.duration || '00:00',
        downloadUrl: ytdlData.download_url || ytdlData.url || '',
        format: format || 'video'
      });
    }

    // ========== API 3: vidsrc (YouTube khusus) ==========
    const vidsrcUrl = `https://vidsrc.me/embed/movie/${encodeURIComponent(url)}`;
    const vidsrcRes = await axios.get(vidsrcUrl, { timeout: 15000 });
    const vidsrcData = vidsrcRes.data;

    if (vidsrcData && vidsrcData.success && vidsrcData.download_url) {
      return res.status(200).json({
        title: vidsrcData.title || 'Unknown',
        thumbnail: vidsrcData.thumbnail || '',
        duration: vidsrcData.duration || '00:00',
        downloadUrl: vidsrcData.download_url || vidsrcData.url || '',
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
