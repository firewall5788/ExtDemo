Ext.define('Ext.calendar.App', {
	
	extend: 'Ext.Component',
	btnBackVisible: true,
	
    requires: [
        'Ext.Viewport',
        'Ext.layout.container.Border',
        'Ext.picker.Date',
        'Ext.calendar.util.Date',
        'Ext.calendar.CalendarPanel',
        'Ext.calendar.data.MemoryCalendarStore',
        'Ext.calendar.data.MemoryEventStore',
        'Ext.calendar.data.Events',
        'Ext.calendar.data.Calendars',
        'Ext.calendar.form.EventWindow',
        'Ext.util.Observable'
    ],
    
    initComponent : function() {
    	var me = this;
    	
        this.checkScrollOffset();
        this.addEvents({
            'itemclick': true,
            'back': true
        });
        
        /**
         * 设置任务类型
         */
        this.calendarStore = Ext.create('Ext.calendar.data.MemoryCalendarStore', {
             data: Ext.calendar.data.Calendars.getData()
        });

        this.eventStore = Ext.create('Ext.calendar.data.MemoryEventStore', {
        });
        
        var northPanel = {
        	xtype: 'panel',
        	region: 'north',
        	buttons: [
				{
					text: '返回',
					handler: function() {
						me.fireEvent('back', me);
					}
				}                		
        	]
        };
        
        var centerPanel = {
            xtype: 'calendarpanel',
            eventStore: this.eventStore,
            calendarStore: this.calendarStore,
            border: false,
            id:'app-calendar',
            region: 'center',
            showDayView: false,
            showWeekView: false,
            showMonthView: true,
            showNavBar: false,
            todayText: '今天',
            dayText: '天',
            weekText: '星期',
            monthText: '月',
            showToday: '今天',
            showTodayText: true,
            
            monthViewCfg: {
                showHeader: true,
                showWeekLinks: true,
                showWeekNumbers: true
            },
            
            tbar: [
            	{
					xtype: 'combo',
					fieldLabel: '年',
					labelAlign: 'right',
					labelWidth: 25,
					width: 100,
					id: 'cmbYear',
					editable: false,
					displayField: 'label',
					valueField: 'label',
					queryMode: 'local',
					store: Ext.create('Ext.data.Store', {
						fields: [
							{name: 'label'}
						],
						proxy: {
							type: 'memory',
							reader: {
								type: 'json'
							}
						}
					}),
					listeners: {
            			'beforerender': function( cmb, eOpts) {
            				var array = [];
            				for (var i = 2010; i < 2020; i++) {
            					array.push({
            						label: i
            					});
            				}
            				cmb.getStore().loadData(array);
            			}
					}
				},
				{
					xtype: 'combo',
					fieldLabel: '月',
					labelAlign: 'right',
					labelWidth: 25,
					width: 100,
					id: 'cmbMonth',
					editable: false,
					displayField: 'label',
					valueField: 'label',
					queryMode: 'local',
					store: Ext.create('Ext.data.Store', {
						fields: [
							{name: 'label'}
						],
						proxy: {
							type: 'memory',
							reader: {
								type: 'json'
							}
						}
					}),
					listeners: {
            			'beforerender': function( cmb, eOpts) {
            				var array = [];
            				for (var i = 1; i <= 12; i++) {
            					array.push({
            						label: i
            					});
            				}
            				cmb.getStore().loadData(array);
            			}
					}
				},
				{
					xtype: 'button',
					text: '确定',
					handler: function() {
				        var year = Ext.getCmp('cmbYear').getValue();
				        var month = Ext.getCmp('cmbMonth').getValue();
				        if (parseInt(month) < 10) {
				        	month = '0' + month;
				        }
				        var date = strTurnDate(year + '-' + month + '-01');
				        Ext.getCmp('app-calendar').setStartDate(date);
					}
				},
				{
					xtype: 'button',
					text: '今天',
					handler: function() {
						var date = new Date();
				       	var year = "";
				       	if (Ext.isIE8m) {
				       		year = date.getYear();
				       	} else {
				       		year = date.getYear() + 1900;
				       	}
				        var month = date.getMonth() + 1;
				        Ext.getCmp('cmbYear').select(year);
				        Ext.getCmp('cmbMonth').select(month);
				        
				        Ext.getCmp('app-calendar').setStartDate(date);
					}
				}
            ],
            
            listeners: {
                'eventclick': {
                    fn: function(vw, rec, el){
                        this.showEditWindow(rec, el);
                    },
                    scope: this
                }
            }
        };
        
        var items = [];
        if (me.btnBackVisible) {
        	items = [northPanel, centerPanel];
        } else {
        	items = [centerPanel];
        }
        
        Ext.create('Ext.Viewport', {
            layout: 'border',
            renderTo: 'calendar-ct',
            items: [{
                id: 'app-center',
                region: 'center',
                layout: 'border',
                items: items
            }]
        });
         
        var date = new Date();
        var year = "";
        if (Ext.isIE8m) {
       		year = date.getYear();
       	} else {
       		year = date.getYear() + 1900;
       	}
        
        var month = date.getMonth() + 1;
        Ext.getCmp('cmbYear').select(year);
        Ext.getCmp('cmbMonth').select(month);
        
        Ext.getCmp('app-calendar').setStartDate(date);
        
        this.callParent(arguments);
    },
    
    showEditWindow : function(rec, animateTarget){
		this.fireEvent('itemclick', this, rec, animateTarget);
    },
        
    checkScrollOffset: function() {
        var scrollbarWidth = Ext.getScrollbarSize ? Ext.getScrollbarSize().width : Ext.getScrollBarWidth();
        
        if (scrollbarWidth < 3) {
            Ext.getBody().addCls('x-no-scrollbar');
        }
        if (Ext.isWindows) {
            Ext.getBody().addCls('x-win');
        }
    },
    
    /**
     * @param {Array} data
     * 			{
     * 				"id": 1011,								主键
	 *              "cid": 1,								任务类型
	 *              "title": "Movie night",					标题
	 *              "start": makeDate(2, 19),				起始时间
	 *              "end": makeDate(2, 23),					结束时间
	 *              "notes": "Don't forget the tickets!",	备注
	 *              "rem": "60"								在*分钟之前提醒
     *          }
     */
    loadData: function(data) {
    	var result = [];
    	for (var i = 0; i < data.length; i++) {
    		var rec = new Ext.calendar.data.EventModel({
    			EventId: data[i]['id'],
    			CalendarId: data[i]['cid'],
    			Title: data[i]['title'],
    			StartDate: data[i]['start'],
    			EndDate: data[i]['end'],
    			Location: '',
    			Notes: data[i]['notes'],
    			Url: '',
    			IsAllDay: true,
    			Reminder: data[i]['rem'],
    			IsNew: true
    		});
    		
    		result.push(rec);
    	}
    	
    	this.eventStore.loadData(result);
    },
    
    getData: function() {
    	//var data = eventStore.data['items'];
    	return [];
    }
    
},
function() {
    /*
     * A few Ext overrides needed to work around issues in the calendar
     */
    
    Ext.form.Basic.override({
        reset: function() {
            var me = this;
            // This causes field events to be ignored. This is a problem for the
            // DateTimeField since it relies on handling the all-day checkbox state
            // changes to refresh its layout. In general, this batching is really not
            // needed -- it was an artifact of pre-4.0 performance issues and can be removed.
            //me.batchLayouts(function() {
                me.getFields().each(function(f) {
                    f.reset();
                });
            //});
            return me;
        }
    });
    
    // Currently MemoryProxy really only functions for read-only data. Since we want
    // to simulate CRUD transactions we have to at the very least allow them to be
    // marked as completed and successful, otherwise they will never filter back to the
    // UI components correctly.
    Ext.data.MemoryProxy.override({
        updateOperation: function(operation, callback, scope) {
            operation.setCompleted();
            operation.setSuccessful();
            Ext.callback(callback, scope || this, [operation]);
        },
        create: function() {
            this.updateOperation.apply(this, arguments);
        },
        update: function() {
            this.updateOperation.apply(this, arguments);
        },
        destroy: function() {
            this.updateOperation.apply(this, arguments);
        }
    });
});