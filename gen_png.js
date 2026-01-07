const fs = require('fs');
const buffer = Buffer.from('89504e470d0a1a0a0000000d49484452000000010000000108060000001f15c4890000000a49444154789c63000100000500010d0a2d600000000049454e44ae426082', 'hex');
fs.writeFileSync('test.png', buffer);
console.log('test.png created');
