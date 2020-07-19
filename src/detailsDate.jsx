import React from 'react';
import { Statistic, Divider, Header } from "semantic-ui-react";
import { durationModeDate } from './utils';

class DetailsDate extends React.Component {
  render() {
    const { data, selectedDate, isMobile, durationMode } = this.props;
    return (
      <div>
        <Divider horizontal>
          <Header size='medium'>{ durationModeDate(selectedDate, durationMode, 'big') }</Header>
        </Divider>
        <Statistic.Group widths={2} size={isMobile ? 'mini' : 'tiny'}>
          <Statistic>
            <Statistic.Label>Entries</Statistic.Label>
            <Statistic.Value>{ data ? data.entries.toLocaleString('en-US') : 0 }</Statistic.Value>
          </Statistic>
          <Statistic>
            <Statistic.Label>Exits</Statistic.Label>
            <Statistic.Value>{ data ? data.exits.toLocaleString('en-US') : 0 }</Statistic.Value>
          </Statistic>
        </Statistic.Group>
      </div>
    )
  }
}

export default DetailsDate;