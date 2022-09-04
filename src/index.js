import './css/styles.css';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { fetchCountries } from './fetchCountries';

const DEBOUNCE_DELAY = 300;

const searchInput = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

searchInput.addEventListener('input', debounce(onCountryInput, DEBOUNCE_DELAY));

function onCountryInput() {
  const name = searchInput.value.trim();
  if (name === '') {
    return (countryList.innerHTML = ''), (countryInfo.innerHTML = '');
  }

  fetchCountries(name)
    .then(countries => {
      countryList.innerHTML = '';
      countryInfo.innerHTML = '';

      if (countries.length === 1) {
        countryList.insertAdjacentHTML(
          'beforeend',
          createCountryList(countries)
        );
        countryInfo.insertAdjacentHTML(
          'beforeend',
          createCountryCard(countries)
        );
      } else if (countries.length >= 10) {
        alertTooManyMatches();
      } else {
        countryList.insertAdjacentHTML(
          'beforeend',
          createCountryList(countries)
        );
      }
    })
    .catch(alertWrongName);
}

function createCountryList(countries) {
  const markup = countries
    .map(({ name, flags }) => {
      return `
          <li class="country-list__item">
              <img class="country-list__flag" src="${flags.svg}" alt="Flag of ${name.official}" width = 30px height = 30px>
              <h2 class="country-list__name">${name.official}</h2>
          </li>
          `;
    })
    .join('');
  return markup;
}

function createCountryCard(countries) {
  const markup = countries
    .map(({ capital, population, languages }) => {
      return `
        <ul class="country-info__list">
            <li class="country-info__item"><span><b>Capital: </b>${capital}</span></li>
            <li class="country-info__item"><span><b>Population: </b>${population}</span></li>
            <li class="country-info__item"><span><b>Languages: </b>${Object.values(
              languages
            ).join(', ')}</span></li>
        </ul>
        `;
    })
    .join('');
  return markup;
}

function alertWrongName() {
  Notify.failure('Oops, there is no country with that name');
}

function alertTooManyMatches() {
  Notify.info('Too many matches found. Please enter a more specific name.');
}
