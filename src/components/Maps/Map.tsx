/* global google */
import { Component, useState, useEffect } from "react";
import {
  withGoogleMap,
  GoogleMap,
  withScriptjs,
  Marker,
  DirectionsRenderer,
  InfoWindow,
} from "react-google-maps";

import config from "../../config";

import LocationInfoBox from "../LocationInfoBox";

const customIcon = (opts) =>
  Object.assign(
    {
      path:
        "M39.27,58.64a4.74,4.74,0,1,1,9.47,0V93.72a4.74,4.74,0,1,1-9.47,0V58.64Zm63.6-19.86L98,103a22.29,22.29,0,0,1-6.33,14.1,19.41,19.41,0,0,1-13.88,5.78h-45a19.4,19.4,0,0,1-13.86-5.78l0,0A22.31,22.31,0,0,1,12.59,103L7.74,38.78H0V25c0-3.32,1.63-4.58,4.84-4.58H27.58V10.79A10.82,10.82,0,0,1,38.37,0H72.24A10.82,10.82,0,0,1,83,10.79v9.62h23.35a6.19,6.19,0,0,1,1,.06A3.86,3.86,0,0,1,110.59,24c0,.2,0,.38,0,.57V38.78Zm-9.5.17H17.24L22,102.3a12.82,12.82,0,0,0,3.57,8.1l0,0a10,10,0,0,0,7.19,3h45a10.06,10.06,0,0,0,7.19-3,12.8,12.8,0,0,0,3.59-8.1L93.37,39ZM71,20.41V12.05H39.64v8.36ZM61.87,58.64a4.74,4.74,0,1,1,9.47,0V93.72a4.74,4.74,0,1,1-9.47,0V58.64Z",
      fillColor: "#34495e",
      fillOpacity: 1,
      strokeColor: "#000",
      strokeWeight: 1,
      scale: 0.15,
    },
    opts
  );

class MapDirectionsRenderer extends Component {
  state = {
    directions: null,
    error: null,
  };

  componentDidMount() {
    const { places, travelMode } = this.props;

    const waypoints = places.map((p) => ({
      location: { lat: p.latitude, lng: p.longitude },
      stopover: true,
    }));
    const origin = waypoints.shift().location;
    const destination = waypoints.pop().location;

    const directionsService = new google.maps.DirectionsService();
    directionsService.route(
      {
        origin: origin,
        destination: destination,
        travelMode: travelMode,
        waypoints: waypoints,
      },
      (result, status) => {
        console.log(result, status);
        if (status === google.maps.DirectionsStatus.OK) {
          this.setState({
            directions: result,
          });
        } else {
          this.setState({ error: result });
        }
      }
    );
  }

  render() {
    console.log(this.state.error);
    if (this.state.error) {
      return <h1>{this.state.error}</h1>;
    }
    return (
      this.state.directions && (
        <DirectionsRenderer directions={this.state.directions} />
      )
    );
  }
}

const CustomMap = (props) => {
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [markerMap, setMarkerMap] = useState(
    props.markers.reduce((acc, val) => {
      acc[val.id] = val;
      return acc;
    }, {})
  );
  const [center, setCenter] = useState(props.defaultCenter);
  const [zoom, setZoom] = useState(props.defaultZoom);
  const [clickedLatLng, setClickedLatLng] = useState(null);
  const [infoOpen, setInfoOpen] = useState(false);

  const markerClickHandler = (event, place) => {
    setSelectedPlace(place);

    // Required so clicking a 2nd marker works as expected
    if (infoOpen) {
      setInfoOpen(false);
    }

    setInfoOpen(true);

    // If you want to zoom in a little on marker click
    if (zoom < 13) {
      setZoom(13);
    }

    // if you want to center the selected Marker
    setCenter(place.pos);
  };

  return (
    <GoogleMap
      defaultCenter={center}
      defaultZoom={zoom}
      center={center}
      zoom={zoom}
      options={{
        styles: config.mapStyles,
      }}
    >
      {props.markers.map((place) => {
        return (
          <Marker
            key={place.id}
            position={place.pos}
            icon={customIcon({
              fillColor: place.color,
              strokeColor: "transparent",
            })}
            onClick={(event) => markerClickHandler(event, place)}
          />
        );
      })}
      {/* <MapDirectionsRenderer
      places={props.markers}
      travelMode={google.maps.TravelMode.DRIVING}
    /> */}
      {infoOpen && selectedPlace && (
        <LocationInfoBox
          place={selectedPlace}
          onCloseClick={() => setInfoOpen(false)}
          position={markerMap[selectedPlace.id].pos}
        />
      )}
    </GoogleMap>
  );
};

const Map = withScriptjs(withGoogleMap(CustomMap));

export default Map;
