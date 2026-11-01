// Chuẩn bị thư mục www/ cho app: copy index.html, tải thư viện về nhét vào app,
// bỏ phần PWA (manifest, service worker) vì app đã chứa sẵn mọi thứ.
import fs from 'node:fs';
import path from 'node:path';

const OUT = 'www';
const LIB = path.join(OUT, 'lib');
fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(LIB, { recursive: true });

let html = fs.readFileSync('src/index.html', 'utf8');

async function download(url, dest) {
  const r = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
  if (!r.ok) throw new Error(`Tải thất bại ${url}: ${r.status}`);
  fs.writeFileSync(dest, Buffer.from(await r.arrayBuffer()));
}

// 1) Thư viện JS: bắt buộc phải tải được, nếu không thì dừng build
const LIBS = [
  ['https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js', 'three.min.js'],
  ['https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.45.4/dist/umd/supabase.js', 'supabase.js'],
];
for (const [url, name] of LIBS) {
  if (!html.includes(url)) throw new Error('Không thấy thẻ script trong index.html: ' + url);
  await download(url, path.join(LIB, name));
  html = html.split(url).join('lib/' + name);
  console.log('OK thu vien:', name);
}

// 2) Font Montserrat: cố gắng tải, lỗi thì giữ link cũ (không làm hỏng build)
try {
  const m = html.match(/<link href="(https:\/\/fonts\.googleapis\.com\/css2[^"]+)" rel="stylesheet">/);
  if (m) {
    const css0 = await (await fetch(m[1], { headers: { 'User-Agent': 'Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36 Chrome/120 Mobile Safari/537.36' } })).text();
    fs.mkdirSync(path.join(LIB, 'fonts'), { recursive: true });
    let css = css0, i = 0;
    for (const u of [...new Set([...css0.matchAll(/url\((https:[^)]+)\)/g)].map(x => x[1]))]) {
      const fn = `f${i++}.woff2`;
      await download(u, path.join(LIB, 'fonts', fn));
      css = css.split(u).join('fonts/' + fn);
    }
    fs.writeFileSync(path.join(LIB, 'fonts.css'), css);
    html = html.replace(m[0], '<link href="lib/fonts.css" rel="stylesheet">');
    console.log('OK font Montserrat');
  }
} catch (e) {
  console.log('Bo qua font (giu link cu):', e.message);
}

// 3) Bỏ phần PWA
html = html.replace(/<link rel="manifest"[^>]*>\s*/g, '');
html = html.replace(/<script>if\('serviceWorker' in navigator\)[\s\S]*?<\/script>\s*/g, '');

if (fs.existsSync('tex')) fs.cpSync('tex', path.join(OUT, 'tex'), { recursive: true });
fs.writeFileSync(path.join(OUT, 'index.html'), html);
console.log('Xong: www/index.html', html.length, 'ky tu');
