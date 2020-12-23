// import 'regenerator-runtime/runtime';
import { API_URL } from './config.js';

export const getCurrencies = async function () {
  const res = await fetch(`${API_URL}currencies`);
  const data = await res.json();
  const currencies = Object.keys(data);
  return currencies;
};

export const createCurrencyObject = function (data) {
  return {
    amount: data.amount,
    from: data.base,
    to: Object.keys(data.rates)[0],
    rate: Object.values(data.rates)[0],
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
