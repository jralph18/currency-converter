const APP_ID = config.APP_ID;
let currencies;

/**
 * Populates To/From dropdown menus with available currencies.
 * 
 * Queries Open Exchange Rates API to find available currencies. Uses the JSON response
 * consisting of an object with key, value pair of currency code, currency name to
 * populate the To/From dropdown menus for user choices.
 */
const getCurrencies = () => {
    fetch('https://openexchangerates.org/api/currencies.json?app_id=' + APP_ID)
    .then(response => response.json())
    .then(data => {

        // Fetched json data is an object with keys=currency codes and values=currency names (long form).
        currencies = data;
        const fromDropdown = document.getElementById("fromdropdown");
        const toDropdown = document.getElementById("todropdown");

        for (const [currencyCode, currencyName] of Object.entries(currencies)) {
            
            let fromOption = createCurrencyOption(fromDropdown.id, currencyCode, currencyName);
            fromDropdown.append(fromOption);
            
            let toOption = createCurrencyOption(toDropdown.id, currencyCode, currencyName);
            toDropdown.append(toOption);
        }

        /**
         * Helper function that creates an option element for a select html parent element.
         * 
         * @param {String} parentId     the id of the parent element for the option element.
         * @param {String} currencyCode the currency code of the currency to be added.
         * @param {String} currencyName the full name of the currency to be added.
         * @return {HTML Element}       HTML option element with id based on parentId.       
         */
        function createCurrencyOption(parentId, currencyCode, currencyName) {
            let option = document.createElement("option");
            option.id = parentId + currencyCode;
            option.value = currencyCode;
            option.text = currencyCode + " - " + currencyName;
            return option;
        }
    });
}

/**
 * Adds submit event listener for the currency converter form. Uses exchange rates from
 * Open Exchange Rates API to convert between From and To currencies. Also finds unit 
 * currency conversions between the two currencies. Displays these results in the conversion
 * container to the user.
 * 
 * Note: the exchange rates from Open Exchange Rates are given relative to the US Dollar (USD).
 */
const loadFormHandler = () => {
    const currencyForm = document.getElementById("currencyform");
    currencyForm.addEventListener('submit', (event) => {
        event.preventDefault();

        // Gets values submitted by user in the form
        const amountToConvert = document.getElementById("amount").value;
        const fromCurrency = document.getElementById("fromdropdown").value;
        const toCurrency = document.getElementById("todropdown").value;

        // Fetches current exchange rates from Open Exchange Rates API
        fetch(`https://openexchangerates.org/api/latest.json?app_id=${APP_ID}`)
        .then(response => response.json())
        .then(data => {
            const exchangeRatesUSDBase = data.rates;
            const conversionAmount = convertCurrency(amountToConvert, exchangeRatesUSDBase, fromCurrency, toCurrency);

            /* Add HTML to display result formatted as:
                    4.00 United States Dollar =
                    3.37 Euro
            */
            document.getElementById("specific-result-from").innerHTML = amountToConvert + " " + currencies[fromCurrency] + " =";
            document.getElementById("specific-result-to").innerHTML = conversionAmount + " " + currencies[toCurrency];

            /*
                Add HTML to display unit-based exchange rate formatted as:
                    1 USD = 0.841365 EUR
                    1 EUR = 1.188545 USD
            */
            const numberOfDecimals = 6; // Arbitrary choice of decimal precision
            document.getElementById("unit-result-from").innerHTML = "1 " + fromCurrency + " = " + 
                                    convertCurrency(1, exchangeRatesUSDBase, fromCurrency, toCurrency, numberOfDecimals) 
                                    + " " + toCurrency;
            document.getElementById("unit-result-to").innerHTML = "1 " + toCurrency + " = " + 
                                    convertCurrency(1, exchangeRatesUSDBase, toCurrency, fromCurrency, numberOfDecimals) 
                                    + " " + fromCurrency;
        });
    });
}

/**
 * Swaps the currency selected in the "From" dropdown and the currency selected in the
 * "To" dropdown. Uses the id created in getCurrencies (parentElementId + currencyCode)
 * to make the swap.
 */
const swapFromAndTo = () => {
    // Currency codes stored as values in the dropdown. See getCurrencies.
    const fromCurrencyCode = document.getElementById("fromdropdown").value;
    const toCurrencyCode = document.getElementById("todropdown").value;

    // Change the selected option element. OptionId = parentId + optionValue. See getCurrencies.
    document.getElementById("fromdropdown" + toCurrencyCode).selected = true;
    document.getElementById("todropdown" + fromCurrencyCode).selected = true;
}

/**
 * Helper function to convert from one currency to another.
 * 
 * @param {Number} amount                the value to be converted.
 * @param {Object} relativeExchangeRates object containing relative exchange rates for available currencies.
 * @param {String} fromCurrency          the currency code of the starting currency.
 * @param {String} toCurrency            the currency code of the currency to be converted to.
 * @param {Number} numberOfDecimals      (optional, default=2) number of decimals for the return value.
 * @return {String}                      the amount converted to the To currency. Returned as String for decimal precision.
 */
const convertCurrency = (amount, relativeExchangeRates, fromCurrency, toCurrency, numberOfDecimals=2) => {
    fromRelativeRate = relativeExchangeRates[fromCurrency];
    toRelativeRate = relativeExchangeRates[toCurrency];
    return (amount * (toRelativeRate / fromRelativeRate)).toFixed(numberOfDecimals);
}

/**
 * Helper function to format user input automatically to two decimal places.
 * 
 * @param {*} event onchange event generated by typing in the amount input field.
 */
function setTwoNumberDecimal(event) {
    this.value = parseFloat(this.value).toFixed(2);
}

/**
 * On page load fetch the currencies from the API, load dropdown menus, add event listener to
 * the form, assign function to swap button, and assign onchange to amount input element.
 * 
 * @param {*} event Load page event.
 */
window.onload = (event) => {
    getCurrencies();
    loadFormHandler();
    document.getElementById("swap-btn").onclick = swapFromAndTo;
    document.getElementById("amount").onchange = setTwoNumberDecimal;
}