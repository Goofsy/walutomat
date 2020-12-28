// import 'regenerator-runtime/runtime';
import { API_URL } from './config.js';

export const state = {
  currencies: [],
};

const sortByRelevancy = function (value, searchTerm) {
  if (value === searchTerm) return 2;
  if (value.startsWith(searchTerm)) return 1;
  return 0;
};

export const currenciesListFilter = function (data) {
  const value = data.toUpperCase().trim();
  const filteredCurrencies = state.currencies
    .filter(curr => curr.includes(value))
    .sort((curr1, curr2) => {
      return sortByRelevancy(curr2, value) - sortByRelevancy(curr1, value);
    });
  return filteredCurrencies;
};

export const getCurrencies = async function () {
  const res = await fetch(`${API_URL}currencies`);
  const data = await res.json();
  state.currencies = Object.keys(data);
};

const createCurrencyObject = function (data) {
  return {
    from: data.base,
    amount: data.amount,
    to: Object.keys(data.rates)[0],
    rate: Object.values(data.rates)[0].toFixed(3),
    updateDate: data.date.split('-').reverse().join('.'),
  };
};

export const searchCurrency = async function (
  amount = 10,
  from = 'EUR',
  to = 'PLN'
) {
  const res = await fetch(
    `${API_URL}latest?amount=${amount}&from=${from}&to=${to}`
  );
  const data = await res.json();
  return createCurrencyObject(data);
};
