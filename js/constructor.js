const regionData = {
    "Центральный федеральный округ": [
      { name: "Москва", latitude: 55.7522, longitude: 37.6156, attractions: ["Кремль", "Красная площадь", "Храм Василия Блаженного"] },
      { name: "Санкт-Петербург", latitude: 59.9311, longitude: 30.3587, attractions: ["Эрмитаж", "Петергоф", "Исаакиевский собор"] },
      { name: "Воронеж", latitude: 51.6736, longitude: 39.1925, attractions: ["Воронежский Никитский монастырь", "Дворец Ольденбургских"] },
      { name: "Ярославль", latitude: 57.6206, longitude: 39.8969, attractions: ["Спасо-Преображенский монастырь", "Ярославский художественный музей"] },
      { name: "Калуга", latitude: 54.5060, longitude: 36.2681, attractions: ["Музей истории космонавтики", "Оптина пустынь"] }
    ],
    "Сибирский федеральный округ": [
      { name: "Новосибирск", latitude: 55.0415, longitude: 82.9346, attractions: ["Новосибирский зоопарк", "Театр оперы и балета"] },
      { name: "Красноярск", latitude: 56.0152, longitude: 92.8932, attractions: ["Столбы", "Красноярская ГЭС"] },
      { name: "Томск", latitude: 56.4977, longitude: 84.9744, attractions: ["Томский государственный университет", "Лагерный сад"] },
      { name: "Иркутск", latitude: 52.2873, longitude: 104.3003, attractions: ["Байкал", "Иркутский острог"] },
      { name: "Барнаул", latitude: 53.3467, longitude: 83.7790, attractions: ["Алтайский краеведческий музей", "Парк Центрального района"] }
    ],
    "Дальневосточный федеральный округ": [
      { name: "Владивосток", latitude: 43.1161, longitude: 131.8826, attractions: ["Золотой Рог", "Орлиное гнездо"] },
      { name: "Хабаровск", latitude: 48.4801, longitude: 135.0735, attractions: ["Собор Успения Пресвятой Богородицы", "Утес Петра Великого"] },
      { name: "Южно-Сахалинск", latitude: 46.9619, longitude: 142.7394, attractions: ["Сахалинский областной краеведческий музей", "Парк Победы"] },
      { name: "Магадан", latitude: 59.5683, longitude: 150.8069, attractions: ["Колыма", "Музей истории Севера"] },
      { name: "Петропавловск-Камчатский", latitude: 53.0412, longitude: 158.6522, attractions: ["Долина гейзеров", "Халактырский пляж"] }
    ]
  };
  let selectedRegions = [];
  let selectedCities = [];
  let selectedAttractions = [];
  function updateRegionOptions() {
    const regionList = document.querySelector(".constructor__region-list");
    regionList.innerHTML = "";
    for (const region in regionData) {
      const li = document.createElement("li");
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.value = region;
      checkbox.addEventListener("change", () => {
        updateCityOptions();
        updateAttractionOptions();
      });
      const label = document.createElement("label");
      label.textContent = region;
      li.appendChild(checkbox);
      li.appendChild(label);
      regionList.appendChild(li);
    }
  }
  function updateCityOptions() {
    const cityList = document.querySelector(".constructor__city-list");
    cityList.innerHTML = "";
    selectedRegions = Array.from(document.querySelectorAll(".constructor__region-list input[type='checkbox']:checked"))
      .map(checkbox => checkbox.value);
    selectedRegions.forEach(region => {
      const cities = regionData[region];
      cities.forEach(city => {
        const li = document.createElement("li");
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.value = city.name;
        checkbox.addEventListener("change", updateAttractionOptions);
        const label = document.createElement("label");
        label.textContent = city.name;
        li.appendChild(checkbox);
        li.appendChild(label);
        cityList.appendChild(li);
      });
    });
  }
  function updateAttractionOptions() {
    const attractionsList = document.querySelector(".constructor__attractions-list");
    attractionsList.innerHTML = "";
    selectedCities = Array.from(document.querySelectorAll(".constructor__city-list input[type='checkbox']:checked"))
      .map(checkbox => checkbox.value);
    selectedCities.forEach(cityName => {
      const city = regionData[selectedRegions.find(region => regionData[region].some(c => c.name === cityName))].find(c => c.name === cityName);
      city.attractions.forEach(attraction => {
        const li = document.createElement("li");
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.value = attraction;
        const label = document.createElement("label");
        label.textContent = attraction;
        li.appendChild(checkbox);
        li.appendChild(label);
        attractionsList.appendChild(li);
      });
    });
  }
  function updateResult() {
    const resultRegions = document.querySelector(".constructor__result-regions");
    const resultCities = document.querySelector(".constructor__result-cities");
    const resultAttractions = document.querySelector(".constructor__result-attractions");
    const resultTransport = document.querySelector(".constructor__result-transport");
    resultRegions.innerHTML = "";
    resultCities.innerHTML = "";
    resultAttractions.innerHTML = "";
    resultTransport.innerHTML = "";
    selectedRegions.forEach(region => {
      const regionElement = document.createElement("div");
      regionElement.textContent = region;
      resultRegions.appendChild(regionElement);
    });
    selectedCities.forEach(cityName => {
      const city = regionData[selectedRegions.find(region => regionData[region].some(c => c.name === cityName))].find(c => c.name === cityName);
      const cityElement = document.createElement("div");
      cityElement.textContent = city.name;
      resultCities.appendChild(cityElement);
      const attractionsElement = document.createElement("div");
      selectedAttractions = Array.from(document.querySelectorAll(".constructor__attractions-list input[type='checkbox']:checked"))
        .map(checkbox => checkbox.value);
      selectedAttractions.forEach(attraction => {
        const attractionElement = document.createElement("div");
        attractionElement.textContent = attraction;
        attractionsElement.appendChild(attractionElement);
      });
      resultAttractions.appendChild(attractionsElement);
    });
    const selectedTransport = document.querySelector("input[name='transport']:checked").value;
    const selectedTransportOther = document.querySelector("#transport-other-select").value;
    const transportElement = document.createElement("div");
    if (selectedTransport === "car") {
      transportElement.textContent = "Автомобиль";
    } else {
      transportElement.textContent = selectedTransportOther;
    }
    resultTransport.appendChild(transportElement);
    // Render the map
    renderMap(selectedCities, selectedAttractions);
  }
  function renderMap(cities, attractions) {
    const mapElement = document.querySelector(".constructor__result-map");
    mapElement.innerHTML = "";
    if (cities.length === 0 && attractions.length === 0) {
      return;
    }
    ymaps.ready(function () {
      const myMap = new ymaps.Map(mapElement, {
        center: [55.76, 37.64], // Начальные координаты карты (Москва)
        zoom: 8
      });
      const routePoints = [];
      cities.forEach(cityName => {
        const city = regionData[selectedRegions.find(region => regionData[region].some(c => c.name === cityName))].find(c => c.name === cityName);
        const cityCoords = [city.latitude, city.longitude];
        routePoints.push(cityCoords);
        const cityPlacemark = new ymaps.Placemark(cityCoords, {
          balloonContent: city.name
        });
        myMap.geoObjects.add(cityPlacemark);
      });
      attractions.forEach(attraction => {
        const city = regionData[selectedRegions.find(region => regionData[region].some(c => c.attractions.includes(attraction)))].find(c => c.attractions.includes(attraction));
        const attractionCoords = [city.latitude, city.longitude];
        routePoints.push(attractionCoords);
        const attractionPlacemark = new ymaps.Placemark(attractionCoords, {
          balloonContent: attraction
        });
        myMap.geoObjects.add(attractionPlacemark);
      });
      if (routePoints.length > 0) {
        const multiRoute = new ymaps.multiRouter.MultiRoute({
          referencePoints: routePoints,
          params: {
            routingMode: 'auto'
          }
        }, {
          boundsAutoApply: true
        });
        myMap.geoObjects.add(multiRoute);
      }
    });
  }
  updateRegionOptions();
  updateCityOptions();
  updateAttractionOptions();
  document.querySelector(".constructor__form").addEventListener("submit", (event) => {
    event.preventDefault();
    updateResult();
  });