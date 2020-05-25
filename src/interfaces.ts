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

export interface Summary {
  Global: GlobalCovidData;
  Countries: CountryCovidData[];
  Date: Date;
}

export interface Country {
  Country: string;
  Slug: string;
  ISO2: string;
}
