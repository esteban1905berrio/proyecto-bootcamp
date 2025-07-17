 // Configuración de rutas de datos
const RUTA_PRODUCCION = "data/modern-renewable-prod.csv";
const RUTA_CONSUMO = "data/modern-renewable-energy-consumption.csv";

// Variables globales
let datosProduccion = [];
let datosConsumo = [];
let graficos = {
  barras: null,
  torta: null,
  lineas: null,
  area: null
};

// Configuración de colores para los gráficos
const COLORES = {
  eolica: '#3498db',
  solar: '#f1c40f',
  hidro: '#2ecc71',
  geotermica: '#9b59b6',
  bioenergia: '#e67e22',
  convencional: '#e74c3c',
  renovable: '#27ae60'
};

// Inicialización cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", async () => {
  try {
    await cargarDatos();
    inicializarFiltros();
    actualizarDashboard();
    actualizarResumen();
  } catch (error) {
    console.error("Error al inicializar el dashboard:", error);
    mostrarError("Error al cargar los datos. Por favor, recarga la página.");
  }
});

/**
 * Carga los datos CSV desde los archivos
 */
async function cargarDatos() {
  try {
    const [prodData, consData] = await Promise.all([
      cargarCSV(RUTA_PRODUCCION),
      cargarCSV(RUTA_CONSUMO)
    ]);

    // Filtrar datos válidos
    datosProduccion = prodData.filter(d => d.Entity && d.Year && !isNaN(d.Year));
    datosConsumo = consData.filter(d => d.Entity && d.Year && !isNaN(d.Year));

    console.log(`Datos cargados: ${datosProduccion.length} registros de producción, ${datosConsumo.length} registros de consumo`);
  } catch (error) {
    throw new Error(`Error al cargar datos: ${error.message}`);
  }
}

/**
 * Función para cargar archivos CSV usando Papa Parse
 */
function cargarCSV(ruta) {
  return new Promise((resolve, reject) => {
    Papa.parse(ruta, {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: (resultado) => {
        if (resultado.errors.length > 0) {
          reject(new Error(`Errores en CSV: ${resultado.errors.map(e => e.message).join(', ')}`));
        } else {
          resolve(resultado.data);
        }
      },
      error: (error) => reject(error)
    });
  });
}

/**
 * Inicializa los filtros con los datos disponibles
 */
function inicializarFiltros() {
  const paisSelect = document.getElementById("paisSelect");
  const anioSelect = document.getElementById("anioSelect");
  const rangoAnios = document.getElementById("rangoAnios");

  // Obtener países únicos
  const paises = [...new Set(datosProduccion.map(d => d.Entity))].sort();
  paises.forEach(pais => {
    const option = new Option(pais, pais);
    paisSelect.add(option);
  });

  // Obtener años únicos
  const años = [...new Set(datosProduccion.map(d => parseInt(d.Year)))].sort((a, b) => a - b);
  años.forEach(año => {
    const option = new Option(año, año);
    anioSelect.add(option);
  });

  // Configurar valores por defecto
  paisSelect.value = paises[0] || "";
  anioSelect.value = años[años.length - 1] || "";

  // Event listeners
  paisSelect.addEventListener("change", actualizarDashboard);
  anioSelect.addEventListener("change", actualizarDashboard);
  rangoAnios.addEventListener("change", actualizarDashboard);
}

/**
 * Actualiza todos los gráficos del dashboard
 */
function actualizarDashboard() {
  const pais = document.getElementById("paisSelect").value;
  const año = document.getElementById("anioSelect").value;
  const rango = document.getElementById("rangoAnios").value;

  if (!pais || !año) return;

  // Obtener datos filtrados
  const datosPais = obtenerDatosPais(pais, año, rango);
  
  // Actualizar cada gráfico
  actualizarGraficoBarras(datosPais.produccionActual);
  actualizarGraficoTorta(datosPais.consumoActual);
  actualizarGraficoLineas(datosPais.historicoProduccion);
  actualizarGraficoArea(datosPais.historicoConsumo);
}

/**
 * Obtiene los datos filtrados para un país específico
 */
function obtenerDatosPais(pais, año, rango) {
  // Datos de producción actual (del archivo de producción)
  const produccionActual = datosProduccion.find(d => d.Entity === pais && d.Year === año) || {};
  
  // Datos de consumo actual (del archivo de consumo)
  const consumoActual = datosConsumo.find(d => d.Entity === pais && d.Year === año) || {};
  
  // Datos históricos de producción (para capacidad instalada)
  let historicoProduccion = datosProduccion.filter(d => d.Entity === pais);
  if (rango !== "all") {
    const añoLimite = parseInt(año) - parseInt(rango);
    historicoProduccion = historicoProduccion.filter(d => parseInt(d.Year) >= añoLimite);
  }
  historicoProduccion.sort((a, b) => parseInt(a.Year) - parseInt(b.Year));
  
  // Datos históricos de consumo (para consumo renovable)
  let historicoConsumo = datosConsumo.filter(d => d.Entity === pais);
  if (rango !== "all") {
    const añoLimite = parseInt(año) - parseInt(rango);
    historicoConsumo = historicoConsumo.filter(d => parseInt(d.Year) >= añoLimite);
  }
  historicoConsumo.sort((a, b) => parseInt(a.Year) - parseInt(b.Year));

  return {
    produccionActual,
    consumoActual,
    historicoProduccion,
    historicoConsumo
  };
}

/**
 * Actualiza el gráfico de barras (Producción por Fuente)
 */
function actualizarGraficoBarras(datos) {
  const ctx = document.getElementById("graficoBarras");
  
  const datosGrafico = {
    labels: ['Eólica', 'Solar', 'Hidroeléctrica', 'Bioenergía'],
    datasets: [{
      label: 'Producción (TWh)',
      data: [
        parseFloat(datos['Electricity from wind (TWh)'] || 0),
        parseFloat(datos['Electricity from solar (TWh)'] || 0),
        parseFloat(datos['Electricity from hydro (TWh)'] || 0),
        parseFloat(datos['Other renewables including bioenergy (TWh)'] || 0)
      ],
      backgroundColor: [
        COLORES.eolica,
        COLORES.solar,
        COLORES.hidro,
        COLORES.bioenergia
      ],
      borderColor: [
        COLORES.eolica,
        COLORES.solar,
        COLORES.hidro,
        COLORES.bioenergia
      ],
      borderWidth: 2
    }]
  };

  const config = {
    type: 'bar',
    data: datosGrafico,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: `Producción de Energía Renovable por Fuente - ${datos.Year || 'N/A'}`,
          font: { size: 16, weight: 'bold' }
        },
        legend: {
          display: false
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Teravatios-hora (TWh)'
          }
        }
      }
    }
  };

  crearOActualizarGrafico(ctx, config, 'barras');
}

/**
 * Actualiza el gráfico de torta (Participación de Energías Renovables)
 * Calcula los porcentajes basándose en los datos de generación disponibles
 */
function actualizarGraficoTorta(datos) {
  const ctx = document.getElementById("graficoTorta");
  const container = ctx.parentElement;

  // Limpiar mensajes previos
  const advertenciaExistente = container.querySelector('.advertencia-torta');
  if (advertenciaExistente) advertenciaExistente.remove();

  // Extraer datos de generación (TWh)
  const solarGen = parseFloat(datos['Solar Generation - TWh'] || 0);
  const windGen = parseFloat(datos['Wind Generation - TWh'] || 0);
  const hydroGen = parseFloat(datos['Hydro Generation - TWh'] || 0);
  const bioGen = parseFloat(datos['Geo Biomass Other - TWh'] || 0);

  // Calcular total de energía renovable
  const totalRenovable = solarGen + windGen + hydroGen + bioGen;

  // Verificar si hay datos válidos
  if (totalRenovable <= 0) {
    // Si no hay datos, destruir gráfico y mostrar advertencia
    if (graficos.torta) {
      graficos.torta.destroy();
      graficos.torta = null;
    }
    const advertencia = document.createElement('div');
    advertencia.className = 'advertencia-torta';
    advertencia.style = 'color: #e74c3c; text-align: center; margin-top: 20px; font-weight: bold;';
    advertencia.innerHTML = '<i class="fas fa-exclamation-triangle"></i> No hay datos de generación renovable disponibles para este país/año.';
    container.appendChild(advertencia);
    ctx.style.display = 'none';
    return;
  } else {
    ctx.style.display = 'block';
  }

  // Calcular porcentajes
  const porcentajeSolar = (solarGen / totalRenovable) * 100;
  const porcentajeEolica = (windGen / totalRenovable) * 100;
  const porcentajeHidro = (hydroGen / totalRenovable) * 100;
  const porcentajeBio = (bioGen / totalRenovable) * 100;

  const datosGrafico = {
    labels: ['Solar', 'Eólica', 'Hidroeléctrica', 'Bioenergía'],
    datasets: [{
      data: [porcentajeSolar, porcentajeEolica, porcentajeHidro, porcentajeBio],
      backgroundColor: [
        COLORES.solar,
        COLORES.eolica,
        COLORES.hidro,
        COLORES.bioenergia
      ],
      borderColor: '#ffffff',
      borderWidth: 2
    }]
  };

  const config = {
    type: 'pie',
    data: datosGrafico,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: `Distribución de Energías Renovables - ${datos.Year || 'N/A'} (Total: ${totalRenovable.toFixed(1)} TWh)`,
          font: { size: 16, weight: 'bold' }
        },
        legend: {
          position: 'bottom'
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              const valor = context.parsed;
              const total = context.dataset.data.reduce((a, b) => a + b, 0);
              const porcentaje = ((valor / total) * 100).toFixed(1);
              return `${context.label}: ${valor.toFixed(1)}% (${(valor * totalRenovable / 100).toFixed(1)} TWh)`;
            }
          }
        }
      }
    }
  };

  crearOActualizarGrafico(ctx, config, 'torta');
}

/**
 * Actualiza el gráfico de líneas (Tendencia de Generación Eléctrica Renovable)
 */
function actualizarGraficoLineas(datos) {
  const ctx = document.getElementById("graficoLineas");
  
  const años = datos.map(d => d.Year);
  const generacionEolica = datos.map(d => parseFloat(d['Electricity from wind (TWh)'] || 0));
  const generacionSolar = datos.map(d => parseFloat(d['Electricity from solar (TWh)'] || 0));
  const generacionHidro = datos.map(d => parseFloat(d['Electricity from hydro (TWh)'] || 0));
  const generacionBio = datos.map(d => parseFloat(d['Other renewables including bioenergy (TWh)'] || 0));

  const datosGrafico = {
    labels: años,
    datasets: [
      {
        label: 'Eólica (TWh)',
        data: generacionEolica,
        borderColor: COLORES.eolica,
        backgroundColor: COLORES.eolica + '20',
        fill: false,
        tension: 0.4
      },
      {
        label: 'Solar (TWh)',
        data: generacionSolar,
        borderColor: COLORES.solar,
        backgroundColor: COLORES.solar + '20',
        fill: false,
        tension: 0.4
      },
      {
        label: 'Hidroeléctrica (TWh)',
        data: generacionHidro,
        borderColor: COLORES.hidro,
        backgroundColor: COLORES.hidro + '20',
        fill: false,
        tension: 0.4
      },
      {
        label: 'Bioenergía (TWh)',
        data: generacionBio,
        borderColor: COLORES.bioenergia,
        backgroundColor: COLORES.bioenergia + '20',
        fill: false,
        tension: 0.4
      }
    ]
  };

  const config = {
    type: 'line',
    data: datosGrafico,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: 'Evolución de la Generación Eléctrica Renovable',
          font: { size: 16, weight: 'bold' }
        },
        legend: {
          position: 'top'
        }
      },
      scales: {
        x: {
          title: {
            display: true,
            text: 'Año'
          }
        },
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Teravatios-hora (TWh)'
          }
        }
      }
    }
  };

  crearOActualizarGrafico(ctx, config, 'lineas');
}

/**
 * Actualiza el gráfico de área (Consumo Renovable vs Convencional)
 */
function actualizarGraficoArea(datos) {
  const ctx = document.getElementById("graficoArea");
  
  const años = datos.map(d => d.Year);
  const consumoRenovable = datos.map(d => {
    const solar = parseFloat(d['Solar Generation - TWh'] || 0);
    const wind = parseFloat(d['Wind Generation - TWh'] || 0);
    const hydro = parseFloat(d['Hydro Generation - TWh'] || 0);
    const bio = parseFloat(d['Geo Biomass Other - TWh'] || 0);
    return solar + wind + hydro + bio;
  });
  
  // Estimación de consumo convencional (basado en datos históricos)
  // Para este ejemplo, usamos una proporción estimada
  const consumoConvencional = consumoRenovable.map(valor => {
    // Estimación: si hay generación renovable, estimamos el total eléctrico
    // y calculamos la diferencia como convencional
    if (valor > 0) {
      // Estimación conservadora: asumimos que las renovables son ~25% del total
      const totalEstimado = valor * 4; // 4 veces más que renovables
      return totalEstimado - valor;
    }
    return 0;
  });

  const datosGrafico = {
    labels: años,
    datasets: [
      {
        label: 'Energía Renovable (TWh)',
        data: consumoRenovable,
        borderColor: COLORES.renovable,
        backgroundColor: COLORES.renovable + '40',
        fill: true,
        tension: 0.4
      },
      {
        label: 'Energía Convencional (TWh) - Estimado',
        data: consumoConvencional,
        borderColor: COLORES.convencional,
        backgroundColor: COLORES.convencional + '40',
        fill: true,
        tension: 0.4
      }
    ]
  };

  const config = {
    type: 'line',
    data: datosGrafico,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: 'Comparación de Generación: Renovable vs Convencional (Estimado)',
          font: { size: 16, weight: 'bold' }
        },
        legend: {
          position: 'top'
        }
      },
      scales: {
        x: {
          title: {
            display: true,
            text: 'Año'
          }
        },
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Teravatios-hora (TWh)'
          }
        }
      }
    }
  };

  crearOActualizarGrafico(ctx, config, 'area');
}

/**
 * Crea o actualiza un gráfico de Chart.js
 */
function crearOActualizarGrafico(ctx, config, tipo) {
  if (graficos[tipo]) {
    graficos[tipo].destroy();
  }
  
  graficos[tipo] = new Chart(ctx, config);
}

/**
 * Actualiza la información del resumen
 */
function actualizarResumen() {
  const periodoDatos = document.getElementById("periodoDatos");
  const regionesDisponibles = document.getElementById("regionesDisponibles");
  
  // Calcular período de datos
  const años = datosProduccion.map(d => parseInt(d.Year)).filter(año => !isNaN(año));
  const añoMin = Math.min(...años);
  const añoMax = Math.max(...años);
  
  periodoDatos.textContent = `${añoMin} - ${añoMax}`;
  
  // Contar regiones únicas
  const regiones = new Set(datosProduccion.map(d => d.Entity));
  regionesDisponibles.textContent = regiones.size;
}

/**
 * Muestra un mensaje de error
 */
function mostrarError(mensaje) {
  const main = document.querySelector('main');
  const errorDiv = document.createElement('div');
  errorDiv.className = 'error-mensaje';
  errorDiv.innerHTML = `
    <div style="background: #e74c3c; color: white; padding: 20px; border-radius: 10px; text-align: center; margin: 20px 0;">
      <i class="fas fa-exclamation-triangle"></i> ${mensaje}
    </div>
  `;
  main.insertBefore(errorDiv, main.firstChild);
}

// Exportar funciones para uso global si es necesario
window.DashboardApp = {
  actualizarDashboard,
  cargarDatos,
  obtenerDatosPais
};