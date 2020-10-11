import React from 'react';
import { Segment, Header, Dimmer, Loader } from "semantic-ui-react";
import { Route, Switch, Redirect } from "react-router-dom";

import OverallDetails from './overallDetails';
import StationDetails from './stationDetails';

import stations from './data/stations.json';
import timestamp from './data/timestamp.json';

class DataBox extends React.Component {
  handleStationChange = (stationId) => {
    const { handleStationChange } = this.props;
    if (this.dataBox) {
      this.dataBox.scrollTop = 0;
    }
    handleStationChange(stationId);
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
      durationMode,
      mode,
      selectedDate,
      selectedDateObj,
      compareWithDate,
      compareWithDateObj,
      firstYear,
      lastYear,
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
            <Switch>
              <Route path='/stations/:stationId' render={(props) => {
                if (stations[props.match.params.stationId]) {
                  return (
                    <StationDetails isMobile={isMobile}
                      selectedDate={selectedDate} durationMode={durationMode} stationId={props.match.params.stationId}
                      compareWithDate={compareWithDate}
                      firstYear={firstYear} lastYear={lastYear}
                      handleYearChange={handleYearChange}
                      handleStationChange={this.handleStationChange}
                      handleGraphClick={handleGraphClick} />
                    );
                }
                return (<Redirect to="/" />);
              }} />
              <Route exact path={['/', '/stations']} render={() => (
                <OverallDetails isMobile={isMobile} nyct={nyct} sir={sir} rit={rit} pth={pth} jfk={jfk} mode={mode} durationMode={durationMode}
                  selectedDate={selectedDate} selectedDateObj={selectedDateObj}
                  compareWithDate={compareWithDate} compareWithDateObj={compareWithDateObj}
                  firstYear={firstYear} lastYear={lastYear}
                  handleYearChange={handleYearChange}
                  handleToggle={handleToggle} handleGraphClick={handleGraphClick} />
              )} />
              <Redirect to="/" />
            </Switch>
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