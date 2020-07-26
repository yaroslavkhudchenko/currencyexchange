# Currency converter 

## Legend

<ul>
    <li>User can change base/target currencies</li>
    <li>User can change base/target currencies values</li>
    <li>User can swap currencies by pressing mix</li>
    <li>User can use graph to check currency value changes regards to USD,GBP and SGD starting from 2014-12-29</li>
    <li>User can use graph to check currency value changes sorted by 1,3,6 months, 1 year, all time and from the beginning of the current year</li>
    <li>User can check price of bying and selling 1 peace of base/target currencies in the result box below inputs</li>
</ul>

## Tech Stack

<ul>
    <li>React.js</li>
    <li>highcharts-react - graph (https://github.com/highcharts/highcharts-react) </li>
    <li>sass - styling</li>
    <li>axios - for api requests</li>
</ul>

## Data

Data is taken from http://exchangeratesapi.io/

## How to run

1.clone the repository and go to folder: 
```
git clone https://github.com/yaroslavkhudchenko/currencyexchange.git && cd currencyexchange
```
2.for dev mode run:
```
npm start
```
3.for tests:
```
npm test
```
4.to build prod version run:
```
npm run build
```
and find the build version in ./build folder


## TO DO:

1. animation on loading
2. unit tests