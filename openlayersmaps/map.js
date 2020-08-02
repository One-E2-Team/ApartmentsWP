import 'ol/ol.css';
import {Circle, Fill, Style} from 'ol/style';
import {Feature, Map, Overlay, View} from 'ol/index';
import {OSM, Vector as VectorSource} from 'ol/source';
import {Point} from 'ol/geom';
import {/*Tile as TileLayer, */Vector as VectorLayer} from 'ol/layer';
import {useGeographic} from 'ol/proj';
import MousePosition from 'ol/control/MousePosition';
//import OSM from 'ol/source/OSM';
import TileLayer from 'ol/layer/Tile';
//import View from 'ol/View';
import {createStringXY} from 'ol/coordinate';
import {defaults as defaultControls} from 'ol/control';


useGeographic();
var place = [20, 45];


// definition for search map

var mapSearch = new Map({
  target: 'mapSearch',
  view: new View({
    center: place,
    zoom: 9,
  }),
  layers: [
    new TileLayer({
      source: new OSM(),
    }) ],
});

mapSearch.on('click', function (event) {
  var coordinates = event.coordinate;
  var latitude = coordinates[1];
  var longitude = coordinates[0];
  var layers = mapSearch.layers;
  mapSearch.getLayers().forEach(function(layer){
    if(layer instanceof VectorLayer){
      mapSearch.removeLayer(layer);
    }
  });
  mapSearch.addLayer(new VectorLayer({
    source: new VectorSource({
      features: [new Feature(new Point(coordinates))],
    }),
    style: new Style({
      image: new Circle({
        radius: 5,
        fill: new Fill({color: 'red'}),
      }),
    })
  }));
  // TODO set coordinate fields
});


//definition for search results map


var point = new Point(place);

var mapResults = new Map({
  target: 'mapResults',
  view: new View({
    center: place,
    zoom: 9,
  }),
  layers: [
    new TileLayer({
      source: new OSM(),
    })/*,
    new VectorLayer({
      source: new VectorSource({
        features: [new Feature(point)],
      }),
      style: new Style({
        image: new Circle({
          radius: 9,
          fill: new Fill({color: 'red'}),
        }),
      }),
    }) */],
});
/*
var element = document.getElementById('popup');

var popup = new Overlay({
  element: element,
  positioning: 'bottom-center',
  stopEvent: false,
  offset: [0, -10],
});
map.addOverlay(popup);

function formatCoordinate(coordinate) {
  return ("\n    <table>\n      <tbody>\n        <tr><th>lon</th><td>" + (coordinate[0].toFixed(2)) + "</td></tr>\n        <tr><th>lat</th><td>" + (coordinate[1].toFixed(2)) + "</td></tr>\n      </tbody>\n    </table>");
}

var info = document.getElementById('info');
map.on('moveend', function () {
  var view = map.getView();
  var center = view.getCenter();
  info.innerHTML = formatCoordinate(center);
});*/

mapResults.on('click', function (event) {
  var layers = map.getLayers();
  /*var feature = map.getFeaturesAtPixel(event.pixel)[0];
  if (feature) {
    var coordinate = feature.getGeometry().getCoordinates();
    popup.setPosition(coordinate);
    $(element).popover({
      container: element.parentElement,
      html: true,
      sanitize: false,
      content: formatCoordinate(coordinate),
      placement: 'top',
    });
    $(element).popover('show');
  } else {
    $(element).popover('dispose');
  }
*/});

/*map.on('pointermove', function (event) {
  if (map.hasFeatureAtPixel(event.pixel)) {
    map.getViewport().style.cursor = 'pointer';
  } else {
    map.getViewport().style.cursor = 'inherit';
  }
});*/