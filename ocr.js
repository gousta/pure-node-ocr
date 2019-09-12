const process = require('process');
const Tesseract = require('tesseract.js');
const Jimp = require('jimp');

Jimp.read('download.gif')
  .then((img) => {
    return img
      .background(0xFFFFFFFF)
      .contrast(-0.5)
      .quality(100) // set JPEG quality
      .write('download.jpg'); // save
  })
  .then(() => {
    Tesseract.recognize('./download.jpg')
      .then(({ text }) => {
        const cleanedResult = text.replace(/\D/g, '');
        console.log('cleanedResult', `<${cleanedResult}>`);
        process.exit(0);
      })
      .finally(resultOrError => console.log(resultOrError))
      .catch(err => console.error('test1', err));
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });

