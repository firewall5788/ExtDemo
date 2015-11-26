Ext.define('Ext.calendar.data.Calendars', {
    statics: {
        getData: function(){
            return {
                "calendars":[{
                    "id":    1,
                    "title": "已执行完计划"
                },{
                    "id":    2,
                    "title": "已过期计划"
                },{
                    "id":    3,
                    "title": "正在执行计划"
                },{
                    "id":    4,
                    "title": "组未分配计划"
                }]
            };    
        }
    }
});