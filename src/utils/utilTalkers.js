const fs = require('fs').promises;
const path = require('path');

const { join } = require('path');

const caminho = '../talker.json';

const readTalkers = async () => {
  const fileContent = await fs.readFile(join(__dirname, caminho), 'utf-8');
  const resultado = JSON.parse(fileContent);
  return resultado;
};

  const writeTalkers = async (file) => fs
  .writeFile(path.resolve(__dirname, '../talker.json'), JSON.stringify(file));

module.exports = {
  readTalkers,
  writeTalkers,
};