import 'core-js';
import 'regenerator-runtime/runtime';
import * as model from './model.js';

const controlCurrencies = async function () {
  console.log(await model.getCurrencies());
};

const controlSearchCurrency = async function () {
  console.log(await model.searchCurrency());
};

controlSearchCurrency();
controlCurrencies();
