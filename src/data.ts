import fs from 'fs';
import { promisify } from 'util';
import { Country } from './interfaces';

const readFile = promisify(fs.readFile);

export enum fieldChoices {
  TotalConfirmed = 'Total Infeksi',
  NewConfirmed = 'Infeksi Terbaru',
  TotalDeaths = 'Total Meninggal',
  NewDeaths = 'Meninggal Terbaru',
  TotalRecovered = 'Total Sembuh',
  NewRecovered = 'Sembuh Terbaru',
}

export enum scopeChoices {
  Global = 'Global',
  Country = 'Negara',
}

// baca isi file countries yang didapat dari covid19api.com
export const getCountries = async () => {
  return <Country[]>JSON.parse(
    await readFile(`${__dirname}/../data/countries.json`, {
      encoding: 'utf-8',
    })
  );
};

export const getCountriesName = async () => {
  const countries = await getCountries();
  return countries
    .map(country => country.Country)
    .sort((a, b) => a.localeCompare(b));
};

export const getCountriesSlug = async (name: string) => {
  const countries = await getCountries();
  return countries.find(country => country.Country === name)?.Slug;
};
