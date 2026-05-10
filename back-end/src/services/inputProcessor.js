import axiosClient from '../utils/axiosClient.js';

// Normalize user input (image, URL, or text) for AI processing
export async function normalize(body, file) {
  // 1. Handle image upload
  if (file) {
    return { type: 'image', content: file.buffer.toString('base64'), mimeType: file.mimetype };
  }

  // 2. Handle URL input
  if (body.url) {
    const html = await fetchUrl(body.url);
    return { type: 'url', content: stripHtml(html) };
  }

  // 3. Handle raw text input
  if (body.text) {
    const text = body.text.trim();
    if (text.length < 20 || text.length > 10000) {
      const err = new Error('Teks harus 20 - 10.000 karakter');
      err.statusCode = 400;
      throw err;
    }
    return { type: 'text', content: text };
  }

  const err = new Error('Pilih salah satu input: gambar, teks, atau URL');
  err.statusCode = 400;
  throw err;
}

// Fetch HTML content from URL
async function fetchUrl(url) {
  try {
    const response = await axiosClient.get(url, { maxRedirects: 3 });
    return typeof response.data === 'string' ? response.data : JSON.stringify(response.data);
  } catch {
    const err = new Error('Gagal mengambil data dari URL');
    err.statusCode = 400;
    throw err;
  }
}

// Strip HTML tags to extract raw text
function stripHtml(html) {
  return html.replace(/<script[\s\S]*?<\/script>/gi, '').replace(/<style[\s\S]*?<\/style>/gi, '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}