const qrcode = require('qrcode');

const url = 'exp://169.254.0.21:8081';
const outputPath = '/home/ubuntu/expo_qr_code.png';

qrcode.toFile(outputPath, url, {
  width: 500,
  margin: 2
}, (err) => {
  if (err) {
    console.error('Error:', err);
    process.exit(1);
  }
  console.log('✅ QR code generated!');
  console.log('📁 File:', outputPath);
  console.log('🔗 URL:', url);
});
