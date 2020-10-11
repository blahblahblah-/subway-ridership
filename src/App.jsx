import React from 'react';
import Mapbox from './mapbox.jsx'
import { BrowserRouter as Router } from 'react-router-dom'
import { Helmet } from "react-helmet";

import './App.scss';

function App() {
  return (
    <Router>
      <Helmet>
        <title>NYC Subway Ridership - Based on turnstile usage data, updated weekly</title>
        <meta property="og:url" content="https://www.subwayridership.nyc" />
        <meta name="twitter:url" content="https://www.subwayridership.nyc" />
        <link rel="canonical" href="https://www.subwayridership.nyc" />
        <meta property="og:title" content="NYC Subway Ridership - Based on turnstile usage data, updated weekly" />
        <meta name="twitter:title" content="NYC Subway Ridership - Based on turnstile usage data, updated weekly" />
        <meta
      name="description"
      content="Visualization of NYC Subway daily ridership using MTA turnstile usage data, updated weekly. See the effects of the Covid-19 pandemic on transit usage."
    />
        <meta property="og:description" content="Visualization of NYC Subway daily ridership using MTA turnstile usage data, updated weekly. See the effects of the Covid-19 pandemic on transit usage." />
        <meta name="twitter:description" content="Visualization of NYC Subway daily ridership using MTA turnstile usage data, updated weekly. See the effects of the Covid-19 pandemic on transit usage." />
      </Helmet>
      <Mapbox />
    </Router>
  );
}

export default App;
