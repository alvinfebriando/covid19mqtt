import got from 'got';
import {
  Summary,
  CountryCovidData,
  GlobalCovidData,
  Country,
} from './interfaces';

const API_URL = 'https://api.covid19api.com/';

let summary: Summary;
let lastAPICall: Date;
let countriesData: Country[];

type Field =
  | 'NewDeaths'
  | 'TotalDeaths'
  | 'NewConfirmed'
  | 'TotalConfirmed'
  | 'NewRecovered'
  | 'TotalRecovered';

// Ubah dari menit ke ms
const MINUTE = 60000;

// Mengambil data summary dari api
const getSummary = async (): Promise<void> => {
  const now = new Date();
  if (lastAPICall !== undefined) {
    if (now.valueOf() - lastAPICall.valueOf() >= 10 * MINUTE) {
      const response = await got.get(API_URL + 'summary');
      lastAPICall = new Date();
      summary = JSON.parse(response.body);
    }
  } else {
    const response = await got.get(API_URL + 'summary');
    lastAPICall = new Date();
    summary = JSON.parse(response.body);
  }
};

export const getGlobalSummary = async () => {
  await getSummary();
  return summary.Global;
};

export const getCountrySummary = async (slug: string) => {
  let countries: CountryCovidData[];
  await getSummary();
  countries = summary.Countries;
  return countries.find(country => {
    return country.Slug === slug;
  });
};

export const getField = (
  country: CountryCovidData | GlobalCovidData,
  field: Field
) => {
  return country[field].toString();
};

// baca isi file countries yang didapat dari covid19api.com
export const getCountries = async () => {
  await getSummary();
  const countriesData = <Country[]>summary.Countries.map(country => {
    return {
      Country: country.Country,
      Slug: country.Slug,
    };
  });
  return countriesData;
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
