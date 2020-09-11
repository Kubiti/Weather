let currentCity, inputValue = document.getElementById('city'), submit = document.getElementById('submit'),
city = document.getElementById('location'), time = document.getElementById('time'), 
temp = document.getElementById('temperature'), desc = document.getElementById('description')
wIcon = document.getElementById('weatherIcon'), wind = document.getElementById('wind')
humidity = document.getElementById('humidity'), pressure = document.getElementById('pressure')
hour = document.getElementById('hour'), main = document.querySelector('main'),
article = document.querySelector('article');



const getCity = () => {
    currentCity = inputValue.value;
    fetch('https://api.openweathermap.org/data/2.5/weather?q=' + inputValue.value + '&APPID=530df0912db9cd46a24db04211fd0b82')
    .then(response => response.json())
    .then(data => {
        let countryCode = data["sys"]["country"];
        console.log(data, countryCode);
            fetch('./countries.json').then(response => response.json())
            .then(obj => {
                country = obj[countryCode];
                let locationValue = `${country === data['name'] ? data['name'] : data['name'] + ', ' + country}`;
                city.innerHTML = locationValue;
                console.log(country);
            })
            .catch(error => console.log('Error loading countries.'))
        
        let timeValue;
        let directValue;

        (function degToCompass() {
            let val = Math.floor(((+data['wind']['deg'])/22.5) + 0.5);
            let arr = ["N","NNE","NE","ENE","E","ESE", "SE", "SSE","S","SSW","SW","WSW","W","WNW","NW","NNW"]
            directValue = arr[(val % 16)];
            console.log(directValue);
        })();

        (function convertTime () {
            let date = new Date(data['dt'] * 1000);
            utcString = date.toUTCString();
            timeValue = utcString.slice(0, -7);
        })();
        
        let tempValue = `${Math.round(+data['main']['temp'] - 273.15)}`;
        let celciusSign = document.createElement("sup");
        celciusSign.innerHTML = '&#176;C'
        let descValue = data['weather']['0']['description'];
        let iconValue = data['weather']['0']['icon'];
        let iconSrc = "./assets/weather_icons/" + iconValue + "@2x.png";
        let windValue = `${data['wind']['speed']}m/s ${directValue}`
        let humidValue = data['main']['humidity'];
        let pressureValue = data['main']['pressure'];

        time.innerHTML = timeValue;
        temp.innerHTML = tempValue;
        temp.appendChild(celciusSign);
        wIcon.src = iconSrc;
        desc.innerHTML = descValue;
        wind.innerHTML = 'Wind: ' + windValue;
        humidity.innerHTML = `Humidity: ${humidValue}%`;
        pressure.innerHTML = `Atmpospheric Pressure: ${pressureValue}hPa`
    })
    .catch(err => {
        console.log("Error loading city");
        city.innerHTML = 'Error loading city, please refresh page and try again.';
        time.innerHTML = '';
    })
    }

inputValue.addEventListener('keyup', (event) => {
    if (event.keyCode === 13) {
        event.preventDefault();
        getCity();
    }
})

/* ************* SEARCH CITY OR TOWN WEATHER ******* */

submit.addEventListener('click', ()=> getCity());


const getCurrentWeather = () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            lat = position.coords.latitude;
            lon = position.coords.longitude;
            console.log(lat, lon)
        


    fetch('https://api.openweathermap.org/data/2.5/weather?lat=' + lat + '&lon=' + lon + '&appid=530df0912db9cd46a24db04211fd0b82')
        .then(response => response.json())
        .then(data => {
            console.log(data);
            let countryCode = data["sys"]["country"];
            
            console.log(countryCode);
            fetch('./countries.json').then(response => response.json())
                .then(obj => {
                    country = obj[countryCode];
                    let locationValue = `${country === data['name'] ? data['name'] : data['name'] + ', ' + country}`;
                    city.innerHTML = locationValue;
                    currentCity = data['name'];
                    console.log(currentCity);
                })
                .catch(error => console.log('Error loading countries.'))
            
            let timeValue;
            let directValue;

            (function degToCompass() {
                let val = Math.floor(((+data['wind']['deg'])/22.5) + 0.5);
                let arr = ["N","NNE","NE","ENE","E","ESE", "SE", "SSE","S","SSW","SW","WSW","W","WNW","NW","NNW"]
                directValue = arr[(val % 16)];
                //console.log(directValue);
            })();

            (function convertTime () {
                let date = new Date(data['dt'] * 1000);
                utcString = date.toUTCString();
                timeValue = utcString.slice(0, -7);
            })();
            
            let tempValue = `${Math.round(+data['main']['temp'] - 273.15)}`;
            let celciusSign = document.createElement("sup");
            celciusSign.innerHTML = '&#176;C'
            let descValue = data['weather']['0']['description'];
            let iconValue = data['weather']['0']['icon'];
            let iconSrc = "./assets/weather_icons/" + iconValue + "@2x.png";
            let windValue = `${data['wind']['speed']}m/s ${directValue}`
            let humidValue = data['main']['humidity'];
            let pressureValue = data['main']['pressure'];

            time.innerHTML = timeValue;
            temp.innerHTML = tempValue;
            temp.appendChild(celciusSign);
            wIcon.src = iconSrc;
            desc.innerHTML = descValue;
            wind.innerHTML = 'Wind: ' + windValue;
            humidity.innerHTML = `Humidity: ${humidValue}%`;
            pressure.innerHTML = `Atmpospheric Pressure: ${pressureValue}hPa`
        })
        .catch(err => {
            time.innerHTML = 'Unable to access location. Please refresh or search for city.'
            console.log(err)
        })

    });
            
            
    } else {
    time.innerHTML = "Please allow location to show your location's weather,  or search for it.";
    }
}

getCurrentWeather();