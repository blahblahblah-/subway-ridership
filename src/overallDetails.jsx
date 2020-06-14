import React from 'react';
import { Checkbox, Divider, Header } from "semantic-ui-react";

import OverallGraph from './overallGraph';
import DetailsDate from './detailsDate';
import DetailsCompareDates from './detailsCompareDates';

import overall from './data/overall.json';

class OverallDetails extends React.Component {
  combinedDetails() {
    const { nyct, sir, rit, pth, jfk, selectedDate, compareWithDate } = this.props;
    const settings = { 'NYCT': nyct, 'SIR': sir, 'RIT': rit, 'PTH': pth, 'JFK': jfk};
    const results = {};
    [selectedDate, compareWithDate].filter((date) => date).forEach((date) => {
      results[date] = {};
      ['entries', 'exits'].forEach((field) => {
        results[date][field] = Object.keys(settings).filter((system) => settings[system]).map((system) => overall[system][date][field]).reduce((acc, cur) => acc + cur, 0);
      });
    })
    return results;
  }

  render() {
    const { nyct, sir, rit, pth, jfk, handleToggle, selectedDate, compareWithDate } = this.props;
    return (
      <div>
        <Checkbox label='NYCT Subway' name='nyct' checked={nyct} onChange={handleToggle} />
        <Checkbox label='Staten Island Railway' name='sir' checked={sir} onChange={handleToggle} />
        <Checkbox label='Roosevelt Island Tramway' name='rit' checked={rit} onChange={handleToggle} />
        <Checkbox label='PATH' name='pth' checked={pth} onChange={handleToggle} />
        <Checkbox label='AirTrain JFK' name='jfk' checked={jfk} onChange={handleToggle} />
        {
          compareWithDate ? <DetailsCompareDates data={this.combinedDetails()} selectedDate={selectedDate} compareWithDate={compareWithDate} /> : <DetailsDate data={this.combinedDetails()} selectedDate={selectedDate} />
        }
        <Divider horizontal>
          <Header size='medium'>Daily Counts in 2020</Header>
        </Divider>
        <OverallGraph nyct={nyct} sir={sir} rit={rit} pth={pth} jfk={jfk} />
      </div>
    )
  }
}

export default OverallDetails;