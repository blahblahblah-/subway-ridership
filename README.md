# NYC Subway Ridership

A frontend-only React app, providing visualization of daily NYC Subway ridership and trends using turnstiles data, inspired by wanting to see the impact of COVID-19 on transit usage. Heavily relies on aggregated daily turnstiles data by [qri](https://qri.cloud). Some front-end elements sampled from [The Weekendest](https://github.com/blahblahblah-/theweekendest/) and [goodservice.io](https://github.com/blahblahblah-/goodservice).

Project was started with using [Create React App](https://create-react-app.dev/docs/getting-started/). Uses [Mapbox](https://www.mapbox.com) for maps, [Semantic UI React](https://react.semantic-ui.com/) for UI elements, [Nivo](https://nivo.rocks/) for graphs.

See it live at https://www.subwayridership.nyc.

## Running locally

`````
brew install yarn
yarn install
`````

* Sign up for an account with [Mapbox](https://www.mapbox.com), get a token and add it to an `.env` file as `REACT_APP_MAPBOX_TOKEN`.

* Download datasets from qri:
  * [NYC Subway Turnstiles Counts - 2020](https://qri.cloud/nyc-transit-data/turnstile_daily_counts_2020), copy `csv` file over to `data/turnstile_counts_2020.csv`
  * Optional: [NYC Subway Turnstiles Counts - 2019](https://qri.cloud/nyc-transit-data/turnstile_daily_counts_2019), copy `csv` file over to `data/turnstile_counts_2019.csv`
  * [NYC Turnstiles Station List](https://qri.cloud/nyc-transit-data/stationscsv), copy `csv` file over to `data/turnstile_station_list.csv`

`````
node scripts/generateStationJson.js
node scripts/generateDataJson.js

yarn start
`````

Inspirations:
* https://iquantny.tumblr.com/post/612712380924903424/mapping-fridays-30-drop-in-nyc-subway-ridership
* https://medium.com/qri-io/taming-the-mtas-unruly-turnstile-data-c945f5f96ba0
