import React, { useState,useEffect } from 'react';
import './../Styles/Converter.scss';
import axios from 'axios';

export const Converter = () => {

    // selected base and target currencies for the selectors
    let [selectedBase, setSelectedBase] = useState({cur:'SEK', val:1});
    let [selectedTarget, setSelectedTarget] = useState({cur:'USD', val: 1});

    // list of all available currencies for the selectors
    let [listOfCurrencies, setListOfCurrencies] = useState([]);

    // get the initial data for the selectors 
	useEffect(()=>{

		// latest based on SEK
		axios.get(`https://api.exchangeratesapi.io/latest?base=${selectedBase.cur}`)
			.then(data => {
				console.log('data load success ', 
					Object.entries(data.data.rates).map(one => one = { cur:one[0], value:one[1]}));
				console.log(data)
				// set selectable countries to the loaded rates data
				setListOfCurrencies(Object.entries(data.data.rates).map(one => one = { cur:one[0], value:one[1]}));
			})
			.catch(err => console.log(`error while loading data - ${err}`))

	},[])

    return (
        <div className='Converter'>
            <div className='selectCurrency'>
                <div className='singleCurrency'>
					<div className='selector'>
						<select value={selectedBase}>
							
						</select>
					</div>
					<div className='valueInput'>
						<input defaultValue={1} />
					</div>
				</div>
                <div className='mixArrows'>
					mix
				</div>
				<div className='singleCurrency'>
					<div className='selector'>
						<select value={selectedTarget}>
						
						</select>
					</div>
					<div className='valueInput'>
						<input defaultValue={1} />
					</div>
				</div>
            </div>
            <div className='result'>

            </div>

        </div>
    )
}