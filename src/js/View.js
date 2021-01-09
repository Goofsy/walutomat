import imgs from '../flags/*.png';

class View {
  _form = document.querySelector('.form');
  _dropdowns = document.querySelectorAll('.dropdown');
  _currenciesLists = document.querySelectorAll('.currencies-list');
  _inputSearchCurrencies = document.querySelectorAll('.input--search');
  _inputAmount = document.querySelector('.input--amount');
  _btnsDropdownOpen = document.querySelectorAll('.dropdown-open');
  _btnFrom = document.querySelector('.btn-from');
  _btnTo = document.querySelector('.btn-to');
  _btnSubmit = document.querySelector('.btn--submit');
  _errorText = document.querySelector('.error-text');

  _btnSwap = document.querySelector('.btn--swap');

  _resultAmount = document.querySelector('.result__amount');
  _resultLastUpdate = document.querySelector('.result__info__last-update');
  _resultOneXY = document.querySelector('.result__info__one-xy');
  _resultOneYX = document.querySelector('.result__info__one-yx');

  _chart = document.querySelector('#myChart');
  _btnOpenDropdownChart = document.querySelector('.open-chart-dropdown');
  _chartDropdown = document.querySelector('.chart__dropdown');
  _chartMonths = document.querySelector('.chart__months');
  _chartTitle = document.querySelector('.chart__title');
  _myChart;

  inputSearchCurrenciesValue;
  daysChart;
  constructor() {
    this._handlerSwapCurrencies();
    this._handlerChooseCurrencies();
    this._handlerCloseCurrenciesList();
    this._handlerOpenDropdownChart();
    this._handlerCloseDropdownChart();
  }

  // Chart
  updateChart({ from, to, dates, rates }) {
    const { config } = this.myChart;
    config.data.labels = dates;
    config.data.datasets[0].data = rates;
    config.data.datasets[0].label = `1 ${from} = `;
    config.options.title.text = `Historia zmian ${from} na ${to}`;
    this.myChart.update();
  }

  addHandlerSelectMonthsChart(handler) {
    this._chartDropdown.addEventListener('click', e => {
      const btn = e.target.closest('.btn--chart');
      if (!btn) return;
      this._chartMonths.innerHTML = btn.innerHTML;
      this.daysChart = btn.dataset.days;
      handler();
    });
  }

  _handlerCloseDropdownChart() {
    window.addEventListener('click', e => {
      if (e.target.closest('.open-chart-dropdown')) return;

      this._chartDropdown.style.display = 'none';
    });
  }

  _handlerOpenDropdownChart() {
    this._btnOpenDropdownChart.addEventListener('click', e => {
      this._chartDropdown.style.display = 'block';
    });
  }

  renderChart({ from, to, rates, dates }) {
    Chart.defaults.global.defaultFontFamily = 'sans-serif';

    this.myChart = new Chart(this._chart, {
      type: 'line',
      data: {
        labels: dates,
        datasets: [
          {
            label: `1 ${from} = `,
            data: rates,
            backgroundColor: 'rgba(39, 174, 96, 0.3)',
            borderColor: '#27ae60',
            borderWidth: 1,
          },
        ],
      },
      options: {
        maintainAspectRatio: false,
        animation: {
          duration: 0,
        },
        scales: {
          xAxes: [
            {
              ticks: {
                minRotation: 65,
                maxTicksLimit: 12,
              },
            },
          ],
        },
        title: {
          display: true,
          position: 'top',
          text: `Historia zmian ${from} na ${to}`,
          fontSize: 22,
        },
        legend: {
          display: false,
        },
        tooltips: {
          displayColors: false,

          callbacks: {
            label: function (tooltipItem, data) {
              let label = data.datasets[tooltipItem.datasetIndex].label || '';

              label += Math.round(tooltipItem.yLabel * 1000) / 1000;
              return label;
            },
          },
        },
      },
    });
  }

  // Search Currency
  addHandlerSearchRateByEnter(handler) {
    this._inputAmount.addEventListener('keydown', e => {
      if (e.key !== 'Enter') return;
      e.preventDefault();
      handler();
      this._inputAmount.value = '';
      this._hideSearchError();
      this._chartMonths.innerHTML = '1 Miesiąc';
    });
  }

  addHandlerSearchRate(handler) {
    this._btnSubmit.addEventListener('click', () => {
      handler();
      this._inputAmount.value = '';
      this._hideSearchError();
      this._chartMonths.innerHTML = '1 Miesiąc';
    });
  }

  getSearchFormData() {
    return {
      amount: this._inputAmount.value,
      from: this._btnFrom.dataset.currency,
      to: this._btnTo.dataset.currency,
    };
  }

  _hideSearchError() {
    this._inputAmount.classList.remove('input--amount--error');
    this._errorText.style.opacity = '0.1';
    this._errorText.style.visibility = 'hidden';
  }

  renderSearchError(err) {
    this._errorText.innerHTML = err;
    this._errorText.style.visibility = 'visible';
    this._errorText.style.opacity = '1';
    this._inputAmount.classList.add('input--amount--error');
  }

  renderSearchCurrency(result) {
    this._resultAmount.innerHTML = `${result.amount} ${result.from} = ${result.rate} ${result.to}`;
    this._resultLastUpdate.innerHTML = `Ostatnia Aktualizacja ${result.updateDate}`;
    this._resultOneXY.innerHTML = `
    1 ${result.from} = ${(Number(result.rate) / result.amount).toFixed(3)} ${
      result.to
    }`;

    this._resultOneYX.innerHTML = `
    1 ${result.to} = ${(result.amount / result.rate).toFixed(3)} ${
      result.from
    }`;
  }

  // Currencies List
  _swapCurrencies() {
    const btn1Html = this._btnsDropdownOpen[0].innerHTML;
    const btn2Html = this._btnsDropdownOpen[1].innerHTML;
    const btn1data = this._btnsDropdownOpen[0].dataset.currency;
    const btn2data = this._btnsDropdownOpen[1].dataset.currency;
    this._btnsDropdownOpen[0].innerHTML = btn2Html;
    this._btnsDropdownOpen[1].innerHTML = btn1Html;
    this._btnsDropdownOpen[0].dataset.currency = btn2data;
    this._btnsDropdownOpen[1].dataset.currency = btn1data;
  }

  _handlerSwapCurrencies() {
    this._btnSwap.addEventListener('click', this._swapCurrencies.bind(this));
  }

  _chooseCurrency(e) {
    const btn = e.target.closest('.btn--search');
    if (!btn) return;
    const cur = btn.dataset.currency;

    if (
      document.querySelector(
        `.btn-${btn.closest('.currencies-list').dataset.list}`
      ).dataset.currency === cur
    ) {
      this._swapCurrencies();
      return;
    }

    const markup = `
      <img src="${imgs[cur]}" alt="${cur}"/>
      <p>${cur}</p>
    `;
    btn
      .closest('.form__group')
      .querySelector('.dropdown-open').dataset.currency = `${cur}`;
    btn
      .closest('.form__group')
      .querySelector('.btn-content').innerHTML = markup;
  }

  _handlerChooseCurrencies() {
    [...this._currenciesLists].forEach(list => {
      list.addEventListener('click', this._chooseCurrency.bind(this));
    });
  }

  addHandlerFilterCurrencies(handler) {
    [...this._inputSearchCurrencies].forEach(input =>
      input.addEventListener('input', e => {
        this.inputSearchCurrenciesValue = e.target.value;
        handler();
      })
    );
  }

  _handlerCloseCurrenciesList() {
    document.body.addEventListener('click', e => {
      if (
        e.target.closest('.dropdown-open') ||
        e.target.closest('.input--search')
      )
        return;

      [...this._inputSearchCurrencies].forEach(input => (input.value = ''));
      [...this._dropdowns].forEach(el => (el.style.display = 'none'));
    });
  }

  handlerOpenCurrenciesList(currencies) {
    this._form.addEventListener('click', e => {
      e.preventDefault();

      if (e.target.closest('.input--search')) return;
      [...this._dropdowns].forEach(e => (e.style.display = 'none'));
      const btn = e.target.closest('.dropdown-open');

      if (!btn) return;
      this.renderCurrencies(currencies);
      btn.nextElementSibling.style.display = 'block';
      btn.nextElementSibling.querySelector('.input--search').focus();
      btn.nextElementSibling.addEventListener('keydown', e => {
        if (e.key !== 'Enter') return;
        e.preventDefault();
        let firstElement = btn.nextElementSibling.querySelector(
          '.currencies-list'
        ).children[0];
        firstElement.click();
      });
    });
  }

  _clearCurrenciesList() {
    [...this._currenciesLists].forEach(list => {
      list.innerHTML = '';
    });
  }

  _setNoCurrencies() {
    const markup = '<p class="no-results">Nie znaleziono</p>';

    [...this._currenciesLists].forEach(list =>
      list.insertAdjacentHTML('beforeend', markup)
    );
  }

  _generateButton(cur) {
    return `
      <button class="btn btn--search" data-currency="${cur}">
        <img src="${imgs[cur]}" alt="${cur}" data-currency="${cur}"/>
        <p>${cur}</p>
      </button>
   `;
  }

  _setCurrenciesList(currencies) {
    currencies.forEach(cur => {
      [...this._currenciesLists].forEach(list =>
        list.insertAdjacentHTML('beforeend', this._generateButton(cur))
      );
    });
  }

  renderCurrencies(currencies) {
    this._clearCurrenciesList();

    if (currencies.length === 0) this._setNoCurrencies();

    this._setCurrenciesList(currencies);
  }
}
export default new View();
