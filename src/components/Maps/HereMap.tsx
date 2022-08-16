// src/DisplayMapFC.js
import { renderToString } from 'react-dom/server'
import { LatLng, Place, Waypoint } from '@app/shared/types';
import { useEffect, useLayoutEffect, useRef } from 'react';
import config from '../../config';
import { GetCentralGeoCoordinate } from '@app/shared/utils/coords';

import { Box, useColorModeValue } from '@chakra-ui/react';

import TaskCard from '../TaskCard';

function InvertHexColor(color: string) {
  const hex = color.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  const inverted = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
  return inverted;
}


var svgMarkup = (color: string) => `<svg  width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="${color}" d="M9,3V4H4V6H5V19A2,2 0 0,0 7,21H17A2,2 0 0,0 19,19V6H20V4H15V3H9M7,6H17V19H7V6M9,8V17H11V8H9M13,8V17H15V8H13Z" /></svg>`;
var svgNumberMarkup = (color: string, number: number) => {
  let n = number.toString();
  if (number < 10) {
    n = '0' + n;
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 48 48" width="48" height="48"><g clip-path="url(#_clipPath_aF97FNxfvN5wHvKNmugRwGLgbtlbfPjF)"><path d=" M 24 40.05 Q 30.65 34 33.825 29.075 Q 37 24.15 37 20.4 Q 37 14.5 33.225 10.75 Q 29.45 7 24 7 Q 18.55 7 14.775 10.75 Q 11 14.5 11 20.4 Q 11 24.15 14.25 29.075 Q 17.5 34 24 40.05 Z  M 24 44 Q 15.95 37.15 11.975 31.275 Q 8 25.4 8 20.4 Q 8 12.9 12.825 8.45 Q 17.65 4 24 4 Q 30.35 4 35.175 8.45 Q 40 12.9 40 20.4 Q 40 25.4 36.025 31.275 Q 32.05 37.15 24 44 Z " fill="rgb(0,0,0)"/><g clip-path="url(#_clipPath_rcEj6PK2f0wYItiTDHPJW5MxjzDsUl6O)"><text transform="matrix(1,0,0,1,13.28,26.829)" style="font-family:'Arial';font-weight:900;font-size:17px;font-style:normal;fill:#000000;stroke:none;">${n}</text></g><defs><clipPath id="_clipPath_rcEj6PK2f0wYItiTDHPJW5MxjzDsUl6O"><rect x="0" y="0" width="32" height="23.151" transform="matrix(1,0,0,1,8,8.658)"/></clipPath></defs></g></svg>`
}
// var svgMarkup = '<svg  width="24" height="24" xmlns="http://www.w3.org/2000/svg">' +
//   '<rect stroke="black" fill="${FILL}" x="1" y="1" width="22" height="22" />' +
//   '<text x="12" y="18" font-size="12pt" font-family="Arial" font-weight="bold" ' +
//   'text-anchor="middle" fill="${STROKE}" >C</text></svg>';

export const DisplayMapFC = ({ mapHeight, current, places, waypoints, ...rest }: { current: LatLng, places: Place[], waypoints: Waypoint[], mapHeight: number }) => {
  // Create a reference to the HTML element we want to put the map on
  const mapRef = useRef(null);
  const hMapRef = useRef(null);

  let hMap: any;

  //@ts-ignore
  const H = window.H;
  const platform = new H.service.Platform({
    apikey: config.hereApiKey
  });
  const defaultLayers = platform.createDefaultLayers();

  const mapMode = useColorModeValue(
    defaultLayers.vector.normal.map,
    defaultLayers.raster.normal.mapnight
  );

  const colorMode = useColorModeValue('light', 'dark');
  /**
   * Create the map instance
   * While `useEffect` could also be used here, `useLayoutEffect` will render
   * the map sooner
   */

  useEffect(() => {
    if (!hMapRef.current) return;
    hMapRef.current.getViewPort().resize()
    console.log('resized');
  }, [mapHeight])

  useEffect(() => {
    const resizeEvent = () => {
      if (!hMapRef.current) return;
      hMapRef.current.getViewPort().resize();
    }
    window.addEventListener('resize', resizeEvent);
    return () => {
      window.removeEventListener('resize', resizeEvent);
    }
  }, [])

  useLayoutEffect(() => {
    // `mapRef.current` will be `undefined` when this hook first runs; edge case that
    if (!mapRef.current) return;

    const initialPos = places[0] && places[0].pos || null;

    const hMap = new H.Map(mapRef.current, mapMode, {
      center: (places.length > 1) ? GetCentralGeoCoordinate(places) : initialPos,
      zoom: 12,
      pixelRatio: window.devicePixelRatio || 1
    });

    hMapRef.current = hMap;

    const behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(hMap));

    const ui = H.ui.UI.createDefault(hMap, defaultLayers);
    console.log(places);
    if (places.length > 1) {
      var group = new H.map.Group();

      group.addEventListener('tap', function (evt: any) {
        // event target is the marker itself, group is a parent event target
        // for all objects that it contains
        var bubble = new H.ui.InfoBubble(evt.target.getGeometry(), {
          // read custom data
          content: evt.target.getData()
        });
        // show info bubble
        ui.addBubble(bubble);
      }, false);


      places.map((place: Place, index: number) => {
        const color = place.route?.color?.hex || 'black';
        const c = (colorMode === 'dark') ? InvertHexColor(color) : color;
        const icon = new H.map.Icon(svgNumberMarkup(c, index + 1));
        const marker = new H.map.Marker(place.pos, { icon });
        marker.setData(renderToString(<TaskCard place={place} />));
        group.addObject(marker);
      })

      if (current) {
        const currentLocation = new H.map.Marker(current);
        group.addObject(currentLocation);
      }

      hMap.addObject(group);

      hMap.getViewModel().setLookAtData({ bounds: group.getBoundingBox() });
    } else {
      const place = places[0];
      if (place) {
        const color = place.route?.color?.hex || 'black';
        const c = (colorMode === 'dark') ? InvertHexColor(color) : color;
        const icon = new H.map.Icon(svgNumberMarkup(c, 1));
        const marker = new H.map.Marker(place.pos, { icon });
        marker.setData(renderToString(<TaskCard place={place} />));
        hMap.addObject(marker);
      }
    };



    // hMap.setZoom(12);

    // Define a callback function to process the routing response:
    var onResult = function (result: any) {
      console.log(result);
      // ensure that at least one route was found
      if (result.routes.length) {
        result.routes[0].sections.forEach((section: any) => {
          // Create a linestring to use as a point source for the route line
          let linestring = H.geo.LineString.fromFlexiblePolyline(section.polyline);

          // Create a polyline to display the route:
          let routeLine = new H.map.Polyline(linestring, {
            style: { strokeColor: 'blue', lineWidth: 3 }
          });

          // Create a marker for the start point:
          // let startMarker = new H.map.Marker(section.departure.place.location);

          // Create a marker for the end point:
          // let endMarker = new H.map.Marker(section.arrival.place.location);

          // Add the route polyline and the two markers to the map:
          hMap.addObjects([
            routeLine,
            // startMarker, 
            // endMarker
          ]);
        });
      }
    };

    // Get an instance of the routing service version 8:
    var router = platform.getRoutingService(null, 8);

    waypoints.map((waypoint: any, index: number) => {
      if (index + 1 === waypoints.length) return null;
      // Create the parameters for the routing request:
      var routingParameters = {
        'routingMode': 'fast',
        'transportMode': 'car',
        // The start point of the route:
        'origin': `${waypoint.lat},${waypoint.lng}`,
        // The end point of the route:
        'destination': `${waypoints[index + 1].lat},${waypoints[index + 1].lng}`,
        // Include the route shape in the response
        'return': 'polyline'
      };
      // Call calculateRoute() with the routing parameters,
      // the callback and an error callback function (called if a
      // communication error occurs):
      router.calculateRoute(routingParameters, onResult,
        function (error: any) {
          alert(error.message);
        });
    })

    // This will act as a cleanup to run once this hook runs again.
    // This includes when the component un-mounts
    return () => {
      hMap.dispose();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapRef]); // This will run this hook every time this ref is updated

  return <Box className="map" ref={mapRef} {...rest} />;
};
