var auth         = require('./auth')
  , facade       = require('segmentio-facade')
  , helpers      = require('./helpers')
  , integrations = require('..')
  , should       = require('should');


var mixpanel = new integrations['Mixpanel']()
  , settings = auth['Mixpanel'];


describe('Mixpanel', function () {

  describe('.enabled()', function () {
    it('should only be enabled for server side messages', function () {
      mixpanel.enabled(new facade.Track({ channel : 'server' })).should.be.ok;
      mixpanel.enabled(new facade.Track({ channel : 'client' })).should.not.be.ok;
      mixpanel.enabled(new facade.Track({})).should.not.be.ok;
    });
  });


  describe('.validate()', function () {
    it('should not validate settings without a token', function () {
      var identify = helpers.identify();
      mixpanel.validate(identify, {}).should.be.instanceOf(Error);
    });

    it('should validate proper identify calls', function () {
      var identify = helpers.identify();
      should.not.exist(mixpanel.validate(identify, { token : 'x' }));
    });

    it('should not validate old track calls without an apiKey', function () {
      var track = helpers.track({ timestamp : new Date('5/10/2013') });
      mixpanel.validate(track, { token : 'x' }).should.be.instanceOf(Error);
    });

    it('should validate old track calls with an apiKey', function () {
      var track = helpers.track({ timestamp : new Date('5/10/2013') });
      should.not.exist(mixpanel.validate(track, {
        token : 'x',
        apiKey : 'x'
      }));
    });
  });


  describe('.track()', function () {
    it('should be able to track correctly', function (done) {
      mixpanel.track(helpers.track(), settings, done);
    });

    it('should be able to track a bare call', function (done) {
      mixpanel.track(helpers.track.bare(), settings, done);
    });

    it('should increment', function(done){
      var opts = {};
      for (var k in settings) opts[k] = settings[k];
      var track = helpers.track({ event: 'increment' });
      opts.increments = [track.event()];
      mixpanel.track(track, opts, done);
    })

    it('should be able to track ill-formed traits', function (done) {
      mixpanel.track(helpers.track.bare({
        context : {
          traits : 'aaa'
        }
      }), settings, done);
    });
  });


  describe('.identify()', function () {
    var identify = helpers.identify();
    it('should be able to identify correctly', function (done) {
      mixpanel.identify(identify, settings, done);
    });
  });

  describe('.alias()', function () {
    var alias = helpers.alias();
    it('should be able to alias properly', function (done) {
      mixpanel.alias(alias, settings, done);
    });
  });
});
