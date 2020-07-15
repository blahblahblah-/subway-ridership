import React from 'react';
import { Header, Button, Icon, Divider, Dropdown } from "semantic-ui-react";
import moment from 'moment';

import DetailsDate from './detailsDate';
import DetailsCompareDates from './detailsCompareDates';
import StationDetailsGraph from './stationDetailsGraph';
import StationRoutes from './stationRoutes';
import { selectYearOptions } from './utils';

import stations from './data/stations.json';

class StationDetails extends React.Component {
  render() {
    const {
      isMobile,
      selectedDate,
      compareWithDate,
      selectedStation,
      selectedStationObj,
      firstYear,
      lastYear,
      handleBack,
      handleGraphClick,
      handleYearChange,
    } = this.props;
    const selectedYear = moment(selectedDate).year();
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
            <DetailsCompareDates isMobile={isMobile} selectedDate={selectedDate} selectedDateObj={selectedStationObj[selectedDate]}
            compareWithDate={compareWithDate} compareWithDateObj={selectedStationObj[compareWithDate]} /> :
            <DetailsDate isMobile={isMobile} data={selectedStationObj[selectedDate]} selectedDate={selectedDate} />
        }
        <Divider horizontal>
          <Header size='medium'>
            Daily Counts in&nbsp;
            <Dropdown inline options={selectYearOptions(firstYear, lastYear)} value={selectedYear} selectOnNavigation={false} onChange={handleYearChange} />
          </Header>
        </Divider>
        <StationDetailsGraph isMobile={isMobile} complexData={selectedStationObj} handleGraphClick={handleGraphClick} selectedYear={selectedYear} />
      </div>
    )
  }
}

export default StationDetails;