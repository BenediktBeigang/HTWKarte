import React from 'react';
import './App.css';
import { MapContainer, TileLayer, SVGOverlay, LayerGroup, Polygon} from 'react-leaflet';
import L, { TileLayerOptions } from 'leaflet';
import Building from './Building';

const MIN_ZOOM = 17.5 as const;
const MAX_ZOOM = 18 as const;

function App() {
  // let map = L.map('map', {crs: L.CRS.Simple});
  
  const corner1 = L.latLng(51.3159159, 12.3714126);
  const corner2 = L.latLng(51.3115960, 12.3789587);
  const bounds = L.latLngBounds(corner1, corner2);

  const handleBuildingClick = () => {
    alert('Building clicked!');
  }

  const pathOf_lipsius : string = "m 122.5239,103.84729 2.89939,-0.0177 0.003,-0.30483 7.40087,0.15242 0.0213,0.3757 2.97734,0.0213 0.0781,0.43952 24.79717,0.5104 -0.11346,9.91746 -25.54148,-0.42536 -0.63802,-0.51039 -1.25541,-0.003 -1.1948,1.07283 -0.0257,1.45731 0.39394,0.29996 -0.24345,13.69775 0.35838,0.0178 -0.0538,4.59202 c 0,0 1.00641,1.07641 1.00641,3.24339 0,2.15198 -1.12029,3.24339 -1.12029,3.24339 l -0.0538,4.88274 -0.39457,-0.0102 -0.23417,13.66489 -0.31118,0.2514 10e-4,1.47451 1.19634,1.14419 1.40361,-0.002 0.47388,-0.36188 3.17192,0.0204 -0.0667,9.87849 -2.90302,-0.076 v 0.49977 l -2.87455,-0.008 -0.003,0.22682 -2.12668,-0.0213 v 0.26937 l -3.04117,-0.0568 -0.008,-0.29065 -2.28265,-0.008 0.008,-0.27648 -2.84975,0.0355 0.38175,-26.5249 -1.985,-0.0101 0.009,-3.26375 0.61454,-0.001 v -0.13584 h 0.21736 v -1.57135 l -0.41114,-0.003 v -0.43952 l 0.41114,-0.003 v -1.38589 h -0.41114 v -0.43241 h 0.41114 v -1.54894 h -0.41114 v -0.42534 h 0.41114 v -1.39298 h -0.41114 v -0.42888 h 0.41114 l 0.008,-1.51703 h -0.33672 v -0.30838 H 120.093 v -3.08371 h 1.97074 z"
  const pathOf_nieper : string = "m 75.75182,103.96435 16.499018,0.26324 -1.238033,67.13513 -16.565911,-0.29131 z";

  return (
    <MapContainer
      id="MapContainer"
      center={[51.313, 12.375]}
      
      zoom={MIN_ZOOM}
      // minZoom={MIN_ZOOM}
      // maxZoom={MAX_ZOOM}
      // maxBounds={bounds}
      maxBoundsViscosity={3}>

      <TileLayer 
        attribution='&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
      />

      {/* <Polygon positions={[0,0]} /> */}

      <SVGOverlay 
        bounds={bounds}
        pane="overlayPane"
        interactive = {true}>
        <Building onClick={() => handleBuildingClick} path={pathOf_lipsius} />
        <Building onClick={() => handleBuildingClick} path={pathOf_nieper} />
      </SVGOverlay>

    </MapContainer>
  );
}

export default App;
