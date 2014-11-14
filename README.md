# pocketchange.forecast-grouper 

Given a collection of objects like such:

```javascript
[{
  "date": "8-14-2014",
  "type": "credit", // "debit"
  "title": "salary",
  "amount": 1000.00
}]
```

It should group all debits by the closest credit date that is on or before
the debit's date.

## Usage

```javascript
var forecastGrouper = require('forecast-grouper');
forecastGrouper(/* journal*/); // "awesome"
```

## API

_(Coming soon)_


## Contributing

In lieu of a formal styleguide, take care to maintain the existing coding style. 
Add unit tests for any new or changed functionality. Lint and test your code 
using [gulp](http://gulpjs.com/).


## Release History

_(Nothing yet)_

## Example

### Raw

| 8-14-2014    | 8-15-2014    | 9-15-2014   | 8-14-2014          | 8-20-2014   | 8-17-2014   
| ------------ | ------------ | ----------- | ------------------ | ----------- | ---------------
| credit       | debit        | debit       | debit              | credit      | debit
| salary 1     | electric     | electric    | american furniture | salary 2    | home furnishings  
| 1000         | 100          | 100         | 50                 | 800         | 150
  

### Grouped

* 8-14-2014
    * Credits:
        * salary 1 - $1,000.00
    * Debits:
        * (8-15-2014) electric - $100.00
        * (8-14-2014) american furniture - $50.00
        * (8-17-2014) home furnishings - $150.00
* 8-20-2014
    * Credits:
        * salary 2 - $800.00
    * Debits:
        * (9-15-2014) electric - $100.00



## License

Copyright (c) 2014 Justin Obney. Licensed under the MIT license.
