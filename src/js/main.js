(function () {

  var self = this;

  // ----------------
  // class
  // ----------------

  _.extend (self, {
    compareLessThanOrEqual: compareLessThanOrEqual,
    comparator            : comparator,
    complement            : complement,
    doWhen                : doWhen,
    executeIfHasField     : executeIfHasField,
    existy                : existy,
    fail                  : fail,
    lessOrEqual           : lessOrEqual,
    isEven                : isEven,
    isIndexed             : isIndexed,
    note                  : note,
    nth                   : nth,
    parseAge              : parseAge,
    second                : second,
    splat                 : splat,
    truthy                : truthy,
    unsplat               : unsplat,
    warn                  : warn
  });

  // ----------------
  // functions
  // ----------------

  function splat (func) {
    return function (array) {
      return func.apply (null, array);
    }
  }

  self.addArrayElements = splat (function (x, y) {
    return x + y;
  });


  function unsplat (func) {
    return function () {
      return func.call (null, _.toArray (arguments));
    }
  }

  self.joinElements = unsplat (function (array) {
    return array.join (' ');
  });

  // ----------------
  function parseAge (age) {
    if (!_.isString (age)) {
      self.fail ('age must be a String');
      return 0;
    }
    self.note ('attempting to parse age ' + age);
    var a = parseInt (age, 10);
    if (_.isNaN (a)) {
      self.warn ('unable to parse ' + age + ', returning 0');
      a = 0;
    }

    return a;
  }

  //console.log ('parsing', parseAge (12));
  //console.log ('parsing', parseAge ('12'));
  //console.log ('parsing', parseAge ('aaaa'));

  function warn (mssg) {
    console.log ('WARNING %s', mssg);
  }

  function note (mssg) {
    console.log ('NOTE %s', mssg);
  }

  function fail (mssg) {
    console.log ('FAIL %s', mssg);
    //throw new Error (mssg);
  }

  // ----------------

  function existy (x) {
    return x != null;
  }

  function truthy (x) {
    return self.existy (x) && x !== false;
  }

  function doWhen (cond, action) {
    if (truthy (cond)) {
      return action ();
    }
    else {
      return undefined;
    }
  }

  function executeIfHasField (target, name) {
    return self.doWhen (existy (target[ name ]), function () {
      var result = _.result (target, name);
      self.note ('the result is ' + result);
      return result;
    })
  }

  function complement (pred) {
    return function () {
      return !pred.apply (null, _.toArray (arguments));
    }
  }

  //executeIfHasField ([ 1, 2, 3 ], 'reverssse');
  //executeIfHasField ({foo:'bar'}, 'foo');

  //console.log ('filter', _.filter ([ 'a', 'b', 4, 'c', { foo: 'bar' } ], _.isNumber));
  //console.log ('complement', _.filter ([ 'a', 'b', 4, 'c', { foo: 'bar' } ], complement (_.isNumber)));


  // ----------------

  // make an array of all the values passed in
  function cat () {
    var head = _.first (arguments);

    if (existy (head)) {
      return _.toArray (head).concat.apply (head, _.rest (arguments));
    }
    return [];
  }

  //console.log (cat ([ 12, 1, 3 ], { foo: 'bar' }, [ 5, '77', 7 ], 'bite me'));
  //console.log (cat ({ foo: 'bar' }, [ 12, 1, 3 ], [ 5, '77', 7 ], 'bite me'));
  //console.log (cat ({ foo: 'bar' }));

  function construct (head, tail) {
    //console.log ('head = ', head);
    //console.log ('tail = ', tail);
    return cat ([ head ], _.toArray (tail));
  }

  //console.log (construct ({ foo: 'bar' }, [ 5, '77', 7 ]));

  function mapcat (func, coll) {
    return cat.apply (null, _.map (coll, func))
  }

  //var foo = function (e) {
  //  //console.log ('e = ', e);
  //  return construct (e, [ '==' ]);
  //};
  //console.log (mapcat (foo, [ 1, 2, 3, 4 ]));

  function butLast (coll) {
    return _.toArray (coll).slice (0, -1);
  }

  function interpose (inter, coll) {
    return butLast (mapcat (function (e) {
      return construct (e, [ inter ]);
    }, coll));
  }

  //console.log (interpose (',', [ 1, 2, 3, 4 ]));

  //console.log (_.pick ({a:1, b:2, c:3}, 'a',  'c'));

  // ----------------
  function project (table, keys) {
    return _.map (table, function (obj) {
      return _.pick.apply (null, construct (obj, keys))
    })
  }

  var library = [
    {
      title: 'SCIP',
      isbn : 1,
      ed   : 1
    },
    {
      title: 'SCIP',
      isbn : 2,
      ed   : 2
    },
    {
      title: 'Joy of Clojure',
      isbn : 3,
      ed   : 1
    }
  ];
  console.log ('edition results', project (library, [ 'title', 'isbn' ]));

  // ----------------
  function nth (data, idx) {
    if (!_.isNumber (idx)) {
      throw new Error ('Index must be a number');
    }
    if (!self.isIndexed (data)) {
      throw new Error ('Data is not indexed');
    }
    if ((idx < 0) || (idx > data.length)) {
      throw new Error ('Index out of range');
    }

    return data[ idx ];
  }

  function isIndexed (data) {
    return _.isArray (data) || _.isString (data);
  }

  function second (data) {
    return self.nth (data, 1);
  }

  function compareLessThanOrEqual (a, b) {
    if (x < y) {
      return -1;
    }
    else if (x > y) {
      return 1;
    }
    return 0;
  }

  function lessOrEqual (x, y) {
    return x <= y;
  }

  function isEven (x, y) {
    return x % 2 === 0 && y % 2 == 0;
  }


  function comparator (pred) {
    return function (x, y) {
      if (self.truthy (pred (x, y))) {
        return -1;
      }
      else if (self.truthy (pred (y, x))) {
        return 1;
      }
      else {
        return 0;
      }
    }
  }

  // ----------------


  // ----------------
  function lameCSV (str) {
    return _.reduce (str.split ('\n'), function (table, row) {
      table.push (_.map (row.split (','), function (c) {
        return c.trim ()
      }));
      return table;
    }, []);
  }

  function selectNames (table) {
    return _.rest (_.map (table, _.first));
  }

  function selectAges (table) {
    return _.rest (_.map (table, second));
  }

  function selectHairColor (table) {
    return _.rest (_.map (table, function (row) {
      return nth (row, 2);
    }));
  }

  var mergeResults = _.zip;

  //var table       = 'name, age, hair \n merble, 35, red \n bob, 64, grey';
  //var peopleTable = lameCSV (table);
  //console.log ('peopeTable', peopleTable);
  //console.log ('names', selectNames (peopleTable));
  //console.log ('names and ages', mergeResults (selectNames (peopleTable), selectAges (peopleTable)));
  //console.log ('hair', selectHairColor (peopleTable));


}) ();

//var arr = [ -100, -31, 59, -234, 34, 1, -1, -23, 33, 5, 18, -1 ];
//console.log ('truthy?', self.truthy (0));
//console.log ('truthy?', self.truthy ({ foo: 'bar' }));
//console.log ('existy?', self.existy (0));
//console.log ('false == 0', false == 0);
//console.log ('0 == false', 0 == false);
//console.log ('nativeNth', self.nth (arr, '-1'));
//console.log ('nativeNth', self.nth (4, 4));

//console.log ('sort', arr.sort (comparator (lessOrEqual)));
//console.log ('sort', arr.sort (comparator (_.isEqual)));