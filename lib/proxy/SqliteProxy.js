/**
 * SQLite proxy
 * 
 * @author Florian Horn
 * @version 1.0, 21.02.2014
 * @namespace ws.proxy
 * @name Sqlite
 */

Ext.define('ws.proxy.Sqlite', {
    alias: 'proxy.sqlite',
    extend: 'Ext.data.proxy.Sql',
    requires: ['ws.database.Sqlite'],
    
    getDatabaseObject: function() {
        return ws.database.Sqlite.database;
    }
});