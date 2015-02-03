'use strict';

var ngModule;

try {
	ngModule = angular.module('pd');
} catch(err) {
	ngModule = angular.module('pd', []);
}

module.exports = ngModule;


require('../vendor/angular-local-storage/dist/angular-local-storage.js');

ngModule.requires.push( 'LocalStorageModule' );
