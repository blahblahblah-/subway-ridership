import React from 'react';

import Graph from './graph';
import overall from './data/overall.json';

class OverallGraph extends React.Component {
  graphData() {
    const { nyct, sir, rit, pth, jfk, selectedYear } = this.props;
    const settings = { 'NYCT': nyct, 'SIR': sir, 'RIT': rit, 'PTH': pth, 'JFK': jfk};

    return Object.keys(settings).filter((system) => {
      return settings[system];
    }).flatMap((system) => {
      return ["entries", "exits"].map((field) => {
        const keys = Object.keys(overall[system]).filter((date) => date.startsWith(selectedYear));
        return {
          'id': `${system} ${field}`,
          'data': keys.map((key) => {
                    const data = overall[system][key];
                    return {
                      "x": key,
                      "y":  data[field]
                    }
                  })
        };
      })
    });
  }

  render() {
    const { isMobile, handleGraphClick } = this.props;
    return (
      <Graph isMobile={isMobile} handleGraphClick={handleGraphClick} data={this.graphData()} />
    )
  }
}

export default OverallGraph;