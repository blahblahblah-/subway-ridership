const filePath = `${__dirname}/../data/turnstile_station_list.csv`
const csv = require('csvtojson');
const turf = require('@turf/turf');
const fs = require('fs');

const getSystem = (division) => {
  if (['RIT', 'PTH', 'SIR', 'JFK'].includes(division)) {
    return division;
  }
  return 'NYCT';
}

const convertObj = (obj) => {
  return {
    name: obj.stop_name.replace(/ - /gi, '–'),
    system: getSystem(obj.division),
    borough: obj.borough,
    routes: obj.daytime_routes.split(' '),
    coordinates: [Number(obj.gtfs_longitude), Number(obj.gtfs_latitude)]
  };
}


(async () => {
  const complexes = {};

  await csv().fromFile(filePath).subscribe(
    (obj) => {
      const convertedObj = convertObj(obj);
      let complexObj = complexes[obj.complex_id];

      if (!complexObj) {
        complexes[obj.complex_id] = {
          stations: []
        };
        complexObj = complexes[obj.complex_id];
      }

      complexObj.stations.push(convertedObj);
    },
    () => console.log('error'),
    () => console.log('success')
  );

  Object.keys(complexes).forEach((key) => {
    const complexObj = complexes[key];
    const features = turf.featureCollection(complexObj.stations.map((s) => turf.point(s.coordinates)));
    const center = turf.center(features);

    complexObj['name'] = [...new Set(complexObj.stations.map((s) => s.name))].sort().join('/');
    complexObj['system'] = complexObj.stations[0].system;
    complexObj['borough'] = complexObj.stations[0].borough;
    complexObj['routes'] = complexObj.stations.map((s) => s.routes).flat().sort();
    complexObj['coordinates'] = center.geometry.coordinates;
  });

  const complexJson = JSON.stringify(complexes);

  fs.writeFile(`${__dirname}/../src/data/stations.json`, complexJson, 'utf8', (err) => {
    if (err) throw err;
    console.log('The file has been saved!');
  });
})();