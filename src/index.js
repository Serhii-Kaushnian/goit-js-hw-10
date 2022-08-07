import './css/styles.css';
import Notiflix from 'notiflix';
var debounce = require('lodash.debounce');
//================================================================
Notiflix.Notify.init({
  width: '200px',
  position: 'right-top',
  distance: '20px',
  opacity: 0.8,
  borderRadius: '10px',
  timeout: 1500,
  fontSize: '10px',
  cssAnimationDuration: 500,
  cssAnimationStyle: 'zoom',
});
//================================================================

const DEBOUNCE_DELAY = 800;
//================================================================

const refs = {
  inputSearchCounry: document.querySelector('#search-box'),
  listCountry: document.querySelector('.country-list'),
  divCountryInfo: document.querySelector('.country-info'),
};
//================================================================

const BASE_URL = 'https://restcountries.com/v3.1/name/';
//================================================================

refs.inputSearchCounry.addEventListener(
  'input',
  debounce(onInputType, DEBOUNCE_DELAY)
);
//================================================================

//================================================================
function onInputType(event) {
  const serchedCounry = event.target.value;
  const URL = `${BASE_URL}${serchedCounry}?fields=name,capital,population,flags,languages`;

  if (event.target.value) {
    fetch(URL)
      .then(function (response) {
        if (response.status == 404) {
          Notiflix.Notify.failure('Oops, there is no country with that name');
          refs.divCountryInfo.innerHTML = '';
          refs.listCountry.innerHTML = '';
        } else {
          return response.json();
        }
      })
      .then(data => {
        refs.divCountryInfo.innerHTML = '';
        refs.listCountry.innerHTML = '';
        dataOprate(data);
      })
      .catch(function (err) {
        console.log(err);
      });
  }
}
//================================================================
function dataOprate(fetchedResponse) {
  if (fetchedResponse.length > 10) {
    Notiflix.Notify.info(
      'Too many matches found. Please enter a more specific name.'
    );
  } else if (fetchedResponse.length == 1) {
    let { capital, flags, languages, name, population } = fetchedResponse[0];
    const allLang = Object.values(languages).join(',');

    refs.divCountryInfo.innerHTML = `<div class="country-info__body">
	<div class="country-info__title">
		<img class="country-info__title_img"  src=${flags.svg} alt="${name.common}" />
		<h3 class="country-info__title_name">${name.official}</h3>
	</div>
	<div class="country-info__statistics">
		<p class="country-info__capital"><span>Capital:</span> ${capital}</p>
		<p class="country-info__population"><span>Population:</span> ${population}</p>
		<p class="country-info__Languages"><span>Languages:</span> ${allLang}</p>
	</div>
</div>`;
  } else if (fetchedResponse.length > 1 && fetchedResponse.length <= 10) {
    let generatedListEl = '';
    for (const country of fetchedResponse) {
      generatedListEl += `<li class="country-info__title">
		<img class="country-info__title_img"  src=${country.flags.svg} alt="${country.name.common}" />
		<h3 class="country-info__title_name">${country.name.official}</h3>
	</li>`;
    }
    refs.listCountry.innerHTML = generatedListEl;
  }
}
//================================================================
