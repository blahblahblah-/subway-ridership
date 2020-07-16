import React from 'react';
import { Divider, Header, Dropdown, Modal, Button, Icon, Responsive } from "semantic-ui-react";
import moment from 'moment';

import DetailsDate from './detailsDate';
import DetailsCompareDates from './detailsCompareDates';
import StationDetailsGraph from './stationDetailsGraph';
import StationRoutes from './stationRoutes';
import { selectYearOptions } from './utils';

import stations from './data/stations.json';

class StationDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      width: 0,
      height: 0,
    }
  }

  handleGetWidth = () => {
    return { width: window.innerWidth, height: window.innerHeight };
  };

  handleOnUpdate = (e, { width }) => {
    this.setState(width);
  };


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
    const { width, height } = this.state;
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
          <Header size='medium' className='details-graph-header'>
            <div>
              Daily Counts in&nbsp;
            </div>
            <Dropdown inline options={selectYearOptions(firstYear, lastYear)} value={selectedYear} selectOnNavigation={false} onChange={handleYearChange} />
            <Modal trigger={<div className='icon-container'><Icon name='external' size='small' title='Expand graph' link /></div>} size='fullscreen' closeIcon>
              <Modal.Header>
                Daily Counts in&nbsp;
                <Dropdown inline options={selectYearOptions(firstYear, lastYear)} value={selectedYear} selectOnNavigation={false} onChange={handleYearChange} />
              </Modal.Header>
              <Responsive as={Modal.Content} getWidth={this.handleGetWidth} onUpdate={this.handleOnUpdate} fireOnMount>
                <StationDetailsGraph isMobile={isMobile} complexData={selectedStationObj} handleGraphClick={handleGraphClick} selectedYear={selectedYear} width={width} height={height} />
              </Responsive>
            </Modal>
          </Header>
        </Divider>
        <div>
          <StationDetailsGraph isMobile={isMobile} complexData={selectedStationObj} handleGraphClick={handleGraphClick} selectedYear={selectedYear} />
        </div>
      </div>
    )
  }
}

export default StationDetails;