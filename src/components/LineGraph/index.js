import React, { useState, useEffect } from 'react';
import classes from './LineGraph.module.css';
import { Line } from 'react-chartjs-2';
import numeral from 'numeral';

//npm i react0chartjs-2 chart.js
// npm i numeral

const options = {
    legend: {
        display: false,
    },
    elements: {
        point: {
            radius: 0
        },
    },
    maintainAspectRatio: false,
    tootips: {
        mode: "index",
        intersect: false,
        callbacks: {
            label: (tooltipItem, data) => {
                return numeral(tooltipItem.value).format("+0,0")
            }
        }
    },
    scales: {
        xAxes: [
            {
                type: 'time',
                time: {
                    format: "MM/DD/YY",
                    tooltipFormat: 'll'
                }
            }
        ],
        yAxes: [
            {
                gridLines: {
                    display: false,
                },
                ticks: {
                    // include a dollar sign in the ticks
                    callback: (value, index, values) => {
                        return numeral(value).format("0a")
                    }
                },
            }
        ]
    }
}

function LineGraph(props) {
    const [data, setData] = useState({});

    const buildChartData = (data, casesType) => {
        const chartData = [];
        let lastDataPoint;

        for (let date in data.cases) {
            if (lastDataPoint) {
                const newDataPoint = {
                    x: date,
                    y: data[casesType][date] - lastDataPoint
                }
                chartData.push(newDataPoint)
            }
            lastDataPoint = data[casesType][date]
        }
        return chartData
    };

    useEffect(() => {
        const fetchData = async () => {
            fetch('https://disease.sh/v3/covid-19/historical/all?lastdays=120')
                .then((response) => response.json())
                .then((data) => {

                    let chartData = buildChartData(data, 'cases');
                    setData(chartData)
                }
                )
        }
        fetchData()
    }, []);


    return (
        <div className={classes.props.className} >
            <Line
                data={{
                    datasets: [{
                        backgroundColor: "rgba(204, 16, 52, 0.75)",
                        borderColor: '#CC1034',
                        data: data,
                    }]
                }}
                options={options}
            />
        </div>
    )
}

export default LineGraph
