import 'core-js';
import 'regenerator-runtime/runtime';
import * as model from './model.js';
import View from './View.js';

const controlCurrencies = async function () {
  const curr = View.inputSearchCurrenciesValue;
  View.renderCurrencies(model.currenciesListFilter(curr));
};

const controlSearchCurrency = async function () {
  try {
    const formData = View.getFormData();

    View.renderSearchCurrency(
      await model.searchCurrency(formData.amount, formData.from, formData.to)
    );
  } catch (err) {
    View.renderSearchError(err.message);
  }
};

const init = async function () {
  await model.getCurrencies();
  View.renderSearchCurrency(await model.searchCurrency());
  View.addHandlerSearchRate(controlSearchCurrency);
  View.addHandlerSearchRateByEnter(controlSearchCurrency);
  View.addHandlerFilterCurrencies(controlCurrencies);
  View.handlerOpenCurrenciesList(model.state.currencies);
  View.handlerSwapCurrencies();
  View.handlerChooseCurrency();
  View.handlerCloseCurrenciesList();
};
init();
