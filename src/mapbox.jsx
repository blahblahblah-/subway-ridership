import React from 'react';
import mapboxgl from 'mapbox-gl';
import { debounce } from 'lodash';
import { Responsive } from 'semantic-ui-react';
import moment from 'moment';

import ConfigBox from './configBox';
import DataBox from './dataBox';

import stations from './data/stations.json';
import overall from './data/overall.json';

const center = [-73.9905, 40.73925];
const dates = Object.keys(overall['NYCT']).sort();
const firstDate = dates[0];
const lastDate = dates[dates.length - 2];
const firstYear = moment(firstDate).year();
const lastYear = moment(lastDate).year();

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_KEY;

class Mapbox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedDate: lastDate,
      selectedDateObj: null,
      selectedStation: null,
      selectedStationObj: null,
      mode: 'entries',
      compareWithAnotherDate: false,
      compareWithDate: moment(lastDate).subtract(52, 'week').format('YYYY-MM-DD'),
      compareWithDateObj: null,
      nyct: true,
      sir: false,
      rit: false,
      pth: false,
      jfk: false,
      isDataBoxVisible: true,
      isDataLoaded: false,
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
    const { selectedDate, compareWithDate, compareWithAnotherDate } = this.state;

    import(`./data/dates/${selectedDate}.json`)
      .then(data => {
        if (compareWithAnotherDate) {
          import(`./data/dates/${compareWithDate}.json`)
            .then(compareWithData => {
               this.setState({ selectedDateObj: data, compareWithDateObj: compareWithData, isDataLoaded: true}, this.updateMap);
            });
        } else {
          this.setState({ selectedDateObj: data, compareWithDateObj: null, isDataLoaded: true}, this.updateMap);
        }
      });
  }

  selectStation() {
    const { selectedStation } = this.state;

    import(`./data/complexId/${selectedStation}.json`)
      .then(data => {
        this.setState({ selectedStationObj: data, isDataLoaded: true}, this.navigateToStation);
      });
  }

  navigateToStation() {
    const { selectedStation } = this.state;

    this.map.easeTo({
      center: stations[selectedStation].coordinates,
      zoom: 15,
      bearing: 29,
    });
  }

  updateMap() {
    const {
      selectedDateObj,
      compareWithAnotherDate,
      compareWithDateObj,
      mode,
      nyct,
      sir,
      rit,
      pth,
      jfk
    } = this.state;
    const filteredStations = Object.keys(stations).filter((s) => selectedDateObj[s]);
    const systems = {nyct, sir, rit, pth, jfk };
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
              "entries": this.getPassengerData(selectedDateObj, compareWithAnotherDate, compareWithDateObj, "entries", s),
              "exits": this.getPassengerData(selectedDateObj, compareWithAnotherDate, compareWithDateObj, "exits", s),
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
      10, ['max', ['min', ['/', ['get', mode], 5000], 5], 3],
      14, ['max', ['min', ['/', ['get', mode], 2000], 50], 5]
    ];

    if (compareWithAnotherDate) {
      circleRadiusValue = [
        'interpolate', ['linear'], ['zoom'],
        10, ['max', ['min', ['abs', ['/', ['get', mode], 10]], 20], 3],
        14, ['max', ['min', ['abs', ['/', ['get', mode], 5]], 50], 5]
      ];
    }

    let circleColorValue = '#54c8ff';

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
    this.setState({ selectedStation: station, isDataBoxVisible: true }, this.selectStation);
  }, 300, {
    'leading': true,
    'trailing': false
  });

  handleModeClick = (e, { name }) => this.setState({ mode: name }, this.refreshMap);

  handleDateInputChange = (event, {name, value}) => {
    const { compareWithDate } = this.state;

    if (this.state.hasOwnProperty(name) && value) {
      const newState = { [name]: value };
      if (name === 'selectedDate' || value === compareWithDate) {
        const newDate = moment(value);
        const nextYearToday = newDate.clone().add(52, 'week');

        if (newDate.year() !== firstYear) {
          newState['compareWithDate'] = newDate.subtract(52, 'week').format('YYYY-MM-DD');
        } else if (nextYearToday <= moment(lastDate)) {
          newState['compareWithDate'] = newDate.add(52, 'week').format('YYYY-MM-DD');
        } else if (value === compareWithDate) {
          newState['compareWithDate'] = newDate.add(1, 'day').format('YYYY-MM-DD');
        }
      }
      this.setState(newState, this.refreshMap);
    }
  }

  handleOnUpdate = (e, { width }) => {
    this.setState({ 'isMobile': width < Responsive.onlyTablet.minWidth });
  };

  handleToggle = (event, {name, value}) => {
    if (this.state.hasOwnProperty(name)) {
      const prevVal = this.state[name];
      this.setState({ [name]: !prevVal }, this.refreshMap);
    }
  }

  handleBack = () => {
    this.setState({ selectedStation: null });
  }

  handleSelectStation = (station) => {
    const { selectedStation } = this.state;
    if (selectedStation !== station) {
      this.setState({ selectedStation: station }, this.selectStation);
    }
  }

  handleToggleDataBox = () => {
    this.setState({ isDataBoxVisible: !this.state.isDataBoxVisible });
  }

  handleGraphClick = (date) => {
    const { compareWithDate } = this.state;
    const newState = { selectedDate: date };
    const newDate = moment(date);
    const nextYearToday = newDate.clone().add(52, 'week');

    if (newDate.year() === 2020) {
      newState['compareWithDate'] = newDate.subtract(52, 'week').format('YYYY-MM-DD');
    } else if (nextYearToday <= moment(lastDate)) {
      newState['compareWithDate'] = newDate.add(52, 'week').format('YYYY-MM-DD');
    } else if (date === compareWithDate) {
      newState['compareWithDate'] = newDate.add(1, 'day').format('YYYY-MM-DD');
    }
    this.setState(newState, this.refreshMap);
  }

  render() {
    const {
      isMobile,
      isDataBoxVisible,
      isDataLoaded,
      selectedDate,
      selectedDateObj,
      selectedStation,
      selectedStationObj,
      mode,
      compareWithAnotherDate,
      compareWithDate,
      compareWithDateObj,
      nyct,
      sir,
      rit,
      pth,
      jfk
    } = this.state;
    return (
      <Responsive as='div' fireOnMount onUpdate={this.handleOnUpdate}>
        <div ref={el => this.mapContainer = el} className='mapbox'>
        </div>
        <ConfigBox mode={mode} handleModeClick={this.handleModeClick} isMobile={isMobile} latestDate={lastDate} selectedDate={selectedDate}
          compareWithAnotherDate={compareWithAnotherDate} handleToggle={this.handleToggle} compareWithDate={compareWithDate} handleToggleDataBox={this.handleToggleDataBox}
          handleDateInputChange={this.handleDateInputChange} />
        { (!isMobile || isDataBoxVisible) &&
          <DataBox nyct={nyct} sir={sir} rit={rit} pth={pth} jfk={jfk} mode={mode}
            selectedStation={selectedStation} selectedStationObj={selectedStationObj} isMobile={isMobile}
            selectedDate={selectedDate} selectedDateObj={selectedDateObj}
            compareWithDate={compareWithAnotherDate && compareWithDate} compareWithDateObj={compareWithAnotherDate && compareWithDateObj}
            firstYear={firstYear} lastYear={lastYear} handleToggle={this.handleToggle} isDataLoaded={isDataLoaded}
            handleSelectStation={this.handleSelectStation} handleBack={this.handleBack} handleGraphClick={this.handleGraphClick} />
          }
      </Responsive>
    )
  }
}

export default Mapbox;
