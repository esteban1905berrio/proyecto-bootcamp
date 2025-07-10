// main.js
// Lógica principal del proyecto de energía solar (enfocado en Colombia)

let datosColombia = [];
let datosAnios = [];
let datosProduccion = [];

const csvFileInput = document.getElementById('csvFileInput');
const csvTableContainer = document.getElementById('csvTableContainer');

function mostrarTablaCSV(data) {
  const tablaMensaje = document.getElementById('tablaMensaje');
  if (!data || data.length === 0) {
    csvTableContainer.innerHTML = '<p>No hay datos para mostrar.</p>';
    if (tablaMensaje) tablaMensaje.textContent = 'No se encontraron datos de Colombia en el archivo.';
    return;
  }
  let table = '<table class="table table-striped table-bordered">';
  table += '<thead><tr>';
  Object.keys(data[0]).forEach(key => {
    table += `<th>${key}</th>`;
  });
  table += '</tr></thead><tbody>';
  data.forEach(row => {
    table += '<tr>';
    Object.values(row).forEach(val => {
      table += `<td>${val}</td>`;
    });
    table += '</tr>';
  });
  table += '</tbody></table>';
  csvTableContainer.innerHTML = table;
  if (tablaMensaje) tablaMensaje.textContent = '';
}

// Limpiar gráficos y tabla al cargar nuevos archivos
function limpiarGraficosYTabla() {
  if (graficoBarras) { graficoBarras.destroy(); graficoBarras = null; }
  if (graficoLineas) { graficoLineas.destroy(); graficoLineas = null; }
  if (graficoTorta) { graficoTorta.destroy(); graficoTorta = null; }
  if (graficoArea) { graficoArea.destroy(); graficoArea = null; }
  csvTableContainer.innerHTML = '';
  const tablaMensaje = document.getElementById('tablaMensaje');
  if (tablaMensaje) tablaMensaje.textContent = '';
}

if (csvFileInput) {
  csvFileInput.addEventListener('change', function (e) {
    limpiarGraficosYTabla();
    const file = e.target.files[0];
    if (file) {
      if (!file.name.includes('solar-energy-consumption')) {
        const tablaMensaje = document.getElementById('tablaMensaje');
        if (tablaMensaje) tablaMensaje.textContent = 'Por favor, sube el archivo correcto: 12 solar-energy-consumption.csv';
        return;
      }
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: function (results) {
          datosColombia = results.data.filter(row => row.Entity && row.Entity.trim().toLowerCase() === 'colombia');
          datosAnios = datosColombia.map(row => row.Year);
          datosProduccion = datosColombia.map(row => parseFloat(row["Electricity from solar (TWh)"]));
          mostrarTablaCSV(datosColombia);
          actualizarGraficos();
        }
      });
    }
  });
}

// 2. Formulario de estimación de porcentaje solar (usando el dato más reciente de Colombia)
const estimacionForm = document.getElementById('estimacionForm');
const resultadoEstimacion = document.getElementById('resultadoEstimacion');

if (estimacionForm) {
  estimacionForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const consumoTotal = parseFloat(document.getElementById('consumoTotal').value);
    // Usar el dato más reciente de producción solar de Colombia
    let porcentajeSolar = 0;
    if (datosProduccion.length > 0) {
      // Suponiendo que el consumo total nacional es igual a la producción (para ejemplo)
      // Si tienes el consumo total real, puedes ajustar este cálculo
      const produccionReciente = datosProduccion[datosProduccion.length - 1];
      porcentajeSolar = produccionReciente > 0 ? 100 : 0;
    }
    const consumoSolar = (consumoTotal * porcentajeSolar) / 100;
    resultadoEstimacion.innerHTML = `De tu consumo total, <span class="text-warning fw-bold">${consumoSolar.toFixed(2)} kWh</span> provienen de energía solar (${porcentajeSolar}%).`;
  });
}

// 3. Dashboard de gráficos con Chart.js (Colombia)
let graficoBarras, graficoLineas;

function actualizarGraficos() {
  // Gráfico de Barras: Producción solar por año (Colombia)
  const ctxBarras = document.getElementById('graficoBarras').getContext('2d');
  if (graficoBarras) graficoBarras.destroy();
  graficoBarras = new Chart(ctxBarras, {
    type: 'bar',
    data: {
      labels: datosAnios,
      datasets: [{
        label: 'Producción Solar en Colombia (TWh)',
        data: datosProduccion,
        backgroundColor: '#ffb300',
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } }
    }
  });

  // Gráfico de Líneas: Producción solar por año (Colombia)
  const ctxLineas = document.getElementById('graficoLineas').getContext('2d');
  if (graficoLineas) graficoLineas.destroy();
  graficoLineas = new Chart(ctxLineas, {
    type: 'line',
    data: {
      labels: datosAnios,
      datasets: [{
        label: 'Producción Solar en Colombia (TWh)',
        data: datosProduccion,
        borderColor: '#ff9800',
        backgroundColor: 'rgba(255, 193, 7, 0.2)',
        fill: true
      }]
    },
    options: { responsive: true }
  });
}

// Variables para los otros gráficos
let graficoTorta, graficoArea;

// Permitir cargar otros archivos CSV para los otros gráficos
document.addEventListener('DOMContentLoaded', function () {
  actualizarGraficos();

  // Listeners para cargar archivos adicionales
  // Gráfico de torta: participación solar en electricidad
  const inputTorta = document.createElement('input');
  inputTorta.type = 'file';
  inputTorta.accept = '.csv';
  inputTorta.className = 'form-control mb-2';
  inputTorta.id = 'csvTortaInput';
  inputTorta.title = 'Cargar archivo de participación solar en electricidad';
  const labelTorta = document.createElement('label');
  labelTorta.innerText = 'Cargar archivo de participación solar en electricidad (%):';
  labelTorta.htmlFor = 'csvTortaInput';
  document.getElementById('dashboard').prepend(labelTorta, inputTorta);

  inputTorta.addEventListener('change', function (e) {
    limpiarGraficosYTabla();
    const file = e.target.files[0];
    if (file) {
      if (!file.name.includes('share-electricity-solar')) {
        const tablaMensaje = document.getElementById('tablaMensaje');
        if (tablaMensaje) tablaMensaje.textContent = 'Por favor, sube el archivo correcto: 12 share-electricity-solar.csv';
        return;
      }
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: function (results) {
          const datosCol = results.data.filter(row => row.Entity && row.Entity.trim().toLowerCase() === 'colombia');
          if (datosCol.length > 0) {
            // Tomar el año más reciente
            const ultimo = datosCol.reduce((a, b) => (parseInt(a.Year) > parseInt(b.Year) ? a : b));
            const solar = parseFloat(ultimo["Solar (% electricity)"]) || 0;
            const noSolar = 100 - solar;
            actualizarGraficoTorta(solar, noSolar, ultimo.Year);
          }
        }
      });
    }
  });

  // Gráfico de área: evolución del porcentaje solar en energía primaria
  const inputArea = document.createElement('input');
  inputArea.type = 'file';
  inputArea.accept = '.csv';
  inputArea.className = 'form-control mb-2';
  inputArea.id = 'csvAreaInput';
  inputArea.title = 'Cargar archivo de porcentaje solar en energía primaria';
  const labelArea = document.createElement('label');
  labelArea.innerText = 'Cargar archivo de porcentaje solar en energía primaria (%):';
  labelArea.htmlFor = 'csvAreaInput';
  document.getElementById('dashboard').prepend(labelArea, inputArea);

  inputArea.addEventListener('change', function (e) {
    limpiarGraficosYTabla();
    const file = e.target.files[0];
    if (file) {
      if (!file.name.includes('solar-share-energy')) {
        const tablaMensaje = document.getElementById('tablaMensaje');
        if (tablaMensaje) tablaMensaje.textContent = 'Por favor, sube el archivo correcto: 12 solar-share-energy.csv';
        return;
      }
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: function (results) {
          const datosCol = results.data.filter(row => row.Entity && row.Entity.trim().toLowerCase() === 'colombia');
          const anios = datosCol.map(row => row.Year);
          const porcentaje = datosCol.map(row => parseFloat(row["Solar (% equivalent primary energy)"]) || 0);
          actualizarGraficoArea(anios, porcentaje);
        }
      });
    }
  });
});

function actualizarGraficoTorta(solar, noSolar, year) {
  const ctxTorta = document.getElementById('graficoTorta').getContext('2d');
  if (graficoTorta) graficoTorta.destroy();
  graficoTorta = new Chart(ctxTorta, {
    type: 'pie',
    data: {
      labels: [
        `Solar (${solar.toFixed(2)}%)`,
        `No solar (${noSolar.toFixed(2)}%)`
      ],
      datasets: [{
        data: [solar, noSolar],
        backgroundColor: ['#ffd600', '#bdbdbd']
      }]
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: `Participación de la energía solar en la electricidad de Colombia (${year})`
        }
      }
    }
  });
}

function actualizarGraficoArea(anios, porcentaje) {
  const ctxArea = document.getElementById('graficoArea').getContext('2d');
  if (graficoArea) graficoArea.destroy();
  graficoArea = new Chart(ctxArea, {
    type: 'line',
    data: {
      labels: anios,
      datasets: [
        {
          label: 'Porcentaje solar en energía primaria (%)',
          data: porcentaje,
          borderColor: '#ffd600',
          backgroundColor: 'rgba(255, 214, 0, 0.3)',
          fill: true
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: 'Evolución del porcentaje solar en la energía primaria de Colombia'
        }
      }
    }
  });
} 