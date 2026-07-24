export default async function handler(req, res) {
  // CORS biar bisa dipanggil dari frontend
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
    // Pake API sosial download (no watermark)
    const apiUrl = `https://api.socialdownload.net/convert?url=${encodeURIComponent(url)}&format=${format === 'audio' ? 'mp3' : 'mp4'}`;
    
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (data && data.success) {
      return res.status(200).json({
        title: data.title || 'Unknown',
        thumbnail: data.thumbnail || '',
        duration: data.duration || '00:00',
        downloadUrl: data.download_url || data.url || '',
        format: format || 'video'
      });
    } else {
      // Fallback ke y2mate
      const y2mateUrl = `https://api.y2mate.com/analyze?url=${encodeURIComponent(url)}`;
      const y2mateRes = await fetch(y2mateUrl);
      const y2mateData = await y2mateRes.json();
      
      if (y2mateData && y2mateData.video) {
        return res.status(200).json({
          title: y2mateData.video.title || 'Unknown',
          thumbnail: y2mateData.video.thumb || '',
          duration: y2mateData.video.duration || '00:00',
          downloadUrl: y2mateData.video.download_url || y2mateData.video.url || '',
          format: format || 'video'
        });
      } else {
        return res.status(500).json({ error: 'Gagal ambil data dari semua sumber' });
      }
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
