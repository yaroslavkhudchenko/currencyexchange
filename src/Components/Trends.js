import React, { useState, useEffect } from 'react';
import './../Styles/Trends.scss';
import Highcharts from 'highcharts/highstock'
import HighchartsReact from 'highcharts-react-official'
import axios from 'axios';

export const Trends = () => {
  
  const [options, setOptions] = useState({})

  const [currenciesForGraph, setCurrenciesForGraph] = useState(['GBP','USD','SGD'])
    useEffect(()=>{

      // get rates for SEK regarding currencies for graph for given period
      axios.get(
          `https://api.exchangeratesapi.io/history?start_at=2015-03-26&end_at=2017-06-13&base=SEK&symbols=${currenciesForGraph.join(',')}`
        )
        .then((data) => {
         
          setOptions({
            title: {
              text: "SEK stock chart",
            },
            // creating 3 sets of data, one for each currency for graph
            series: currenciesForGraph.map(
              (cur) => cur = {
                  name: cur,
                  data: Object.entries(data.data.rates)
                    .map((one) => [new Date(one[0]).getTime(), one[1][cur]]) // array [ data , value ]
                    .sort((a, b) => (a[0] > b[0] ? 1 : -1)), // sort to have correct dates order
                }
            ),
          });
        })
        .catch((err) => console.log(`error while loading chart data - ${err}`));

  },[])

  return (
    <div className="Trends">
      <HighchartsReact
        highcharts={Highcharts}
        constructorType={"stockChart"}
        options={options}
      />
    </div>
  );
}