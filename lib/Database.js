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
    statics: {
        database: null,
        result: [],
        statement: null,



        /**
         * Initialize databsae connection
         * @param {string} database database name
         * @param {string} version version number
         * @param {string} name deprecated name parameter
         * @param {int} size pre-allocated database size on hardware
         */
        initialize: function(database, version, name, size) {
            ws.database.Sqlite.database = window.sqlitePlugin.openDatabase(database, version, name, size);
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
         * @param {string} stmt statement string
         * @return {array}
         */
        executeWithResult: function(stmt) {
            console.log('[DB::executeWithResult]');
            ws.database.Sqlite.clear();
            ws.database.Sqlite.statement = stmt;
            ws.database.Sqlite.database.transaction(
                    function(tx) {
                        console.log('[DB::transaction]');
                        tx.executeSql(
                                ws.database.Sqlite.statement,
                                [],
                                // success
                                function(tx, results) {
                                    console.log('[DB::executeSql] statement successfully loaded');
                                    ws.database.Sqlite.result = results;
                                }, 
                                // error
                                function(err) {
                                    console.log('[DB::executeSql] statement error occured: '+err);
                                });
                    }, 
                    // error
                    function(err) {
                        console.log('[DB::transaction] database error occured: '+err);
                    }, 
                    // success
                    function() {
                        console.log('[DB::transaction] database succeded');
                    });
            return ws.database.Sqlite.result;
        },



        /**
         * Execute statements without expecting a result (e.g. insert)
         * @param {string} stmt statement string
         */
        execute: function(stmt) {
            console.log('[DB::execute]');
            ws.database.Sqlite.clear();
            ws.database.Sqlite.statement = stmt;
            ws.database.Sqlite.database.transaction(function(tx) {
                        console.log('[DB::transaction]');
                        tx.executeSql(ws.database.Sqlite.statement);
                    }, 
                    // error
                    function(err) {
                        console.log('[DB::transaction] database error occured: '+err);
                    }, 
                    // success
                    function() {
                        console.log('[DB::transaction] database succeded');
                    });
        }
    }
});