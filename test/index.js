'use strict';

var Test = require('segmentio-integration-tester');
var fmt = require('util').format;
var fs = require('fs');
var helpers = require('./helpers');
var Calq = require('..');

describe('Calq', function() {
  var settings;
  var calq;
  var test;

  beforeEach(function() {
    settings = { writeKey: '0e116d3930b329831f146716c3667dfe' };
    calq = new Calq(settings);
    test = Test(calq, __dirname);
  });

  it('should have the correct settings', function() {
    test
      .name('Calq')
      .channels(['server', 'client', 'mobile'])
      .ensure('settings.writeKey');
  });

  describe('.validate()', function() {
    it('should be invalid when .writeKey is missing', function() {
      delete settings.writeKey;
      test.invalid({}, settings);
    });

    it('should be valid when settings are complete', function() {
      test.valid({}, settings);
    });
  });

  describe('mapper', function() {
    describe('track', function() {
      it('should map basic track', function() {
        test.maps('track-basic', settings);
      });

      it('should map full track', function() {
        test.maps('track-full', settings);
      });
    });

    describe('alias', function() {
      it('should map alias', function() {
        test.maps('alias', settings);
      });
    });

    describe('identify', function() {
      it('should map basic identify', function() {
        test.maps('identify-basic', settings);
      });
    });
  });

  describe('.track()', function() {
    it('should be able to track correctly', function(done) {
      fixture('track-full', function(err, json) {
        if (err) { return done(err); }

        test
          .set(settings)
          .track(json.input)
          .sends(json.output)
          .expects(200, done);
      });
    });

    it('should be able to track a bare call correctly', function(done) {
      fixture('track-basic', function(err, json) {
        if (err) { return done(err); }

        test
          .set(settings)
          .track(json.input)
          .sends(json.output)
          .expects(200, done);
      });
    });

    it('should error on an invalid write key', function(done) {
      test
        .set({ writeKey: 'bad-key' })
        .track(helpers.track())
        .expects(403)
        .error('cannot POST /track (403)', done);
    });
  });

  describe('.identify()', function() {
    it('should be able to identify correctly', function(done) {
      fixture('identify-basic', function(err, json) {
        if (err) { return done(err); }

        test
          .identify(json.input)
          .sends(json.output)
          .expects(200, done);
      });
    });

    it('should error on invalid write key', function(done) {
      fixture('identify-basic', function(err, json) {
        if (err) { return done(err); }

        test
          .set({ writeKey: 'bad-key' })
          .identify(json.input)
          .expects(403)
          .error('cannot POST /profile (403)', done);
      });
    });
  });

  describe('.alias()', function() {
    it('should be able to alias properly', function(done) {
      fixture('alias', function(err, json) {
        if (err) { return done(err); }

        test
          .alias(json.input)
          .sends(json.output)
          .expects(200, done);
      });
    });

    it('should error on invalid write key', function(done) {
      fixture('alias', function(err, json) {
        if (err) { return done(err); }

        test
          .set({ writeKey: 'bad-key' })
          .alias(json.input)
          .expects(403)
          .error('cannot POST /transfer (403)', done);
      });
    });
  });

  describe('.page()', function() {
    it('should be able to track all pages', function(done) {
      fixture('page-all', function(err, json) {
        if (err) { return done(err); }

        test
          .set(settings)
          .page(json.input)
          .sends(json.output)
          .expects(200, done);
      });
    });

    it('should be able to track categorized pages', function(done) {
      fixture('page-categorized', function(err, json) {
        if (err) { return done(err); }

        test
          .set(settings)
          .page(json.input)
          .sends(json.output)
          .expects(200, done);
      });
    });

    it('should be able to track named pages', function(done) {
      fixture('page-named', function(err, json) {
        if (err) { return done(err); }

        test
          .set(settings)
          .page(json.input)
          .sends(json.output)
          .expects(200, done);
      });
    });
  });

  describe('.screen()', function() {
    it('should be able to track all screens', function(done) {
      fixture('screen-all', function(err, json) {
        if (err) { return done(err); }

        test
          .set(settings)
          .screen(json.input)
          .sends(json.output)
          .expects(200, done);
      });
    });

    it('should be able to track categorized screens', function(done) {
      fixture('screen-categorized', function(err, json) {
        if (err) { return done(err); }

        test
          .set(settings)
          .screen(json.input)
          .sends(json.output)
          .expects(200, done);
      });
    });

    it('should be able to track named screens', function(done) {
      fixture('screen-named', function(err, json) {
        if (err) { return done(err); }

        test
          .set(settings)
          .screen(json.input)
          .sends(json.output)
          .expects(200, done);
      });
    });
  });
});

/**
 * Loads a fixture and adds timestamps.
 */

function fixture(file, cb) {
  var path = fmt('%s/fixtures/%s.json', __dirname, file);
  fs.readFile(path, function(err, data) {
    if (err) { return cb(err); }
    var json = JSON.parse(data);
    var now = new Date;
    json.input.timestamp = String(now.getFullYear());
    json.output.timestamp = fmt('%d-01-01T00:00:00.000Z', now.getFullYear());
    cb(null, json);
  });
}
