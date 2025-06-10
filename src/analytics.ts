// src/analytics.ts
import ReactGA from "react-ga4";

export const initGA = () => {
  ReactGA.initialize("G-8DNPCFJZJH"); // Replace with your Measurement ID
};

export const logEvent = (name: string, params: any = {}) => {
  ReactGA.event(name, params);
};

export const logPageView = (path: string) => {
  ReactGA.send({ hitType: "pageview", page: path });
};
