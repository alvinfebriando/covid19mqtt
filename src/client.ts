import { prompt } from 'enquirer';
import {
  getCountriesName,
  getCountriesSlug,
  scopeChoices,
  fieldChoices,
} from './data';
import { Subscriber } from './subscriber';

const start = async () => {
  const fieldAnswer: { field: string } = await prompt({
    type: 'select',
    name: 'field',
    message: 'Informasi apa yang anda butuhkan?',
    choices: Object.values(fieldChoices),
  });
  const scopeAnswer: { scope: string } = await prompt({
    type: 'select',
    name: 'scope',
    message: 'Pilih global atau negara',
    choices: Object.values(scopeChoices),
  });
  if (scopeAnswer.scope === 'Global') {
    const mqttClient = new Subscriber();
    Object.entries(fieldChoices).forEach(field => {
      if (field[1] === fieldAnswer.field) {
        mqttClient.subscribe(`Global/${field[0]}`);
      }
    });
  } else if (scopeAnswer.scope === 'Negara') {
    const countryAnswer: { country: string } = await prompt({
      type: 'autocomplete',
      name: 'country',
      message: 'Pilih satu negara',
      choices: await getCountriesName(),
    });
    const slug = await getCountriesSlug(countryAnswer.country);
    const mqttClient = new Subscriber();
    Object.entries(fieldChoices).forEach(field => {
      if (field[1] === fieldAnswer.field) {
        mqttClient.subscribe(`Country/${slug}/${field[0]}`);
      }
    });
  }
};

start();
