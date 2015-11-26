/**
 * Created by endong on 2015/11/25.
 */
Ext.define('Code.Model', {
    extend: 'Ext.data.Model',
    fields: [
        { name: 'name', type: 'auto' },
        { name: 'age', type: 'auto' },
        { name: 'sex', type: 'auto' }
    ]
});

Ext.regModel('Model.RegModel', {
    fields: [
        { name: 'name', type: 'auto' },
        { name: 'age', type: 'auto' },
        { name: 'sex', type: 'auto' }
    ]
});