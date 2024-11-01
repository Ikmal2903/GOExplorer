const fs = require('fs');
const path = require('path');
function View() {
    window.location.href = "view.html"; // Replace with your actual page URL
}
function homepage() {
    window.location.href = "index.html"; // Replace with your actual page URL
}
// DOM Elements
var btnCreate = document.getElementById('btnCreate');
var btnRead = document.getElementById('btnRead');
var btnDelete = document.getElementById('btnDelete');
var btnSave = document.getElementById('btnSave');
var btnUpdate = document.getElementById('btnUpdate');
var fileName = document.getElementById('fileName');
var fileContents = document.getElementById('fileContents');
var date=document.getElementById('date');
var itineraries=document.getElementById('itineraries')
// Directory to store files
let pathName = path.join(__dirname, 'Files');
if (!fs.existsSync(pathName)) {
    fs.mkdirSync(pathName);
}

// Create File
btnCreate.addEventListener('click', function () {
    let filePath = path.join(pathName, `${fileName.value}.txt`);
    let content = `Date:${date.value}\n${fileContents.value}\nItineraries Details:${itineraries.value}`;

    fs.writeFile(filePath, content, function (err) {
        if (err) {
            alert("Error: " + err.message);
            return;
        }
        alert(`${fileName.value} created successfully!`);
    });
});

// Read File
btnRead.addEventListener('click', function () {
    let filePath = path.join(pathName, `${fileName.value}.txt`);
    
    fs.readFile(filePath, 'utf-8', function (err, data) {
      if (err) {
        alert("Error: " + err.message);
        return;
      }
      fileContents.value = data;
      alert(`${fileName.value} read successfully!`);
    });
  });
btnUpdate.addEventListener('click', function () {
    let filePath = path.join(pathName, `${fileName.value}.txt`);
    let content = `Date:${date.value}\n${fileContents.value}\nItineraries Details:${itineraries.value}`;

    fs.writeFile(filePath, content, function (err) {
        if (err) {
            alert("Error: " + err.message);
            return;
        }
        alert(`${fileName.value} updated successfully!`);
    });
});


// Delete File
btnDelete.addEventListener('click', function () {
    let filePath = path.join(pathName, `${fileName.value}.txt`);

    fs.unlink(filePath, function (err) {
        if (err) {
            alert("Error: " + err.message);
            return;
        }
        fileName.value = '';
        fileContents.value = '';
        alert(`${fileName.value} deleted successfully!`);
    });
});

// Fetch country data and display it
async function buttonClicked() {
    const countryName = document.getElementById('country1-input').value.toLowerCase();

    try {
        const response = await fetch(`https://restcountries.com/v3.1/name/${countryName}`);
        const data = await response.json();

        if (data && data[0]) {
            const countryData = data[0];

            // Display fetched data
            displayCountryData(countryData);
        } else {
            alert("Country not found.");
        }
    } catch (error) {
        console.error("Error fetching country data:", error);
    }
}

function displayCountryData(countryData) {
    // Display country details
    document.getElementById("country1").textContent = countryData.name.common;
    document.getElementById("population1").textContent = `${countryData.population} people`;
    document.getElementById("currencies1").textContent = Object.values(countryData.currencies).map(currency => currency.name).join(", ");
    document.getElementById("timezone1").textContent = countryData.timezones.join(", ");
    document.getElementById("continent1").textContent = countryData.continents.join(", ");
    document.getElementById("capital1").textContent = countryData.capital?.join(", ") || 'N/A';
    document.getElementById("languages1").textContent = Object.values(countryData.languages).join(", ");
    document.getElementById("region").textContent = countryData.region;
    document.getElementById("subregion").textContent = countryData.subregion;
    document.getElementById("maps").innerHTML = `<a href="${countryData.maps.googleMaps}" target="_blank">View Map</a>`;
    document.getElementById("flags").src = countryData.flags.png;
    document.getElementById("coatofarms").src = countryData.coatOfArms?.png || "";
    document.getElementById("area").textContent = `${countryData.area} square feet`;
    document.getElementById("location").textContent = `${countryData.latlng[0]} latitude, ${countryData.latlng[1]} longitude`;

    // Display nearby countries with clickable search
    const nearbyCountriesElement = document.getElementById("nearbyCountries");
    nearbyCountriesElement.innerHTML = ''; // Clear previous nearby countries
    countryData.borders.forEach(async borderCode => {
        const borderResponse = await fetch(`https://restcountries.com/v3.1/alpha/${borderCode}`);
        const borderData = await borderResponse.json();
        if (borderData && borderData[0]) {
            const borderCountry = borderData[0].name.common; // Get full name
            const borderButton = document.createElement("button");
            borderButton.textContent = borderCountry;
            borderButton.style.marginRight = "5px"; // Optional spacing
            borderButton.onclick = () => searchNearbyCountry(borderCountry); // Attach click event
            nearbyCountriesElement.appendChild(borderButton);
        }
    });
}

function searchNearbyCountry(countryName) {
    document.getElementById('country1-input').value = countryName; // Set input to the nearby country
    buttonClicked(); // Trigger search
}



// Helper function to get displayed data
function getDisplayedData() {
    return {
        Country: document.getElementById("country1").textContent,
        Population: document.getElementById("population1").textContent,
        Currencies: document.getElementById("currencies1").textContent,
        Timezones: document.getElementById("timezone1").textContent,
        Continent: document.getElementById("continent1").textContent,
        Capital: document.getElementById("capital1").textContent,
        Languages: document.getElementById("languages1").textContent,
        Region: document.getElementById("region").textContent,
        Subregion: document.getElementById("subregion").textContent,
        MapsLink: document.getElementById("maps").querySelector('a').href,
        Flags: document.getElementById("flags").src,
        CoatOfArms: document.getElementById("coatofarms").src,
    };
}

// Save displayed data to a text file
async function saveCountry() {
    let pathName = path.join(__dirname, 'Files');
    if (!fs.existsSync(pathName)) {
    fs.mkdirSync(pathName);
    }
    const data = getDisplayedData();
    if (!data.Country) {
        alert("No country data to save.");
        return;
    }

    const filePath = path.join(pathName, `${data.Country}.txt`);
    const dataToSave = Object.entries(data)
        .map(([key, value]) => `${key}: ${value}`)
        .join('\n');

    fs.writeFile(filePath, dataToSave, (err) => {
        if (err) {
            console.error("Error saving file:", err);
            alert("Error saving file: " + err.message);
        } else {
            alert(` ${data.Country} data saved successfully`);
        }
    });
}




// Update displayed data in a text file
async function updateCountry() {
    let pathName = path.join(__dirname, 'Files');
    if (!fs.existsSync(pathName)) {
    fs.mkdirSync(pathName);
    }
    const data = getDisplayedData();
    if (!data.Country) {
        alert("No country data to update.");
        return;
    }

    const filePath = path.join(pathName, `${data.Country}.txt`);
    const dataToUpdate = Object.entries(data)
        .map(([key, value]) => `${key}: ${value}`)
        .join('\n');

    fs.writeFile(filePath, dataToUpdate, (err) => {
        if (err) {
            console.error("Error updating file:", err);
            alert("Error updating file: " + err.message);
        } else {
            alert(`Displayed data for ${data.Country} updated in ${filePath}`);
        }
    });
}




// Button event listeners for saving and loading
btnSave.addEventListener('click', saveCountry);
btnLoad.addEventListener('click', loadCountry);
