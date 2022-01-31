const apiKey = "d485db4fe3bf6659d47e27063ef61e26";


let rawHistory = JSON.parse(localStorage.getItem("history")) || [];
let history = rawHistory.slice(-5);
$("#submit").on("click", function(event) {
    event.preventDefault();
    history.push($('#userInput').val());
    window.location.reload();
    localStorage.setItem("history", JSON.stringify(history));
    getWeather($('#userInput').val());
});

function getDate(date){
    let currentDate = new Date(date*1000);
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1; 
    const day = currentDate.getDate();
    return month + "/" + day + "/" + year;
}

function renderhistory() {
    for (let i=0; i<=4; i++) {
        let searchedCity = $("<div>");
        let storedData = $('#storedData');
        searchedCity.append("<button type='button' href='#' id='storedData' class='btn btn-secondary btn-lg btn-block'>"+history[i]+"</button>");
        searchedCity.on("click", function() {
            storedData.val(history[i]);
            console.log(storedData.val());
            getWeather(history[i]);
        })
        $("#searchSection").append(searchedCity);
    }
}

function conversion(k) {
    return Math.floor((k - 273.15) * 1.8 + 32);
}

function getWeather(cityName){
    let queryUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + apiKey;
    fetch(queryUrl)
      .then(function(response) {
        return response.json();
      })
      .then(function(response){
          $("#cityName").text(response.name + " on " + getDate(response.dt));
          let icon = response.weather[0].icon;
          $("#cityWeatherIcon").attr("src", "https://openweathermap.org/img/wn/" + icon + "@2x.png");
          $("#cityWeatherIcon").attr("alt", response.weather[0].description);
          $("#description").text(response.weather[0].main);
          $("#temp").text("Temperature: " + conversion(response.main.temp) + " °F");
          $("#humidity").text("Humidity: " + response.main.humidity + "%");
          $("#wind").text("Wind Speed: " + response.wind.speed + " MPH");
           let lat = response.coord.lat;
           let lon = response.coord.lon;
           let uvIndexQueryUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=minutely,hourly" + "&appid=" + apiKey;
           console.log(uvIndexQueryUrl);
           fetch(uvIndexQueryUrl)
             .then(function(uvResponse) {
                 return uvResponse.json();
             })
             .then(function(uvResponse){
                var uvConditions;
                if (uvResponse.current.uvi < 3) {
                    uvConditions = "badge badge-success";}
                    else if (uvResponse.current.uvi >= 3 && uvResponse.current.uvi < 6) {
                        uvConditions = "badge badge-warning";} else {
                            uvConditions = "badge badge-danger";
                        }
                $("#uvIndex").addClass(uvConditions).text("Current UV Index: " + uvResponse.current.uvi);
                let oldCard = $(".w-8")
                for(i = 0; i < oldCard.length; i++){
                    $(".w-8").remove();
                }
                 let dataArry = uvResponse.daily;
                 for(let i = 0; i < 5; i++){
                     console.log(dataArry[i])
                     let dataIcon = "https://openweathermap.org/img/wn/" + dataArry[i].weather[0].icon + "@2x.png";
                     createForecast(getDate(dataArry[i].dt), dataIcon, conversion(dataArry[i].temp.day), dataArry[i].humidity, dataArry[i].wind_speed);
                 }
             });
      });
}

function createForecast(date, icon, temp, humidity, windSpeed) {
    let cardContainer = $("<div>").addClass("card w-8");
    let cardDate = $("<h5>").addClass("card-header");
    let cardIcon = $("<img>").addClass("card-img-top text-center").css("width","fit-content");
    let cardTemp = $("<li>").addClass("list-group-item");
    let cardHumidity = $("<li>").addClass("list-group-item");
    let cardWindSpeed = $("<li>").addClass("list-group-item");
    cardDate.text(date);
    cardIcon.attr("src", icon);
    cardTemp.text(`Temperature: ${temp}°F`);
    cardHumidity.text(`Humidity: ${humidity}%`);
    cardWindSpeed.text(`Wind Speed: ${windSpeed} MPH`);
    cardContainer.append(cardDate, cardIcon, cardTemp, cardHumidity, cardWindSpeed);
    $("#forecastSection").append(cardContainer);
}

$(document).ready(function(){
    renderhistory();
    if (history.length > 0) {
        getWeather(history[history.length - 1]);
    }
});