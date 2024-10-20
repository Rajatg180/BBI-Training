let countries = [];
let currentSearchQuery = "";
let currentSortOption = null;
let currentSortOrder = "asc";

function showLoading() {
  const loadingSpinner = document.querySelector(".loading");
  loadingSpinner.style.display = "block";
}

function hideLoading() {
  const loadingSpinner = document.querySelector(".loading");
  loadingSpinner.style.display = "none";
}

async function getData() {
  const response = await fetch("https://restcountries.com/v3.1/all");
  const data = await response.json();
  hideLoading();
  return data;
}

function displayUi(countries) {

  const cardBody = document.querySelector(".card-body");
  
  cardBody.innerHTML = ""; 


  if (countries.length === 0) {
    const title = document.createElement("div");
    title.textContent = "No countries found with the given filter.";
    title.style.fontSize = "22px";
    title.style.fontWeight = "bold";
    title.style.color = "#666";
    title.style.textAlign = "center";
    cardBody.appendChild(title);
    return;
  }


  for (let country of countries) {
    const countryName = country.name?.common;
    const population = country.population;
    const capital = country.capital ? country.capital[0] : "No capital";
    const flag = country.flags?.png || "https://via.placeholder.com/150";

    const card = document.createElement("div");

    card.classList.add("card");

    card.innerHTML = `
      <div class="card-image">
        <img src="${flag}" alt="Flag of ${countryName}">
      </div>
      <div class="card-common-name">Country: ${countryName}</div>
      <div class="card-population">Population: ${population}</div>
      <div class="card-capital">Capital: ${capital}</div>
    `;

    cardBody.appendChild(card);
  }
}


function applySearchAndSort() {

  let filteredCountries = countries.filter((country) =>
    country.name?.common.toLowerCase().includes(currentSearchQuery)
  );

  if (currentSortOption === "name") {
    filteredCountries.sort((a, b) =>
      currentSortOrder === "asc"
        ? a.name.common.localeCompare(b.name.common)
        : b.name.common.localeCompare(a.name.common)
    );
  } else if (currentSortOption === "population") {
    filteredCountries.sort((a, b) =>
      currentSortOrder === "asc" ? a.population - b.population : b.population - a.population
    );
  } else if (currentSortOption === "region") {
    filteredCountries.sort((a, b) =>
      currentSortOrder === "asc"
        ? (a.region || "").localeCompare(b.region || "")
        : (b.region || "").localeCompare(a.region || "")
    );
  }

  displayUi(filteredCountries);
}


function searchFunction() {
  currentSearchQuery = document.querySelector("#search").value.toLowerCase();
  currentSortOption = null; 
  applySearchAndSort();
}


function sortCountries() {
  currentSortOption = document.querySelector(".dropdown").value;
  applySearchAndSort(); 
}


function toggleSortOrder() {
  currentSortOrder = document.querySelector(".sort-order").value;
  applySearchAndSort();
}

async function Country() {
  countries = await getData();
  applySearchAndSort(); 
}

Country();
