import 'core-js';
import 'regenerator-runtime/runtime';
import * as model from './model.js';
import View from './View.js';

const controlCurrencies = async function () {
  const curr = View.inputSearchCurrenciesValue;
  View.renderCurrencies(model.currenciesListFilter(curr));
};

const controlSearchCurrency = async function () {
  console.log(await model.searchCurrency());
};

const init = async function () {
  await model.getCurrencies();
  View.addHandlerFilterCurrencies(controlCurrencies);
  View.handlerOpenCurrenciesList(model.state.currencies);
  View.handlerSwapCurrencies();
  View.handlerChooseCurrency();
  View.handlerCloseCurrenciesList();
};
init();
