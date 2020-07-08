const filePath = `${__dirname}/../data/turnstile_counts_2019.csv`
const csv = require('csvtojson');
const fs = require('fs');

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
  const byComplexId = {};
  const overall = {};
  await csv().fromFile(filePath).subscribe(
    (obj) => {
      const convertedObj = convertObj(obj);
      let dateObj = byDays[obj.date];
      let complexObj = byComplexId[obj.complex_id];
      const system = getSystem(obj.division);
      let overallObj = overall[system];

      if (!dateObj) {
        byDays[obj.date] = {};
        dateObj = byDays[obj.date];
      }

      if (!complexObj) {
        byComplexId[obj.complex_id] = {}
        complexObj = byComplexId[obj.complex_id];
      }

      if (!overallObj) {
        overall[system] = {};
        overallObj = overall[system];
      }

      let overallSys = overallObj[obj.date];

      if (!overallSys) {
        overallObj[obj.date] = {"entries": 0, "exits": 0};
        overallSys = overallObj[obj.date];
      }

      overallObj[obj.date]["entries"] = overallObj[obj.date]["entries"] + convertedObj.entries;
      overallObj[obj.date]["exits"] = overallObj[obj.date]["exits"] + convertedObj.exits;
      dateObj[obj.complex_id] = convertedObj;
      complexObj[obj.date] = convertedObj;
    },
    () => console.log('error'),
    () => console.log('success')
  );

  const dateJson = JSON.stringify(byDays);
  const complexJson = JSON.stringify(byComplexId);
  const overallJson = JSON.stringify(overall);

  fs.writeFile(`${__dirname}/../src/data/byDate_2019.json`, dateJson, 'utf8', (err) => {
    if (err) throw err;
    console.log('The file has been saved!');
  });
  fs.writeFile(`${__dirname}/../src/data/byComplexId_2019.json`, complexJson, 'utf8', (err) => {
    if (err) throw err;
    console.log('The file has been saved!');
  });
  fs.writeFile(`${__dirname}/../src/data/overall_2019.json`, overallJson, 'utf8', (err) => {
    if (err) throw err;
    console.log('The file has been saved!');
  });
})();