import { Marker } from 'react-leaflet';
import L from 'leaflet';

import nieper from "./Assets/Abbreviation/Nieper.png";
import lipsius from "./Assets/Abbreviation/Lipsius.png";
import geutebrueck from "./Assets/Abbreviation/Geutebrueck.png";
import foeppl from "./Assets/Abbreviation/Foeppl.png";
import eichendorfstrasse from "./Assets/Abbreviation/Eichendorfstrasse.png";
import gutenberg from "./Assets/Abbreviation/Gutenberg.png";
import medienzentrum from "./Assets/Abbreviation/Medienzentrum.png";
import bibliothek from "./Assets/Abbreviation/Bibliothek.png";
import zuse from "./Assets/Abbreviation/Zuse.png";
import treffts_a from "./Assets/Abbreviation/Treffts_A.png";
import treffts_b from "./Assets/Abbreviation/Treffts_B.png";
import treffts_c from "./Assets/Abbreviation/Treffts_C.png";
import treffts_l from "./Assets/Abbreviation/Treffts_L.png";

function BuildingAbbreviation(lat: number, lng: number, iconUrl: string, iconSize: [number, number] = [25, 25]) {
  return (
    <Marker
      position={new L.LatLng(lat, lng)}
      icon={new L.Icon({ iconUrl: iconUrl, iconSize: iconSize })}
    />
  );
}

export const Building = () => {
  return (
    <div>
      {BuildingAbbreviation(51.313231581288704, 12.37287883331203, nieper)}
      {BuildingAbbreviation(51.31319879585476, 12.373778157922914, lipsius)}
      {BuildingAbbreviation(51.31461006223731, 12.372551384319365, geutebrueck)}
      {BuildingAbbreviation(51.31434284662663, 12.372148540517315, foeppl)}
      {BuildingAbbreviation(
        51.31362514606505,
        12.372034291663653,
        eichendorfstrasse
      )}
      {BuildingAbbreviation(51.31243116113731, 12.374981180000901, gutenberg)}
      {BuildingAbbreviation(
        51.31238198598396,
        12.374326540797853,
        medienzentrum
      )}
      {BuildingAbbreviation(51.312492377572426, 12.373720461637419, bibliothek)}
      {BuildingAbbreviation(51.312444708125014, 12.375968173281649, zuse)}
      {BuildingAbbreviation(
        51.31284,
        12.375638756225442,
        treffts_a,
        [50, 25]
      )}
      {BuildingAbbreviation(
        51.3132261337642,
        12.376044146921913,
        treffts_b,
        [50, 25]
      )}
      {BuildingAbbreviation(
        51.31346,
        12.375919720074506,
        treffts_c,
        [50, 25]
      )}
      {BuildingAbbreviation(
        51.313119597020204,
        12.375229639323209,
        treffts_l,
        [50, 25]
      )}
    </div>
  );
};
