import React, { useState } from 'react';
import './../Styles/Converter.scss';

export const Converter = () => {

    // selected base and target currencies for the selectors
    let [selectedBase, setSelectedBase] = useState({cur:'SEK', val:1});
    let [selectedTarget, setSelectedTarget] = useState({cur:'USD', val: 1});

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