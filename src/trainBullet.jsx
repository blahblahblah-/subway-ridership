import React from 'react';

class TrainBullet extends React.Component {
  classNames() {
    const { size, name } = this.props;
    if (size === 'small') {
      return `small route bullet train-${name}`;
    } else if (size === 'medium') {
      return `medium route bullet train-${name}`;
    }
    return `route bullet train-${name}`;
  }

  render() {
    return(
      <div className={this.classNames()}>
        <div className='inner'>{this.props.name}</div>
      </div>
    )
  }
}
export default TrainBullet