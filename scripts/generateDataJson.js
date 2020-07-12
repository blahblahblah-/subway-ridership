const csv = require('csvtojson');
const fs = require('fs');

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
  const byComplexId = {};
  const overall = {};

  await Promise.all(fs.readdirSync(path).filter((filename) => {
    return fileRegex.test(filename);
  }).map((filename) => {
    const filePath = path + filename;
    return csv().fromFile(filePath).subscribe(
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
  }));

  const overallJson = JSON.stringify(overall);

  fs.writeFile(`${__dirname}/../src/data/overall.json`, overallJson, 'utf8', (err) => {
    if (err) throw err;
    console.log('The file has been saved!');
  });

  Object.keys(byDays).forEach((date) => {
    const dateJson = JSON.stringify(byDays[date]);
    fs.writeFile(`${__dirname}/../src/data/dates/${date}.json`, dateJson, 'utf8', (err) => {
      if (err) throw err;
      console.log(`${date} has been saved!`);
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