const process = require('process');
const fs = require('fs');
const Tesseract = require('tesseract.js');
const Jimp = require('jimp');

// Provision the path
const filePath = process.argv[2] || null;
if (!filePath) {
  console.error('Path is missing');
  process.exit(1);
}

// Clean the path
const filePathSplit = filePath.split('.');
const fileName = filePathSplit && filePathSplit[0] ? filePathSplit[0] : null;
if (!fileName) {
  console.error('Failed to identify path to file without extension');
  process.exit(1);
}

if (!fs.existsSync(`${fileName}.gif`)) {
  console.error(`File ${fileName}.gif does not exist`);
  process.exit(1);
}

function success(res) {
  if (res && res.text) {
    console.log(`|||${res.text.replace(/\D/g, '')}|||`);
  }
  fs.unlinkSync(`${fileName}.gif`)
  fs.unlinkSync(`${fileName}.jpg`)
  process.exit(0);
}

function failure(err) {
  console.error(err);
  fs.unlinkSync(`${fileName}.gif`)
  fs.unlinkSync(`${fileName}.jpg`)
  process.exit(1);
}

// Execute
Jimp.read(`${fileName}.gif`)
  .then((img) => img.background(0xFFFFFFFF).contrast(-0.5).scale(1.5).quality(100).write(`${fileName}.jpg`))
  .then(() => {
    Tesseract
      .recognize(`${fileName}.jpg`)
      .then(success)
      .catch(failure)
  })
  .catch(failure)