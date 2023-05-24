import React from 'react';
import Mapbox from './mapbox.jsx'
import { Message } from "semantic-ui-react";
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
      <Message color='black' className='toast'>
        <Message.Header>Sunsetting Notice</Message.Header>
        <p>
          This project was built around a dataset that <a href="https://groups.google.com/g/mtadeveloperresources/c/UaMktsBMjX8" target="_blank">
          excludes OMNY taps</a>. It is now outdated, and has outlived its usefulness. There are no plans to rebuild it with the new dataset, and this site is no longer maintained.
        </p>
      </Message>
      <Mapbox />
    </Router>
  );
}

export default App;
