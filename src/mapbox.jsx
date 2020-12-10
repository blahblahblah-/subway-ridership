import React from 'react';
import mapboxgl from 'mapbox-gl';
import { debounce } from 'lodash';
import { Responsive } from 'semantic-ui-react';
import moment from 'moment';
import { withRouter } from "react-router-dom";

import ConfigBox from './configBox';
import DataBox from './dataBox';

import stations from './data/stations.json';
import overall from './data/overall.json';

const center = [-73.9905, 40.73925];
const dates = Object.keys(overall['NYCT'].days).sort();
const weeks = Object.keys(overall['NYCT'].weeks).sort();
const firstDate = dates[0];
const lastDate = dates[dates.length - 1];
const firstYear = moment(firstDate).year();
const lastYear = moment(lastDate).year();

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_KEY;

class Mapbox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedDate: lastDate,
      selectedDateObj: null,
      durationMode: 'days',
      mode: 'entries',
      compareMode: 'percentOf',
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

  getPassengerData(dateObj, compareWithAnotherDate, compareMode, compareDateObj, fieldName, complexId) {
    if (!compareWithAnotherDate) {
      return dateObj[complexId][fieldName];
    }
    if (!dateObj[complexId] || !compareDateObj[complexId]) {
      return 0;
    }
    if (compareMode === 'percentOf') {
      return (dateObj[complexId][fieldName] / compareDateObj[complexId][fieldName]) * 100;
    }
    return ((dateObj[complexId][fieldName] - compareDateObj[complexId][fieldName]) / compareDateObj[complexId][fieldName]) * 100;
  }

  refreshMap() {
    const { selectedDate, compareWithDate, compareWithAnotherDate, durationMode } = this.state;

    import(`./data/${durationMode}/${selectedDate}.json`)
      .then(data => {
        if (compareWithAnotherDate) {
          import(`./data/${durationMode}/${compareWithDate}.json`)
            .then(compareWithData => {
               this.setState({ selectedDateObj: data, compareWithDateObj: compareWithData, isDataLoaded: true}, this.updateMap);
            });
        } else {
          this.setState({ selectedDateObj: data, compareWithDateObj: null, isDataLoaded: true}, this.updateMap);
        }
      });
  }

  updateMap() {
    const {
      selectedDateObj,
      compareWithAnotherDate,
      compareMode,
      compareWithDateObj,
      durationMode,
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
              "entries": this.getPassengerData(selectedDateObj, compareWithAnotherDate, compareMode, compareWithDateObj, "entries", s),
              "exits": this.getPassengerData(selectedDateObj, compareWithAnotherDate, compareMode, compareWithDateObj, "exits", s),
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

    let displayFactor = 1;

    if (durationMode === 'weeks') {
      displayFactor = 7;
    } else if (durationMode === 'months') {
      displayFactor = 30
    }

    let circleRadiusValue = [
      'interpolate', ['linear'], ['zoom'],
      10, ['max', ['min', ['/', ['get', mode], 5000 * displayFactor], 5], 3],
      14, ['max', ['min', ['/', ['get', mode], 2000 * displayFactor], 50], 5]
    ];

    if (compareWithAnotherDate) {
      if (compareMode === 'percentOf') {
        circleRadiusValue = [
          'interpolate', ['linear'], ['zoom'],
          10, ['max', ['min', ['abs', ['/', ['get', mode], 5]], 40], 3],
          14, ['max', ['min', ['abs', ['/', ['get', mode], 2]], 100], 5]
        ];
      } else {
        circleRadiusValue = [
          'interpolate', ['linear'], ['zoom'],
          10, ['max', ['min', ['abs', ['/', ['get', mode], 10]], 20], 3],
          14, ['max', ['min', ['abs', ['/', ['get', mode], 5]], 50], 5]
        ];
      }
    }

    let circleColorValue = '#54c8ff';

    if (compareWithAnotherDate && compareMode === 'diffPercent') {
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
    this.props.history.push(`/stations/${station}`);
    this.setState({ isDataBoxVisible: true });
  }, 300, {
    'leading': true,
    'trailing': false
  });

  handleModeClick = (e, { name }) => this.setState({ mode: name }, this.refreshMap);

  handleDurationModeClick = (e, { name }) => {
    const { selectedDate, compareWithDate } = this.state;
    let newDate = selectedDate;
    let newCompareWithDate = compareWithDate;

    if (name === 'weeks') {
      newDate = moment(selectedDate).endOf('week').subtract(1, 'day').format('YYYY-MM-DD');
      newCompareWithDate = moment(compareWithDate).endOf('week').subtract(1, 'day').format('YYYY-MM-DD');
    } else if (name === 'months') {
      newDate = moment(selectedDate).startOf('month').format('YYYY-MM-DD');
      newCompareWithDate = moment(compareWithDate).startOf('month').format('YYYY-MM-DD');
    }
    this.setState({ durationMode: name, selectedDate: newDate, compareWithDate: newCompareWithDate }, this.refreshMap);
  }

  handleDateInputChange = (date) => {
    const dateObj = moment(date);
    this.selectDate(dateObj.format('YYYY-MM-DD'));
  }

  handleCompareDateInputChange = (date) => {
    const dateObj = moment(date);
    this.setState({compareWithDate: dateObj.format('YYYY-MM-DD')}, this.refreshMap);
  }

  handleYearChange = (e, { value }) => {
    const { selectedDate, durationMode } = this.state;
    const lastDateObj = moment(lastDate);
    let newDate = moment(selectedDate).year(value);

    if (newDate > lastDateObj) {
      newDate = lastDateObj
    }

    if (durationMode === 'weeks') {
      newDate.endOf('week').subtract(1, 'day');
    } else if (durationMode === 'months') {
      newDate.startOf('month');
    }

    this.selectDate(newDate.format('YYYY-MM-DD'));
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

  handleCompareModeChange = (e, { name, value }) => {
    this.setState({ compareMode: value }, this.refreshMap);
  };

  handleToggleDataBox = () => {
    this.setState({ isDataBoxVisible: !this.state.isDataBoxVisible });
  }

  handleGraphClick = (date) => {
    this.selectDate(date);
  }

  handleStationChange = (stationId) => {
    this.map.easeTo({
      center: stations[stationId].coordinates,
      bearing: 29,
    });
  }

  selectDate = (date) => {
    const { durationMode } = this.state;
    const newDate = moment(date);

    if (!newDate.isValid()) {
      return;
    }

    const newState = { selectedDate: moment(date).format('YYYY-MM-DD') };
    const nextYearToday = newDate.clone().add(52, 'week');

    if (newDate.year() !== firstYear) {
      if (durationMode === 'months') {
        newState['compareWithDate'] = newDate.subtract(1, 'year').format('YYYY-MM-DD');
      } else {
        newState['compareWithDate'] = newDate.subtract(52, 'week').format('YYYY-MM-DD');
      }
    } else if (nextYearToday <= moment(lastDate)) {
      if (durationMode === 'months') {
        newState['compareWithDate'] = newDate.add(1, 'year').format('YYYY-MM-DD');
      } else {
        newState['compareWithDate'] = newDate.add(52, 'week').format('YYYY-MM-DD');
      }
    } else {
      if (durationMode === 'months') {
        newState['compareWithDate'] = newDate.add(1, 'month').format('YYYY-MM-DD');
      } else if (durationMode === 'weeks') {
        newState['compareWithDate'] = newDate.add(1, 'week').format('YYYY-MM-DD');
      } else {
        newState['compareWithDate'] = newDate.add(1, 'day').format('YYYY-MM-DD');
      }
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
      durationMode,
      mode,
      compareWithAnotherDate,
      compareMode,
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
        <ConfigBox mode={mode} weeks={weeks} durationMode={durationMode} handleModeClick={this.handleModeClick} handleDurationModeClick={this.handleDurationModeClick}
          isMobile={isMobile} firstDate={firstDate} lastDate={lastDate} selectedDate={selectedDate}
          compareWithAnotherDate={compareWithAnotherDate} compareMode={compareMode} handleCompareModeChange={this.handleCompareModeChange}
          handleToggle={this.handleToggle} compareWithDate={compareWithDate} handleToggleDataBox={this.handleToggleDataBox}
          handleDateInputChange={this.handleDateInputChange} handleCompareDateInputChange={this.handleCompareDateInputChange} />
        { (!isMobile || isDataBoxVisible) &&
          <DataBox nyct={nyct} sir={sir} rit={rit} pth={pth} jfk={jfk} mode={mode} durationMode={durationMode}
            isMobile={isMobile}
            selectedDate={selectedDate} selectedDateObj={selectedDateObj}
            compareWithDate={compareWithAnotherDate && compareWithDate} compareMode={compareWithAnotherDate && compareMode}
            compareWithDateObj={compareWithAnotherDate && compareWithDateObj}
            firstYear={firstYear} lastYear={lastYear} handleToggle={this.handleToggle} isDataLoaded={isDataLoaded}
            handleYearChange={this.handleYearChange}
            handleStationChange={this.handleStationChange} handleGraphClick={this.handleGraphClick} />
          }
      </Responsive>
    )
  }
}

export default withRouter(Mapbox);
