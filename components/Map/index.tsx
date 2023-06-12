import { geoLocation } from '@/types';
import React from 'react'
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import { LatLngExpression } from "leaflet";
import "leaflet/dist/leaflet.css";
type props ={
    geoLocation:geoLocation,
    location:string
}
function Map({location,geoLocation}:props) {
    if(typeof window === 'undefined'){
        return null;
    }
    const position = [+geoLocation.lat,+geoLocation.lng]
  return (
    <div className="w-full h-[200px] overflow-x-hidden mb-3 lg:md-[400px]">
    <MapContainer  center={position as LatLngExpression}   zoom={15} scrollWheelZoom={false} >
<TileLayer
  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
/>
<Marker position={position}>
  <Popup>
    {location}
  </Popup>
</Marker>
</MapContainer>
</div>
  )
}

export default Map
