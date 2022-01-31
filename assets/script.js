const apiKey = "d485db4fe3bf6659d47e27063ef61e26";


let history = JSON.parse(localStorage.getItem("history")) || [];

$("#submit").on("click", function(event) {
    event.preventDefault();
    history.push(searchInput.val());
    window.location.reload();
    localStorage.setItem("history", JSON.stringify(history));
    getWeather(searchInput.val());
});