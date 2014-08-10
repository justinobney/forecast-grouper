/*
 * forecast-grouper
 * https://github.com/justinobney/forecast-grouper
 *
 * Copyright (c) 2014 Justin Obney
 * Licensed under the MIT license.
 */

'use strict';

var _ = require('lodash');

exports.build = function(forecastData) {
  var summaries = [],
    grouped = _.groupBy(forecastData, 'type');

  _.chain(grouped.credit)
    .groupBy('date')
    .forEach(function(val, key) {
      summaries.push(new WeekSummary(key, val, []));
    });

  var sortedSummaries = _.sortBy(summaries, orderByDate).reverse();

  _.forEach(sortedSummaries, function(summary){
    summary.debits = _.reject(grouped.debit, findOlderDebits);

    grouped.debit = _.reject(grouped.debit, removeProcessedDebits);

    function findOlderDebits(debit){
      return new Date(debit.date) < new Date(summary.date);
    }

    function removeProcessedDebits(debit){
      return _.contains(summary.debits, debit);
    }
  });

  return summaries;

  function orderByDate(entry){return new Date(entry.date);}
};

function WeekSummary(date, credits, debits) {
  this.date = date;
  this.credits = credits;
  this.debits = debits;
}

_.extend(WeekSummary.prototype, {
  calulateNet: function(){
    var sources = [
      _.pluck(this.credits, 'amount'),
      _.map(this.debits, ensureDebit)
    ];

    var combined = Array.prototype.concat.apply([],sources);

    return _.reduce(combined, function(n, memo){return n + memo},0)

    function ensureDebit(n){
      return -1 * Math.abs(n.amount);
    }
  }
});
