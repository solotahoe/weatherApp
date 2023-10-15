const date = document.getElementById('date');
const searchInput = document.getElementById('search_input');
const windSpeed = document.getElementById('wind');
const windDirection = document.getElementById('direction');
const averageHumidity = document.getElementById('humidity');
const pressure = document.getElementById('pressure');
const lowest = document.getElementById('lowestTemp')
const highest = document.getElementById('highestTemp');
const getLocation = document.getElementById('location');
const getLocation1 = document.getElementById('location1');
const getTime = document.getElementById('time');
const getTime1 = document.getElementById('time1');
const weatherIcon = document.getElementById('weatherIcon');
const weatherIcon1 = document.getElementById('weatherIcon1');
const currentTemperature = document.getElementById('currentTemp');
const currentTemperature1 = document.getElementById('currentTemp1');
const weatherDescription = document.getElementById('weatherDescription');
const weatherDescription1 = document.getElementById('weatherDescription1');


const apiKey = "8109965e7254a469d08a746e8b210e1e";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=Nairobi"

document.addEventListener('DOMContentLoaded', () => {
    //display current date
    date.innerText = new Date(Date.now()).toLocaleString('en-US', {
        weekday: 'long',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })

      //get search input and add an eventListener
document.querySelector('.btn').addEventListener('click',async ()=> {
    const town = searchInput.value 
    // console.log(town)
    weatherData(town)
    searchInput.value = '';
})   

function renderDom(data) {
    console.log(data[1])
    if (data[0]) {
        windSpeed.innerText = data[0].wind.speed;
        averageHumidity.innerText = data[0].main.humidity
        pressure.innerText = data[0].main.pressure
        lowest.innerText = data[0].main.temp_min
        highest.innerText = data[0].main.temp_max;
        // Get and format Current Time
        getTime.innerText = new Date(Date.now()).toLocaleString('en-US', {
            hour: 'numeric',
            minute: 'numeric',
      })

      getTime1.innerText = new Date(Date.now()).toLocaleString('en-US', {
        hour: 'numeric',
        minute: 'numeric',
  })
        // Get the location of the user from the API (When you type, it's probably not formatted)
        getLocation.innerText = data[0].name;
        getLocation1.innerText = data[0].name;
    
        // Weather Icon
    // Use template literals to insert the in the below link, then set it as image source:
    // http://openweathermap.org/img/w/10d.png
    // All you need to do is that moderate the icon id given in the link. You can change 10d with any icon id that you need.
       weatherIcon.src = `http://openweathermap.org/img/wn/${data[0].weather[0].icon}@2x.png`
       weatherIcon1.src = `http://openweathermap.org/img/wn/${data[0].weather[0].icon}@2x.png`
    
       //current temperature
       currentTemperature.innerText = data[0].main.temp;
       currentTemperature1.innerText = data[0].main.temp;
    
       // Description of the current weather
       weatherDescription.innerText = data[0].weather[0].main;
       weatherDescription1.innerText = data[0].weather[0].main;
     // Display chart
     // create a function
     renderChart(data[1].list)
    }
  
}

//Function that renders the chart on the DOM
function renderChart(data) {
    // console.log(data)
    const ctx = document.getElementById("myChart").getContext("2d");
    const xlabels = data.map(item => item.dt_txt);
    const ylabels = data.map(item => item.main.temp);
    
    // First, check if the chart with the given ID exists, and if it does, destroy it.
const existingChart = Chart.getChart("myChart");
if (existingChart) {
    existingChart.destroy();
}

// Now, you can create a new chart with the same ID.
const myChart = new Chart(ctx, {
    // Chart configuration options go here
    type: 'line',
    data: {
      labels: xlabels,
      datasets: [{
        label: 'Temperature',
        data: ylabels,
        borderWidth: 1.5,
        smooth: true,
        backgroundColor: 'blue',
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }

});

}

// fetch data of the city on the search bar
const weatherData = async () => {
    // Use the try-catch block to handle errors
    try {
      // Create a const that stores the user input from the searchbar or defaults back to 'Nairobi' if left blank
      const city = searchInput.value || 'Nairobi'
  
      // Create 2 promises that call the APIs and pass in the city name
      // If the user haven't typed anything, use Nairobi as default
      const currentWeather = new Promise(async (resolve, reject) => {
        try {
          const weatherApiData = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=8109965e7254a469d08a746e8b210e1e&units=metric`,
          )
  
          resolve(await weatherApiData.json())
        } catch (error) {
          reject()
        }
      })
  
      const forecast = new Promise(async (resolve, reject) => {
        try {
          const forecastApiData = await fetch(
            `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=8109965e7254a469d08a746e8b210e1e&units=imperial&cnt=10`,
          )
  
          resolve(await forecastApiData.json())
        } catch (error) {
          reject()
        }
      })
  
      // Using the Promise.all method, wait for both promises to resolve, and save the returned data in a variable
      const data = await Promise.all([currentWeather, forecast])
  
      // Now pass that data into the renderDom() function
      renderDom(data)
    } catch (error) {
      console.log(error)
    }
  }
weatherData()

})
