import './css/styles.css';
import { fetchCountries } from "./backend/fetchCountries";
import debounce from "lodash.debounce";
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import 'notiflix/dist/notiflix-3.2.2.min.css';

const DEBOUNCE_DELAY = 300;
const inputRef = document.querySelector("#search-box");
const countryListRef = document.querySelector(".country-list");
const countryInfoRef = document.querySelector(".country-info");


inputRef.addEventListener("input", debounce(onInputText, DEBOUNCE_DELAY))

function onInputText(e) {
    countryListRef.innerHTML = "";
    countryInfoRef.innerHTML = "";
    if (inputRef.value.trim() === "") {
        return
    };
   
        fetchCountries(inputRef.value.trim())
            .then(countryData => {
                if (countryData.length > 10) {
                    Notify.info("Too many matches found. Please enter a more specific name.");
                    
                } else if (countryData.length >= 2 && countryData.length <= 10) { 
                    countryData.map(country => {
                        countryListRef.insertAdjacentHTML("beforeend", markUpCountryList(country));
                    })
                    
                } else {
                    countryInfoRef.innerHTML = markUpCountryInfo(countryData[0])
                } 
            })
            .catch(error => {
                Notify.failure("Oops, there is no country with that name");
            });
}

function markUpCountryList({flags, name}) {
    return `<li class = "country-item"><img src="${flags.svg}" alt="country flag" width="50"><p class = "country-name">${name.official}</p></li>`
};

function markUpCountryInfo({flags, name, capital, population, languages}) {
    return `<img src="${flags.svg}" alt="country flag" width="250">
    <h1>${name.official}</h1>
    <p><b>Capital: </b>${capital}</p>
    <p><b>Population: </b>${population}</p>
    <p><b>Languages: </b>${Object.values(languages).join(", ")}</p>`
}
