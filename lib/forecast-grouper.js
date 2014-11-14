/*
 * forecast-grouper
 * https://github.com/justinobney/forecast-grouper
 *
 * Copyright (c) 2014 Justin Obney
 * Licensed under the MIT license.
 */

'use strict';

var _ = require('lodash');
var WeekSummary = require('./week-summary');

module.exports = function build(forecastData) {
  var grouped = _.groupBy(forecastData, 'type');
  var summaries = _(grouped.credit)
    .groupBy('date')
    .map(createWeekSummayByCreditDate)
    .value();

  var sortedSummaries = _.sortBy(summaries, parseDate).reverse();

  _.forEach(sortedSummaries, matchDebitsToDate);

  return summaries;

  function createWeekSummayByCreditDate(val, key) { return new WeekSummary(key, val, []); }
  function parseDate(entry) { return new Date(entry.date); }

  function matchDebitsToDate(summary) {
    summary.debits = _.reject(grouped.debit, _.partial(isDebitBeforeCreditDate, summary));
    grouped.debit = _.reject(grouped.debit, _.partial(removeProcessedDebits, summary));
  }

  function isDebitBeforeCreditDate(summary, debit) { return new Date(debit.date) < new Date(summary.date); }
  function removeProcessedDebits(summary, debit) { return _.contains(summary.debits, debit); }
};
