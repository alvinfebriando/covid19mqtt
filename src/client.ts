import { fieldChoices } from './data';
import { Subscriber, emitter } from './subscriber';
import {
  answerQuestion,
  fieldQuestion,
  loopQuestion,
  scopeQuestion,
} from './questions';
import { getCountriesSlug } from './api';

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
