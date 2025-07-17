# Dashboard de Energías Renovables - Punto 3

## 📊 Descripción del Proyecto

Este dashboard integral presenta un análisis completo de la producción y consumo de energía renovable a nivel global, desarrollado como parte del proyecto del Talento Tech Bootcamp. El dashboard permite visualizar datos históricos desde 1965 hasta 2022, proporcionando insights valiosos sobre la evolución de las energías renovables.

## 🎯 Objetivos del Dashboard

El dashboard cumple con los siguientes requerimientos del **Punto 3** del proyecto:

### Componentes Implementados:

1. **Gráfico de Barras: Producción de Energía Renovable por Fuente**
   - Muestra la cantidad de energía producida por cada fuente renovable
   - Datos: wind-generation, solar-energy-consumption, hydropower-consumption, biofuel-production

2. **Gráfico de Torta: Participación de Energías Renovables**
   - Visualiza el porcentaje de cada tipo de energía renovable en el total del consumo eléctrico
   - Datos: share-electricity-renewables, share-electricity-wind, share-electricity-solar, share-electricity-hydro

3. **Gráfico de Líneas: Tendencia en la Capacidad Instalada**
   - Presenta la evolución de la capacidad instalada de diferentes fuentes de energía renovable a lo largo del tiempo
   - Datos: cumulative-installed-wind-energy-capacity-gigawatts, installed-solar-PV-capacity, installed-geothermal-capacity

4. **Gráfico de Área: Comparación entre Consumo de Energía Renovable y Convencional**
   - Compara el consumo de energía renovable con el consumo de energía convencional a lo largo del tiempo
   - Datos: modern-renewable-energy-consumption, estimaciones de consumo convencional

## 🚀 Características del Dashboard

### ✨ Funcionalidades Principales:

- **Filtros Interactivos**: Selección de país/región, año específico y rango de años
- **Visualizaciones Dinámicas**: Gráficos que se actualizan automáticamente según los filtros seleccionados
- **Diseño Responsivo**: Interfaz adaptada para dispositivos móviles y de escritorio
- **Datos en Tiempo Real**: Carga dinámica de datos CSV con manejo de errores
- **Información Contextual**: Resumen de datos con estadísticas relevantes

### 🎨 Diseño y UX:

- **Interfaz Moderna**: Diseño limpio con gradientes y efectos visuales atractivos
- **Iconografía**: Uso de iconos Font Awesome para mejorar la experiencia visual
- **Animaciones**: Transiciones suaves y efectos hover para mejor interactividad
- **Paleta de Colores**: Esquema de colores coherente y accesible

## 📁 Estructura del Proyecto

```
energia-solar/
├── index.html              # Página principal del dashboard
├── estilo.css              # Estilos CSS modernos y responsivos
├── js/
│   └── dashboard.js        # Lógica principal del dashboard
├── data/
│   ├── modern-renewable-energy-consumption.csv    # Datos de consumo
│   └── modern-renewable-prod.csv                 # Datos de producción
└── README.md               # Documentación del proyecto
```

## 🛠️ Tecnologías Utilizadas

- **HTML5**: Estructura semántica y accesible
- **CSS3**: Estilos modernos con variables CSS, Grid y Flexbox
- **JavaScript (ES6+)**: Lógica interactiva y manejo de datos
- **Chart.js**: Biblioteca para la creación de gráficos interactivos
- **Papa Parse**: Parser CSV para cargar datos
- **Font Awesome**: Iconografía moderna

## 📊 Fuentes de Datos

El dashboard utiliza dos archivos CSV principales:

1. **modern-renewable-prod.csv**: Datos de producción de energía renovable
   - Período: 1965-2022
   - Fuentes: Eólica, Solar, Hidroeléctrica, Bioenergía, Geotérmica
   - Unidades: TWh (Teravatios-hora), GW (Gigavatios)

2. **modern-renewable-energy-consumption.csv**: Datos de consumo de energía renovable
   - Período: 1965-2022
   - Métricas: Porcentajes de participación, consumo total
   - Unidades: Porcentajes, TWh

## 🚀 Instalación y Uso

### Requisitos Previos:
- Navegador web moderno (Chrome, Firefox, Safari, Edge)
- Servidor web local (opcional, para desarrollo)

### Pasos de Instalación:

1. **Clonar o descargar el proyecto**
   ```bash
   git clone [URL-del-repositorio]
   cd energia-solar
   ```

2. **Iniciar servidor local** (opcional)
   ```bash
   # Con Python
   python -m http.server 8000
   
   # Con Node.js
   npx http-server
   
   # Con PHP
   php -S localhost:8000
   ```

3. **Abrir en el navegador**
   - Si usas servidor local: `http://localhost:8000`
   - Si abres directamente: `file:///ruta/al/proyecto/index.html`

## 📱 Uso del Dashboard

### Filtros Disponibles:

1. **País/Región**: Selecciona el territorio geográfico de interés
2. **Año**: Elige un año específico para análisis puntual
3. **Rango de Años**: Visualiza tendencias en períodos de 5, 10, 20 años o todos los datos

### Interpretación de Gráficos:

- **Gráfico de Barras**: Compara la producción absoluta entre fuentes renovables
- **Gráfico de Torta**: Muestra la distribución porcentual de cada fuente
- **Gráfico de Líneas**: Identifica tendencias y patrones de crecimiento
- **Gráfico de Área**: Compara la evolución del consumo renovable vs convencional

## 🔧 Personalización

### Modificar Colores:
Los colores se pueden personalizar editando las variables CSS en `estilo.css`:

```css
:root {
  --primary-color: #2c3e50;
  --secondary-color: #3498db;
  --accent-color: #e74c3c;
  /* ... más variables */
}
```

### Agregar Nuevas Fuentes de Datos:
1. Agregar el archivo CSV en la carpeta `data/`
2. Modificar las rutas en `dashboard.js`
3. Actualizar las funciones de procesamiento de datos

## 🐛 Solución de Problemas

### Problemas Comunes:

1. **Los gráficos no se cargan**
   - Verificar que los archivos CSV estén en la carpeta `data/`
   - Revisar la consola del navegador para errores

2. **Datos no se muestran**
   - Verificar que los archivos CSV tengan el formato correcto
   - Comprobar que las columnas coincidan con los nombres esperados

3. **Problemas de CORS**
   - Usar un servidor web local en lugar de abrir el archivo directamente

## 📈 Mejoras Futuras

- [ ] Agregar más tipos de gráficos (mapas de calor, gráficos de dispersión)
- [ ] Implementar exportación de datos y gráficos
- [ ] Agregar comparaciones entre múltiples países
- [ ] Incluir predicciones y tendencias futuras
- [ ] Implementar modo oscuro
- [ ] Agregar más métricas y KPIs

## 👥 Contribuciones

Este proyecto fue desarrollado como parte del Talento Tech Bootcamp. Las contribuciones son bienvenidas para mejorar la funcionalidad y el diseño del dashboard.

## 📄 Licencia

Este proyecto está desarrollado para fines educativos como parte del Talento Tech Bootcamp.

---

**Desarrollado con ❤️ para el análisis de energías renovables** 