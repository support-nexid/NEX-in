const fp = require('ffmpeg-static');
const { execSync } = require('child_process');
console.log('ffmpeg path:', fp);
execSync(`"${fp}" -i "PORTFOLIO INSPIRATION.mp4" -vf fps=1/5 -frames:v 6 inspiration_frame_%02d.png`, { stdio: 'inherit' });
console.log('Done!');
