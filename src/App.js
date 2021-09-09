import classes from './App.module.css';
import { FormControl, Select, MenuItem, Card, CardContent } from "@material-ui/core"
import { useEffect, useState } from 'react';
import InfoBox from './components/InfoBox';
import Map from './components/Map';
import Table from './components/Table';
import { prettyPrintStat, sortdata } from './utils';
import LineGraph from './components/LineGraph';
import "leaflet/dist/leaflet.css";

function App() {
  const [countries, setCountries] = useState(['UK', 'USA', 'NG', 'MLY']);
  const [country, setCountry] = useState("worldwide");
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState({
    lat: 34.80746, lng: -40.4796
  });
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountries, setMapCountries] = useState([]);
  const [casesType, setCasesType] = useState("cases")

  useEffect(() => {
    const getCountriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
        .then((res) => res.json())
        .then((data) => {
          const countries = data.map((country) => ({
            name: country.country,
            value: country.countryInfo.iso2
          }))
          const sortedData = sortdata(data)
          setTableData(sortedData);
          setMapCountries(data);
          setCountries(countries);
        })
    }

    getCountriesData();
  }, []);

  const selectCountry = async (e) => {
    const countryCode = e.target.value;
    setCountry(countryCode);

    const url = countryCode === 'worldwide' ?
      'https://disease.sh/v3/covid-19/all' :
      `https://disease.sh/v3/covid-19/countries/${countryCode}`

    await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setCountryInfo(data);
        setCountry(countryCode);

        setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
        setMapZoom(4)
      })
      .catch((error) => alert(error.message))
  }

  useEffect(() => {
    fetch('https://disease.sh/v3/covid-19/all')
      .then((response) => response.json())
      .then(data => setCountryInfo(data));
  }, [])

  return (
    <div className={classes.app}>
      <div className={classes.app__left}>
        <div className={classes.app__header}>
          <FormControl className={classes.app__dropdown}>
            <Select
              varaint="outlined"
              value={country}
              onChange={selectCountry}
            >
              <MenuItem value="worldwide">Worldwide</MenuItem>
              {countries.map(country => (
                <MenuItem value={country.value} key={country.value}>{country.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        <div className={classes.app__stats}>
          <InfoBox
            isRed
            active={casesType === "cases"}
            onClick={e => setCasesType('cases')}
            title="CoronaVirus Cases"
            case={prettyPrintStat(countryInfo.todayCases)}
            total={prettyPrintStat(countryInfo.cases)}
          />
          <InfoBox
            active={casesType === "recovered"}
            onClick={e => setCasesType('recovered')}
            title="Recovered"
            cases={prettyPrintStat(countryInfo.todayRecovered)}
            total={prettyPrintStat(countryInfo.recovered)}
          />
          <InfoBox
            active={casesType === "deaths"}
            onClick={e => setCasesType('deaths')}
            title="Deaths"
            cases={prettyPrintStat(countryInfo.todayDeaths)}
            total={prettyPrintStat(countryInfo.deaths)}
          />
        </div>
        <Map
          casesType={casesType}
          countries={mapCountries}
          center={mapCenter}
          zoom={mapZoom}
        />
      </div>
      <Card className={classes.app__right}>
        <CardContent className={classes.app__cardContent}>
          <h3>Live Cases by Country</h3>
          <Table countries={tableData} />
          <h3 className={classes.app__graphTitle}>Worldwide new {casesType}</h3>
          <LineGraph className={classes.app__graph} casesType={casesType} />
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
