import React from 'react';
import mapboxgl from 'mapbox-gl';
import { debounce } from 'lodash';

import ConfigBox from './configBox';
import DataBox from './dataBox';

import byDate from './data/byDate.json';
import stations from './data/stations.json';

const center = [-73.9905, 40.73925];
const defaultCompareWithDate = '2020-03-04';

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_KEY;

class Mapbox extends React.Component {
  constructor(props) {
    const dates = Object.keys(byDate);
    const lastDate = dates[dates.length - 2];

    super(props);
    this.state = {
      latestDate: lastDate,
      selectedDate: lastDate,
      selectedStation: null,
      mode: 'entries',
      compareWithAnotherDate: false,
      compareWithDate: defaultCompareWithDate,
      nyct: true,
      sir: false,
      rit: false,
      pth: false,
      jfk: false
    }

  }

  componentDidMount() {
    this.map = new mapboxgl.Map({
      container: this.mapContainer,
      style: 'mapbox://styles/theweekendest/ck1fhati848311cp6ezdzj5cm?optimize=true',
      center: center,
      bearing: 29,
      minZoom: 9,
      zoom: 13,
      hash: false,
      maxBounds: [
        [-74.8113, 40.1797],
        [-73.3584, 41.1247]
      ],
      maxPitch: 0,
    });

    this.map.addControl(new mapboxgl.NavigationControl(), "bottom-right");

    this.map.on('load', () => {
      this.refreshMap();
    });
  }

  getPassengerData(dateObj, compareWithAnotherDate, compareDateObj, fieldName, complexId) {
    if (!compareWithAnotherDate) {
      return dateObj[complexId][fieldName];
    }
    if (!dateObj[complexId] || !compareDateObj[complexId]) {
      return 0;
    }
    return ((dateObj[complexId][fieldName] - compareDateObj[complexId][fieldName]) / compareDateObj[complexId][fieldName]) * 100
  }

  refreshMap() {
    const { selectedDate, compareWithAnotherDate, compareWithDate, mode, nyct, sir, rit, pth, jfk } = this.state;
    const dateObj = byDate[selectedDate]
    const compareDateObj = byDate[compareWithDate];
    const filteredStations = Object.keys(stations).filter((s) => dateObj[s]);
    const systems = {nyct: nyct, sir: sir, rit: rit, pth: pth, jfk: jfk };
    const visibleSystems = ['BLAH']; // There needs to be at least one value in the filter, or else Mapbox would just ignore it completely

    const geoJson = {
      "type": "geojson",
      "data": {
        "type": "FeatureCollection",
        "features": filteredStations.map((s) => {
          return {
            "type": "Feature",
            "properties": {
              "id": s,
              "entries": this.getPassengerData(dateObj, compareWithAnotherDate, compareDateObj, "entries", s),
              "exits": this.getPassengerData(dateObj, compareWithAnotherDate, compareDateObj, "exits", s),
              "system": stations[s].system,
            },
            "geometry": {
              "type": "Point",
              "coordinates": stations[s].coordinates
            }
          }
        })
      }
    };

    Object.keys(systems).forEach((s) => {
      if (systems[s]) {
        visibleSystems.push(s.toUpperCase());
      }
    });

    if (this.map.getSource('data')) {
      this.map.getSource('data').setData(geoJson.data);
    } else {
      this.map.addSource('data', geoJson);
    }

    let circleRadiusValue = [
      'interpolate', ['linear'], ['zoom'],
      10, ['max', ['min', ['/', ['get', mode], 5000], 5], 1],
      14, ['max', ['min', ['/', ['get', mode], 2000], 40], 3]
    ];

    if (compareWithAnotherDate) {
      circleRadiusValue = [
        'interpolate', ['linear'], ['zoom'],
        10, ['max', ['min', ['abs', ['/', ['get', mode], 10]], 20], 1],
        14, ['max', ['min', ['abs', ['/', ['get', mode], 5]], 40], 3]
      ];
    }

    let circleColorValue = '#2185d0';

    if (compareWithAnotherDate) {
      circleColorValue = [
        'case', ['>=', ['get', mode], 0], '#21ba45', '#db2828'
      ];
    }

    const circleOpacityValue = [
      'match', ['get', 'system'], visibleSystems, 0.5, 0
    ]

    if (this.map.getLayer('data')) {
      this.map.setPaintProperty('data', 'circle-radius', circleRadiusValue);
      this.map.setPaintProperty('data', 'circle-opacity', circleOpacityValue);
      this.map.setPaintProperty('data', 'circle-color', circleColorValue);
    } else {
      this.map.addLayer({
        'id': 'data',
        'type': 'circle',
        'source': 'data',
        'paint': {
          'circle-radius': circleRadiusValue,
          'circle-color': circleColorValue,
          'circle-opacity': circleOpacityValue
        },
      });
    }

    this.map.on('click', 'data', e => {
      this.debounceSelectStation(e.features[0].properties.id);
    });
    this.map.on('mouseenter', 'data', () => {
      this.map.getCanvas().style.cursor = 'pointer';
    });
    this.map.on('mouseleave', 'data', () => {
      this.map.getCanvas().style.cursor = '';
    });
  }

  debounceSelectStation = debounce((station) => {
    this.setState({ selectedStation: station }, this.refreshMap);
  }, 300, {
    'leading': true,
    'trailing': false
  });

  handleModeClick = (e, { name }) => this.setState({ mode: name }, this.refreshMap);

  handleDateInputChange = (event, {name, value}) => {
    const { compareWithDate } = this.state;

    if (this.state.hasOwnProperty(name) && value) {
      const newState = { [name]: value };
      if (name === 'selectedDate' && value === compareWithDate) {
        const newCompareWithDate = new Date(`${compareWithDate}Z-04:00`);
        newCompareWithDate.setDate(newCompareWithDate.getDate() - 1);
        if (value === '2020-01-01') {
          newCompareWithDate.setDate(newCompareWithDate.getDate() + 2);
        }
        newState['compareWithDate'] = newCompareWithDate.toISOString().split('T')[0];
      }
      this.setState(newState, this.refreshMap);
    }
  }

  handleToggle = (event, {name, value}) => {
    if (this.state.hasOwnProperty(name)) {
      const prevVal = this.state[name];
      this.setState({ [name]: !prevVal }, this.refreshMap);
    }
  }

  handleBack = () => {
    this.setState({ selectedStation: null }, this.refreshMap);
  }

  render() {
    const { latestDate, selectedDate, selectedStation, mode, compareWithAnotherDate, compareWithDate, nyct, sir, rit, pth, jfk } = this.state;
    return (
      <div>
        <div ref={el => this.mapContainer = el} className='mapbox'>
        </div>
        <ConfigBox mode={mode} handleModeClick={this.handleModeClick} latestDate={latestDate} selectedDate={selectedDate}
          compareWithAnotherDate={compareWithAnotherDate} handleToggle={this.handleToggle} compareWithDate={compareWithDate}
          handleDateInputChange={this.handleDateInputChange} />
        <DataBox nyct={nyct} sir={sir} rit={rit} pth={pth} jfk={jfk} selectedStation={selectedStation} selectedDate={selectedDate} compareWithDate={compareWithAnotherDate && compareWithDate} handleToggle={this.handleToggle} handleBack={this.handleBack} />
      </div>
    )
  }
}

export default Mapbox;
