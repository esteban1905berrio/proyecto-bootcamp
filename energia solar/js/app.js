 // Configurar el gráfico de torta
function crearGraficoTorta(datos, labels, titulo, idCanvas) {
  const ctx = document.getElementById(idCanvas).getContext('2d');

  // Colores bonitos
  const colores = [
    '#3498db', '#e74c3c', '#2ecc71', '#f1c40f', '#9b59b6',
    '#1abc9c', '#e67e22', '#34495e', '#fd79a8', '#00cec9'
  ];

  // Destruir el gráfico anterior si ya existe
  if (window.graficos && window.graficos[idCanvas]) {
    window.graficos[idCanvas].destroy();
  }

  const chart = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: labels,
      datasets: [{
        data: datos,
        backgroundColor: colores,
        borderColor: '#fff',
        borderWidth: 2,
        hoverOffset: 10
      }]
    },
    options: {
      responsive: true,
      plugins: {
        datalabels: {
          color: '#fff',
          font: {
            weight: 'bold',
            size: 14
          },
          formatter: (value, ctx) => {
            let sum = ctx.chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
            let percentage = (value * 100 / sum).toFixed(1) + "%";
            return percentage;
          }
        },
        legend: {
          position: 'right',
          labels: {
            color: '#333',
            font: {
              size: 14
            }
          }
        },
        title: {
          display: true,
          text: titulo,
          font: {
            size: 18,
            weight: 'bold'
          },
          color: '#2c3e50'
        }
      }
    },
    plugins: [ChartDataLabels]
  });

  // Guardamos el gráfico para poder destruirlo después si se vuelve a crear
  if (!window.graficos) window.graficos = {};
  window.graficos[idCanvas] = chart;
}
