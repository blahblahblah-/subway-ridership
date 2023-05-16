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
        <Message.Header>A note about the dataset</Message.Header>
        <p>
          This site uses MTA's turnstile usage dataset, which currently <a href="https://groups.google.com/g/mtadeveloperresources/c/UaMktsBMjX8" target="_blank">
          does not track OMNY taps</a> for entries. Considering using exit numbers to infer ridership instead.
        </p>
      </Message>
      <Mapbox />
    </Router>
  );
}

export default App;
