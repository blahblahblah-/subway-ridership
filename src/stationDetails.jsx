import React from 'react';
import { Header, Label, Button, Icon, Divider } from "semantic-ui-react";

import TrainBullet from './trainBullet';
import DetailsDate from './detailsDate';
import DetailsCompareDates from './detailsCompareDates';
import StationDetailsGraph from './stationDetailsGraph';

import stations from './data/stations.json';
import byComplexId from './data/byComplexId.json';

class StationDetails extends React.Component {
  render() {
    const { selectedStation, handleBack, selectedDate, compareWithDate } = this.props;
    const complexData = byComplexId[selectedStation];
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
            <div className='trains'>
              { stations[selectedStation].system === 'NYCT' && stations[selectedStation].routes.map((r) => {
                return (
                  <TrainBullet name={r} key={r} size='small' />
                )
              })}
              {
                stations[selectedStation].system === 'SIR' &&
                <Label color='blue' horizontal>SIR</Label>
              }
              {
                stations[selectedStation].system === 'RIT' &&
                <Label color='red' horizontal>Roosevelt Island Tramway</Label>
              }
              {
                stations[selectedStation].system === 'JFK' &&
                <Label color='black' horizontal>AirTrain JFK</Label>
              }
              {
                stations[selectedStation].system === 'PTH' &&
                <Label color='yellow' horizontal>PATH</Label>
              }
             </div>
          </div>
        </div>
        <Divider hidden />
        {
          compareWithDate ? <DetailsCompareDates data={complexData} selectedDate={selectedDate} compareWithDate={compareWithDate} /> : <DetailsDate data={complexData} selectedDate={selectedDate} />
        }
        <Divider horizontal>
          <Header size='medium'>Daily Counts in 2020</Header>
        </Divider>
        <StationDetailsGraph complexData={complexData} />
      </div>
    )
  }
}

export default StationDetails;