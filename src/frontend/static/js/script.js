if (window.location.pathname === '/') {
  let timer;
  const waitTime = 1000;
  const input = document.querySelector('#input-city');
  input.addEventListener('input', (e) => {
    const city = e.currentTarget.value;
    clearTimeout(timer);
    timer = setTimeout(() => {
      homeChains(city);
    }, waitTime);

    if (city === '') {
      const dropdownMenu = document.querySelector('#cityselect');
      dropdownMenu.innerHTML = '';
    }
  });
}

function homeChains(city) {
  $.ajax({
    type: 'GET',
    url: `/api/v1/sensor/search/${city}`,
    success: (data) => {
      console.log(data)

      const dropdownMenu = document.querySelector('#cityselect');

      dropdownMenu.innerHTML = '';

      if (data.length === 0) {
        const noResultsItem = document.createElement('a');
        noResultsItem.classList.add('tag');
        noResultsItem.classList.add('is-medium');
        noResultsItem.classList.add('results-item');
        noResultsItem.textContent = 'No Results';
        dropdownMenu.appendChild(noResultsItem);
      } else {
        data.forEach((item) => {
          const dropdownItem = document.createElement('a');
          dropdownItem.classList.add('tag');
          dropdownItem.classList.add('is-medium');
          dropdownItem.classList.add('results-item');
          dropdownItem.href = `/city?sensor=` + item.id;
          dropdownItem.textContent = item.cityName;
          dropdownMenu.appendChild(dropdownItem);
        });
      }
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
      console.log(data);
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
        },
        plugins: {
          legend: {
            display: false // Oculta a legenda
          }
        },
        tension: 0.4 // Controla a suavidade das linhas do gráfico
      };
      const tempcChartData = {
        labels: lastFiveDateData,
        datasets: [{
          label: 'TempC',
          data: lastFiveTempcData,
          fill: true,
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
        },
        plugins: {
          legend: {
            display: false // Oculta a legenda
          }
        },
        tension: 0.4 // Controla a suavidade das linhas do gráfico
      };
      const tempfChartData = {
        labels: lastFiveDateData,
        datasets: [{
          label: 'TempF',
          data: lastFiveTempfData,
          fill: true,
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
        },
        plugins: {
          legend: {
            display: false // Oculta a legenda
          }
        },
        tension: 0.4 // Controla a suavidade das linhas do gráfico
      };
      const humidityChartData = {
        labels: lastFiveDateData,
        datasets: [{
          label: 'Humidity',
          data: lastFiveHumidityData,
          fill: true,
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

if (window.location.pathname === '/dashboard') {
  // Função para criar a tabela com os dados dos sensores
  function createSensorTable(data) {
    const tableBody = document.getElementById('sensorTableBody');
    tableBody.innerHTML = '';

    data.forEach((sensor) => {
      const row = document.createElement('tr');

      const idCell = document.createElement('td');
      idCell.textContent = sensor.id;
      idCell.classList.add('is-hidden');
      row.appendChild(idCell);

      const nameCell = document.createElement('td');
      nameCell.textContent = sensor.name;
      row.appendChild(nameCell);

      const ipCell = document.createElement('td');
      ipCell.textContent = sensor.ip;
      row.appendChild(ipCell);

      const cityCell = document.createElement('td');
      cityCell.textContent = sensor.cityName;
      row.appendChild(cityCell);

      const statusCell = document.createElement('td');
      if (sensor.status === false) {
        const disabledButton = document.createElement('button');
        disabledButton.classList.add('button');
        disabledButton.classList.add('is-dark');
        disabledButton.classList.add('disable-button');
        disabledButton.classList.add('is-responsive');
        disabledButton.textContent = 'Disabled';
        disabledButton.disabled = true;
        statusCell.appendChild(disabledButton);
      } else {
        const disableButton = document.createElement('button');
        disableButton.classList.add('button');
        disableButton.classList.add('is-danger');
        disableButton.classList.add('disable-button');
        disableButton.classList.add('is-responsive');
        disableButton.textContent = 'Disable';
        disableButton.setAttribute('data-sensor-id', sensor.id);
        disableButton.addEventListener('click', (event) => {
          const button = event.target;
          const sensorId = button.getAttribute('data-sensor-id');
          disableSensor(sensorId);
        });
        statusCell.appendChild(disableButton);
      }
      row.appendChild(statusCell);

      const editCell = document.createElement('td');
      const editButton = document.createElement('button');
      editButton.classList.add('button');
      editButton.classList.add('is-warning');
      editButton.classList.add('edit-button');
      editButton.classList.add('is-responsive');
      editButton.textContent = 'Edit';
      editButton.setAttribute('data-sensor-id', sensor.id);
      editButton.addEventListener('click', (event) => {
        const button = event.target;
        const sensorId = button.getAttribute('data-sensor-id');
        editSensor(sensorId);
      });
      editCell.appendChild(editButton);
      row.appendChild(editCell);

      tableBody.appendChild(row);
    });
  }
  // Função para buscar os dados dos sensores e configurar a chamada repetida a cada 5 minutos
  function fetchSensorDataRepeatedly() {
    // Chama a função imediatamente
    fetchSensorData();
    // Chama a função a cada 5 minutos
    setInterval(fetchSensorData, 1 * 6 * 1000);
  }
  // Chama a função para buscar os dados dos sensores e configurar a chamada repetida
  fetchSensorDataRepeatedly();
}

function openModal() {
  const modal = document.getElementById('sensorModal');
  modal.classList.add('is-active');
}

function closeModal() {
  const modal = document.getElementById('sensorModal');
  const modaledit = document.getElementById('sensorModal-edit');
  modaledit.classList.remove('is-active');
  modal.classList.remove('is-active');

  // Limpar os valores dos campos de entrada
  const sensorNameInput = document.getElementById('sensorName');
  const sensorIPInput = document.getElementById('sensorIP');
  const cityNameInput = document.getElementById('cityName');
  sensorNameInput.value = '';
  sensorIPInput.value = '';
  cityNameInput.value = '';

  // Limpar o valor e remover as opções do dropdown editcityName
  const editcityNameInput = document.getElementById('editcityName');
  editcityNameInput.value = '';
  editcityNameInput.innerHTML = '';
}

function saveSensor() {
  const name = document.getElementById('sensorName').value;
  const ip = document.getElementById('sensorIP').value;
  const cityName = document.getElementById('cityName').value;
  
  // Verificar se todos os campos estão preenchidos
  if (!name || !ip || !cityName) {
    // Exibir notificação de erro
    const errorNotification = document.getElementById('errorNotification');
    errorNotification.classList.remove('is-hidden');
   
    setTimeout(() => {
      errorNotification.classList.add('is-hidden');
    }, 5000);

    return;
  }

  // Validar os dados
  const ipPattern = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/;
  if (!ipPattern.test(ip)) {
    // Exibir notificação de erro
    const errorNotification = document.getElementById('errorNotification');
    errorNotification.classList.remove('is-hidden');
   
    setTimeout(() => {
      errorNotification.classList.add('is-hidden');
    }, 5000);

    return;
  }

  // Ocultar notificação de erro se estiver sendo exibida
  const errorNotification = document.getElementById('errorNotification');
  errorNotification.classList.add('is-hidden');

  // Criar objeto com os dados do sensor
  const sensorData = {
    name,
    ip,
    cityName
  };

  // Fazer a requisição AJAX
  fetch('/api/v1/sensor/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(sensorData)
  })
    .then((response) => response.json())
    .then((data) => {
      console.log('Sensor saved:', data);
      closeModal();
    })
    .catch((error) => {
      console.log('Error:', error);
    });
}

document.addEventListener('keydown', (event) => {
  const e = event || window.event;
  if (e.keyCode === 27) { // Escape key
    closeModal();
  }
});

// Função para fazer a requisição AJAX
function fetchSensorData() {
  // Faz a requisição para a rota /api/v1/sensor/
  $.ajax({
    url: '/api/v1/sensor/',
    method: 'GET',
    success: function (data) {
      createSensorTable(data);
    },
    error: function (error) {
      console.log(error);
    }
  });
}

function editSensor(sensorId) {
  const modal = document.getElementById('sensorModal-edit');
  modal.classList.add('is-active');
  console.log(sensorId);
  $.ajax({
    url: `/api/v1/sensor/` + sensorId,
    method: 'GET',
    success: function(data) {
      console.log(data)
      // Preencher os campos do modal com os dados retornados
      const editsensorId = document.getElementById('editsensorId');
      const sensorNameInput = document.getElementById('editsensorName');
      const sensorIPInput = document.getElementById('editsensorIP');
      const cityNameInput = document.getElementById('editcityName');

      editsensorId.value = data.id;
      sensorNameInput.value = data.name;
      sensorIPInput.value = data.ip;
      cityNameInput.value = data.sensor_city.name;
    },
    error: function(error) {
      console.error('Error:', error);
    }
  });
  // Requisição para obter todas as cidades
  $.ajax({
    url: '/api/v1/city',
    method: 'GET',
    success: function(cities) {
      // Adicionar as opções de cidades no dropdown
      const cityDropdown = document.getElementById('editcityName');

      cities.forEach(city => {
        const option = document.createElement('option');
        option.value = city.id;
        option.textContent = city.name;
        cityDropdown.appendChild(option);
      });
    },
    error: function(error) {
      console.error('Error:', error);
    }
  });
}


function editSensor(sensorId) {
  const modal = document.getElementById('sensorModal-edit');
  modal.classList.add('is-active');
  console.log(sensorId);
  
  // Requisição para obter os dados do sensor
  $.ajax({
    url: `/api/v1/sensor/${sensorId}`,
    method: 'GET',
    success: function(data) {
      console.log(data);
      // Preencher os campos do modal com os dados retornados
      const editsensorId = document.getElementById('editsensorId');
      const sensorNameInput = document.getElementById('editsensorName');
      const sensorIPInput = document.getElementById('editsensorIP');
      const cityNameInput = document.getElementById('editcityName');

      editsensorId.value = data.id;
      sensorNameInput.value = data.name;
      sensorIPInput.value = data.ip;
      cityNameInput.value = data.sensor_city.id; // Preencher com o ID da cidade

      // Requisição para obter todas as cidades
      $.ajax({
        url: '/api/v1/city',
        method: 'GET',
        success: function(cities) {
          // Adicionar as opções de cidades no dropdown
          const cityDropdown = document.getElementById('editcityName');
          cityDropdown.innerHTML = ''; // Limpar as opções existentes

          cities.forEach(city => {
            const option = document.createElement('option');
            option.value = city.id;
            option.textContent = city.name;

            if (city.id === data.sensor_city.id) {
              option.selected = true; // Selecionar a opção correspondente à cidade do sensor
            }

            cityDropdown.appendChild(option);
          });
        },
        error: function(error) {
          console.error('Error:', error);
        }
      });
    },
    error: function(error) {
      console.error('Error:', error);
    }
  });
}

function saveEditedSensor() {
  const sensorId = document.getElementById('editsensorId').value;
  const sensorName = document.getElementById('editsensorName').value;
  const sensorIP = document.getElementById('editsensorIP').value;
  const cityId = document.getElementById('editcityName').value;

  $.ajax({
    url: `/api/v1/sensor/${sensorId}`,
    method: 'PUT',
    data: {
      sensorName: sensorName,
      sensorIP: sensorIP,
      cityId: cityId
    },
    success: function(data) {
      console.log(data);
    },
    error: function(error) {
      console.error('Error:', error);
    }
  });
  fetchSensorDataRepeatedly();
  closeModal(); // Feche o modal após salvar os dados
}

function disableSensor(sensorId) {
  $.ajax({
    url: '/api/v1/sensor/' + sensorId,
    method: 'DELETE',
    success: function (response) {
      console.log("Sensor deleted:", response);
      fetchSensorDataRepeatedly();
    },
    error: function (error) {
      console.log("Error:", error);
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