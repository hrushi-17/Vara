const ffmpeg = require('ffmpeg-static');
const { execSync } = require('child_process');

try {
  execSync(`"${ffmpeg}" -ss 00:00:15 -i "public/images/products/premium/AAFYKL-W002/AAFYKL-W002.mp4" -vframes 1 -q:v 2 output15.jpg`, {stdio: 'inherit'});
  execSync(`"${ffmpeg}" -ss 00:00:12 -i "public/images/products/premium/AAFYKL-W002/AAFYKL-W002.mp4" -vframes 1 -q:v 2 output12.jpg`, {stdio: 'inherit'});
} catch(e) {
  console.log(e.message);
}
