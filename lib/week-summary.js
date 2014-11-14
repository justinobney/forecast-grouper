'use strict';

var _ = require('lodash');

function WeekSummary(date, credits, debits) {
  this.date = date;
  this.credits = credits;
  this.debits = debits;
}

WeekSummary.prototype.calulateNet = function calulateNet() {
  var sources = [
    _.pluck(this.credits, 'amount'),
    _.map(this.debits, ensureDebit)
  ];

  var combined = Array.prototype.concat.apply([], sources);

  return _.reduce(combined, sum, 0);

  function sum(n, memo) {
    return n + memo;
  }

  function ensureDebit(n) {
    return -1 * Math.abs(n.amount);
  }
};

module.exports = WeekSummary;
