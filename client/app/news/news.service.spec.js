'use strict';

describe('Service: news', function () {

  // load the service's module
  beforeEach(module('fluxApp'));

  // instantiate service
  var news;
  beforeEach(inject(function (_news_) {
    news = _news_;
  }));

  it('should do something', function () {
    expect(!!news).toBe(true);
  });

});
