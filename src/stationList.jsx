import React from 'react';
import { List, Header } from "semantic-ui-react";

import StationRoutes from './stationRoutes';

import byDate from './data/byDate.json';
import stations from './data/stations.json';

class StationList extends React.Component {
  getData(station) {
    const { selectedDate, compareWithDate, mode } = this.props;
    if (!compareWithDate) {
      return byDate[selectedDate][station][mode];
    }
    const compareWith = byDate[compareWithDate][station][mode];
    const selected = byDate[selectedDate][station][mode];
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

  handleClick = (e) => {
    const { handleSelectStation } = this.props;
    handleSelectStation(e.target.getAttribute('data-station-id'))
  }

  renderListItems() {
    const { nyct, sir, rit, pth, jfk, selectedDate, compareWithDate } = this.props;
    const systems = {NYCT: nyct, SIR: sir, RIT: rit, PTH: pth, JFK: jfk };

    return Object.keys(stations).filter((station) => {
      return systems[stations[station].system] && byDate[selectedDate][station] && (!compareWithDate || byDate[compareWithDate][station]);
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
    }).map((obj) => {
      const station = obj.id;
      const stationObj = stations[station];
      return (
        <List.Item key={station} className='station-list-item' onClick={this.handleClick} data-station-id={station}>
          <List.Content floated='left' className='station-name'>
            <Header as='h5'>
              { stationObj.name }
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

  render() {
    return (
      <List divided relaxed selection>
        { this.renderListItems() }
      </List>
    )
  }
}

export default StationList;