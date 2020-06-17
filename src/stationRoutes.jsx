import React from 'react';
import { Label } from "semantic-ui-react";

import TrainBullet from './trainBullet';

class StationRoutes extends React.Component {
  render() {
    const { station } = this.props;
    return (
      <div className='trains'>
        { station.system === 'NYCT' && station.routes.map((r) => {
          return (
            <TrainBullet name={r} key={r} size='small' />
          )
        })}
        {
          station.system === 'SIR' &&
          <Label color='blue' horizontal>SIR</Label>
        }
        {
          station.system === 'RIT' &&
          <Label color='red' horizontal>Roosevelt Island Tramway</Label>
        }
        {
          station.system === 'JFK' &&
          <Label color='black' horizontal>AirTrain JFK</Label>
        }
        {
          station.system === 'PTH' &&
          <Label color='yellow' horizontal>PATH</Label>
        }
       </div>
    )
  }
}

export default StationRoutes;