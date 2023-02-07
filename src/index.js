const express = require('express');

const { readTalkers, writeTalkers } = require('./utils/utilTalkers');
const genToken = require('./utils/genToken');
const authToken = require('./middlewares/authToken');
const validName = require('./middlewares/validName');
const validAge = require('./middlewares/validAge');
const validTalk = require('./middlewares/validTalk');
const watchedAT = require('./middlewares/watchedAt');
const rate = require('./middlewares/rate');
const emailANDpassword = require('./middlewares/emailANDpassword');

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

app.get('/talker/search', authToken, async (req, res) => {
  const { q } = req.query;
  const palestrantes = await readTalkers();
  const filtraPalestrante = palestrantes
    .filter((e) => e.name.toLowerCase().includes(q.toLowerCase()));

    // const search = talkers.filter((element) => element.name.toLowerCase().includes(q.toLowerCase()));

  if (!q) return res.status(200).json(palestrantes);
  if (!filtraPalestrante) return res.status(200).json([]);

  return res.status(200).json(filtraPalestrante);
});

app.get('/talker', async (req, res) => {
  const palestrantes = await readTalkers();

  if (palestrantes) {
    return res.status(200).json(palestrantes);
  }
  return res.status(200).json([]);
});

app.get('/talker/:id', async (req, res) => {
  const { id } = req.params;
  const palestrantes = await readTalkers();

  const chosenTalkers = palestrantes.find((palestrante) => palestrante.id === Number(id));

  if (chosenTalkers) {
    return res.status(200).json(chosenTalkers);
  }
  return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });
});

app.post('/login', emailANDpassword, async (req, res) => {
  const token = genToken();
  return res.status(200).json(token);
});

app.post('/talker', 
  authToken, 
  validName, 
  validAge, 
  validTalk, 
  rate, 
  watchedAT, 
  async (req, res) => {
    const { name, age, talk } = req.body;
    const palestrantes = await readTalkers();
    const novoPalestrante = {
      id: palestrantes.length + 1,
      name,
      age,
      talk,
    };
    // palestrantes.push(novoPalestrante);
    await writeTalkers([...palestrantes, novoPalestrante]);
    return res.status(201).json(novoPalestrante);
});

app.put('/talker/:id', authToken, validName, validAge, 
  validTalk, watchedAT, rate, async (req, res) => {
  const { id } = req.params;
  const { name, age, talk } = req.body;
  const palestrantes = await readTalkers();

  palestrantes[Number(id)] = { 
    id: Number(id),
    name,
    age,
    talk,
  };
  await writeTalkers(palestrantes);

  return res.status(200).json(palestrantes[Number(id)]);
});

app.delete('/talker/:id', authToken, async (req, res) => {
  const { id } = req.params;
  const palestrantes = await readTalkers();
  const filtraPalestrante = palestrantes.filter((e) => e.id !== +id);
  await writeTalkers(filtraPalestrante);

  return res.status(204).end();
});