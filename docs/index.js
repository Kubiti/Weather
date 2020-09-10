let inputValue = document.getElementById('city'), submit = document.getElementById('submit'),
city = document.getElementById('location'), time = document.getElementById('time'), 
temp = document.getElementById('temperature'), desc = document.getElementById('description')
wIcon = document.getElementById('weatherIcon'), wind = document.getElementById('wind')
humidity = document.getElementById('humidity'), pressure = document.getElementById('pressure');
   

submit.addEventListener('click', () => {

    fetch('http://api.openweathermap.org/data/2.5/weather?q=' + inputValue.value + '&APPID=530df0912db9cd46a24db04211fd0b82')
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
        let iconSrc = "http://openweathermap.org/img/wn/" + iconValue + "@2x.png";
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
    .catch(err => console.log("Error loading city"))
    }
);