import React from 'react';
import { Segment, Header, Form, Menu, Checkbox, Divider, Button, Icon } from "semantic-ui-react";
import { DateInput } from 'semantic-ui-calendar-react';

const significantDates = [
  ['2020-03-12'], // geatherings banned
  ['2020-03-16'], // NYC schools close
  ['2020-03-22'], // PAUSE
  ['2020-05-06'], // subway suspends overnight service
  ['2020-06-01'], // curfew
  ['2020-06-08']  // phase 1
]

class ConfigBox extends React.Component {
  render() {
    const { mode, isMobile, handleModeClick, firstDate, lastDate, selectedDate, compareWithAnotherDate, handleToggle, compareWithDate,
       handleDateInputChange, handleToggleDataBox } = this.props;
    return (
      <Segment inverted vertical className="configbox">
        <div>
          <Header inverted as={isMobile ? 'h3' : 'h1'} color='blue'>
            NYC Subway Ridership
            <Header.Subheader>
              Based on turnstile usage data, updated weekly <a href='https://medium.com/good-service/mapping-nyc-subway-ridership-through-the-pandemic-aed596a36c9e' target='_blank'><Icon name='info circle' link aria-label='info' fitted /></a>
            </Header.Subheader>
          </Header>
        </div>
        <Divider horizontal hidden />
        <Form inverted>
          <Menu inverted fluid widths={2} size='mini'>
            <Menu.Item name='entries' active={mode === 'entries'} onClick={handleModeClick} />
            <Menu.Item name='exits' active={mode === 'exits'} onClick={handleModeClick} />
          </Menu>
          <DateInput
            className='date-input'
            placeholder='Date'
            closable
            inlineLabel
            clearable={false}
            label='Date'
            name='selectedDate'
            dateFormat='YYYY-MM-DD'
            minDate={firstDate}
            maxDate={lastDate}
            value={selectedDate}
            onChange={handleDateInputChange}
            marked={significantDates.map((d) => new Date(`${d}Z-04:00`))}
            markColor='blue'
            popupPosition='bottom center'
            size='mini'
            hideMobileKeyboard
          />
          <Checkbox label={isMobile ? 'Compare' : 'Compare with another date'} name='compareWithAnotherDate' checked={compareWithAnotherDate} onChange={handleToggle} />
          <DateInput
            className='date-input compare-date-input'
            placeholder='Compare with Date'
            closable
            inlineLabel
            clearable={false}
            disable={selectedDate}
            name='compareWithDate'
            dateFormat='YYYY-MM-DD'
            minDate={firstDate}
            maxDate={lastDate}
            value={compareWithDate}
            onChange={handleDateInputChange}
            marked={significantDates.map((d) => new Date(`${d}Z-04:00`))}
            markColor='blue'
            popupPosition='bottom center'
            disabled={!compareWithAnotherDate}
            size='mini'
            hideMobileKeyboard
          />
        </Form>
        { isMobile &&
          <Button icon
            className="mobile-data-box-control" onClick={handleToggleDataBox}
            title="Expand/Collapse">
            <Icon name='sort'/>
          </Button>
        }
      </Segment>
    )
  }
}

export default ConfigBox;