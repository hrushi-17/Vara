const ffmpeg = require('ffmpeg-static');
const { execSync } = require('child_process');

try {
  const output = execSync(`"${ffmpeg}" -i "public/images/products/premium/AAFYKL-W002/AAFYKL-W002.mp4" -vf "blackdetect=d=0.5:pix_th=0.1" -an -f null - 2>&1`, {encoding: 'utf8'});
  console.log(output);
} catch(e) {
  console.log(e.stdout || e.stderr || e.message);
}
