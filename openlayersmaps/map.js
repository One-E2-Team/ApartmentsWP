import 'ol/ol.css';
import { Circle, Fill, Style, Text } from 'ol/style';
import { Feature, Map, Overlay, View } from 'ol/index';
import { OSM, Vector as VectorSource } from 'ol/source';
import { Point } from 'ol/geom';
import { Vector as VectorLayer } from 'ol/layer';
import { useGeographic } from 'ol/proj';
import TileLayer from 'ol/layer/Tile';


useGeographic();
var place = [20, 45];
var mapSearch = null;
var mapResults = null;
var element = null;
var popup = null;


// definition for search map

window.initSearchMap = function initSearchMap(func) {
  mapSearch = new Map({
    target: 'mapSearch',
    view: new View({
      center: place,
      zoom: 9,
    }),
    layers: [
      new TileLayer({
        source: new OSM(),
      })
    ],
  });

  mapSearch.on('click', function(event) {
    var coordinates = event.coordinate;
    var latitude = coordinates[1];
    var longitude = coordinates[0];
    mapSearch.getLayers().forEach(function(layer) {
      if (layer instanceof VectorLayer) {
        mapSearch.removeLayer(layer);
      }
    });
    mapSearch.addLayer(new VectorLayer({
      source: new VectorSource({
        features: [new Feature(new Point(coordinates))],
      }),
      style: new Style({
        image: new Circle({
          radius: 6,
          fill: new Fill({ color: 'red' }),
        }),
      })
    }));
    if (func) {
      func(latitude, longitude); //set coordinate fields
    }
  });
}



//definition for search results map

window.initResultsMap = function initResultsMap(popupEnabled, latLongMapCenter, func) {
  mapResults = new Map({
    target: 'mapResults',
    view: new View({
      center: [latLongMapCenter[1], latLongMapCenter[0]],
      zoom: 9,
    }),
    layers: [
      new TileLayer({
        source: new OSM(),
      }),
    ],
  });

  element = document.getElementById('popup');
  popup = new Overlay({
    element: element,
    positioning: 'bottom-center',
    stopEvent: true,
    offset: [0, -10],
  });
  mapResults.addOverlay(popup);

  mapResults.on('pointermove', function(event) {
    if (mapResults.hasFeatureAtPixel(event.pixel)) {
      mapResults.getViewport().style.cursor = 'pointer';
    } else {
      mapResults.getViewport().style.cursor = 'inherit';
    }
  });

  function formatPopUp(coordinate) {
    var latitude = coordinate[1];
    var longitude = coordinate[0];
    if (!func) {
      return ("\n    <table>\n      <tbody>\n        <tr><th>lon</th><td>" + (coordinate[0]) + "</td></tr>\n        <tr><th>lat</th><td>" + (coordinate[1]) + "</td></tr>\n      </tbody>\n    </table>");
    }
    return func(latitude, longitude);
  }

  mapResults.on('click', function(event) {
    if (popupEnabled) {
      $(element).popover('dispose');
      var feature = mapResults.getFeaturesAtPixel(event.pixel)[0];
      if (feature) {
        var coordinate = feature.getGeometry().getCoordinates();
        popup.setPosition(coordinate);
        $(element).popover({
          container: element.parentElement,
          html: true,
          sanitize: false,
          content: formatPopUp(coordinate),
          placement: 'top',
        });
        $(element).popover('show');
      }
    }
  });
}


window.addAllApartmentPointsResultMap = function addAllApartmentPointsResultMap(orderedLatLongList, showNumber) {
  $(element).popover('dispose');
  for (var i in orderedLatLongList)
    mapResults.addLayer(new VectorLayer({
      source: new VectorSource({
        features: [new Feature(new Point([orderedLatLongList[i][1], orderedLatLongList[i][0]]))],
      }),
      style: new Style({
        image: new Circle({
          radius: 8,
          fill: new Fill({ color: 'red' }),
        }),
        text: new Text({
          font: "bold 12px Arial, Verdana, Helvetica, sans-serif",
          text: showNumber ? (Number(i) + 1).toString() : "",
        }),
      }),
    }));
}


window.removeAllApartmentPointsResultMap = function removeAllApartmentPointsResultMap() {
  $(element).popover('dispose');
  mapResults.getLayers().forEach(function(layer) {
    if (layer instanceof VectorLayer) {
      mapResults.removeLayer(layer);
    }
  });
}
