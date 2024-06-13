let city;
let unit;
let format;

function displayWeather(){
    chrome.storage.local.get(['city', 'unit', 'format'], function(result) {
        if(!result.city || !result.unit || !result.format) {
            document.getElementById("setup-modal").style.display = "block";
        }else{
            city = result.city;
            unit = result.unit;
            format = result.format;
        }
    });
}

function applySettings(city, unit, format){
    chrome.storage.local.set({'city': city, 'unit': unit, 'format': format}, function() {
        document.getElementById("setup-modal").style.display = "none";
        document.getElementById("settings-modal").style.display = "none";
        displayWeather();
    });
}

window.onload = function() {
    displayWeather();
};

document.getElementById("settings").addEventListener("click", function() {
    document.getElementById("settings-modal").style.display = "block";
    document.getElementById("cityInput").value = city;
    document.getElementById("unit").value = unit;
    document.getElementById("time").value = format;
});

document.getElementById("done").addEventListener("click", function() {
    let city = document.getElementById("city-setup").value;
    let unit = document.getElementById("unit-setup").value;
    let format = document.getElementById("time-setup").value;
    applySettings(city, unit, format);
});

document.getElementById("apply").addEventListener("click", function() {
    let city = document.getElementById("cityInput").value;
    let unit = document.getElementById("unit").value;
    let format = document.getElementById("time").value;
    applySettings(city, unit, format);
});

