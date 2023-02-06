const express = require('express');

const readTalkers =  require('./utils/readTalkers')

const app = express();
app.use(express.json());

const HTTP_OK_STATUS = 200;
const PORT = '3000';

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.listen(PORT, () => {
  console.log('Online');
});

app.get('/talker', async (req, res) => {
  const palestrantes = await readTalkers.talkers();

  if(palestrantes) {
    return res.status(200).json(palestrantes);
  }
  return res.status(200).json([]);
});

app.get('/talker:id', async (req, res) => {
  
});
