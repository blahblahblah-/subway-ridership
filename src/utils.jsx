import React from 'react';
import moment from 'moment';

export const selectYearOptions = (firstYear, lastYear) => {
  let array = [];
  for (let i = lastYear; i >= firstYear; i--) {
    array.push({ key: i, text: i, value: i });
  }
  return array;
}

export const durationModeAdjective = (durationMode) => {
  if (durationMode === 'months') {
    return 'Monthly';
  } else if (durationMode === 'weeks') {
    return 'Weekly';
  } else {
    return 'Daily';
  }
}

export const durationModeDate = (date, durationMode, size) => {
  if (durationMode === 'months') {
    return moment(date).format('MMMM YYYY');
  } else if (durationMode === 'weeks') {
    if (size === 'big') {
      return `Week ending on ${date}`
    }
    const start = moment(date).subtract(6, 'days').format('YYYY-MM-DD');
    return (
      <span>
        { start} –<br />{date}
      </span>
    )
  }
  return date;
}