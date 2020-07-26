import React, { useState, useEffect, useContext } from "react";
import './../Styles/Converter.scss';
import axios from 'axios';
import { AppContext } from "./App";

export const Converter = () => {
	const appContext = useContext(AppContext);

	// top level pointer for localstoragedata
	let localStorageData = null;

    // selected default base and target currencies for the selectors
	const [selected, setSelected] = useState({
		base : {cur:'SEK', value:1},
		target : {cur: 'GBP', value:0, pointer:0}
	})

    // list of all available currencies for the selectors
    const [listOfCurrencies, setListOfCurrencies] = useState([]);

    // get the initial data for the selectors 
	useEffect(()=>{
		// grab data from the localstorage
		localStorageData = JSON.parse(window.localStorage.getItem("selected"));

		// latest based on base currency
		axios.get(`https://api.exchangeratesapi.io/latest?base=${localStorageData ? localStorageData.base.cur : selected.base.cur}`)
			.then(data => {
				
				// good format for future use
				let correctData = Object.entries(data.data.rates).map(one => one = { cur:one[0], value:one[1]});

				// set selectable countries to the loaded rates data
				setListOfCurrencies(correctData);

				// set value based on loaded rates data or localstorage
				if(localStorageData) {
					setSelected({
						base: {
							cur : localStorageData.base.cur,
							value:  localStorageData.base.value
						},
						target : {
							cur: localStorageData.target.cur,
							value:  correctData.filter(one=> one.cur === localStorageData.target.cur)[0].value, // check for the value in all currencies
							pointer: correctData.filter(one=> one.cur === localStorageData.target.cur)[0].value // check for the value in all currencies
						}
					})
				} else {
					setSelected({
						...selected,
						target : {
							cur: 'GBP', 
							value:  correctData.filter(one=> one.cur === selected.target.cur)[0].value, // check for the value in all currencies
							pointer: correctData.filter(one=> one.cur === selected.target.cur)[0].value // check for the value in all currencies
						},
					})
				}
			})
			.catch(err => console.log(`error while loading data - ${err}`))

	},[]);

	// on select change refresh currencies based on the change
    const refreshCurrencies = (e, what) =>	{
		// get good value for newly selected currency
		let data = listOfCurrencies.filter(one=>one.cur === e.target.value)[0].value;

		what === "target"
			? 
			setSelected({
				...selected,
				target: {
					cur: e.target.value,
					value: data,
					pointer: data,
				},
			})
			: 
			axios.get(`https://api.exchangeratesapi.io/latest?base=${e.target.value}`)
				.then((data) => {

					// good data structure for future use
					let correctData = Object.entries(data.data.rates).map((one) => (one = { cur: one[0], value: one[1] }));

					setListOfCurrencies(correctData);

					setSelected({
						base: { cur: data.data.base, value: localStorageData ? localStorageData.base.value : 1 },
						target: {
							...selected.target,
							value: correctData.filter((one) => one.cur === selected.target.cur)[0].value,// check for the value in all currencies
							pointer: correctData.filter((one) => one.cur === selected.target.cur)[0].value,// check for the value in all currencies
						},
					});
					appContext.setState({
						...appContext.state,
						graphCurrency: data.data.base, // change graph currency for graph rerender
					});
				})
				.catch((err) => console.log(`error during refreshing - ${err}`));
	}

	// on input value change recalculate currencies values based on change
    const inputChange = (e, what) => {
		
		// check which of two inputs changed
		what === "target"
      		? setSelected({
          		base: {
            		...selected.base,
					// value is based on target value(from editing input) divided by the pointer of the target currency
					value: e.target.value / selected.target.pointer,
          		},
				target: {
					...selected.target,
					value: e.target.value*1
				},
        	})
      		: setSelected({
          		base: {
            		...selected.base,
            		value: e.target.value*1,
          		},
          		target: {
            		...selected.target,
					// value is based on target value(from editing input) multiply by number of base value
					value: e.target.value * selected.target.pointer,
          		},
        	});
	}
	
	// swap currencies base <-> target
	const swapCurrencies = () => {
		let base = selected.base;
		let target = selected.target;
		axios.get(`https://api.exchangeratesapi.io/latest?base=${target.cur}`)
			.then(data => {

				// good data structure for future use
				let correctData = Object.entries(data.data.rates).map(one => one = { cur:one[0], value:one[1]})

				setSelected({
					base: target,
					target : {
						cur:base.cur,
						value:base.value,
						pointer: correctData.filter(one=>one.cur === selected.base.cur)[0].value // correct value
					}
				})
				setListOfCurrencies(correctData);

				appContext.setState({
					...appContext.state,
					graphCurrency: data.data.base, // change graph currency
				});
			})
	}

    useEffect(() => window.localStorage.setItem("selected", JSON.stringify(selected)),[selected])// save on each change to the localStorage
    useEffect(() => appContext.graphCurrency && window.localStorage.setItem("graphCurrency", appContext.graphCurrency), [appContext.graphCurrency]);// save on each change to the localStorage

    return (
      	<div className="Converter">
        	<div className="selectCurrency">
          		<div className="singleCurrency">
            		<div className="selector">
              			<select
							value={selected.base.cur}
							onChange={(e) => refreshCurrencies(e, "base")}
              			>
                			{listOfCurrencies.map((one) => (
                  				<option value={one.cur} key={one.value}>
									{one.cur}
								</option>
                			))}
             			</select>
            		</div>
					<div className="valueInput">
						<input
							type="number"
							onChange={(e) => inputChange(e, "base")}
							min="0"
							value={selected.base.value * 1}
						/>
					</div>
          		</div>
				<div className="mixArrows" onClick={swapCurrencies}>
					swap
				</div>
          		<div className="singleCurrency">
					<div className="selector">
             			<select
							value={selected.target.cur}
							onChange={(e) => refreshCurrencies(e, "target")}
              			>
                			{listOfCurrencies.map((one) => (
								<option value={one.cur} key={one.value}>
									{one.cur}
								</option>
                			))}
              			</select>
            		</div>
					<div className="valueInput">
						<input
							type="number"
							onChange={(e) => inputChange(e, "target")}
							min="0"
							value={selected.target.value}
						/>
					</div>
          		</div>
        	</div>
			<div className="result">
			<div className="resultTitle">
				{selected.base.cur} / {selected.target.cur}
			</div>
			<div className="resultBody">
				<div>Selling 1.00000 {selected.base.cur} gives you {(1 * selected.target.pointer * 1).toFixed(5)} {selected.target.cur}</div>
				<div> Buying 1.00000 {selected.target.cur} costs you {((1 / selected.target.pointer) * 1).toFixed(5)} {selected.base.cur}</div>
			</div>
        </div>
      </div>
    );
}