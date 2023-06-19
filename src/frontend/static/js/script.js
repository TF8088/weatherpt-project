if (window.location.pathname === '/') {
  let timer;
  const waitTime = 1000;

  const input = document.querySelector('#input-city');
  input.addEventListener('keyup', (e) => {
    const city = e.currentTarget.value;
    clearTimeout(timer);
    timer = setTimeout(() => {
      homeChains(city);
    }, waitTime);
  });
};

function homeChains(city) {
  $.ajax({
    type: 'GET',
    url: `/api/v1/sensor/?city=${city}`,
    success: (data) => {
      console.log(data)

      const dropdownMenu = document.querySelector('#cityselect');

      dropdownMenu.innerHTML = '';

      data.forEach((item) => {
        const dropdownItem = document.createElement('a');
        dropdownItem.classList.add('tag');
        dropdownItem.classList.add('is-medium');
        dropdownItem.href = `/city?sensor=` + item.id;
        dropdownItem.textContent = item.cityName;
        dropdownMenu.appendChild(dropdownItem);
      });
    },
    error: (err) => {
      params.error(err);
    }
  });
}
// Função para atualizar o gráfico de tempo em tempo real
function updateChartInterval(sensor, interval) {
  // Chama a função weatherdata inicialmente
  weatherdata(sensor);
  console.log("Hell");
  // Configura o intervalo de atualização do gráfico
  setInterval(() => {
    weatherdata(sensor);
  }, interval);
}
//  Dados Do Sensor
if (window.location.pathname === '/city') {
  document.addEventListener('DOMContentLoaded', function () {
    const scriptElement = document.querySelector('script[src="./static/js/script.js"]');
    const sensorData = scriptElement.getAttribute('data-sensor');
    const sensor = JSON.parse(sensorData);
    weatherdata(sensor);
    updateChartInterval(sensor, 10000);
  });
}

let previousData = null;
let tempcChart = null;
let tempfChart = null;
let humidityChart = null;

function weatherdata(sensor) {
  $.ajax({
    type: 'GET',
    url: `/api/v1/weather/` + sensor,
    success: (data) => {
      const tempcData = data.sensorData.map(entry => entry.tempc);
      const tempfData = data.sensorData.map(entry => entry.tempf);
      const humidityData = data.sensorData.map(entry => entry.humidity);
      const dateData = data.sensorData.map(entry => moment(entry.date).format('HH:mm'));

      // Verifica se os dados são iguais aos anteriores
      if (JSON.stringify(data.sensorData) === JSON.stringify(previousData)) {
        return; // Não faz o rerender se os dados forem iguais
      }

      previousData = data.sensorData; // Atualiza os dados anteriores

      // Restringe os dados aos últimos 5 registros
      const lastFiveTempcData = tempcData.slice(-5);
      const lastFiveTempfData = tempfData.slice(-5);
      const lastFiveHumidityData = humidityData.slice(-5);
      const lastFiveDateData = dateData.slice(-5);

      // Resto do código para criar os gráficos
      if (tempcChart) {
        tempcChart.destroy();
      }
      if (tempfChart) {
        tempfChart.destroy();
      }
      if (humidityChart) {
        humidityChart.destroy();
      }

      // Criação do novo gráfico de temperatura em Celsius
      const tempcChartOptions = {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      };  
      const tempcChartData = {
        labels: lastFiveDateData,
        datasets: [{
          label: 'TempC',
          data: lastFiveTempcData,
          fill: false,
          borderColor: 'rgba(75, 192, 192, 1)',
          tension: 0.1
        }]
      };
      const tempcCtx = document.getElementById('tempcchart').getContext('2d');
      tempcChart = new Chart(tempcCtx, {
        type: 'line',
        data: tempcChartData,
        options: tempcChartOptions
      });

      // Criação do novo gráfico de temperatura em Fahrenheit
      const tempfChartOptions = {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      };  
      const tempfChartData = {
        labels: lastFiveDateData,
        datasets: [{
          label: 'TempF',
          data: lastFiveTempfData,
          fill: false,
          borderColor: 'rgba(255, 99, 132, 1)',
          tension: 0.1
        }]
      };
      const tempfCtx = document.getElementById('tempfchart').getContext('2d');
      tempfChart = new Chart(tempfCtx, {
        type: 'line',
        data: tempfChartData,
        options: tempfChartOptions
      });

      // Criação do novo gráfico de umidade
      const humidityChartOptions = {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      };  
      const humidityChartData = {
        labels: lastFiveDateData,
        datasets: [{
          label: 'Humidity',
          data: lastFiveHumidityData,
          fill: false,
          borderColor: 'rgba(54, 162, 235, 1)',
          tension: 0.1
        }]
      };
      const humidityCtx = document.getElementById('humiditychart').getContext('2d');
      humidityChart = new Chart(humidityCtx, {
        type: 'line',
        data: humidityChartData,
        options: humidityChartOptions
      });
    },
    error: (err) => {
      params.error(err);
    }
  });
}

/* Menu util */
document.addEventListener('DOMContentLoaded', () => {
  // Get all "navbar-burger" elements
  const $navbarBurgers = Array.prototype.slice.call(document.querySelectorAll('.navbar-burger'), 0);
  // Add a click event on each of them
  $navbarBurgers.forEach(el => {
    el.addEventListener('click', () => {
      // Get the target from the "data-target" attribute
      const target = el.dataset.target;
      const $target = document.getElementById(target);
      // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
      el.classList.toggle('is-active');
      $target.classList.toggle('is-active');
    });
  });
});
