import React from 'react';
import { Header, Button, Icon, Divider, Dropdown } from "semantic-ui-react";
import moment from 'moment';

import DetailsDate from './detailsDate';
import DetailsCompareDates from './detailsCompareDates';
import StationDetailsGraph from './stationDetailsGraph';
import StationRoutes from './stationRoutes';

import stations from './data/stations.json';
import byComplexId from './data/byComplexId.json';
import byComplexId2019 from './data/byComplexId_2019.json';

const yearOptions = [
  {key: 2019, text: 2019, value: 2019},
  {key: 2020, text: 2020, value: 2020},
]

class StationDetails extends React.Component {
  constructor(props) {
    super(props);
    const year = moment(props.selectedDate).year();

    this.state = {selectedYear: year};
  }

  componentDidUpdate(prevProps) {
    const { selectedDate } = this.props;
    if (prevProps.selectedDate !== selectedDate) {
      const year = moment(selectedDate).year();
      this.setState({selectedYear: year});
    }
  }

  handleYearChange = (e, { value }) => this.setState({ selectedYear: value });

  render() {
    const { isMobile, selectedStation, handleBack, handleGraphClick, selectedDate, compareWithDate } = this.props;
    const { selectedYear } = this.state;
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
          <Header size='medium'>
            Daily Counts in&nbsp;
            <Dropdown inline options={yearOptions} value={selectedYear} selectOnNavigation={false} onChange={this.handleYearChange} />
          </Header>
        </Divider>
        <StationDetailsGraph isMobile={isMobile} complexData={selectedYear === 2020 ? byComplexId[selectedStation] : byComplexId2019[selectedStation]} handleGraphClick={handleGraphClick} year={selectedYear} />
      </div>
    )
  }
}

export default StationDetails;