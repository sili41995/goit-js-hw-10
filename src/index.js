import './css/styles.css';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { fetchCountries } from './fetchCountries';

const refs = {
  searchForm: document.querySelector('#search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};

refs.searchForm.addEventListener('input', debounce(onInputForm, 300));

function onInputForm(e) {
  const searchQuery = e.target.value.trim();

  if (!searchQuery) {
    clearMarkup();
    return;
  }

  fetchCountries(searchQuery)
    .then((countriesArray) => {
      if (countriesArray.length > 10) {
        Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
        return;
      }
      if (countriesArray.length >= 2 && countriesArray.length <= 10) {
        clearMarkup();
        appendCountriesListMarkup(countriesArray);
        return;
      }
      clearMarkup();
      appendCountryMarkup(countriesArray);
    })
    .catch((error) => {
      clearMarkup();
      Notify.failure('Oops, there is no country with that name');
    });
}

function appendCountriesListMarkup(countriesArray) {
  const countriesListMarkup = createCountriesListMarkup(countriesArray);
  refs.countryList.insertAdjacentHTML('beforeend', countriesListMarkup);
}

function createCountriesListMarkup(countriesArray) {
  return countriesArray
    .map(
      ({ name, flags }) => `<li class="country-title">
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

function appendCountryMarkup(country) {
  const countryMarkup = createCountryMarkup(country);
  refs.countryInfo.insertAdjacentHTML('beforeend', countryMarkup);
}

function createCountryMarkup(country) {
  return country
    .map(
      ({
        name,
        capital,
        population,
        flags,
        languages,
      }) => `<div class="country-card">
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
</div>`
    )
    .join('');
}

function clearMarkup() {
  refs.countryList.innerHTML = '';
  refs.countryInfo.innerHTML = '';
}
