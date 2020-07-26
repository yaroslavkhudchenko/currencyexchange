import React, { useState,useEffect } from 'react';
import './../Styles/Converter.scss';
import axios from 'axios';

export const Converter = () => {

    // selected base and target currencies for the selectors
    let [selectedBase, setSelectedBase] = useState({cur:'SEK', value:1});
    let [selectedTarget, setSelectedTarget] = useState({cur: 'GBP', value:0});

    // list of all available currencies for the selectors
    let [listOfCurrencies, setListOfCurrencies] = useState([]);

    // get the initial data for the selectors 
	useEffect(()=>{

		// latest based on SEK
		axios.get(`https://api.exchangeratesapi.io/latest?base=${selectedBase.cur}`)
			.then(data => {
				console.log('data load success ', 
					Object.entries(data.data.rates).map(one => one = { cur:one[0], value:one[1]}));
				console.log(data);

				
				let correctData = Object.entries(data.data.rates).map(one => one = { cur:one[0], value:one[1]});

				// set selectable countries to the loaded rates data
				setListOfCurrencies(correctData);

				// set value based on loaded rates data
				setSelectedTarget({
					cur:'GBP', 
					value:  correctData.filter(one=>one.cur === selectedTarget.cur)[0].value
				})


			})
			.catch(err => console.log(`error while loading data - ${err}`))

	},[]);


    const refreshCurrencies = (e, what) =>	{
        e.persist();
        console.log((() => listOfCurrencies.filter(one=>one.cur === e.target.value)[0].value)());
        console.log(e.target.value);


		what === 'target' ?
			setSelectedTarget(
                {
                    cur:e.target.value, 
                    value: listOfCurrencies.filter(one=>one.cur === e.target.value)[0].value
                }
            ) :
				axios.get(`https://api.exchangeratesapi.io/latest?base=${e.target.value}`)
					.then((data) => {
						console.log('good refresh currencies');
						let correctData = Object.entries(data.data.rates).map(one => one = { cur:one[0], value:one[1]})
						setListOfCurrencies(correctData);
						setSelectedBase({cur:data.data.base, value:1})


						console.log('----------------------')
						console.log(correctData.filter(one=>one.cur === selectedTarget.cur)[0])
						console.log(correctData.filter(one=>one.cur === selectedTarget.cur)[0].value)


						setSelectedTarget({
							...selectedTarget,
							value:correctData.filter(one=>one.cur === selectedTarget.cur)[0].value
						})
                        console.log(e.target.value);
                        console.log(data.data.base)

					})
					.catch(err => console.log(`error during refreshing - ${err}`))
	}

    const inputChange = (e) => {
		console.log('input')
		setSelectedTarget({
			cur:e.target.value, 
			value: (() => listOfCurrencies.filter(one=>one.cur === e.target.value)[0].value)()
		})
    }


    useEffect(()=>{
        console.log('selectedTarget')
        console.log(selectedTarget)
    },[selectedTarget])

    useEffect(()=>{
        console.log('selectedBase')
        console.log(selectedBase)
    },[selectedBase])

    return (
        <div className='Converter'>
            <div className='selectCurrency'>
                <div className='singleCurrency'>
					<div className='selector'>
						<select value={selectedBase.cur} onChange={(e)=> refreshCurrencies(e, 'base')}>
                            {listOfCurrencies.map((one,index)=>

                                <option value={one.cur} key={index}>{one.cur}</option>

                            )}
						</select>
					</div>
					<div className='valueInput'>
						<input type='number' readOnly value={selectedBase.value} />
					</div>
				</div>
                <div className='mixArrows'>
					mix
				</div>
				<div className='singleCurrency'>
					<div className='selector'>
						<select value={selectedTarget.cur} onChange={(e)=> refreshCurrencies(e, 'target')}>
                            {listOfCurrencies.map((one,index)=>

                                <option value={one.cur} key={index}>{one.cur}</option>

                            )}
						</select>
					</div>
					<div className='valueInput'>
						<input type='number' readOnly value={(selectedTarget.value *selectedBase.value).toFixed(5)} />
					</div>
				</div>
            </div>
            <div className='result'>
				<div className='resultTitle'>
					{selectedBase.cur} / {selectedTarget.cur}
				</div>
				<div className='resultBody'>
					<div>Selling 1.00000 {selectedBase.cur} gives you {selectedTarget.value.toFixed(5)} {selectedTarget.cur}</div>
				</div>
            </div>

        </div>
    )
}