import { prompt } from 'enquirer';
import { scopeChoices, fieldChoices } from './choices';
import { getCountriesName } from './api';
import { FieldAnswer, ScopeAnswer, CountryAnswer } from './interfaces';

// Pertanyaan
export const fieldQuestion = async () => {
  return <FieldAnswer>await prompt({
    type: 'select',
    name: 'field',
    message: 'Informasi apa yang anda butuhkan?',
    choices: Object.values(fieldChoices),
  });
};

export const scopeQuestion = async () => {
  return <ScopeAnswer>await prompt({
    type: 'select',
    name: 'scope',
    message: 'Pilih global atau negara',
    choices: Object.values(scopeChoices),
  });
};

export const answerQuestion = async () => {
  return <CountryAnswer>await prompt({
    type: 'autocomplete',
    name: 'country',
    message: 'Pilih satu negara',
    choices: await getCountriesName(),
  });
};

export const loopQuestion = async () => {
  return <{ loop: string }>await prompt({
    type: 'confirm',
    name: 'loop',
    message: 'Jalankan lagi?',
  });
};
