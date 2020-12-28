import imgs from '../flags/*.png';

class View {
  _form = document.querySelector('.form');
  _dropdowns = document.querySelectorAll('.dropdown');
  _currenciesLists = document.querySelectorAll('.currencies-list');
  _inputSearchCurrencies = document.querySelectorAll('.input--search');
  _btnSwap = document.querySelector('.btn--swap');

  inputSearchCurrenciesValue;
  constructor() {}

  // Currencies List
  handlerSwapCurrencies() {
    this._btnSwap.addEventListener('click', e => {
      const currenciesBtns = document.querySelectorAll('.btn-content');
      const btn1Html = currenciesBtns[0].innerHTML;
      const btn2Html = currenciesBtns[1].innerHTML;
      currenciesBtns[0].innerHTML = btn2Html;
      currenciesBtns[1].innerHTML = btn1Html;
    });
  }

  _chooseCurrency(e) {
    const btn = e.target.closest('.btn--search');
    if (!btn) return;

    const cur = btn.dataset.currency;
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

  handlerChooseCurrency() {
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

  handlerCloseCurrenciesList() {
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
