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
  amount = 1,
  from = 'EUR',
  to = 'PLN'
) {
  try {
    if (amount < 1) throw new Error('Wpisz minimum 1');
    if (amount.length > 10) throw new Error('Za duza kwota');
    const res = await fetch(
      `${API_URL}latest?amount=${amount}&from=${from}&to=${to}`
    );
    const data = await res.json();
    return createCurrencyObject(data);
  } catch (err) {
    throw err;
  }
};

const createCurrencyTimeSeries = function (data) {
  const rates = Object.values(data.rates).map(el => {
    return Object.values(el)[0];
  });
  const to = Object.keys(Object.values(data.rates)[0])[0];
  const dates = Object.keys(data.rates).map(el => {
    return el.split('-').reverse().join('.');
  });

  return {
    from: data.base,
    to: to,
    dates: dates,
    rates: rates,
  };
};

const formateDate = function (days) {
  let currentDate = new Date();
  const dateMinusDays = currentDate.setDate(currentDate.getDate() - days);
  return new Date(dateMinusDays).toISOString().split('T')[0];
};

export const getCurrencyTimeSeries = async function (
  from = 'EUR',
  to = 'PLN',
  days = 30
) {
  const date = formateDate(days);
  const res = await fetch(`${API_URL}${date}..?to=${to}&from=${from}`);
  const data = await res.json();
  return createCurrencyTimeSeries(data);
};
