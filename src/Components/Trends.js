import React, { useState, useEffect } from 'react';
import './../Styles/Trends.scss';
import Highcharts from 'highcharts/highstock'
import HighchartsReact from 'highcharts-react-official'
import axios from 'axios';

export const Trends = () => {
  
  const [chartOptions, setChartOptions] = useState({
    title: {
      text: 'My stock chart'
    },
    xAxis: {
      min: Date.UTC(2015, 2, 26),
      max: new Date().getTime()
  },

    series: [{
      data: [1, 2, 3]
    }]
  })

    useEffect(()=>{

      axios.get(`https://api.exchangeratesapi.io/history?start_at=2015-03-26&end_at=2017-06-13&base=SEK`)
			.then(data => {
      
        console.log('chart data')
				console.log(data);

			})
			.catch(err => console.log(`error while loading chart data - ${err}`))

    },[])

    return (
        <div className='Trends'>
          <HighchartsReact
            highcharts={Highcharts}
            constructorType={'stockChart'}
            options={chartOptions}
          />
        </div>
    )
}