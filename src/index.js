const express = require('express');

const { readTalkers, writeTalkers } =  require('./utils/utilTalkers');
const genToken = require('./utils/genToken');
const authToken = require('./middlewares/authToken');
const name  = require('./middlewares/name');
const age  = require('./middlewares/age');
const talk  = require('./middlewares/talk');
const watchedAT  = require('./middlewares/watchedAt');
const rate = require('./middlewares/rate');

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
  const palestrantes = await readTalkers();

  if(palestrantes) {
    return res.status(200).json(palestrantes);
  }
  return res.status(200).json([]);
});

app.get('/talker/:id', async (req, res) => {
  const { id } = req.params;
  const palestrantes =  await readTalkers();

  const chosenTalkers = palestrantes.find((palestrante) => palestrante.id === Number(id))

  if(chosenTalkers) {
    return res.status(200).json(chosenTalkers);
  }
  return res.status(404).json({ message: 'Pessoa palestrante não encontrada' })
});

app.post('/login', async (req, res) => { 
  const { email, password } = req.body;
  const validateEmail = (email) => email.match(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/);

  if (!email) return res.status(400).json({ message: 'O campo "email" é obrigatório' });
  if (!validateEmail(email)) return res.status(400).json({ message: 'O "email" deve ter o formato "email@email.com"' });
  if (!password) return res.status(400).json({ message: 'O campo "password" é obrigatório' });
  if (password.length < 6) return res.status(400).json({ message: 'O "password" deve ter pelo menos 6 caracteres' });
  
  const token = genToken();
  return res.status(200).json(token)
});

app.post('/talker', authToken, name, age, talk, rate, watchedAT, async (req, res) => {
  const { name, age, talk } = req.body;
  const palestrantes = await readTalkers();
  const novoPalestrante = {
    id: palestrantes.length + 1,
    name,
    age,
    talk
  };
  palestrantes.push(novoPalestrante);
  await writeTalkers([...palestrantes, req.body]);
    return res.status(201).json(novoPalestrante);
});