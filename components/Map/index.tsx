import { geoLocation } from "@/types";
import {useState, useEffect} from "react";
import { LatLngExpression } from "leaflet";
import "leaflet/dist/leaflet.css";
import dynamic from "next/dynamic";

const MapContainer = dynamic(() => import("react-leaflet").then((mod) => mod.MapContainer), {
  ssr: false,
});

const Marker = dynamic(() => import("react-leaflet").then((mod) => mod.Marker), {
  ssr: false,
});

const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), {
  ssr: false,
});

const TileLayer = dynamic(() => import("react-leaflet").then((mod) => mod.TileLayer), {
  ssr: false,
});
type props = {
  geoLocation: geoLocation;
  location: string;
};
function Map({ location, geoLocation }: props) {
  const [client, setClient] = useState(false);

  useEffect(() => {
    setClient(true);
  }, []);

  if (!client) {
    return null;
  }
  const position = [+geoLocation.lat, +geoLocation.lng];
  return (
    <div className="w-full h-[200px] overflow-x-hidden mb-3 lg:md-[400px]">
      <MapContainer
        center={position as LatLngExpression}
        zoom={15}
        scrollWheelZoom={false}
        style={{height:'200px'}}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position as LatLngExpression}>
          <Popup>{location}</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}

export default Map;
