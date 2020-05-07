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
    console.log(`Field: ${answer1.field}, Scope: ${answer1.scope}`);
    const mqttClient = new Subscriber();
    mqttClient.subscribe(`${answer1.field}/${answer1.scope}`);
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
    console.log(`Field: ${answer1.field}, Scope: ${slug}`);
  }
};

start();
