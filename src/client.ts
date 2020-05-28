import { fieldChoices } from './choices';
import { Subscriber, emitter } from './subscriber';
import {
  answerQuestion,
  fieldQuestion,
  loopQuestion,
  scopeQuestion,
} from './questions';
import { getCountriesSlug } from './api';
import { FieldAnswer } from './interfaces';

const askFieldQuestion = async (mqttClient: Subscriber) => {
  const fieldAnswer = await fieldQuestion();
  for (const field of Object.entries(fieldChoices)) {
    if (field[1] === fieldAnswer.field) {
      if (field[0].startsWith('DayOne')) {
        askCountryQuestion(mqttClient, fieldAnswer);
      } else {
        askScopeQuestion(mqttClient, fieldAnswer);
      }
    }
  }
};

const askScopeQuestion = async (
  mqttClient: Subscriber,
  fieldAnswer: FieldAnswer
) => {
  const scopeAnswer = await scopeQuestion();
  if (scopeAnswer.scope === 'Global') {
    // Subscribe ke topic sesuai dengan jawaban user
    Object.entries(fieldChoices).forEach(field => {
      if (field[1] === fieldAnswer.field) {
        mqttClient.publish(
          '/request',
          JSON.stringify({ topic: `Global/${field[0]}` })
        );
        mqttClient.subscribe(`Global/${field[0]}`);
      }
    });
  } else if (scopeAnswer.scope === 'Negara') {
    askCountryQuestion(mqttClient, fieldAnswer);
  }
};

const askCountryQuestion = async (
  mqttClient: Subscriber,
  fieldAnswer: FieldAnswer
) => {
  const countryAnswer = await answerQuestion();
  const slug = await getCountriesSlug(countryAnswer.country);
  // Subscribe ke topic sesuai dengan jawaban user
  Object.entries(fieldChoices).forEach(field => {
    if (field[1] === fieldAnswer.field) {
      mqttClient.publish(
        '/request',
        JSON.stringify({ topic: `Country/${slug}/${field[0]}` })
      );
      mqttClient.subscribe(`Country/${slug}/${field[0]}`);
    }
  });
};

const loop = async (mqttClient: Subscriber) => {
  askFieldQuestion(mqttClient);
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
