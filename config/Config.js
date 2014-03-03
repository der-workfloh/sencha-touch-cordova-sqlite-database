/**
 * App Config
 * 
 * @author Florian Horn
 * @version 1.0, 23.02.2014
 * @namespace App.config
 * @name Config
 */

Ext.define('App.config.Config', {
  singleton: true,
 
  config: {
    /* DATABASE SETTINGS */
    dbName: 'ws-default-db',
    dbDescription: 'ws',
    dbVersion: '1.0',
    dbSize: 200 * 1024 * 1024 // 200 MB
  },
 
  constructor: function(config) {
    this.initConfig(config);
    return this;
  }
});