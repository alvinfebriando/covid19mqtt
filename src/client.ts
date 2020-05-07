import inquirer from 'inquirer';
import { getCountriesName, getCountriesSlug } from './data';

const start = async () => {
  const answer1 = await inquirer.prompt([
    {
      name: 'field',
      message: 'Informasi apa yang anda cari',
      type: 'list',
      choices: ['Total Infeksi', 'Total Sembuh', 'Total Meninggal'],
    },
    {
      name: 'scope',
      message: 'Pilih global atau negara?',
      type: 'list',
      choices: ['Global', 'Negara'],
    },
  ]);

  if (answer1.scope === 'Global') {
    console.log(`Field: ${answer1.field}, Scope: ${answer1.scope}`);
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
