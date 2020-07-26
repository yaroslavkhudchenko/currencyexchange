import React, { useState,useEffect } from 'react';
import './../Styles/Converter.scss';
import axios from 'axios';

export const Converter = () => {

    // selected base and target currencies for the selectors
	let [selected, setSelected] = useState({
		base : {cur:'SEK', value:1},
		target : {cur: 'GBP', value:0, pointer:0}
	})

    // list of all available currencies for the selectors
    let [listOfCurrencies, setListOfCurrencies] = useState([]);

    // get the initial data for the selectors 
	useEffect(()=>{

		// latest based on SEK
		axios.get(`https://api.exchangeratesapi.io/latest?base=${selected.base.cur}`)
			.then(data => {
				console.log('data load success ', 
					Object.entries(data.data.rates).map(one => one = { cur:one[0], value:one[1]}));
				console.log(data);
				
				let correctData = Object.entries(data.data.rates).map(one => one = { cur:one[0], value:one[1]});

				// set selectable countries to the loaded rates data
				setListOfCurrencies(correctData);

				// set value based on loaded rates data

				setSelected({
					...selected,
					target : {
						cur:'GBP', 
						value:  correctData.filter(one=>one.cur === selected.target.cur)[0].value,
						pointer: correctData.filter(one=>one.cur === selected.target.cur)[0].value
					}
				})

			})
			.catch(err => console.log(`error while loading data - ${err}`))

	},[]);

    const refreshCurrencies = (e, what) =>	{
        e.persist();

		what === 'target' ?
			setSelected(
                {
					...selected,
					target : {
						cur:e.target.value, 
						value: listOfCurrencies.filter(one=>one.cur === e.target.value)[0].value
					}
                    
                }
            ) :
				axios.get(`https://api.exchangeratesapi.io/latest?base=${e.target.value}`)
					.then((data) => {
						console.log('good refresh currencies');
						let correctData = Object.entries(data.data.rates).map(one => one = { cur:one[0], value:one[1]})
						setListOfCurrencies(correctData);


						setSelected({
							base: {cur:data.data.base, value:1},
							target: {
								...selected.target,
								value:correctData.filter(one=>one.cur === selected.target.cur)[0].value,
								pointer: correctData.filter(one=>one.cur === selected.target.cur)[0].value
							}
						})

					
					})
					.catch(err => console.log(`error during refreshing - ${err}`))
	}

    const inputChange = (e, what) => {
		console.log('input')
		console.log(e.target.value)
		
		// check which of two inputs changed
		what === 'target'? 

			setSelected({
				base : {
					...selected.base,
					// value is based on target value(from editing input) divided by the pointer of the target currency
					value : e.target.value / selected.target.pointer
				},
				target : {...selected.target, value:e.target.value }
			})
			
		:
			setSelected({
				base : {
					...selected.base,
					value: e.target.value
				},
				target: {
					...selected.target,
					// value is based on target value(from editing input) multiply by number of base value
					value: e.target.value * selected.target.pointer
				}
			})
    }
	const mixCurrencies = () => {
		let base = selected.base;
		let target = selected.target;
		axios.get(`https://api.exchangeratesapi.io/latest?base=${target.cur}`)
			.then(data => {
				console.log('data mix success');
				console.log(data)

				let correctData = Object.entries(data.data.rates).map(one => one = { cur:one[0], value:one[1]})

				setSelected({
					base: target,
					target : {
						cur:base.cur,
						value:base.value,
						pointer: correctData.filter(one=>one.cur === selected.base.cur)[0].value
					}

				})
				setListOfCurrencies(correctData);

			})
		
	}

    useEffect(()=>{
        console.log('selectedTarget')
        console.log(selected.target)
    },[selected])

    useEffect(()=>{
        console.log('selectedBase')
        console.log(selected.base)
    },[selected])

    return (
        <div className='Converter'>
            <div className='selectCurrency'>
                <div className='singleCurrency'>
					<div className='selector'>
						<select value={selected.base.cur} onChange={(e)=> refreshCurrencies(e, 'base')}>
                            {listOfCurrencies.map((one,index)=>

                                <option value={one.cur} key={index}>{one.cur}</option>

                            )}
						</select>
					</div>
					<div className='valueInput'>
						<input 
							type='number' 
							onChange={(e) => inputChange(e, 'base')}
							min="0"
							value={selected.base.value*1} 
						/>
					</div>
				</div>
                <div className='mixArrows' onClick={mixCurrencies}>
					mix
				</div>
				<div className='singleCurrency'>
					<div className='selector'>
						<select value={selected.target.cur} onChange={(e)=> refreshCurrencies(e, 'target')}>
                            {listOfCurrencies.map((one,index)=>

                                <option value={one.cur} key={index}>{one.cur}</option>

                            )}
						</select>
					</div>
					<div className='valueInput'>
						<input 
							type='number' 
							onChange={(e) => inputChange(e, 'target')}
							min="0"
							value={selected.target.value}
						/>
					</div>
				</div>
            </div>
            <div className='result'>
				<div className='resultTitle'>
					{selected.base.cur} / {selected.target.cur}
				</div>
				<div className='resultBody'>
					<div>Selling 1.00000 {selected.base.cur} gives you {((1 * selected.target.pointer)*1).toFixed(5)} {selected.target.cur}</div>
					<div>Buying 1.00000 {selected.target.cur} costs you {((1 / selected.target.pointer)*1).toFixed(5)} {selected.base.cur}</div>
				</div>
            </div>

        </div>
    )
}