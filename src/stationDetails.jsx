import React from 'react';
import { Dimmer, Divider, Header, Dropdown, Loader, Modal, Button, Icon, Responsive } from "semantic-ui-react";
import moment from 'moment';
import { withRouter } from "react-router-dom";
import { Helmet } from "react-helmet";
import Clipboard from 'react-clipboard.js';

import DetailsDate from './detailsDate';
import DetailsCompareDates from './detailsCompareDates';
import StationGraph from './stationGraph';
import StationRoutes from './stationRoutes';
import { selectYearOptions, durationModeAdjective } from './utils';

import stations from './data/stations.json';

const BOROUGHS = {
  Bk: 'Brooklyn',
  Bx: 'The Bronx',
  M: 'Manhattan',
  Q: 'Queens',
  SI: 'Staten Island',
};
Object.freeze(BOROUGHS);

class StationDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      width: 0,
      height: 0,
    }
  }

  componentDidMount() {
    this.setState({ selectedStationObj: null}, this.handleStationChange);
  }

  componentDidUpdate(prevProps) {
    const { stationId, durationMode } = this.props;
    const { selectedStationData } = this.state;

    if (prevProps.stationId !== stationId) {
      this.setState({ selectedStationObj: null}, this.handleStationChange);
    } else if (prevProps.durationMode !== durationMode) {
      this.setState({ selectedStationObj: selectedStationData[durationMode]});
    }
  }

  stationRouteNames(addSuffix) {
    const { stationId } = this.props;
    const station = stations[stationId];

    switch(station.system) {
      case 'NYCT':
        if (addSuffix) {
          return `${station.routes.join(', ')} trains`;
        }
        return station.routes.join(', ');
      case 'SIR':
        return 'Staten Island Railway';
      case 'RIT':
        return 'Roosevelt Island Tramway';
      case 'JFK':
        return 'AirTrain JFK';
      default:
        return 'PATH';
    }
  }

  handleStationChange = () => {
    const { handleStationChange, durationMode, stationId } = this.props;

    import(`./data/complexId/${stationId}.json`)
      .then(data => {
        this.setState({ selectedStationData: data, selectedStationObj: data[durationMode] });
      });

    handleStationChange(stationId);
  }

  handleGetWidth = () => {
    return { width: window.innerWidth, height: window.innerHeight };
  };

  handleOnUpdate = (e, { width }) => {
    this.setState(width);
  };

  handleBack = () => {
    this.props.history.push('/');
  }

  renderBoroughName() {
    const { stationId } = this.props;
    if (stations[stationId].borough) {
      return ` in ${BOROUGHS[stations[stationId].borough]}`;
    }
    return '';
  }

  render() {
    const {
      isMobile,
      selectedDate,
      durationMode,
      compareWithDate,
      compareMode,
      stationId,
      firstYear,
      lastYear,
      handleGraphClick,
      handleYearChange,
    } = this.props;
    const { width, height, selectedStationObj } = this.state;
    const selectedYear = moment(selectedDate).year();
    return (
      <div className='station-details'>
        {
          !selectedStationObj &&
          <Dimmer active>
            <Loader inverted></Loader>
          </Dimmer>
        }
        <Helmet>
          <title>NYC Subway Ridership - {stations[stationId].name} Station ({this.stationRouteNames(false)})</title>
          <meta property="og:url" content={`https://www.subwayridership.nyc/stations/${stationId}`} />
          <meta name="twitter:url" content={`https://www.subwayridership.nyc/stations/${stationId}`} />
          <link rel="canonical" href={`https://www.subwayridership.nyc/stations/${stationId}`} />
          <meta property="og:title" content={`NYC Subway Ridership - ${stations[stationId].name} Station (${this.stationRouteNames(false)})`} />
          <meta name="twitter:title" content={`NYC Subway Ridership - ${stations[stationId].name} Station (${this.stationRouteNames(false)})`} />
          <meta
        name="description"
        content={`Daily, weekly, and monthly ridership for ${stations[stationId].name} Station served by ${this.stationRouteNames(true)}${this.renderBoroughName()}. Data derived from MTA turnstile usage data.`}
      />
          <meta property="og:description" content={`Daily, weekly, and monthly ridership for ${stations[stationId].name} Station served by ${this.stationRouteNames(true)}${this.renderBoroughName()}. Data derived from MTA turnstile usage data.`} />
          <meta name="twitter:description" content={`Daily, weekly, and monthly ridership for ${stations[stationId].name} Station served by ${this.stationRouteNames(true)}${this.renderBoroughName()}. Data derived from MTA turnstile usage data.`} />
        </Helmet>
        <div className='top'>
          <div>
            <Button icon onClick={this.handleBack} title="Back">
              <Icon name='arrow left' />
            </Button>
          </div>
          <div className='heading'>
            <Header as="h3">
              { stations[stationId].name }
            </Header>
            <StationRoutes station={stations[stationId]} />
          </div>
          <div className='perm-link'>
            <Clipboard component={Button} className="icon" title="Copy Link" data-clipboard-text={`https://www.subwayridership.nyc/stations/${stationId}`}>
              <Icon name='linkify' />
            </Clipboard>
          </div>
        </div>
        <Divider hidden />
        { selectedStationObj &&
          <>
            {
              compareWithDate ?
                <DetailsCompareDates isMobile={isMobile} selectedDate={selectedDate} selectedDateObj={selectedStationObj[selectedDate]} durationMode={durationMode}
                compareWithDate={compareWithDate} compareMode={compareMode} compareWithDateObj={selectedStationObj[compareWithDate]} /> :
                <DetailsDate isMobile={isMobile} data={selectedStationObj[selectedDate]} selectedDate={selectedDate} durationMode={durationMode} />
            }
            <Divider horizontal>
              <Header size='medium' className='details-graph-header'>
                <div>
                  { durationModeAdjective(durationMode) } Counts in&nbsp;
                </div>
                <Dropdown inline options={selectYearOptions(firstYear, lastYear)} value={selectedYear} selectOnNavigation={false} onChange={handleYearChange} />
                <Modal trigger={<div className='icon-container'><Icon name='external' size='small' title='Expand graph' link /></div>} size='fullscreen' closeIcon>
                  <Modal.Header>
                    { durationModeAdjective(durationMode) } Counts in&nbsp;
                    <Dropdown inline options={selectYearOptions(firstYear, lastYear)} value={selectedYear} selectOnNavigation={false} onChange={handleYearChange} />
                  </Modal.Header>
                  <Responsive as={Modal.Content} getWidth={this.handleGetWidth} onUpdate={this.handleOnUpdate} fireOnMount>
                    <StationGraph isMobile={isMobile} complexData={selectedStationObj} handleGraphClick={handleGraphClick} selectedYear={selectedYear} width={width} height={height} />
                  </Responsive>
                </Modal>
              </Header>
            </Divider>
            <div>
              <StationGraph isMobile={isMobile} durationMode={durationMode} complexData={selectedStationObj} handleGraphClick={handleGraphClick} selectedYear={selectedYear} />
            </div>
          </>
        }
      </div>
    )
  }
}

export default withRouter(StationDetails);