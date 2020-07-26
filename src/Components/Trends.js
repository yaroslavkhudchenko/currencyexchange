import React, { useState, useEffect, useContext } from 'react';
import './../Styles/Trends.scss';
import Highcharts from 'highcharts/highstock'
import HighchartsReact from 'highcharts-react-official'
import axios from 'axios';
import { AppContext } from './App';

export const Trends = () => {

	// import app context
	const appContext = useContext(AppContext);

	// options for the graph
	const [options, setOptions] = useState({})

	// non changable currencies to be represented on graph
	const [currenciesForGraph, setCurrenciesForGraph] = useState(['GBP','USD','SGD']);

    useEffect(()=>{

		// grab value from the local storage
		let localStorageValue = window.localStorage.getItem("graphCurrency");
		
		// get rates for regarding currencies for graph for given period
		axios.get(`https://api.exchangeratesapi.io/history?start_at=2015-01-01&end_at=${new Date().toISOString().split('T')[0]}&base=${
			// check if there is some cached(localstorage) value for graphCurrency
			localStorageValue ? localStorageValue.graphCurrency : appContext.state.graphCurrency
          }&symbols=${currenciesForGraph.join(",")}` // search only for currenciesForGraph
        )
        .then((data) => {
          	setOptions({ // options for the graph
				responsive: true,
				title: {
					text: `${appContext.state.graphCurrency} stock chart`,
				},
				// creating 3 sets of data, one for each currency for graph
				series: currenciesForGraph.map(cur => cur = {
					name: cur,
					data: Object.entries(data.data.rates)
					.map((one) => [new Date(one[0]).getTime(), one[1][cur]]) // array [ data , value ]
					.sort((a, b) => (a[0] > b[0] ? 1 : -1)), // sort to have correct dates order
				})
          	});
        })
        .catch((err) => console.log(`error while loading chart data - ${err}`));
  },[appContext.state.graphCurrency]) // if graph currency was changed rerender graph for the new currency

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