import './css/styles.css';
import Notiflix from 'notiflix';
import debounce from 'lodash.debounce';
import API from './fetchCountries';

const DEBOUNCE_DELAY = 300;

const refs = {
  searchBox: document.querySelector('#search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};

refs.searchBox.addEventListener('input', debounce(onFormInput, DEBOUNCE_DELAY));

function onFormInput(evt) {
  const request = evt.target.value.trim();
  if (request) {
    API.fetchCountries(request)
      .then(countryList => {
        checkCountry(countryList);
      })
      .catch(error => {
        showError(error);
      });
  } else {
    clearContent();
  }
}

function checkCountry(countryList) {
  length = countryList.length;
  clearContent();
  if (length === 1) {
    showOneCountry(countryList[0]);
  } else if (length > 1 && length < 10) {
    showCountries(countryList);
  } else {
    Notiflix.Notify.info(
      'Too many matches found. Please enter a more specific name.'
    );
  }
}

function showError(error) {
  clearContent();
  if ((error.message = '404')) {
    Notiflix.Notify.failure('Oops, there is no country with that name');
  }
}

function showCountries(countryList) {
  let markup = '';
  countryList.forEach(country => {
    // console.log(country);
    markup += `<li><img src="${country.flags.svg}" width="16px" alt="flag of ${country.name.official}"> ${country.name.common}</li>`;
  });
  refs.countryList.innerHTML = markup;
}

function showOneCountry(country) {
  const {
    capital,
    population,
    languages,
    flags,
    name: { official: nameOfficial, common: nameCommon },
  } = country;
  const languagesList = Object.values(languages).join(', ');

  refs.countryInfo.innerHTML = `<h0 class="title"><img src="${flags.svg}" width="24px" alt="flag of ${nameOfficial}"> ${nameCommon}</h0><p><span class='title-bold'>Capital:</span> ${capital}</p><p><span class='title-bold'>Population:</span> ${population}</p><p><span class='title-bold'>Languages:</span> ${languagesList}</p>`;
}

function clearContent() {
  if (refs.countryList.innerHTML) {
    refs.countryList.innerHTML = '';
  }
  if (refs.countryInfo.innerHTML) {
    refs.countryInfo.innerHTML = '';
  }
}
