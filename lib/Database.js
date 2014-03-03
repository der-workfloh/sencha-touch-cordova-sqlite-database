/**
 * SQLite database
 * Requires SQLite Plugin for Cordova, see
 * https://github.com/lite4cordova/Cordova-SQLitePlugin
 * 
 * @author Florian Horn
 * @version 1.0, 18.02.2014
 * @namespace ws.database
 * @name Sqlite
 */

Ext.define('ws.database.Sqlite', {
    requires: ['ws.Logger'],
    
    statics: {
        database: null,
        result: [],
        statement: null,



        /**
         * Initialize databsae connection
         * @param {string} database Database name
         * @param {string} version Version number
         * @param {string} name *deprecated* Name parameter
         * @param {int} size Pre-allocated database size on hardware
         */
        initialize: function(database, version, name, size) {
            if (true === this.isInitialized()) {
                return;
            }
            
            //
            // --- check if cordova is available, if not use fallback to sql
            // --- so application is compatible to be run as webapp
            //
            if (window.cordova) {
                ws.database.Sqlite.database = window.sqlitePlugin.openDatabase(database, version, name, size);
            } else {
                ws.database.Sqlite.database = window.openDatabase(database, version, name, size);
            }
        },
        
        
        
        /**
         * Check if sqlite databse has been initalized
         * @return boolean
         */
        isInitialized: function() {
            return null !== ws.database.Sqlite.database;
        },



        /**
         * clear internal statement artifacts
         * @return void
         */
        clear: function() {
            ws.database.Sqlite.result = [];
            ws.database.Sqlite.statement = null;
        },



        /**
         * get the result array
         * @return array
         */
        getResult: function() {
            return ws.database.Sqlite.result;
        },



        /**
         * Execute statements expecting a result (e.g. select)
         * @param {string} stmt Statement string
         * @return {array}
         */
        executeWithResult: function(stmt) {
            ws.Logger.log('[DB::executeWithResult]');
            ws.database.Sqlite.clear();
            ws.database.Sqlite.statement = stmt;
            ws.database.Sqlite.database.transaction(
                    function(tx) {
                        ws.Logger.log('[DB::transaction] Statement: "'+ws.database.Sqlite.statement+'"');
                        tx.executeSql(
                                ws.database.Sqlite.statement,
                                [],
                                // success
                                function(tx, results) {
                                    ws.Logger.log('[DB::executeSql] statement successfully loaded');
                                    ws.database.Sqlite.result = results;
                                }, 
                                // error
                                function(err) {
                                    ws.Logger.log('[DB::executeSql] statement error occured: '+err);
                                });
                    }, 
                    // error
                    function(err) {
                        ws.Logger.log('[DB::transaction] database error occured: '+err);
                    }, 
                    // success
                    function() {
                        ws.Logger.log('[DB::transaction] database succeeded');
                    });
            return ws.database.Sqlite.result;
        },



        /**
         * Execute statements without expecting a result (e.g. insert)
         * @param {string} stmt Statement string
         */
        execute: function(stmt) {
            ws.Logger.log('[DB::execute]');
            ws.database.Sqlite.clear();
            ws.database.Sqlite.statement = stmt;
            ws.database.Sqlite.database.transaction(function(tx) {
                        ws.Logger.log('[DB::transaction] Statement: "'+ws.database.Sqlite.statement+'"');
                        tx.executeSql(ws.database.Sqlite.statement);
                    }, 
                    // error
                    function(err) {
                        ws.Logger.log('[DB::transaction] database error occured: '+err);
                    }, 
                    // success
                    function() {
                        ws.Logger.log('[DB::transaction] database succeeded');
                    });
        }
    }
});