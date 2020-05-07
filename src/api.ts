import got from 'got';

const API_URL = 'https://api.covid19api.com/';

type GlobalCovidData = {
  NewConfirmed: number;
  TotalConfirmed: number;
  NewDeaths: number;
  TotalDeaths: number;
  NewRecovered: number;
  TotalRecovered: number;
};

type CountryCovidData = {
  Country: string;
  CountryCode: string;
  Slug: string;
  NewConfirmed: number;
  TotalConfirmed: number;
  NewDeaths: number;
  TotalDeaths: number;
  NewRecovered: number;
  TotalRecovered: number;
  Date: Date;
};

type Summary = {
  Global: GlobalCovidData;
  Countries: CountryCovidData[];
  Date: Date;
};

const getSummary = async (): Promise<Summary> => {
  const response = await got.get(API_URL + 'summary');
  return JSON.parse(response.body);
};

export const getGlobalSummary = async () => {
  const summary = await getSummary();
  return summary.Global;
};

export const getCountrySummary = async (slug: string) => {
  const summary = await getSummary();
  const countries = summary.Countries;
  return countries.find(country => {
    return country.Slug === slug;
  });
};
