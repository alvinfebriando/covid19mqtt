import inquirer from 'inquirer';
import {
  getCountriesName,
  getCountriesSlug,
  scopeChoices,
  fieldChoices,
} from './data';
import { Subscriber } from './subscriber';

const start = async () => {
  const mqttClient = new Subscriber();

  const answer1 = await inquirer.prompt([
    {
      name: 'field',
      message: 'Informasi apa yang anda cari',
      type: 'list',
      choices: Object.values(fieldChoices),
    },
    {
      name: 'scope',
      message: 'Pilih global atau negara?',
      type: 'list',
      choices: Object.values(scopeChoices),
    },
  ]);

  if (answer1.scope === 'Global') {
    Object.entries(fieldChoices).forEach(field => {
      if (field[1] === answer1.field) {
        mqttClient.subscribe(`Global/${field[0]}`);
      }
    });
  } else {
    const answer2 = await inquirer.prompt([
      {
        name: 'country',
        message: 'Pilih satu negara',
        type: 'list',
        choices: await getCountriesName(),
      },
    ]);
    const slug = await getCountriesSlug(answer2.country);
    Object.entries(fieldChoices).forEach(field => {
      if (field[1] === answer1.field) {
        mqttClient.subscribe(`Country/${slug}/${field[0]}`);
      }
    });
  }
};

start();
