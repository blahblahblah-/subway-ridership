import React from 'react';
import { List, Header, Input } from "semantic-ui-react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";

import StationRoutes from './stationRoutes';

import stations from './data/stations.json';

class StationList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      query: '',
    };
  }

  getData(station) {
    const { selectedDateObj, compareWithDate, compareWithDateObj, mode } = this.props;
    if (!compareWithDate) {
      return selectedDateObj[station][mode];
    }
    const compareWith = compareWithDateObj[station][mode];
    const selected = selectedDateObj[station][mode];
    return (selected - compareWith) / compareWith;
  }

  renderData(data) {
    const { compareWithDate } = this.props;

    if (!compareWithDate) {
      return (
        <List.Content floated='right' className='data'>
          { data.toLocaleString('en-US') }
        </List.Content>
      )
    }

    const className = data >= 0 ? 'data green' : ' data red';
    return (
      <List.Content floated='right' className={className}>
        { data >= 0 ? '+' : ''}{ Math.round(data * 10000) / 100}%
      </List.Content>
    )
  }

  renderListItems() {
    const { nyct, sir, rit, pth, jfk, selectedDateObj, compareWithDate, compareWithDateObj } = this.props;
    const { query } = this.state;
    const systems = {NYCT: nyct, SIR: sir, RIT: rit, PTH: pth, JFK: jfk };

    if (!selectedDateObj || (compareWithDate && !compareWithDateObj)) {
      return;
    }

    return Object.keys(stations).filter((station) => {
      return systems[stations[station].system] && selectedDateObj[station] && (!compareWithDate || compareWithDateObj[station]);
    }).map((station) => {
      return {
        id: station,
        data: this.getData(station)
      }
    }).sort((a, b) => {
      if (compareWithDate) {
        return a.data - b.data;
      }
      return b.data - a.data;
    }).map((obj, index) => {
      obj.rank = index + 1;
      return obj;
    }).filter((obj) => {
      return query.length < 1 || stations[obj.id].name.toUpperCase().includes(query.toUpperCase())
    }).map((obj) => {
      const station = obj.id;
      const stationObj = stations[station];
      return (
        <List.Item as={Link} key={station} className='station-list-item' data-station-id={station} to={`/stations/${station}`}>
          <List.Content floated='left' className='station-name'>
            <Header as='h5'>
              {obj.rank}. { stationObj.name }
            </Header>
          </List.Content>
          <List.Content floated='left'>
            <StationRoutes station={stationObj} />
          </List.Content>
          { this.renderData(obj.data) }
        </List.Item>
      );
    });
  }

  handleSearch = (e, data) => {
    this.setState({ query: data.value }, this.renderListItems);
  }

  render() {
    return (
      <div className='station-list'>
        <Helmet>
          <title>NYC Subway Ridership - Stations</title>
          <meta property="og:url" content="https://www.subwayridership.nyc/stations" />
          <meta name="twitter:url" content="https://www.subwayridership.nyc/stations" />
          <link rel="canonical" href="https://www.subwayridership.nyc/stations" />
          <meta property="og:title" content="NYC Subway Ridership - Stations" />
          <meta name="twitter:title" content="NYC Subway Ridership - Stations" />
          <meta
        name="description"
        content="List of New York City subway stations with their daily, weekly, and monthly ridership. Data derived from MTA turnstile usage data."
      />
          <meta property="og:description" content="List of New York City subway stations with their daily, weekly, and monthly ridership. Data derived from MTA turnstile usage data." />
          <meta name="twitter:description" content="List of New York City subway stations with their daily, weekly, and monthly ridership. Data derived from MTA turnstile usage data." />
        </Helmet>
        <Input icon='search' placeholder='Search...' onChange={this.handleSearch} className="station-search" />
        <List divided relaxed selection>
          { this.renderListItems() }
        </List>
      </div>
    )
  }
}

export default StationList;