Ext.define('Ext.calendar.data.Events', {

    statics: {
        getData: function() {
            var today = Ext.Date.clearTime(new Date()), 
                makeDate = function(d, h, m, s) {
                    d = d * 86400;
                    h = (h || 0) * 3600;
                    m = (m || 0) * 60;
                    s = (s || 0);
                    return Ext.Date.add(today, Ext.Date.SECOND, d + h + m + s);
                };
                
            return {
                "evts": [{
                    "id": 1001,
                    "cid": 1,
                    "title": "任务1",
                    "start": makeDate(1, 10),
                    "end": makeDate(1, 15),
                    "notes": "Have fun"
                }, {
                    "id": 1011,
                    "cid": 2,
                    "title": "任务2",
                    "start": makeDate(2, 19),
                    "end": makeDate(2, 23),
                    "notes": "Don't forget the tickets!",
                    "rem": "60"
                }]
            }
        }
    }
});
