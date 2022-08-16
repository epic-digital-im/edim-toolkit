import React from 'react'

import {
  InfoWindow,
  InfoWindowProps
} from "react-google-maps";

import { useContainer as useRoutes } from '../store/events';

interface LocationInfoBoxProps extends InfoWindowProps {
  place: { id: number; };
}

const LocationInfoBox = ({ place, ...rest }: LocationInfoBoxProps) => {
  const { route, places, properties } = useRoutes();

  console.log(properties);

  return (
    <InfoWindow {...rest}>
      <div>
        <h3>{place.id}</h3>
        <div>This is your info window content</div>
      </div>
    </InfoWindow>
  )
}

export default LocationInfoBox;
