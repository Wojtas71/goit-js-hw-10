import './css/styles.css';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import { fetchCountries } from './js/fetchCountries';

const DEBOUNCE_DELAY = 300;

const elements = {
    searchInput: document.querySelector('#search-box'),
    countriesList: document.querySelector('.country-list'),
    countryInfo: document.querySelector('.country-info'),
};

elements.searchInput.addEventListener('input', debounce(onInputValue, DEBOUNCE_DELAY));

function onInputValue(event) {

  const inputValue = event.target.value.trim();

  if (inputValue === '') {
    elements.countriesList.innerHTML = '';
    elements.countryInfo.innerHTML = '';
    return;
  }

  fetchCountries(inputValue)
    .then(createCountriesList)
    .catch(countriesListError);
};

function createCountriesList(countries) {
  const countriesCount = countries.length;

  if (countriesCount > 10) {
    Notiflix.Notify.info(
      'Too many matches found. Please enter a more specific name.'
    );
    elements.countriesList.innerHTML = '';
    elements.countryInfo.innerHTML = '';
    return;
  }

  if (countries.length > 2 && countries.length <= 10) {
    const listCountries = countries
      .map(country => createCountryListItem(country))
      .join('');
    elements.countriesList.innerHTML = listCountries;
    elements.countryInfo.innerHTML = '';
  }

  if (countries.length === 1) {
      const cardCountry = countries.map(country => countryCard(country)).join('');
    elements.countriesList.innerHTML = '';
    elements.countryInfo.innerHTML = cardCountry;
  }
};

function countriesListError(error) {
  Notiflix.Notify.failure('Oops, there is no country with that name');
  elements.countriesList.innerHTML = '';
  elements.countryInfo.innerHTML = '';
  return error;
};

function createCountryListItem({ flags, name }) {
    return `
        <li class="country-list__item">
            <img src="${flags.svg}" alt="${name.official}" width="25" />
            <h3>${name.official}</h3>
        </li>
    `;
};

function countryCard({ flags, name, capital, population, languages }) {
    return `
        <div class="country-info">
            <div class="country-info__box">
                <img src="${flags.svg}" alt="${name.official}" width="50" />
                <h3 class="country-info__country-name">${name.official}</h3>
            </div>
            <p><b><i>Capital:</i></b> ${capital}</p>
            <p><b><i>Population:</i></b> ${population}</p>
            <p><b><i>Languages:</i></b> ${Object.values(languages).join(
              ', '
            )}</p>
        </div>
    `;
};

