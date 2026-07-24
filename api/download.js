import { exec } from 'child_process';
import { promisify } from 'util';
const execAsync = promisify(exec);

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
    // Gunakan yt-dlp untuk ambil info video
    const cmd = `yt-dlp -j "${url}"`;
    const { stdout } = await execAsync(cmd);
    const data = JSON.parse(stdout);

    if (!data) {
      return res.status(500).json({ error: 'Gagal ambil data video' });
    }

    const title = data.title || 'Unknown';
    const thumbnail = data.thumbnail || '';
    const duration = data.duration || '00:00';
    
    // Cari format terbaik
    let downloadUrl = '';
    if (format === 'audio') {
      // Cari format audio terbaik
      const audioFormat = data.formats?.find(f => f.acodec !== 'none' && f.vcodec === 'none');
      downloadUrl = audioFormat?.url || data.url || '';
    } else {
      // Cari format video terbaik
      const videoFormat = data.formats?.find(f => f.vcodec !== 'none' && f.acodec !== 'none');
      downloadUrl = videoFormat?.url || data.url || '';
    }

    return res.status(200).json({
      title,
      thumbnail,
      duration,
      downloadUrl,
      format: format || 'video'
    });

  } catch (error) {
    console.error('Error:', error.message);
    return res.status(500).json({ error: error.message || 'Terjadi kesalahan' });
  }
}
