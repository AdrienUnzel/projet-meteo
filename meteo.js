let weather = {
    apikey: "688f7b81a9645ee5777e4bfb6138c4e9", // clé API OpenWeatherMap

    fetchWeather: async function(city) {
        try {
            const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${this.apikey}&lang=fr`;
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`Erreur HTTP: ${response.status}`);
            }

            const data = await response.json();
            this.displayWeather(data);
        } catch (error) {
            console.error("Erreur récupération météo:", error);
            document.querySelector(".temp").textContent = "-- °C";
            document.querySelector(".description").textContent = "Erreur de chargement";
            document.querySelector(".humidity").textContent = "";
            document.querySelector(".wind").textContent = "";
            document.querySelector(".icon").src = "";
            document.body.style.backgroundColor = "#e0f7fa";
        }
    },

    displayWeather: function(data) {
        document.querySelector(".city").innerText = data.name;
        document.querySelector(".temp").textContent = `${data.main.temp}°C`;
        document.querySelector(".description").textContent = data.weather[0].description;
        document.querySelector(".humidity").textContent = `Humidité: ${data.main.humidity}%`;
        document.querySelector(".wind").textContent = `Vent: ${data.wind.speed} km/h`;
        document.querySelector(".icon").src = `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`;
        document.querySelector(".icon").alt = data.weather[0].description;

        // Fond dynamique selon météo
        const weatherMain = data.weather[0].main.toLowerCase();
        if (weatherMain.includes("cloud")) {
            document.body.style.backgroundColor = "#b0c4de";
        } else if (weatherMain.includes("rain")) {
            document.body.style.backgroundColor = "#87cefa";
        } else if (weatherMain.includes("clear")) {
            document.body.style.backgroundColor = "#f7f7a1";
        } else {
            document.body.style.backgroundColor = "#e0f7fa";
        }
    }
};

// Charger la ville depuis conf.json
async function loadCity() {
    const res = await fetch("conf.json");
    const config = await res.json();
    return `${config.ville},${config.pays}`;
}

// Mettre à jour la météo toutes les heures
async function updateWeather() {
    const city = await loadCity();
    weather.fetchWeather(city);
}

// Première mise à jour
updateWeather();

// Mise à jour toutes les heures (3600000 ms)
setInterval(updateWeather, 3600000);