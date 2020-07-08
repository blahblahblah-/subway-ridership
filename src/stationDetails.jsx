import React from 'react';
import { Header, Button, Icon, Divider } from "semantic-ui-react";

import DetailsDate from './detailsDate';
import DetailsCompareDates from './detailsCompareDates';
import StationDetailsGraph from './stationDetailsGraph';
import StationRoutes from './stationRoutes';

import stations from './data/stations.json';
import byComplexId from './data/byComplexId.json';
import byComplexId2019 from './data/byComplexId_2019.json';

class StationDetails extends React.Component {
  render() {
    const { isMobile, selectedStation, handleBack, handleGraphClick, selectedDate, compareWithDate } = this.props;
    const complexData = Object.assign(Object.assign({}, byComplexId2019[selectedStation]), byComplexId[selectedStation]);
    return (
      <div className='station-details'>
        <div className='top'>
          <div>
            <Button icon onClick={handleBack} title="Back">
              <Icon name='arrow left' />
            </Button>
          </div>
          <div className='heading'>
            <Header as="h3">
              { stations[selectedStation].name }
            </Header>
            <StationRoutes station={stations[selectedStation]} />
          </div>
        </div>
        <Divider hidden />
        {
          compareWithDate ?
            <DetailsCompareDates isMobile={isMobile} data={complexData} selectedDate={selectedDate} compareWithDate={compareWithDate} /> :
            <DetailsDate isMobile={isMobile} data={complexData} selectedDate={selectedDate} />
        }
        <Divider horizontal>
          <Header size='medium'>Daily Counts in 2020</Header>
        </Divider>
        <StationDetailsGraph isMobile={isMobile} complexData={complexData} handleGraphClick={handleGraphClick} />
      </div>
    )
  }
}

export default StationDetails;