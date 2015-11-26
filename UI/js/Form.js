/**
 * Created by endong on 2015/11/25.
 */
Ext.define('Code.Form', {
   extend: 'Ext.form.Panel',
   title: '',
   width: '',
    height: '',
    defaults: {
        margin: 5
    },

    initComponent: function() {
        var me = this;
        Ext.apply(this, {
            items: [
                {
                    xtype: 'textfield',
                    name: 'Name',
                    fieldLabel: 'Name',
                    value: 'Bob'
                }
            ]
        });
        me.callParent(arguments);
    }
});