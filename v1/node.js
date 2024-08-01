let dataArray = [];
let birdInfo = [];

async function fetchData() {
    try {
        const response = await fetch('data/nzbird.json');
        if (!response.ok) {
            throw new Error("Error fetching data"); // error handling
        }
        const data = await response.json();
        return data;

    } catch (error) {
        console.error(error);
        return [];
    }
}

async function initialiseBirds() {
    dataArray = await fetchData();
    for (let x = 0; x < dataArray.length; x++) {

        const birdObject = {
            primary_name: dataArray[x].primary_name,
            english_name: dataArray[x].english_name,
            scientific_name: dataArray[x].scientific_name,
            order: dataArray[x].order,
            family: dataArray[x].family,
            status: dataArray[x].status,
            photo: {
                credit: dataArray[x].photo.credit,
                source: dataArray[x].photo.source
            },
            size: {
                length: {
                    value: dataArray[x].size.length.value,
                    units: "cm"
                },
                weight: {
                    value: dataArray[x].size.weight.value,
                    units: "g"
                }
            }
        }
        console.log(birdObject);

        birdInfo.push(birdObject);
    }
}
initialiseBirds();


// Attach an event listener to wait for DOMContentLoaded
window.addEventListener('DOMContentLoaded', async () => {
    try {
        const fetchedData = await fetchData();
        display(fetchedData);
    } catch (error) {
        // Handle errors here
    }
});

async function display(fetchData) {

    const cardContainer = document.querySelector('.card-container');
    let resultCount = document.getElementById("filter-result-count");

    cardContainer.innerHTML = '';

    fetchData.forEach(data => {

        const cardElement = document.createElement('div');
        cardElement.classList.add('card');

        const birdImage = document.createElement('img');
        birdImage.src = data.photo.source;
        birdImage.classList.add('card-image');


        const birdPrimaryName = document.createElement('h2');
        birdPrimaryName.classList.add('card-primary-name');
        birdPrimaryName.textContent = data.primary_name;

        const birdCredit = document.createElement('p');
        birdCredit.classList.add('bird-credit');
        birdCredit.textContent = data.photo.credit;

        const birdEnglishName = document.createElement('p');
        birdEnglishName.classList.add('card-titles');
        const englishText = document.createElement('span');
        englishText.classList.add('card-titles');
        englishText.textContent = "English Name: ";
        const englishValue = document.createElement('span');
        englishValue.classList.add('card-attributes');
        englishValue.textContent = data.english_name;
        birdEnglishName.appendChild(englishText);
        birdEnglishName.appendChild(englishValue);

        const birdScientificName = document.createElement('p');
        birdScientificName.classList.add('card-titles');
        const scientificText = document.createElement('span');
        scientificText.classList.add('card-titles');
        scientificText.textContent = "Scientific name: ";
        const scientificValue = document.createElement('span');
        scientificValue.classList.add('card-attributes');
        scientificValue.textContent = data.scientific_name;
        birdScientificName.appendChild(scientificText);
        birdScientificName.appendChild(scientificValue);

        const birdOrder = document.createElement('p');
        birdOrder.classList.add('card-titles');
        const orderText = document.createElement('span');
        orderText.classList.add('card-titles');
        orderText.textContent = "Order: ";
        const orderValue = document.createElement('span');
        orderValue.classList.add('card-attributes');
        orderValue.textContent = data.order;
        birdOrder.appendChild(orderText);
        birdOrder.appendChild(orderValue);

        const birdStatus = document.createElement('p');
        birdStatus.classList.add('card-titles');
        const statusText = document.createElement('span');
        statusText.classList.add('card-titles');
        statusText.textContent = "Status: ";
        const statusValue = document.createElement('span');
        statusValue.classList.add('card-attributes');
        statusValue.textContent = data.status;
        birdStatus.appendChild(statusText);
        birdStatus.appendChild(statusValue);

        const birdLength = document.createElement('p');
        birdLength.classList.add('card-titles');
        const lengthText = document.createElement('span');
        lengthText.classList.add('card-titles');
        lengthText.textContent = "Length: ";
        const lengthValue = document.createElement('span');
        lengthValue.classList.add('card-attributes');
        lengthValue.textContent = data.size.length.value + " cm";
        birdLength.appendChild(lengthText);
        birdLength.appendChild(lengthValue);

        const birdWeight = document.createElement('p');
        birdWeight.classList.add('card-titles');
        const weightText = document.createElement('span');
        weightText.classList.add('card-titles');
        weightText.textContent = "Weight: ";
        const weightValue = document.createElement('span');
        weightValue.classList.add('card-attributes');
        weightValue.textContent = data.size.weight.value + " g";
        birdWeight.appendChild(weightText);
        birdWeight.appendChild(weightValue);

        const circle = document.createElement('div');
        circle.classList.add('card-circle');
        if (data.status == "Not Threatened") {
            circle.style.backgroundColor = '#02a028';
        } else if (data.status == "Naturally Uncommon") {
            circle.style.backgroundColor = '#649a31';
        } else if (data.status == "Relict") {
            circle.style.backgroundColor = '#99cb68';
        } else if (data.status == "Recovering") {
            circle.style.backgroundColor = '#fecc33';
        } else if (data.status == "Declining") {
            circle.style.backgroundColor = '#fe9a01';
        } else if (data.status == "Nationally Increasing") {
            circle.style.backgroundColor = '#c26967';
        } else if (data.status == "Nationally Vulnerable") {
            circle.style.backgroundColor = '#9b0000';
        } else if (data.status == "Nationally Endangered") {
            circle.style.backgroundColor = '#660032';
        } else if (data.status == "Nationally Critical") {
            circle.style.backgroundColor = '#320033';
        } else if (data.status == "Extinct") {
            circle.style.backgroundColor = 'black';
        } else if (data.status == "Data Deficient") {
            circle.style.backgroundColor = 'black';
        }

        cardElement.appendChild(circle);

        cardElement.appendChild(birdImage);
        cardElement.appendChild(birdPrimaryName);
        cardElement.appendChild(birdCredit);
        cardElement.appendChild(birdEnglishName);
        cardElement.appendChild(birdScientificName);
        cardElement.appendChild(birdOrder);
        cardElement.appendChild(birdStatus);
        cardElement.appendChild(birdLength);
        cardElement.appendChild(birdWeight);

        cardContainer.appendChild(cardElement);

    });
    resultCount.innerText = fetchData.length + " results found";
}




document.addEventListener('DOMContentLoaded', async () => {
    const testButton = document.getElementById('searchButton');

    testButton.addEventListener('click', () => {
        console.log('Button clicked! This is a test message.');
        const searchInput = document.getElementById("search-box").value.toLowerCase();
        const selectedStatus = document.getElementById("conservationFilter").value;
        const sortStatus = document.getElementById("sortFilter").value;
        filterBirds(searchInput, selectedStatus, sortStatus);
    });
});

async function filterBirds(searchInput, selectedStatus, sortStatus) {

    let filteredArray = [];

    let filteredSearchArray = [];
    if (selectedStatus == "All") {
        filteredArray.length = 0;
        birdInfo.forEach(bird => {
            filteredArray.push(bird);
        });
    } else {
        birdInfo.forEach(bird => {
            if (bird.status == selectedStatus) {
                filteredArray.push(bird);
            }
        });
    }
    console.log(searchInput);
    if (searchInput != "") {
        filteredArray.forEach(bird => {
            for (const key in bird) {
                if (key == 'size' || key == 'photo') {
                    break;
                }

                const value = normalizeString(bird[key]).toLowerCase();
                if (value == searchInput) {
                    filteredSearchArray.push(bird);
                    break;
                }
            }
        });

        if (sortStatus == 'A-Z') {
            filteredSearchArray.sort((a, b) => a.primary_name.localeCompare(b.primary_name));
            display(filteredSearchArray);
        } else if (sortStatus == 'Z-A') {
            filteredSearchArray.sort((a, b) => b.primary_name.localeCompare(a.primary_name));
            display(filteredSearchArray);
        } else if (sortStatus == 'WeightHL') {
            filteredSearchArray.sort((a, b) => b.size.weight.value - a.size.weight.value);
            display(filteredSearchArray);
        } else if (sortStatus == 'WeightLH') {
            filteredSearchArray.sort((a, b) => a.size.weight.value - b.size.weight.value);
            display(filteredSearchArray);
        } else if (sortStatus == 'LengthLS') {
            filteredSearchArray.sort((a, b) => b.size.length.value - a.size.length.value);
            display(filteredSearchArray);
        } else if (sortStatus == 'LengthSL') {
            filteredSearchArray.sort((a, b) => a.size.length.value - b.size.length.value);
            display(filteredSearchArray);
        }
    } else {
        if (sortStatus == 'A-Z') {
            filteredArray.sort((a, b) => a.primary_name.localeCompare(b.primary_name));
            display(filteredArray);
        } else if (sortStatus == 'Z-A') {
            filteredArray.sort((a, b) => b.primary_name.localeCompare(a.primary_name));
            display(filteredArray);
        } else if (sortStatus == 'WeightHL') {
            filteredArray.sort((a, b) => b.size.weight.value - a.size.weight.value);
            display(filteredArray);
        } else if (sortStatus == 'WeightLH') {
            filteredArray.sort((a, b) => a.size.weight.value - b.size.weight.value);
            display(filteredArray);
        } else if (sortStatus == 'LengthLS') {
            filteredArray.sort((a, b) => b.size.length.value - a.size.length.value);
            display(filteredArray);
        } else if (sortStatus == 'LengthSL') {
            filteredArray.sort((a, b) => a.size.length.value - b.size.length.value);
            display(filteredArray);
        }
    }
}
function normalizeString(inputString) {
    return inputString.normalize('NFKD').replace(/[^\x00-\x7F]/g, ''); // Remove non-ASCII characters

}
