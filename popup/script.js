let city;
let country;
let unit;
let format;

let tempC;
let tempF;

let windSpdK;
let windSpdM;
let windDir;

let humidity;
let pressureMb;
let pressureIn;

let rainFallMM;
let rainFallIn;

let time;

let feelsLikeC;
let feelsLikeF;

let condition;

let minC;
let maxC;
let minF;
let maxF;

function getWeather(){
    chrome.storage.local.get(['city', 'unit', 'format'], function(result) {
        if(!result.city || !result.unit || !result.format) {
            document.getElementById("setup-modal").style.display = "block";
        }else{
            city = result.city; 
            unit = result.unit;
            format = result.format;

            const key = "b91ec524df5747a3bed133352240605";
            const url = `http://api.weatherapi.com/v1/current.json?key=${key}&q=${city}&aqi=no`;
            const urlForecast = `http://api.weatherapi.com/v1/forecast.json?key=${key}&q=${city}&days=1&aqi=no&alerts=no`;

            fetch(url).then(function(response){
                return response.json();
            }).then(function(data){

                country = data.location.country;

                tempC = Math.floor(data.current.temp_c);
                tempF = Math.floor(data.current.temp_f);

                windSpdK = Math.floor(data.current.wind_kph);
                windSpdM = Math.floor(data.current.wind_mph);
                windDir = data.current.wind_degree;

                humidity = data.current.humidity;

                //If there is a 0 after the point, cut it off with replace

                pressureMb = parseFloat(data.current.pressure_mb).toFixed(1).replace(/\.0$/, '');
                pressureIn = parseFloat(data.current.pressure_in).toFixed(1).replace(/\.0$/, '');

                rainFallMM = parseFloat(data.current.precip_mm).toFixed(1).replace(/\.0$/, '');
                rainFallIn = parseFloat(data.current.precip_in).toFixed(1).replace(/\.0$/, '');

                time = data.location.localtime;

                feelsLikeC = Math.floor(data.current.feelslike_c);
                feelsLikeF = Math.floor(data.current.feelslike_f);

                condition = data.current.condition.text;

                fetch(urlForecast).then(function(response){
                    return response.json();
                }).then(function(data){
                    minC = Math.floor(data.forecast.forecastday[0].day.mintemp_c);
                    maxC = Math.floor(data.forecast.forecastday[0].day.maxtemp_c);
                    minF = Math.floor(data.forecast.forecastday[0].day.mintemp_f);
                    maxF = Math.floor(data.forecast.forecastday[0].day.maxtemp_f);
                    displayWeather();
                }).catch(function(err){
                    console.log("Error getting forecast: " + err.message);
                });
        
            }).catch(function(err){
                console.log("Error getting weather: " + err.message);
            });

        }
    });
}

function displayWeather(){
    document.getElementById("city").innerHTML = city;
    document.getElementById("country").innerHTML = country;

    if(unit === "Metric"){
        document.getElementById("temp").innerHTML = tempC + "°C";
        document.getElementById("feels-like").innerHTML = feelsLikeC + "°";
        document.getElementById("min").innerHTML = minC + "°";
        document.getElementById("max").innerHTML = maxC + "°";
        document.getElementById("speed").innerHTML = windSpdK + " kph";
        document.getElementById("pressure").innerHTML = pressureMb + " mb";
        document.getElementById("rainfall").innerHTML = rainFallMM + " mm";
    }else if(unit === "Imperial"){
        document.getElementById("temp").innerHTML = tempF + "°F";
        document.getElementById("feels-like").innerHTML = feelsLikeF + "°";
        document.getElementById("min").innerHTML = minF + "°";
        document.getElementById("max").innerHTML = maxF + "°";
        document.getElementById("speed").innerHTML = windSpdM + " mph";
        document.getElementById("pressure").innerHTML = pressureIn + " inHg";
        document.getElementById("rainfall").innerHTML = rainFallIn + " in";
    }

    document.getElementById("dir").innerHTML = getWindDirection(windDir);
    document.getElementById("humidity").innerHTML = humidity + "%";

    if(format == "24-hour"){
        let [date, time24] = time.split(" ");
        document.getElementById("time").innerHTML = time24;
    }else if(format == "12-hour"){
        let [date, time12] = time.split(" ");
        document.getElementById("time").innerHTML = convertTime(time12);
    }
}

function applySettings(city, unit, format){
    chrome.storage.local.set({'city': city, 'unit': unit, 'format': format}, function() {
        document.getElementById("setup-modal").style.display = "none";
        document.getElementById("settings-modal").style.display = "none";
        getWeather();
    });
}

function getWindDirection(degree){
    if (degree >= 337.5 || degree < 22.5) {
        return 'N';
    } else if (degree >= 22.5 && degree < 67.5) {
        return 'NE';
    } else if (degree >= 67.5 && degree < 112.5) {
        return 'E';
    } else if (degree >= 112.5 && degree < 157.5) {
        return 'SE';
    } else if (degree >= 157.5 && degree < 202.5) {
        return 'S';
    } else if (degree >= 202.5 && degree < 247.5) {
        return 'SW';
    } else if (degree >= 247.5 && degree < 292.5) {
        return 'W';
    } else if (degree >= 292.5 && degree < 337.5) {
        return 'NW';
    }
}

function convertTime(timeStr) {
    let splitTime = timeStr.split(':');
    let hours = parseInt(splitTime[0], 10);
    let minutes = parseInt(splitTime[1], 10);
    let period;

    if (hours < 12) {
        period = 'AM';
    } else {
        period = 'PM';
    }

    if (hours === 0) {
        hours = 12;
    } else if (hours > 12) {
        hours = hours - 12;
    }

    return `${hours}:${minutes.toString().padStart(2, '0')} ${period}`;
}

window.onload = function() {
    getWeather();
};

document.getElementById("settings").addEventListener("click", function() {
    document.getElementById("settings-modal").style.display = "block";
    document.getElementById("cityInput").value = city;
    document.getElementById("unit").value = unit;
    document.getElementById("time-format").value = format;
});

document.getElementById("done").addEventListener("click", function() {
    let city = document.getElementById("city-setup").value;
    let unit = document.getElementById("unit-setup").value;
    let format = document.getElementById("time-format-setup").value;
    applySettings(city, unit, format);
});

document.getElementById("apply").addEventListener("click", function() {
    let city = document.getElementById("cityInput").value;
    let unit = document.getElementById("unit").value;
    let format = document.getElementById("time-format").value;
    applySettings(city, unit, format);
});

