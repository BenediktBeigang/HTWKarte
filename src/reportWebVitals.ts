import type { Metric } from "web-vitals";

const reportWebVitals = (onPerfEntry?: (metric: Metric) => void): void => {
  if (typeof onPerfEntry === "function") {
    import("web-vitals").then(({ onCLS, onFID, onFCP, onLCP, onTTFB, onINP }) => {
      onCLS(onPerfEntry);
      onFID(onPerfEntry);
      onFCP(onPerfEntry);
      onLCP(onPerfEntry);
      onTTFB(onPerfEntry);
      onINP(onPerfEntry);
    });
  }
};

export default reportWebVitals;
