import inquirer from 'inquirer';
import { getCountriesName, getCountriesSlug } from './data';
import { Subscriber } from './subscriber';

enum fieldChoices {
  TotalConfirmed = 'Total Infeksi',
  NewConfirmed = 'Infeksi Hari Ini',
  TotalDeaths = 'Total Meninggal',
  NewDeaths = 'Meninggal Hari Ini',
  TotalRecovered = 'Total Sembuh',
  NewRecovered = 'Sembuh Hari Ini',
}

enum scopeChoices {
  Global = 'Global',
  Country = 'Negara',
}

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
