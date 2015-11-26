/**
 * Created by endong on 2015/11/25.
 */
Ext.define('Code.Grid', {
    extend: 'Ext.grid.Panel',
    required: 'Model.RegModel',
    title: '',

    initComponent: function() {
        var me = this;
        /**
         * Ext 3种 Model实例化的方式
         */
        me.data1 = Ext.create('Model.RegModel',{
            name: '1',
            age: '2',
            sex: '3'
        });
        me.data2 = new Model.RegModel({
            name: '吴恩东',
            age: '22',
            sex: '男'
        });
        me.data3 = Ext.ModelManager.create({
            name: 'wuendong',
            age: '22',
            sex: '1'
        }, 'Model.RegModel');

        me.store = Ext.create('Ext.data.Store', {
            model: 'Model.RegModel',
            autoLoad: true,
            proxy: {
                type: 'memory',
                reader: {
                    type: 'json'
                }
            },
            data: data
        });

        var column = [
            {
                xtype: 'rownumberer',
                text: '行号',
                width: 50
            },
            {
                text: 'Name',
                dataIndex: 'name',
                width: 120,
            },
            {
                text: 'Age',
                dataIndex: 'age',
                width: 120
            },
            {
                text: 'Sex',
                dataIndex: 'sex',
                width: 100
            }
        ];

        var data = [
            [ '11', '12', '13' ],
            [ '21', '22', '23' ],
            [ '31', '32', '33' ]
        ];
        var store = Ext.create('Ext.data.ArrayStore', {
            model: 'Model.RegModel',
            data: data
        });

        Ext.apply(me, {
            store: store,  // me.store
            columns: column
        });

        me.callParent(arguments);
    }
});