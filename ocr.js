const process = require('process');
const Tesseract = require('tesseract.js');

const filePath = process.argv[2] || null;

if (!filePath) {
  console.error('Filepath is missing');
  process.exit(1);
}

function exitOK(data) {
  console.log(`<${data}>`);
  process.exit(0);
}

Tesseract.recognize(filePath)
  .then(({ text }) => {
    const cleanedResult = text.replace(/\D/g, '');
    exitOK(cleanedResult)
  })
  .finally((resultOrError) => console.log(resultOrError))
  .catch(err => console.error('test1', err));


