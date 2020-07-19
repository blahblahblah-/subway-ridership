import React from 'react';
import { Statistic, Divider, Header } from "semantic-ui-react";
import { durationModeDate } from './utils';

class DetailsCompareDates extends React.Component {
  render() {
    const { isMobile, selectedDate, compareWithDate, selectedDateObj, compareWithDateObj, durationMode } = this.props;
    const compareWithEntries = compareWithDateObj ? compareWithDateObj.entries : 0;
    const selectedEntries = selectedDateObj ? selectedDateObj.entries : 0;
    const entriesChange = (selectedEntries - compareWithEntries) / compareWithEntries * 100;
    const compareWithExits = compareWithDateObj ? compareWithDateObj.exits : 0;
    const selectedExits = selectedDateObj ? selectedDateObj.exits : 0;
    const exitsChange = (selectedExits - compareWithExits) / compareWithExits * 100;
    return (
      <div>
        <Divider horizontal>
          <Header size='medium'>Entries</Header>
        </Divider>
        <Statistic.Group widths={isMobile ? 2 : 3} size='mini'>
          <Statistic>
            <Statistic.Value>{ compareWithEntries.toLocaleString('en-US') }</Statistic.Value>
            <Statistic.Label>{ durationModeDate(compareWithDate, durationMode, 'small') }</Statistic.Label>
          </Statistic>
          <Statistic>
            <Statistic.Value>{ selectedEntries.toLocaleString('en-US') }</Statistic.Value>
            <Statistic.Label>{ durationModeDate(selectedDate, durationMode, 'small') }</Statistic.Label>
          </Statistic>
          <Statistic color={entriesChange >= 0 ? "green" : "red" }>
            <Statistic.Value>{ entriesChange >= 0 && '+'}{ Math.round(entriesChange * 100) / 100}%</Statistic.Value>
            <Statistic.Label>Change</Statistic.Label>
          </Statistic>
        </Statistic.Group>
        <Divider horizontal>
          <Header size='medium'>Exits</Header>
        </Divider>
        <Statistic.Group widths={isMobile ? 2 : 3} size='mini'>
          <Statistic>
            <Statistic.Value>{ compareWithExits.toLocaleString('en-US') }</Statistic.Value>
            <Statistic.Label>{ durationModeDate(compareWithDate, durationMode, 'small') }</Statistic.Label>
          </Statistic>
          <Statistic>
            <Statistic.Value>{ selectedExits.toLocaleString('en-US') }</Statistic.Value>
            <Statistic.Label>{ durationModeDate(selectedDate, durationMode, 'small') }</Statistic.Label>
          </Statistic>
          <Statistic color={exitsChange >= 0 ? "green" : "red" }>
            <Statistic.Value>{ exitsChange >= 0 && '+'}{ Math.round(exitsChange * 100) / 100}%</Statistic.Value>
            <Statistic.Label>Change</Statistic.Label>
          </Statistic>
        </Statistic.Group>
      </div>
    )
  }
}

export default DetailsCompareDates;