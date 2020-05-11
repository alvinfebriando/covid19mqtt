import got from 'got';

const API_URL = 'https://api.covid19api.com/';

export interface GlobalCovidData {
  NewConfirmed: number;
  TotalConfirmed: number;
  NewDeaths: number;
  TotalDeaths: number;
  NewRecovered: number;
  TotalRecovered: number;
  [index: string]: any;
}

export interface CountryCovidData extends GlobalCovidData {
  Country: string;
  CountryCode: string;
  Slug: string;
  Date: Date;
}

interface Summary {
  Global: GlobalCovidData;
  Countries: CountryCovidData[];
  Date: Date;
}

let summary: Summary;

type Field =
  | 'NewDeaths'
  | 'TotalDeaths'
  | 'NewConfirmed'
  | 'TotalConfirmed'
  | 'NewRecovered'
  | 'TotalRecovered';

const getSummary = async (): Promise<Summary> => {
  const response = await got.get(API_URL + 'summary');
  summary = JSON.parse(response.body);
  return summary;
};

export const getGlobalSummary = async () => {
  const summary = await getSummary();
  return summary.Global;
};

export const getCountrySummary = async (slug: string) => {
  let countries: CountryCovidData[];
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
