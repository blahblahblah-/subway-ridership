import React from 'react';
import { Checkbox, Divider, Header, Tab, Dropdown } from "semantic-ui-react";
import moment from 'moment';

import OverallGraph from './overallGraph';
import DetailsDate from './detailsDate';
import DetailsCompareDates from './detailsCompareDates';
import StationList from './stationList';
import { selectYearOptions } from './utils';

import overall from './data/overall.json';

class OverallDetails extends React.Component {
  combinedDetails() {
    const { nyct, sir, rit, pth, jfk, selectedDate, compareWithDate } = this.props;
    const settings = { 'NYCT': nyct, 'SIR': sir, 'RIT': rit, 'PTH': pth, 'JFK': jfk};
    const results = {};
    [selectedDate, compareWithDate].filter((date) => date).forEach((date) => {
      results[date] = {};
      ['entries', 'exits'].forEach((field) => {
        results[date][field] = Object.keys(settings).filter((system) => settings[system]).map((system) => overall[system] && overall[system][date] ? overall[system][date][field] : 0).reduce((acc, cur) => acc + cur, 0);
      });
    })
    return results;
  }

  render() {
    const {
      nyct,
      sir,
      rit,
      pth,
      jfk,
      isMobile,
      selectedDate,
      selectedDateObj,
      compareWithDate,
      compareWithDateObj,
      firstYear,
      lastYear,
      handleSelectStation,
      handleToggle,
      handleGraphClick,
      handleYearChange,
      mode,
    } = this.props;
    const selectedYear = moment(selectedDate).year();
    const data = this.combinedDetails();
    return (
      <div className='overall-details'>
        <Checkbox label='NYCT Subway' name='nyct' checked={nyct} onChange={handleToggle} />
        <Checkbox label='Staten Island Railway' name='sir' checked={sir} onChange={handleToggle} />
        <Checkbox label='Roosevelt Island Tramway' name='rit' checked={rit} onChange={handleToggle} />
        <Checkbox label='PATH' name='pth' checked={pth} onChange={handleToggle} />
        <Checkbox label='AirTrain JFK' name='jfk' checked={jfk} onChange={handleToggle} />
        <Divider className='tab-separator' />
        <Tab menu={{secondary: true, pointing: true}} panes={
          [
            {
              menuItem: 'Overall',
              render: () => {
                return (
                  <Tab.Pane attached={false}>
                    { compareWithDate ?
                      <DetailsCompareDates isMobile={isMobile}
                        selectedDate={selectedDate} selectedDateObj={data[selectedDate]}
                        compareWithDate={compareWithDate} compareWithDateObj={data[compareWithDate]}
                      /> :
                      <DetailsDate isMobile={isMobile} data={data[selectedDate]} selectedDate={selectedDate} />
                    }
                  </Tab.Pane>
                )
              },
            },
            {
              menuItem: 'Stations',
              render: () => {
                return (
                  <Tab.Pane attached={false}>
                    <StationList nyct={nyct} sir={sir} rit={rit} pth={pth} jfk={jfk} mode={mode}
                      selectedDate={selectedDate} selectedDateObj={selectedDateObj}
                      compareWithDate={compareWithDate} compareWithDateObj={compareWithDateObj}
                      handleSelectStation={handleSelectStation} />
                  </Tab.Pane>
                )
              },
            },
          ]
        }/>
        <Divider horizontal>
          <Header size='medium'>
            Daily Counts in&nbsp;
            <Dropdown inline options={selectYearOptions(firstYear, lastYear)} value={selectedYear} selectOnNavigation={false} onChange={handleYearChange} />
          </Header>
        </Divider>
        <OverallGraph isMobile={isMobile} nyct={nyct} sir={sir} rit={rit} pth={pth} jfk={jfk} handleGraphClick={handleGraphClick} selectedYear={selectedYear} />
      </div>
    )
  }
}

export default OverallDetails;