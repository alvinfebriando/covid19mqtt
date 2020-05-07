import fs from 'fs';
import { promisify } from 'util';

const readFile = promisify(fs.readFile);

interface Country {
  Country: string;
  Slug: string;
  ISO2: string;
}

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
