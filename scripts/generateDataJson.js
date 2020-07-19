const csv = require('csvtojson');
const fs = require('fs');
const moment = require('moment');

const path = `${__dirname}/../data/`
const fileRegex = /^turnstile_counts_\d{4}\.csv$/

const convertObj = (obj) => {
  return {
    entries: Number(obj.entries),
    exits: Number(obj.exits),
  };
}

const getSystem = (division) => {
  if (['RIT', 'PTH', 'SIR', 'JFK'].includes(division)) {
    return division;
  }
  return 'NYCT';
}

(async () => {
  const byDays = {};
  const byWeeks = {};
  const byMonths = {};
  const byComplexId = {
    days: {},
    weeks: {},
    months: {},
  };
  const overall = {
    'NYCT': {
      days: {},
      weeks: {},
      months: {},
    },
    'SIR': {
      days: {},
      weeks: {},
      months: {},
    },
    'PTH': {
      days: {},
      weeks: {},
      months: {},
    },
    'RIT': {
      days: {},
      weeks: {},
      months: {},
    },
    'JFK': {
      days: {},
      weeks: {},
      months: {},
    },
  };

  await Promise.all(fs.readdirSync(path).filter((filename) => {
    return fileRegex.test(filename);
  }).map((filename) => {
    const filePath = path + filename;
    return csv().fromFile(filePath).subscribe(
      (obj) => {
        const convertedObj = convertObj(obj);
        const month = moment(obj.date).format('YYYY-MM') + '-01';
        const week = moment(obj.date).endOf('week').subtract(1, 'day').format('YYYY-MM-DD');

        let dateObj = byDays[obj.date];
        let weekObj = byWeeks[week];
        let monthObj = byMonths[month];
        let complexObj = byComplexId[obj.complex_id];
        const system = getSystem(obj.division);
        let overallObj = overall[system];

        if (!dateObj) {
          byDays[obj.date] = {};
          dateObj = byDays[obj.date];
        }

        if (!weekObj) {
          byWeeks[week] = {};
          weekObj = byWeeks[week];
        }

        if (!monthObj) {
          byMonths[month] = {};
          monthObj = byMonths[month];
        }

        let weekObjForComplex =  weekObj[obj.complex_id];

        if (!weekObjForComplex) {
          weekObj[obj.complex_id] = {"entries": 0, "exits": 0};
          weekObjForComplex = weekObj[obj.complex_id];
        }

        let monthObjForComplex =  monthObj[obj.complex_id];

        if (!monthObjForComplex) {
          monthObj[obj.complex_id] = {"entries": 0, "exits": 0};
          monthObjForComplex = monthObj[obj.complex_id];
        }

        if (!complexObj) {
          byComplexId[obj.complex_id] = {
            days: {},
            weeks: {},
            months: {},
          }
          complexObj = byComplexId[obj.complex_id];
        }

        let complexByWeek = complexObj.weeks[week];
        let complexByMonth = complexObj.months[month];

        if (!complexByWeek) {
          complexObj.weeks[week] = {"entries": 0, "exits": 0};
          complexByWeek = complexObj.weeks[week];
        }

        if (!complexByMonth) {
          complexObj.months[month] = {"entries": 0, "exits": 0};
          complexByMonth = complexObj.months[month];
        }

        let overallSysDay = overallObj.days[obj.date];
        let overallSysWeek = overallObj.weeks[week];
        let overallSysMonth = overallObj.months[month];

        if (!overallSysDay) {
          overallObj.days[obj.date] = {"entries": 0, "exits": 0};
          overallSysDay = overallObj.days[obj.date];
        }

        if (!overallSysWeek) {
          overallObj.weeks[week] = {"entries": 0, "exits": 0};
          overallSysWeek = overallObj.weeks[week];
        }

        if (!overallSysMonth) {
          overallObj.months[month] = {"entries": 0, "exits": 0};
          overallSysMonth = overallObj.months[month];
        }

        overallSysDay["entries"] = overallSysDay["entries"] + convertedObj.entries;
        overallSysDay["exits"] = overallSysDay["exits"] + convertedObj.exits;
        overallSysWeek["entries"] = overallSysWeek["entries"] + convertedObj.entries;
        overallSysWeek["exits"] = overallSysWeek["exits"] + convertedObj.exits;
        overallSysMonth["entries"] = overallSysMonth["entries"] + convertedObj.entries;
        overallSysMonth["exits"] = overallSysMonth["exits"] + convertedObj.exits;
        dateObj[obj.complex_id] = convertedObj;
        weekObjForComplex["entries"] = weekObjForComplex["entries"] + convertedObj.entries;
        weekObjForComplex["exits"] = weekObjForComplex["exits"] + convertedObj.exits;
        monthObjForComplex["entries"] = monthObjForComplex["entries"] + convertedObj.entries;
        monthObjForComplex["exits"] = monthObjForComplex["exits"] + convertedObj.exits;
        complexObj.days[obj.date] = convertedObj;
        complexObj.weeks[week]["entries"] = complexObj.weeks[week]["entries"] + convertedObj.entries;
        complexObj.weeks[week]["exits"] = complexObj.weeks[week]["exits"] + convertedObj.exits;
        complexObj.months[month]["entries"] = complexObj.months[month]["entries"] + convertedObj.entries;
        complexObj.months[month]["exits"] = complexObj.months[month]["exits"] + convertedObj.exits;
      },
      () => console.log('error'),
      () => console.log('success')
    );
  }));

  const overallJson = JSON.stringify(overall);

  fs.writeFile(`${__dirname}/../src/data/overall.json`, overallJson, 'utf8', (err) => {
    if (err) throw err;
    console.log('The file has been saved!');
  });

  Object.keys(byDays).forEach((date) => {
    const dateJson = JSON.stringify(byDays[date]);
    fs.writeFile(`${__dirname}/../src/data/days/${date}.json`, dateJson, 'utf8', (err) => {
      if (err) throw err;
      console.log(`${date} has been saved!`);
    });
  });

  Object.keys(byWeeks).forEach((week) => {
    const weekJson = JSON.stringify(byWeeks[week]);
    fs.writeFile(`${__dirname}/../src/data/weeks/${week}.json`, weekJson, 'utf8', (err) => {
      if (err) throw err;
      console.log(`Week ${week} has been saved!`);
    });
  });

  Object.keys(byMonths).forEach((month) => {
    const monthJson = JSON.stringify(byMonths[month]);
    fs.writeFile(`${__dirname}/../src/data/months/${month}.json`, monthJson, 'utf8', (err) => {
      if (err) throw err;
      console.log(`${month} has been saved!`);
    });
  });

  Object.keys(byComplexId).forEach((complexId) => {
    const complexJson = JSON.stringify(byComplexId[complexId]);
    fs.writeFile(`${__dirname}/../src/data/complexId/${complexId}.json`, complexJson, 'utf8', (err) => {
      if (err) throw err;
      console.log(`${complexId} has been saved!`);
    });
  });

  const timestampJson = JSON.stringify(new Date());

  fs.writeFile(`${__dirname}/../src/data/timestamp.json`, timestampJson, 'utf8', (err) => {
    if (err) throw err;
    console.log('The file has been saved!');
  });
})();