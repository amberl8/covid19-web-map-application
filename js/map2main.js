//--- create map ---
mapboxgl.accessToken =
    'pk.eyJ1IjoiamFrb2J6aGFvIiwiYSI6ImNpcms2YWsyMzAwMmtmbG5icTFxZ3ZkdncifQ.P9MBej1xacybKcDN_jehvw';
let map = new mapboxgl.Map({
    container: 'map', // container ID
    projection: 'albers',
    style: 'mapbox://styles/mapbox/dark-v10',
    zoom: 3, // starting zoom
    minZoom: 3, // minimum zoom level of the map
    center: [-95, 37] // starting center
});

const grades = [1000, 2500, 5000, 10000, 50000, 80000],
    colors = ['rgb(237,248,251)', 'rgb(191,211,230)', 'rgb(158,188,218)', 'rgb(140,150,198)', 'rgb(136,86,167)',
        'rgb(129,15,124)'
    ],
    radii = [1, 2, 3, 4, 8, 10];

// load data to the map as new layers.
map.on('load', () => { //simplifying the function statement: arrow with brackets to define a function
    // when loading a geojson, there are two steps
    // add a source of the data and then add the layer out of the source
    map.addSource('covid-counts', {
        type: 'geojson',
        data: 'assets/us-covid-2020-counts.geojson'
    });
    map.addLayer({
        'id': 'covid-point',
        'type': 'circle',
        'source': 'covid-counts',
        'minzoom': 1,
        'paint': {
            // increase the radii of the circle as mag value increases
            'circle-radius': {
                'property': 'cases',
                'stops': [
                    [grades[0], radii[0]],
                    [grades[1], radii[1]],
                    [grades[2], radii[2]],
                    [grades[3], radii[3]],
                    [grades[4], radii[4]],
                    [grades[5], radii[5]]
                ]
            },
            // change the color of the circle as mag value increases
            'circle-color': {
                'property': 'cases',
                'stops': [
                    [grades[0], colors[0]],
                    [grades[1], colors[1]],
                    [grades[2], colors[2]],
                    [grades[3], colors[3]],
                    [grades[4], colors[4]],
                    [grades[5], colors[5]]
                ]
            },
            'circle-stroke-color': 'white',
            'circle-stroke-width': 1,
            'circle-opacity': 0.6
        }
    });
    // click on tree to view magnitude in a popup
    map.on('click', 'covid-point', (event) => {
        new mapboxgl.Popup()
            .setLngLat(event.features[0].geometry.coordinates)
            .setHTML(`<strong>Cases: </strong> ${event.features[0].properties.cases}`)
            .addTo(map);
    });
});

//--- create legend ---
const legend = document.getElementById('legend');

//set up legend grades and labels
var labels = ['<strong id="legend-title">Covid-19 Case Count</strong>'],
    vbreak;

//iterate through grades and create a scaled circle and label for each
var classes = ['0-1000', '1001-2500', '2501-5000', '5001-10000', '10001-50000', '>50000']
for (var i = 0; i < grades.length; i++) {
    vbreak = classes[i];
    // you need to manually adjust the radius of each dot on the legend
    // in order to make sure the legend can be properly referred to the dot on the map.
    dot_radii = 2 * radii[i];
    labels.push(
        '<i class="dot" style="background:' + colors[i] + '; width: ' + dot_radii +
        'px; height: ' +
        dot_radii + 'px; "></i> <span class="dot-label" style="top: ' + dot_radii / 2 + 'px;">' + vbreak +
        '</span>');
}
// add the data source
const source =
    '<p style="text-align: right; font-size:10pt">Source: <a href="https://github.com/nytimes/covid-19-data/blob/43d32dde2f87bd4dafbb7d23f5d9e878124018b8/live/us-counties.csv">New York Times</a></p>';

// combine all the html codes
legend.innerHTML = labels.join('');