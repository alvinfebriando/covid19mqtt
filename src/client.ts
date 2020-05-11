import { prompt } from 'enquirer';
import {
  getCountriesName,
  getCountriesSlug,
  scopeChoices,
  fieldChoices,
} from './data';
import { Subscriber } from './subscriber';
import emitter from './event';

// Pertanyaan
const fieldQuestion = async () => {
  return <{ field: string }>await prompt({
    type: 'select',
    name: 'field',
    message: 'Informasi apa yang anda butuhkan?',
    choices: Object.values(fieldChoices),
  });
};

const scopeQuestion = async () => {
  return <{ scope: string }>await prompt({
    type: 'select',
    name: 'scope',
    message: 'Pilih global atau negara',
    choices: Object.values(scopeChoices),
  });
};

const answerQuestion = async () => {
  return <{ country: string }>await prompt({
    type: 'autocomplete',
    name: 'country',
    message: 'Pilih satu negara',
    choices: await getCountriesName(),
  });
};

const loopQuestion = async () => {
  return <{ loop: string }>await prompt({
    type: 'confirm',
    name: 'loop',
    message: 'Jalankan lagi?',
  });
};

const loop = async (mqttClient: Subscriber) => {
  const fieldAnswer = await fieldQuestion();
  const scopeAnswer = await scopeQuestion();
  if (scopeAnswer.scope === 'Global') {
    // Subscribe ke topic sesuai dengan jawaban user
    Object.entries(fieldChoices).forEach(field => {
      if (field[1] === fieldAnswer.field) {
        mqttClient.subscribe(`Global/${field[0]}`);
      }
    });
  } else if (scopeAnswer.scope === 'Negara') {
    const countryAnswer = await answerQuestion();
    const slug = await getCountriesSlug(countryAnswer.country);
    // Subscribe ke topic sesuai dengan jawaban user
    Object.entries(fieldChoices).forEach(field => {
      if (field[1] === fieldAnswer.field) {
        mqttClient.subscribe(`Country/${slug}/${field[0]}`);
      }
    });
  }
};

const start = async () => {
  // Inisiasi subscriber
  const mqttClient = new Subscriber();
  // Ketika terhubung dengan server berikan pertanyaan
  emitter.once('connect', () => {
    loop(mqttClient);
  });

  // Ketika subscriber menerima pesan (on message) akan
  // memberitahu client bahwa pesan sudah diterima (emit done)
  emitter.on('done', async () => {
    const loopAnswer = await loopQuestion();
    // Ulangi pertanyaan jika user mau
    if (loopAnswer.loop) {
      loop(mqttClient);
    } else {
      process.exit();
    }
  });
};

start();

process.on('unhandledRejection', err => {
  process.exit();
});
