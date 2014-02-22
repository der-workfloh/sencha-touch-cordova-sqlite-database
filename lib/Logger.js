/**
 * Logger
 * 
 * @author Florian Horn
 * @version 1.0, 21.02.2014
 * @namespace ws
 * @name Logger
 */

Ext.define('ws.Logger', {
    statics: {
        /**
         * Log message
         * @param {string} msg Message to log
         * @return void
         */
        log: function(msg) {
            console.log(msg);
        }
    }
});