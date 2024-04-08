import React from 'react';
import {
  LEIPZIG_RED,
  LEIPZIG_YELLOW,
  LEIPZIG_PURPLE,
  LEIPZIG_WHITE_TEXT,
  LEIPZIG_BLACK_TEXT,
} from "./Color";

export const Bus70: React.FC = () => {
  return Bus(
    70,
    LEIPZIG_PURPLE,
    LEIPZIG_WHITE_TEXT,
    "matrix(.054182 0 0 .054182 1.2895 8.314)"
  );
}

export const Bus89: React.FC = () => {
  return Bus(
    89,
    LEIPZIG_PURPLE,
    LEIPZIG_WHITE_TEXT,
    "matrix(.054182 0 0 .054182 1.2895 8.314)"
  );
}

export const Tram9: React.FC = () => {
  return Tram(
    9,
    LEIPZIG_YELLOW,
    LEIPZIG_BLACK_TEXT,
    "matrix(0.054182,0,0,0.054182,3.3103626,8.3140139)"
  );
}

export const Tram10: React.FC = () => {
  return Tram(
    10,
    LEIPZIG_RED,
    LEIPZIG_WHITE_TEXT,
    "matrix(0.054182, 0, 0, 0.054182, 1.2022274, 8.3140139)"
  );
}

export const Tram11: React.FC = () =>{
  return Tram(
    11,
    LEIPZIG_RED,
    LEIPZIG_WHITE_TEXT,
    "matrix(0.054182, 0, 0, 0.054182, 1.2022274, 8.3140139)"
  );
}

export function Tram(tramNumber: number, tramColor: string, tramTextColor: string, textTransform: string): React.ReactElement {
  return (
    <svg width="40" height="40" version="1.1" viewBox="0 0 10.583 10.583">
      <rect
        width="10.583"
        height="10.583"
        style={{
          fill: tramColor,
          strokeLinecap: "round",
          strokeLinejoin: "bevel",
          strokeWidth: ".096855",
        }}
      />
      <text
        transform={textTransform}
        style={{
          fill: tramTextColor,
          fontFamily: "Noto Sans",
          fontSize: "156.26px",
          fontVariantCaps: "normal",
          fontVariantEastAsian: "normal",
          fontVariantLigatures: "normal",
          fontVariantNumeric: "normal",
          fontVariationSettings: "'wdth' 70, 'wght' 600",
          strokeLinecap: "round",
          strokeLinejoin: "bevel",
          whiteSpace: "pre",
        }}
      >
        <tspan x="0" y="0">
          {tramNumber}
        </tspan>
      </text>
    </svg>
  );
}

export function Bus(busNumber: number, busColor: string, busTextColor: string, textTransform: string): React.ReactElement {
  return (
    <svg
      width="40"
      height="40"
      version="1.1"
      viewBox="0 0 10.583 10.583"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        cx="5.2814"
        cy="5.2915"
        r="5.2915"
        style={{
          fill: busColor,
          fontVariationSettings: "'wdth' 70, 'wght' 600",
          strokeLinecap: "round",
          strokeLinejoin: "round",
          strokeWidth: ".37434",
        }}
      />
      <text
        transform="matrix(.054182 0 0 .054182 1.2895 8.314)"
        style={{
          fill: busTextColor,
          fontFamily: "Noto Sans",
          fontSize: "156.26px",
          fontVariantCaps: "normal",
          fontVariantEastAsian: "normal",
          fontVariantLigatures: "normal",
          fontVariantNumeric: "normal",
          fontVariationSettings: "'wdth' 70, 'wght' 600",
          strokeLinecap: "round",
          strokeLinejoin: "bevel",
          whiteSpace: "pre",
        }}
          >
        <tspan x="0" y="0">
          {busNumber}
        </tspan>
      </text>
    </svg>
  );
}