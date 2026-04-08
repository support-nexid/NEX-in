const fp = require('ffmpeg-static');
const { execSync } = require('child_process');
execSync(`"${fp}" -i "Inspiration with inside pages and detailing.mp4" -vf fps=1/3 -frames:v 12 inspiration2_frame_%02d.png`, { stdio: 'inherit' });
console.log('Done!');
