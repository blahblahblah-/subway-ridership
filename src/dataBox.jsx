import React from 'react';
import { Segment, Header, Dimmer, Loader } from "semantic-ui-react";

import OverallDetails from './overallDetails';
import StationDetails from './stationDetails';

import timestamp from './data/timestamp.json';

class DataBox extends React.Component {
  componentDidUpdate(prevProps) {
    const { selectedStation } = this.props;
    if (prevProps.selectedStation !== selectedStation) {
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
      durationMode,
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
      handleGraphClick,
      handleYearChange,
    } = this.props;
    return (
      <Segment inverted vertical className="databox">
        {
          !isDataLoaded &&
          <Dimmer active>
            <Loader inverted></Loader>
          </Dimmer>
        }
        <div className='inner-databox' ref={el => this.dataBox = el}>
          <Segment>
            { selectedStation && selectedStationObj ?
                <StationDetails isMobile={isMobile}
                  selectedStation={selectedStation} selectedStationObj={selectedStationObj}
                  selectedDate={selectedDate} durationMode={durationMode}
                  compareWithDate={compareWithDate}
                  firstYear={firstYear} lastYear={lastYear}
                  handleYearChange={handleYearChange} handleBack={handleBack}
                  handleGraphClick={handleGraphClick} /> :
                <OverallDetails isMobile={isMobile} nyct={nyct} sir={sir} rit={rit} pth={pth} jfk={jfk} mode={mode} durationMode={durationMode}
                  selectedDate={selectedDate} selectedDateObj={selectedDateObj}
                  compareWithDate={compareWithDate} compareWithDateObj={compareWithDateObj}
                  firstYear={firstYear} lastYear={lastYear}
                  handleYearChange={handleYearChange}
                  handleSelectStation={handleSelectStation} handleToggle={handleToggle} handleGraphClick={handleGraphClick} />
             }
          </Segment>
          <Header inverted as='h5' floated='left' style={{margin: "10px 5px"}}>
            Last updated {timestamp && (new Date(timestamp)).toLocaleString('en-US')}.<br />
            Uses dataset from <a href='https://qri.cloud/nyc-transit-data/turnstile_daily_counts_2020' target='_blank' rel="noopener noreferrer">NYC Subway Turnstile Counts</a> on qri.<br />
            Created by <a href='https://sunny.ng' target='_blank' rel="noopener noreferrer">Sunny Ng</a>.<br />
            <a href='https://github.com/blahblahblah-/subway-ridership' target='_blank' rel="noopener noreferrer">Source code</a>.
          </Header>
        </div>
      </Segment>
    )
  }
}

export default DataBox;