import React from 'react';
import { Segment, Header } from "semantic-ui-react";

import OverallDetails from './overallDetails';
import StationDetails from './stationDetails';

import timestamp from './data/timestamp.json';

class DataBox extends React.Component {
  render() {
    const { nyct, sir, rit, pth, jfk, handleToggle, selectedStation, selectedDate, compareWithDate, handleBack } = this.props;
    return (
      <Segment inverted vertical className="databox">
        <div className='inner-databox'>
          <Segment>
            { selectedStation ?
                <StationDetails handleBack={handleBack} selectedStation={selectedStation} selectedDate={selectedDate} compareWithDate={compareWithDate}  /> :
                <OverallDetails nyct={nyct} sir={sir} rit={rit} pth={pth} jfk={jfk} selectedDate={selectedDate} compareWithDate={compareWithDate} handleToggle={handleToggle} />
             }
          </Segment>
          <Header inverted as='h5' floated='left' style={{margin: "10px 5px"}}>
            Last updated {timestamp && (new Date(timestamp)).toLocaleTimeString('en-US')}.<br />
            Uses data from <a href='https://qri.cloud/nyc-transit-data/turnstile_daily_counts_2020' target='_blank'>NYC Subway Turnstile Counts</a> on Qri Cloud.<br />
            Created by <a href='https://sunny.ng' target='_blank'>Sunny Ng</a>.<br />
            <a href='https://github.com/blahblahblah-/subway-ridership' target='_blank'>Source code</a>.
          </Header>
        </div>
      </Segment>
    )
  }
}

export default DataBox;