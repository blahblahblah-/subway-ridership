import React from 'react';
import { Statistic, Divider, Header } from "semantic-ui-react";

class DetailsDate extends React.Component {
  render() {
    const { data, selectedDate, isMobile } = this.props;
    return (
      <div>
        <Divider horizontal>
          <Header size='medium'>{selectedDate}</Header>
        </Divider>
        <Statistic.Group widths={2} size={isMobile ? 'mini' : 'tiny'}>
          <Statistic>
            <Statistic.Label>Entries</Statistic.Label>
            <Statistic.Value>{ data[selectedDate].entries.toLocaleString('en-US') }</Statistic.Value>
          </Statistic>
          <Statistic>
            <Statistic.Label>Exits</Statistic.Label>
            <Statistic.Value>{ data[selectedDate].exits.toLocaleString('en-US') }</Statistic.Value>
          </Statistic>
        </Statistic.Group>
      </div>
    )
  }
}

export default DetailsDate;