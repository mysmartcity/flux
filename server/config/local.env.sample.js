'use strict';

// Use local.env.js for environment variables that grunt will set when the server starts locally.
// Use for your api keys, secrets, etc. This file should not be tracked by git.
//
// You will need to set these on the server you deploy to.

module.exports = {
    DOMAIN:           'http://localhost:9000',
    SESSION_SECRET:   'flux-secret',

    FACEBOOK_ID: '746545382074467',
    FACEBOOK_SECRET: 'cadf48c395a28928c028f60e97b7b1e0',

    GOOGLE_ID:        'app-id',
    GOOGLE_SECRET:    'secret',

    // Control debug level for modules using visionmedia/debug
    DEBUG: ''
};
