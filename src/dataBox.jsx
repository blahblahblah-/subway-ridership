import React from 'react';
import { Segment, Header, Dimmer, Loader } from "semantic-ui-react";

import OverallDetails from './overallDetails';
import StationDetails from './stationDetails';

import timestamp from './data/timestamp.json';

class DataBox extends React.Component {
  componentDidUpdate(prevProps) {
    const { selectedDate, selectedStation, compareWithDate } = this.props;
    if (prevProps.selectedStation !== selectedStation || prevProps.compareWithDate !== compareWithDate) {
      this.dataBox.scrollTop = 0;
    }
  }

  render() {
    const {
      nyct,
      sir,
      rit,
      pth,
      jfk,
      isMobile,
      isDataLoaded,
      handleToggle,
      handleSelectStation,
      mode,
      selectedStation,
      selectedStationObj,
      selectedDate,
      selectedDateObj,
      compareWithDate,
      compareWithDateObj,
      firstYear,
      lastYear,
      handleBack,
      handleGraphClick
    } = this.props;
    return (
      <Segment inverted vertical className="databox" onUpdate={this.handleOnUpdate}>
        {
          !isDataLoaded &&
          <Dimmer active>
            <Loader inverted></Loader>
          </Dimmer>
        }
        <div className='inner-databox' ref={el => this.dataBox = el}>
          <Segment>
            { selectedStation && selectedStationObj ?
                <StationDetails isMobile={isMobile} handleBack={handleBack}
                  selectedStation={selectedStation} selectedStationObj={selectedStationObj}
                  selectedDate={selectedDate}
                  compareWithDate={compareWithDate}
                  firstYear={firstYear} lastYear={lastYear}
                  handleGraphClick={handleGraphClick} /> :
                <OverallDetails isMobile={isMobile} nyct={nyct} sir={sir} rit={rit} pth={pth} jfk={jfk} mode={mode}
                  selectedDate={selectedDate} selectedDateObj={selectedDateObj}
                  compareWithDate={compareWithDate} compareWithDateObj={compareWithDateObj}
                  firstYear={firstYear} lastYear={lastYear}
                  handleSelectStation={handleSelectStation} handleToggle={handleToggle} handleGraphClick={handleGraphClick} />
             }
          </Segment>
          <Header inverted as='h5' floated='left' style={{margin: "10px 5px"}}>
            Last updated {timestamp && (new Date(timestamp)).toLocaleTimeString('en-US')}.<br />
            Uses dataset from <a href='https://qri.cloud/nyc-transit-data/turnstile_daily_counts_2020' target='_blank'>NYC Subway Turnstile Counts</a> on qri.<br />
            Created by <a href='https://sunny.ng' target='_blank'>Sunny Ng</a>.<br />
            <a href='https://github.com/blahblahblah-/subway-ridership' target='_blank'>Source code</a>.
          </Header>
        </div>
      </Segment>
    )
  }
}

export default DataBox;