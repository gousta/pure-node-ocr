const process = require('process');
const fs = require('fs');
const Tesseract = require('tesseract.js');
const Jimp = require('jimp');

// Provision the path
const filePathArgument = process.argv[2] || null;
if (!filePathArgument) failure('Path is missing');

// Clean the path
const filePathArgumentSplit = filePathArgument.split('.');
const filePathWithoutExtension = filePathArgumentSplit && filePathArgumentSplit[0] ? filePathArgumentSplit[0] : null;
if (!filePathWithoutExtension) failure('Failed to identify path to file without extension');

function success(res) {
  if (res && res.text) {
    console.log(`|||${res.text.replace(/\D/g, '')}|||`);
  }
  clean();
  process.exit(0);
}

function failure(err) {
  console.error(err);
  clean();
  process.exit(1);
}

function clean() {
  fs.unlinkSync(`${filePathWithoutExtension}.gif`)
  fs.unlinkSync(`${filePathWithoutExtension}.jpg`)
}

// Execute
Jimp.read(`${filePathWithoutExtension}.gif`)
  .then((img) => img.background(0xFFFFFFFF).quality(100).greyscale().write(`${filePathWithoutExtension}.jpg`))
  .then(() => Tesseract.recognize(`${filePathWithoutExtension}.jpg`).then(success).catch(failure))
  .catch(failure);