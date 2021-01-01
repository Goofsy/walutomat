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
    const formData = View.getSearchFormData();

    View.renderSearchCurrency(
      await model.searchCurrency(formData.amount, formData.from, formData.to)
    );

    View.updateChart(
      await model.getCurrencyTimeSeries(formData.from, formData.to)
    );
  } catch (err) {
    View.renderSearchError(err.message);
  }
};

const controlChartByDays = async function () {
  const formData = View.getSearchFormData();
  const daysChart = View.daysChart;

  const dataTimeSeries = await model.getCurrencyTimeSeries(
    formData.from,
    formData.to,
    daysChart
  );
  View.updateChart(dataTimeSeries);
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
  View.renderChart(await model.getCurrencyTimeSeries());
  View.handlerOpenDropdownChart();
  View.addHandlerSelectMonthsChart(controlChartByDays);
  View.handlerCloseDropdownChart();
};
init();
