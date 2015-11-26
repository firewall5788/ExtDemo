/**
 * Created by endong on 2015/11/25.
 */
Ext.define('Code.Panel', {
    extend: 'Ext.panel.Panel',
    title: '',
    width: '',
    height: '',
    defaults: {
        margin: 5
    },

    initComponent: function() {
        var me = this;

        me.callParent(arguments);
    }
});
