import React from 'react';

import Graph from './graph';

class StationDetailsGraph extends React.Component {
  graphData() {
    const { complexData, selectedYear } = this.props;

    const keys = Object.keys(complexData).filter((date) => date.startsWith(selectedYear)).sort();

    return ["entries", "exits"].map((field) => {
      return {
        'id': field,
        'data': keys.map((key) => {
                  const data = complexData[key];
                  return {
                    "x": key,
                    "y":  data[field]
                  }
                })
      };
    })
  }

  render() {
    const { isMobile, handleGraphClick, width, height } = this.props;
    return (
      <Graph isMobile={isMobile} handleGraphClick={handleGraphClick} data={this.graphData()} width={width} height={height} />
    )
  }
}

export default StationDetailsGraph;