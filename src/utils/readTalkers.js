const fs = require('fs').promises;

const { join } = require('path');

const path = '../talker.json';

const talkers = async () => {
  const fileContent = await fs.readFile(join(__dirname, path), 'utf-8');
  const resultado = JSON.parse(fileContent);
  return resultado;
};

module.exports = {
  talkers,
};