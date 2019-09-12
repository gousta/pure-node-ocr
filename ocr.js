const process = require('process');
const Tesseract = require('tesseract.js');
const Jimp = require('jimp');

function success(res) {
  if (res && res.text) {
    console.log(`<${res.text.replace(/\D/g, '')}>`);
  }

  process.exit(0);
}

function failure(err) {
  console.error(err);
  process.exit(1);
}

function getFilePathWithoutExtension(filePath) {
  const splitting = filePath.split('.');
  return splitting && splitting[0] ? splitting[0] : null;
}

// Provision the path
const filePathArgument = process.argv[2] || null;
if (!filePathArgument) failure('Path is missing');

// Clean the path
const filePathWithoutExtension = getFilePathWithoutExtension(filePathArgument);
if (!filePathWithoutExtension) failure('Failed to identify path to file without extension');

// Execute
Jimp.read(`${filePathWithoutExtension}.gif`)
  .then((img) => img.background(0xFFFFFFFF).contrast(-0.5).quality(100).write(`${filePathWithoutExtension}.jpg`))
  .then(() => Tesseract.recognize(`${filePathWithoutExtension}.jpg`).then(success).catch(failure))
  .catch(failure);