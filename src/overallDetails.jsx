import React from 'react';
import { Checkbox, Divider, Header, Dropdown, Modal, Icon, Responsive, Menu } from "semantic-ui-react";
import moment from 'moment';
import { Route, Switch, Link } from "react-router-dom";

import OverallGraph from './overallGraph';
import DetailsDate from './detailsDate';
import DetailsCompareDates from './detailsCompareDates';
import StationList from './stationList';
import { selectYearOptions, durationModeAdjective } from './utils';

import overall from './data/overall.json';

class OverallDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      width: 0,
      height: 0,
    }
  }

  combinedDetails() {
    const { nyct, sir, rit, pth, jfk, selectedDate, compareWithDate, durationMode } = this.props;
    const settings = { 'NYCT': nyct, 'SIR': sir, 'RIT': rit, 'PTH': pth, 'JFK': jfk};
    const results = {};
    [selectedDate, compareWithDate].filter((date) => date).forEach((date) => {
      results[date] = {};
      ['entries', 'exits'].forEach((field) => {
        results[date][field] = Object.keys(settings).filter((system) => settings[system]).map((system) => overall[system][durationMode] && overall[system][durationMode][date] ? overall[system][durationMode][date][field] : 0).reduce((acc, cur) => acc + cur, 0);
      });
    })
    return results;
  }

  handleGetWidth = () => {
    return { width: window.innerWidth, height: window.innerHeight };
  };

  handleOnUpdate = (e, { width }) => {
    this.setState(width);
  };

  checkboxes() {
    const { isMobile } = this.props;
    return [
      { label: 'NYCT Subway', field: 'nyct'},
      { label: isMobile ? 'SIR' : 'Staten Island Railway', field: 'sir'},
      { label: isMobile ? 'RIT' : 'Roosevelt Island Tramway', field: 'rit'},
      { label: 'PATH', field: 'pth'},
      { label: 'AirTrain JFK', field: 'jfk'},
    ];
  }

  renderTab(index) {
    return (
      <Menu pointing secondary>
        <Menu.Item as={Link} to='/' key='system' active={index === 0}>System</Menu.Item>
        <Menu.Item as={Link} to='/stations' key='stations' active={index === 1}>Stations</Menu.Item>
      </Menu>
    )
  }

  renderSystemWideDetails() {
    const {
      nyct,
      sir,
      rit,
      pth,
      jfk,
      durationMode,
      isMobile,
      selectedDate,
      compareWithDate,
      firstYear,
      lastYear,
      handleGraphClick,
      handleYearChange,
    } = this.props;
    const { width, height } = this.state;
    const data = this.combinedDetails();
    const selectedYear = moment(selectedDate).year();
    return (
      <>
        {
          compareWithDate ?
          <DetailsCompareDates isMobile={isMobile} durationMode={durationMode}
            selectedDate={selectedDate} selectedDateObj={data[selectedDate]}
            compareWithDate={compareWithDate} compareWithDateObj={data[compareWithDate]}
          /> :
          <DetailsDate isMobile={isMobile} data={data[selectedDate]} selectedDate={selectedDate} durationMode={durationMode} />
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
                <OverallGraph isMobile={isMobile} nyct={nyct} sir={sir} rit={rit} pth={pth} jfk={jfk} durationMode={durationMode}
                  handleGraphClick={handleGraphClick} selectedYear={selectedYear} width={width} height={height} />
              </Responsive>
            </Modal>
          </Header>
        </Divider>
        <div>
          <OverallGraph isMobile={isMobile} nyct={nyct} sir={sir} rit={rit} pth={pth} jfk={jfk} durationMode={durationMode}
            handleGraphClick={handleGraphClick} selectedYear={selectedYear} />
        </div>
      </>
    )
  }

  render() {
    const {
      nyct,
      sir,
      rit,
      pth,
      jfk,
      selectedDate,
      handleToggle,
      mode,
      selectedDateObj,
      compareWithDate,
      compareWithDateObj,
    } = this.props;
    return (
      <div className='overall-details'>
        {
          this.checkboxes().map((c) => {
            return (
              <Checkbox label={c.label} name={c.field} checked={this.props[c.field]} key={c.field} onChange={handleToggle} />
            )
          })
        }
        <Divider className='tab-separator' />
        <Switch>
          <Route exact path='/stations' render={() => this.renderTab(1)} />
          <Route render={() => this.renderTab(0)} />
        </Switch>
        <Switch>
          <Route exact path='/stations' render={() => <StationList nyct={nyct} sir={sir} rit={rit} pth={pth} jfk={jfk} mode={mode}
                    selectedDate={selectedDate} selectedDateObj={selectedDateObj}
                    compareWithDate={compareWithDate} compareWithDateObj={compareWithDateObj} />} />
          <Route render={() => this.renderSystemWideDetails()} />
        </Switch>
      </div>
    )
  }
}

export default OverallDetails;