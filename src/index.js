import './css/styles.css';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { fetchCountries } from './fetchCountries';

const DEBOUNCE_DELAY = 300;

const inputEl = document.querySelector('#search-box');
const cardContainer = document.querySelector('.country-info');
const listContainer = document.querySelector('.country-list');

inputEl.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));

function onInput(e) {
  const name = inputEl.value.trim();
  if (name === '') {
    clearMarkup();
    return;
  }
  fetchCountries(name)
    .then((country) => {
      if (country.length > 10) {
        clearMarkup();
        Notify.info(
          'Too many matches found. Please enter a more specific name.',
          {}
        );
        return;
      }
      if (country.length >= 2 && country.length < 10) {
        cardContainer.innerHTML = '';
        const markupCountries = renderCountriesListMarkup(country);
        listContainer.innerHTML = markupCountries;
        return;
      }

      country.forEach((country) => {
        renderCountryMarkup(country);
      });
    })
    .catch((error) => {
      Notify.failure('Oops, there is no country with that name');
    });
}

function renderCountryMarkup({ flags, name, capital, population, languages }) {
  listContainer.innerHTML = '';
  const markupCountry = `<div class="country-card">
  <div class="country-title">
    <img
      class="country-flag"
      src="${flags.svg}"
      alt="${flags.alt}"
    />
    <h2 class="country-name">${name.official}</h2>
  </div>
  <div class="country-card-body">
    <p class="country-capital">
      <span>Capital: </span>${capital}
    </p>
    <p class="country-population">
      <span>Population: </span>${population}
    </p>
    <p class="country-languages">
      <span>Languages: </span>${Object.values(languages)}
    </p>
  </div>
</div>`;
  cardContainer.innerHTML = markupCountry;
}

function renderCountriesListMarkup(countries) {
  return countries
    .map(
      ({ flags, name }) =>
        `<li class="country-title">
      <img
        class='country-flag'
        src='${flags.svg}'
        alt='${flags.alt}'
      />
      <h2 class='country-name'>${name.official}</h2>
    </li>`
    )
    .join('');
}

function clearMarkup() {
  listContainer.innerHTML = '';
  cardContainer.innerHTML = '';
}

export { clearMarkup };
