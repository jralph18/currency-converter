# currency-converter

A currency converter built with pure HTML, CSS (+Bootstrap), and JavaScript. Queries Open Exchange Rates API for list of available currencies and for exchange rates. Allows user to swap selected currencies and outputs result of exchange along with the unit exchange rates (starting currency -> ending currency + ending currency -> starting currency).

## App

Converter on page load.
![App Start](/images/currency-converter-home.png)

Converter as user is selecting currencies.
![Dropdown Open](/images/currency-converter-select.png)

Currency Converter result after user has clicked "Convert!".
![Convert Result](/images/currency-converter-result.png)

## Installation

To run: git clone or git fork to get a copy on your local machine. Create an account with Open Exchange Rates (https://openexchangerates.org/) to get an APP ID for their API. Create config.js file with config object with your APP ID:
var config = {
    APP_ID: 'xxxxxxxxxxxxxxxxxx'
}
Open index.html in browser.