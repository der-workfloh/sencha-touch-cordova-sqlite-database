/**
 * SQLite proxy
 * 
 * @author Florian Horn
 * @version 
 * 1.0, 21.02.2014<br/>
 * 1.1, 03.03.2014<br/>
 * @namespace ws.proxy
 * @name Sqlite
 */

Ext.define('ws.proxy.Sqlite', {
    alias: 'proxy.sqlite',
    extend: 'Ext.data.proxy.Sql',
    requires: ['ws.database.Sqlite',
        'App.config.Config'],
    
    getDatabaseObject: function() {
        ws.Logger.log('[SQLiteProxy::getDatabaseObject]');
        if (false === ws.database.Sqlite.isInitialized()) {
            ws.database.Sqlite.initialize(
                    App.config.Config.getDbName(),
                    App.config.Config.getDbVersion(),
                    App.config.Config.getDbDescription(),
                    App.config.Config.getDbSize());
        }
        return ws.database.Sqlite.database;
    },
    
    
    
    selectRecords: function(transaction, params, callback, scope) {
        var me = this,
            table = me.getTable(),
            idProperty = me.getModel().getIdProperty(),
            sql = 'SELECT * FROM ' + table,
            sqlCount,
            records = [],
            filterStatement = ' WHERE ',
            sortStatement = ' ORDER BY ',
            i, ln, data, result, count, rows, filter, sorter, property, value;

        result = new Ext.data.ResultSet({
            records: records,
            success: true
        });

        if (!Ext.isObject(params)) {
            sql += filterStatement + idProperty + ' = ' + params;
        } else {
            ln = params.filters && params.filters.length;
            if (ln) {
                for (i = 0; i < ln; i++) {
                    filter = params.filters[i];
                    property = filter.getProperty();
                    value = filter.getValue();
                    if (property !== null) {
                        sql += filterStatement + property + ' ' + (filter.getAnyMatch() ? ('LIKE \'%' + value + '%\'') : ('= \'' + value + '\''));
                        filterStatement = ' AND ';
                    }
                }
            }

            ln = params.sorters && params.sorters.length;
            if (ln) {
                for (i = 0; i < ln; i++) {
                    sorter = params.sorters[i];
                    property = sorter.getProperty();
                    if (property !== null) {
                        sql += sortStatement + property + ' ' + sorter.getDirection();
                        sortStatement = ', ';
                    }
                }
            }
            
            // handle correct total count
            sqlCount = sql.replace('SELECT \* FROM','SELECT COUNT(\*) as "count" FROM');

            // handle start, limit, sort, filter and group params
            if (params.page !== undefined) {
                sql += ' LIMIT ' + parseInt(params.start, 10) + ', ' + parseInt(params.limit, 10);
            }
        }
        transaction.executeSql(sql, null,
            function(transaction, resultSet) {
                rows = resultSet.rows;
                count = rows.length;

                for (i = 0, ln = count; i < ln; i++) {
                    data = rows.item(i);
                    records.push({
                        clientId: null,
                        id: data[idProperty],
                        data: data,
                        node: data
                    });
                }

                result.setSuccess(true);
                result.setTotal(count);
                result.setCount(count);
            },
            function(transaction, error) {
                result.setSuccess(false);
                result.setTotal(0);
                result.setCount(0);

                if (typeof callback == 'function') {
                    callback.call(scope || me, result, error);
                }
            }
        );

        // check total count and correct the result value
        transaction.executeSql(sqlCount, null,
            function(transaction, resultSet) {
                var total = resultSet.rows.item(0).count;
                result.setTotal(total);

                if (typeof callback == 'function') {
                    callback.call(scope || me, result);
                }
            },
            function(transaction, error) {
                result.setSuccess(false);
                result.setTotal(0);
                result.setCount(0);

                if (typeof callback == 'function') {
                    callback.call(scope || me, result, error);
                }
            }
        );
    }
});