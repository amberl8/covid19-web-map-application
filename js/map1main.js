// initialize basemmap
mapboxgl.accessToken =
  'pk.eyJ1IjoiamFrb2J6aGFvIiwiYSI6ImNpcms2YWsyMzAwMmtmbG5icTFxZ3ZkdncifQ.P9MBej1xacybKcDN_jehvw';
const map = new mapboxgl.Map({
  container: 'map', // container ID
  projection: 'albers',
  style: 'mapbox://styles/mapbox/light-v10', // style URL
  zoom: 3, // starting zoom
  minzoom: 2,
  center: [-95, 37] // starting center
});

// load data and add as layer
async function geojsonFetch() {
  let response = await fetch('assets/us-covid-2020-rates.geojson');
  let covid_data = await response.json();

  map.on('load', function loadingData() {
    map.addSource('covid_data', {
      type: 'geojson',
      data: covid_data
    });

    map.addLayer({
      'id': 'covid_data_layer',
      'type': 'fill',
      'source': 'covid_data',
      'paint': {
        'fill-color': [
          'step',
          ['get', 'rates'],
          '#FFEDA0', // stop_output_0
          20, // stop_input_0
          '#FED976', // stop_output_1
          40, // stop_input_1
          '#FEB24C', // stop_output_2
          60, // stop_input_2
          '#FD8D3C', // stop_output_3
          80, // stop_input_3
          '#FC4E2A', // stop_output_4
          100, // stop_input_4
          '#E31A1C', // stop_output_5
          500, // stop_input_5
          '#BD0026' // stop_output_6
        ],
        'fill-outline-color': '#BBBBBB',
        'fill-opacity': 0.7,
      }
    });

    const layers = [
      '0-19',
      '20-39',
      '40-59',
      '60-79',
      '80-99',
      '100-499',
      '500-1000'
    ];
    const colors = [
      '#FFEDA070',
      '#FED97670',
      '#FEB24C70',
      '#FD8D3C70',
      '#FC4E2A70',
      '#E31A1C70',
      '#BD002670'
    ];

    //--- create legend ---
    const legend = document.getElementById('legend');
    legend.innerHTML = "<b>Cases per Thousand Residents</b>";


    layers.forEach((layer, i) => {
      const color = colors[i];
      const item = document.createElement('div');
      const key = document.createElement('span');
      key.className = 'legend-key';
      key.style.backgroundColor = color;

      const value = document.createElement('span');
      value.innerHTML = `${layer}`;
      item.appendChild(key);
      item.appendChild(value);
      legend.appendChild(item);
    });
  });

  //--- create information window ---
  map.on('mousemove', ({
    point
  }) => {
    const county = map.queryRenderedFeatures(point, {
      layers: ['covid_data_layer']
    });
    document.getElementById('text-description').innerHTML = county.length ?
      `<h3>${county[0].properties.county}</h3><p><strong><em>${Math.floor(county[0].properties.rates)}</strong> cases per thousand residents</em></p>` :
      `<p>Hover over a state!</p>`;
  });
}

//--- call async func to load data and add map contents ---
geojsonFetch();