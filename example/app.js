var app = angular.module('plunker', []);

app.controller('MainCtrl', function($scope, $http, forecastGrouper) {
  $http.get('input.json')
    .then(function(resp) {
      $scope.raw = resp.data;
      $scope.parsed = forecastGrouper.build($scope.raw);
    })
});

app.factory('forecastGrouper', function() {
  var svc = {};

  svc.build = function(forecastData) {
    var summaries = [],
      grouped = _.groupBy(forecastData, 'type');

    _.chain(grouped.credit)
      .groupBy('date')
      .forEach(function(val, key) {
        summaries.push(new WeekSummary(key, val, []));
      });

    var sortedSummaries = _.sortBy(summaries, orderByDate).reverse();

    _.forEach(sortedSummaries, function(summary) {
      summary.debits = _.reject(grouped.debit, findOlderDebits);

      grouped.debit = _.reject(grouped.debit, removeProcessedDebits);

      function findOlderDebits(debit) {
        return new Date(debit.date) < new Date(summary.date);
      }

      function removeProcessedDebits(debit) {
        return _.contains(summary.debits, debit);
      }
    });

    return summaries;

    function orderByDate(entry) {
      return new Date(entry.date);
    }
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
  })

  return svc;

});
