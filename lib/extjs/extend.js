/**
 * 带时分秒的时间控件选择器
 */
Ext.define('baseUx.form.datetime.DateTimePicker', {
    extend: 'Ext.picker.Date',
    alias: 'widget.datetimepicker',
    alternateClassName: 'Ext.DateTimePicker',
    renderTpl: [
        '<div id="{id}-innerEl">',
            '<div role="presentation" class="{baseCls}-header">',
                '<div class="{baseCls}-prev"><a id="{id}-prevEl" href="#" role="button" title="{prevText}"></a></div>',
                '<div class="{baseCls}-month" id="{id}-middleBtnEl">{%this.renderMonthBtn(values, out)%}</div>',
                '<div class="{baseCls}-next"><a id="{id}-nextEl" href="#" role="button" title="{nextText}"></a></div>',
            '</div>',
            '<table id="{id}-eventEl" class="{baseCls}-inner" cellspacing="0" role="presentation">',
                '<thead role="presentation"><tr role="presentation">',
                    '<tpl for="dayNames">',
                        '<th role="columnheader" title="{.}"><span>{.:this.firstInitial}</span></th>',
                    '</tpl>',
                '</tr></thead>',
                '<tbody role="presentation"><tr role="presentation">',
                    '<tpl for="days">',
                        '{#:this.isEndOfWeek}',
                        '<td role="gridcell" id="{[Ext.id()]}">',
                            '<a role="presentation" href="#" hidefocus="on" class="{parent.baseCls}-date" tabIndex="1">',
                                '<em role="presentation"><span role="presentation"></span></em>',
                            '</a>',
                        '</td>',
                    '</tpl>',
                '</tr></tbody>',
            '</table>',
            '<tpl if="showToday">',
                '<div id="{id}-footerEl" role="presentation"   class="{baseCls}-footer">{%this.renderHour(values, out)%}{%this.renderMinute(values, out)%}{%this.renderSecond(values, out)%}{%this.renderTodayBtn(values, out)%}</div>',
            '</tpl>',
        '</div>',
        {
            firstInitial: function(value) {
                return value.substr(0,1);
            },
            isEndOfWeek: function(value) {
                // convert from 1 based index to 0 based
                // by decrementing value once.
                value--;
                var end = value % 7 === 0 && value !== 0;
                return end ? '</tr><tr role="row">' : '';
            },
            longDay: function(value){
                return Ext.Date.format(value, this.longDayFormat);
            },
            renderHour: function(values, out) {
                Ext.DomHelper.generateMarkup(values.$comp.hour.getRenderTree(), out);
            },
            renderMinute: function(values, out) {
            	out.push('<font  style="float : left;font-weight:bold;">&nbsp&nbsp:&nbsp&nbsp</font>');
                Ext.DomHelper.generateMarkup(values.$comp.minute.getRenderTree(), out);
            },
            renderSecond: function(values, out) {
            	out.push('<font style="float : left;font-weight:bold;">&nbsp&nbsp:&nbsp&nbsp</font>');
                Ext.DomHelper.generateMarkup(values.$comp.second.getRenderTree(), out);
            },
            renderTodayBtn: function(values, out) {
                Ext.DomHelper.generateMarkup(values.$comp.todayBtn.getRenderTree(), out);
            },
            renderMonthBtn: function(values, out) {
                Ext.DomHelper.generateMarkup(values.$comp.monthBtn.getRenderTree(), out);
            }
        }
    ],
    /**
     * 创建时分秒控件
     */
    beforeRender: function () {
        /**---------------------*/
        var me = this;
        me.hour = Ext.create('Ext.form.field.Number', {
            scope: me,
            ownerCt: me,
            editable : false,
            ownerLayout: me.getComponentLayout(),
           	minValue: 0,
           	maxValue: 23,
           	width: 45,
           	style: {float:"left"},
           	enableKeyEvents: true,
           	listeners: {
                 keyup: function(field, e){
                     if (field.getValue() > 23){
                         e.stopEvent();
                         field.setValue(23);
                     }
                 }
             }
        });
        
        me.minute = Ext.create('Ext.form.field.Number', {
            scope: me,
            ownerCt: me,
           	style : {float:"left"},
            ownerLayout: me.getComponentLayout(),
        	minValue: 0,
        	maxValue: 59,
            editable : false,
        	width: 45,
        	enableKeyEvents: true,
        	listeners: {
                keyup: function(field, e){
                    if (field.getValue() > 59){
                        e.stopEvent();
                        field.setValue(59);
                    }
                }
            }
        });
        
      me.second = Ext.create('Ext.form.field.Number', {
            scope: me,
            ownerCt: me,
            editable : false,
           	style : {float:"left"},
            ownerLayout: me.getComponentLayout(),
        	minValue: 0,
        	maxValue: 59,
        	width: 45,
        	enableKeyEvents: true,
        	listeners: {
                keyup: function(field, e){
                    if (field.getValue() > 59){
                        e.stopEvent();
                        field.setValue(59);
                    }
                }
            }
        });
        
        me.callParent();
    },

    /**
     * 渲染时分秒控件
     */
    finishRenderChildren: function () {
        this.callParent();
        /**--------------------------------------*/
        this.hour.finishRender();
        this.minute.finishRender();
        this.second.finishRender();
        /**--------------------------------------*/
    },
    /**
     * Update the contents of the picker
     * @private
     * @param {Date} date The new date
     * @param {Boolean} forceRefresh True to force a full refresh
     */
    update : function(date, forceRefresh){
        var me = this;
		/**-----------设置时分秒----------------*/
        date.setHours(me.hour.getValue());
    	date.setMinutes(me.minute.getValue());
    	date.setSeconds(me.second.getValue());
		/**-----------设置时分秒----------------*/
    	
        me.callParent(arguments);
    }
});


/**
 * 带时分秒的日期控件
 * @author linzhichao
 */
Ext.define('baseUx.form.datetime.DateTime', {
    extend:'Ext.form.field.Date',
    alias: 'widget.datetimefield',
    requires: ['baseUx.form.datetime.DateTimePicker'],
    trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
    trigger2Cls: Ext.baseCSSPrefix + 'form-date-trigger',
    editable : false,
    format : 'Y-m-d H:i:s',
    /**
     * 添加清除按钮
     */
    initComponent: function() {  	
    	var me = this;
		me.onTrigger2Click = Ext.clone(me.onTrigger1Click);
		me.onTrigger1Click = function(){
			me.reset();
		}
		
		me.callParent(arguments);
    },
    /**
     * 创建时间选择器
     * @return {}
     */
    createPicker: function() {
        var me = this,
            format = Ext.String.format;
        return new baseUx.form.datetime.DateTimePicker({
            pickerField: me,
            ownerCt: me.ownerCt,
            renderTo: document.body,
            floating: true,
            hidden: true,
            focusOnShow: true,
            minDate: me.minValue,
            maxDate: me.maxValue,
            disabledDatesRE: me.disabledDatesRE,
            disabledDatesText: me.disabledDatesText,
            disabledDays: me.disabledDays,
            disabledDaysText: me.disabledDaysText,
            format: me.format,
            showToday: me.showToday,
            startDay: me.startDay,
            minText: format(me.minText, me.formatDate(me.minValue)),
            maxText: format(me.maxText, me.formatDate(me.maxValue)),
            listeners: {
                scope: me,
                select: me.onSelect
            },
            keyNavConfig: {
                esc: function() {
                    me.collapse();
                }
            }
        });
    },
    /**
     * 控制按钮的显隐
     */
    afterRender: function(){
        this.callParent();
        if(this.hideTrigger1){//隐藏清除按钮
        	this.triggerCell.item(0).setDisplayed(false);
        }
        if(this.hideTrigger2){//隐藏选择按钮
        	this.triggerCell.item(1).setDisplayed(false);
        }
    },

    /**
     * @private
     * 设置选择器的值
     */
    onExpand: function() {
        var me = this,
            value = me.getValue() instanceof Date ? me.getValue() : new Date();
        me.picker.setValue(value);
        
        me.picker.hour.setValue(value.getHours());
        me.picker.minute.setValue(value.getMinutes());
        me.picker.second.setValue(value.getSeconds());
    }
});

Ext.define('CustomField.GridComboBoxList', {
	extend : 'Ext.view.AbstractView',
	alias : 'widget.gridcombolist',
	alternateClassName : 'Ext.GridComboBoxList',
	renderTpl : [ '<div class="list-ct" style="border: 1px solid #99BBE8"></div>' ],
	//renderTpl : [ '<div class="list-ct" style="border: 1px solid #99BBE8"></div>' ],
	initComponent : function() {
		var me = this;
		me.itemSelector = "div.list-ct";
		//me.itemSelector = ".";
		me.tpl = Ext.create('Ext.XTemplate');
		me.callParent();
		Ext.applyIf(me.renderSelectors, {
			listEl : '.list-ct'
		});
		me.gridCfg.border = false;
		me.gridCfg.store = me.store; 
		if(me.gridCfg.resizable == undefined){
			me.gridCfg.resizable = {
				//'n s e w ne nw se sw'
				handles: 's e se',
				pinned: false
			};
		}

		me.grid = Ext.create('Ext.grid.Panel', me.gridCfg);
		me.grid.addListener({
			resize:function( component, width, height, oldWidth, oldHeight, eOpts ){
				me.maxHeight = width;
				me.minWidth = height;
			}
		});
		
        me.maxHeight = me.grid.maxHeight;
	    me.minWidth = me.grid.minWidth;
		
		me.grid.store.addListener({
			beforeload : function() {
				me.owner.loading = true;
			},
			load : function() {
				me.owner.loading = false;
			}
		});
		var sm = me.grid.getSelectionModel();
		sm.addListener('selectionchange', function(a, sl) {
			var cbx = me.owner;
			var EA = Ext.Array;
			if (cbx.loading)
				return;
			if(cbx.multiSelect){
				var vf = cbx.valueField;
				var df = cbx.displayField;
				var sv = cbx.getValue();
				me.store.each(function(record){
					for(var i = 0;i<sv.length;i++){
						if(sv[i] != undefined 
							&& sv[i][vf] == record.data[vf]
							&& sv[i][df] == record.data[df]){
							delete sv[i];
						}
					}
				});
				sv = EA.clean(sv);
				var slarray = EA.map(sl, function(r) {
					return r.data;
				});
				var resultArray = Ext.Array.merge(sv,slarray);
				cbx.setValue(resultArray);
			}
			else{
				cbx.setValue(sl[0].data);
			}
		});
		sm.addListener('select', function(m, r, i) {
			var cbx = me.owner;
			if (cbx.loading)
				return;
			//if(!cbx.multiSelect)
			//	cbx.collapse();
		});
	},
	onRender : function() {
		this.callParent(arguments);
		this.grid.render(this.listEl);
	},
	bindStore : function(store, initial) {
		this.callParent(arguments);
		if(this.grid)
			this.grid.bindStore(store, initial);
	},
	onDestroy : function() {
		Ext.destroyMembers(this, 'grid', 'listEl');
		this.callParent();
	}
});

Ext.define('CustomField.GridComboBox', {
	extend : 'Ext.form.field.Picker',
	requires : [ 'Ext.util.DelayedTask', 'Ext.EventObject', 'Ext.view.BoundList',
			'Ext.view.BoundListKeyNav', 'Ext.data.StoreManager', 'Ext.grid.View' ],
	alternateClassName : 'Ext.form.GridComboBox',
	alias : [ 'widget.gridcombobox', 'widget.gridcombo' ],
	triggerCls : Ext.baseCSSPrefix + 'form-arrow-trigger',
	multiSelect : false,
	delimiter : ',',
	displayField : 'text',
	triggerAction : 'all',
	allQuery : '',
	queryParam : 'query',
	queryMode : 'remote',
	queryCaching : true,
	pageSize : 0,
	autoSelect : true,
	typeAhead : false,
	typeAheadDelay : 250,
	selectOnTab : true,
	forceSelection : true,
	defaultListConfig : {
		emptyText : '',
		loadingText : 'Loading...',
		loadingHeight : 70,
		minWidth : 70,
		maxHeight : 300,
		shadow : 'sides'
	},
	// private
	ignoreSelection : 0,
	initComponent : function() {
		var me = this, isDefined = Ext.isDefined, store = me.store, transform = me.transform, transformSelect, isLocalMode;
		// <debug>
		if (!store && !transform) {
			Ext.Error
					.raise('Either a valid store, or a HTML select to transform, must be configured on the combo.');
		}
		if (me.typeAhead && me.multiSelect) {
			Ext.Error
					.raise('typeAhead and multiSelect are mutually exclusive options -- please remove one of them.');
		}
		if (me.typeAhead && !me.editable) {
			Ext.Error
					.raise('If typeAhead is enabled the combo must be editable: true -- please change one of those settings.');
		}
		if (me.selectOnFocus && !me.editable) {
			Ext.Error
					.raise('If selectOnFocus is enabled the combo must be editable: true -- please change one of those settings.');
		}
		// </debug>
		this.addEvents('beforequery', 'select');
		// Build store from 'transform' HTML select element's
		// options
		if (!store && transform) {
			transformSelect = Ext.getDom(transform);
			if (transformSelect) {
				store = Ext.Array.map(Ext.Array.from(transformSelect.options), function(
						option) {
					return [ option.value, option.text ];
				});
				if (!me.name) {
					me.name = transformSelect.name;
				}
				if (!('value' in me)) {
					me.value = transformSelect.value;
				}
			}
		}
		me.bindStore(store, true);
		store = me.store;
		if (store.autoCreated) {
			me.queryMode = 'local';
			me.valueField = me.displayField = 'field1';
			if (!store.expanded) {
				me.displayField = 'field2';
			}
		}
		if (!isDefined(me.valueField)) {
			me.valueField = me.displayField;
		}
		isLocalMode = me.queryMode === 'local';
		if (!isDefined(me.queryDelay)) {
			me.queryDelay = isLocalMode ? 10 : 500;
		}
		if (!isDefined(me.minChars)) {
			me.minChars = isLocalMode ? 0 : 4;
		}
		if (!me.displayTpl) {
			me.displayTpl = Ext.create('Ext.XTemplate', '<tpl for=".">'
					+ '{[typeof values === "string" ? values : values.' + me.displayField
					+ ']}' + '<tpl if="xindex < xcount">' + me.delimiter + '</tpl>'
					+ '</tpl>');
		} else if (Ext.isString(me.displayTpl)) {
			me.displayTpl = Ext.create('Ext.XTemplate', me.displayTpl);
		}
		me.callParent();
		me.doQueryTask = Ext.create('Ext.util.DelayedTask', me.doRawQuery, me);
		// store has already been loaded, setValue
		if (me.store.getCount() > 0) {
			me.setValue(me.value);
		}
		// render in place of 'transform' select
		if (transformSelect) {
			me.render(transformSelect.parentNode, transformSelect);
			Ext.removeNode(transformSelect);
			delete me.renderTo;
		}
	},
	beforeBlur : function() {
		var me = this;
		me.doQueryTask.cancel();
		if(me.readOnly != true){
			me.assertValue();
		}
	},
	assertValue: function() {
		 var me = this,
            value = me.getRawValue(),
            rec, currentValue;

        if (me.forceSelection) {
            if (me.multiSelect) {
                // For multiselect, check that the current displayed value matches the current
                // selection, if it does not then revert to the most recent selection.
                if (value !== me.getDisplayValue()) {
                    me.setValue(me.lastSelection);
                }
            } else {
                // For single-select, match the displayed value to a record and select it,
                // if it does not match a record then revert to the most recent selection.
                rec = me.findRecordByDisplay(value);
                if (rec) {
                    currentValue = me.value;
                    // Prevent an issue where we have duplicate display values with
                    // different underlying values.
					if(rec.data[me.valueField] != currentValue[0][me.valueField] ||
							rec.data[me.displayField] != currentValue[0][me.displayField]){
						me.select(rec, true);
					}
                } else {
                    me.setValue(me.lastSelection);
                }
            }
        }
        me.collapse();
	},
	onTypeAhead : function() {
		var me = this, df = me.displayField;
		var st = me.store, rv = me.getRawValue();
		var r = me.store.findRecord(df, rv);
		if (r) {
			var nv = r.get(df), ln = nv.length, ss = rv.length;
			if (ss !== 0 && ss !== ln) {
				me.setRawValue(nv);
				me.selectText(ss, nv.length);
			}
		}
	},
	// invoked when a different store is bound to this combo
	// than the original
	resetToDefault : function() {
	},
	bindStore : function(store, initial) {
		var me = this, oldStore = me.store;
		// this code directly accesses this.picker, bc invoking
		// getPicker
		// would create it when we may be preping to destroy it
		if (oldStore && !initial) {
			if (oldStore !== store && oldStore.autoDestroy) {
				oldStore.destroy();
			} else {
				oldStore.un({
					scope : me,
					load : me.onLoad,
					exception : me.collapse
				});
			}
			if (!store) {
				me.store = null;
				if (me.picker) {
					me.picker.bindStore(null);
				}
			}
		}
		if (store) {
			if (!initial) {
				me.resetToDefault();
			}
			me.store = Ext.data.StoreManager.lookup(store);
			me.store.on({
				scope : me,
				load : me.onLoad,
				exception : me.collapse
			});
			if (me.picker) {
				me.picker.bindStore(store);
			}
		}
	},
	onLoad : function() {
		var me = this, value = me.value;
		me.syncSelection();
	},
	/**
	 * @private Execute the query with the raw contents within
	 *		  the textfield.
	 */
	doRawQuery : function() {
		this.doQuery(this.getRawValue());
	},
	doQuery : function(queryString, forceAll) {
		queryString = queryString || '';
		// store in object and pass by reference in
		// 'beforequery'
		// so that client code can modify values.
		var me = this, qe = {
			query : queryString,
			forceAll : forceAll,
			combo : me,
			cancel : false
		}, store = me.store, isLocalMode = me.queryMode === 'local';

		if (me.fireEvent('beforequery', qe) === false || qe.cancel) {
			return false;
		}
		// get back out possibly modified values
		queryString = qe.query;
		forceAll = qe.forceAll;
		// query permitted to run
		if (forceAll || (queryString.length >= me.minChars)) {
			// expand before starting query so LoadMask can
			// position itself correctly
			me.expand();
			// make sure they aren't querying the same thing
			if (!me.queryCaching || me.lastQuery !== queryString) {
				me.lastQuery = queryString;
				store.clearFilter(!forceAll);
				if (isLocalMode) {
					if (!forceAll) {
						store.filter(me.displayField, queryString);
					}
				} else {
					store.load({
						params : me.getParams(queryString)
					});
				}
			}
			// Clear current selection if it does not match the
			// current value in the field
			if (me.getRawValue() !== me.getDisplayValue()) {
				me.ignoreSelection++;
				me.picker.grid.getSelectionModel().deselectAll();
				me.ignoreSelection--;
			}
			if (me.typeAhead) {
				me.expand();
				me.doTypeAhead();
			}
		}
		return true;
	},
	// private
	getParams : function(queryString) {
		var p = {}, pageSize = this.pageSize;
		p[this.queryParam] = encodeURI(queryString);
		if (pageSize) {
			p.start = 0;
			p.limit = pageSize;
		}
		return p;
	},
	doTypeAhead : function() {
		if (!this.typeAheadTask) {
			this.typeAheadTask = Ext.create('Ext.util.DelayedTask', this.onTypeAhead, this);
		}
		if (this.lastKey != Ext.EventObject.BACKSPACE
				&& this.lastKey != Ext.EventObject.DELETE) {
			this.typeAheadTask.delay(this.typeAheadDelay);
		}
	},
	onTriggerClick : function() {
		var me = this;
		if (!me.readOnly && !me.disabled) {
			if (me.isExpanded) {
				me.collapse();
			} else {
				me.onFocus({});
				if (me.triggerAction === 'all') {
					me.doQuery(me.allQuery, true);
				} else {
					me.doQuery(me.getRawValue());
				}
			}
			me.inputEl.focus();
		}
	},
	// store the last key and doQuery if relevant
	onKeyUp : function(e, t) {
		var me = this, key = e.getKey();

		if (!me.readOnly && !me.disabled && me.editable) {
			me.lastKey = key;
			me.doQueryTask.cancel();

			// perform query w/ any normal key or backspace or
			// delete
			if (!e.isSpecialKey() || key == e.BACKSPACE || key == e.DELETE) {
				if(me.getRawValue() == ''){
					me.clearValue();
					return;
				}
				me.doQueryTask.delay(me.queryDelay);
			}else if(key == e.ENTER) {
				this.doQuery(this.getRawValue(), true);
			}
		}
	},
	initEvents : function() {
		var me = this;
		me.callParent();
		// setup keyboard handling
		me.mon(me.inputEl, 'keyup', me.onKeyUp, me);
	},
	createPicker : function() {
		var me = this, menuCls = Ext.baseCSSPrefix + 'menu';
		var opts = Ext.apply({
			selModel : {
				mode : me.multiSelect ? 'SIMPLE' : 'SINGLE'
			},
			floating : true,
			hidden : true,
			ownerCt : me.ownerCt,
			cls : me.el.up('.' + menuCls) ? menuCls : '',
			store : me.store,
			displayField : me.displayField,
			focusOnToFront : false,
			pageSize : me.pageSize,
			gridCfg : me.gridCfg,
			owner : me
		}, me.listConfig, me.defaultListConfig);
		var pk = me.picker = Ext.create('CustomField.GridComboBoxList',opts);
		me.mon(pk.grid, 'itemclick', me.onItemClick, me);
		me.mon(pk.grid, 'refresh', me.onListRefresh, me);
		
		me.mon(pk.grid.getSelectionModel(), 'selectionChange', me.onListSelectionChange, me);
		return pk;
	},
	onListRefresh : function() {
		this.alignPicker();
		this.syncSelection();
	},
	onItemClick : function(picker, record) {
		/*
		 * If we're doing single selection, the selection change
		 * events won't fire when clicking on the selected
		 * element. Detect it here.
		 */
		var me = this, lastSelection = me.lastSelection, valueField = me.valueField, selected;
		if (!me.multiSelect && lastSelection) {
			selected = lastSelection[0];
			if (record.get(valueField) === selected[valueField]) {
				me.collapse();
			}
		}
	},
	onListSelectionChange : function(list, selectedRecords) {
		var me = this;
		// Only react to selection if it is not called from
		// setValue, and if our list is
		// expanded (ignores changes to the selection model
		// triggered elsewhere)
		if (!me.ignoreSelection && me.isExpanded) {
			if (!me.multiSelect) {
				if (selectedRecords.length > 0) {
					Ext.defer(me.collapse, 1, me);
				}
			}
			//me.setValue(selectedRecords, false);
			if (selectedRecords.length > 0) {
				me.fireEvent('select', me, selectedRecords);
			}
			me.inputEl.focus();
		}
	},
	/**
	 * @private Enables the key nav for the BoundList when it is
	 *		  expanded.
	 */
	onExpand : function() {
		var me = this, keyNav = me.listKeyNav;
		var selectOnTab = me.selectOnTab, picker = me.getPicker();

		// redo layout to make size right after reload store
		picker.grid.doLayout();
		// Handle BoundList navigation from the input field.
		// Insert a tab listener specially to enable
		// selectOnTab.
		if (keyNav) {
			keyNav.enable();
		} else {
			keyNav = me.listKeyNav = Ext.create('Ext.view.BoundListKeyNav', this.inputEl, {
				boundList : picker,
				forceKeyDown : true,
				home: function(e){
					return true;
				},
				end: function(e){
					return true;
				},
				tab: function(e) {
					if (selectOnTab) {
						this.selectHighlighted(e);
						me.triggerBlur();
					}
					// Tab key event is allowed to propagate to
					// field
					return true;
				}
			});
		}
		// While list is expanded, stop tab monitoring from
		// Ext.form.field.Trigger so it doesn't short-circuit
		// selectOnTab
		if (selectOnTab) {
			me.ignoreMonitorTab = true;
		}
		// Ext.defer(keyNav.enable, 1, keyNav); //wait a bit so
		// it doesn't react to the down arrow opening the picker
		me.inputEl.focus();
		me.syncSelection();
	},
	/**
	 * @private Disables the key nav for the BoundList when it
	 *		  is collapsed.
	 */
	onCollapse : function() {
		var me = this, keyNav = me.listKeyNav;
		if (keyNav) {
			keyNav.disable();
			me.ignoreMonitorTab = false;
		}
	},
	select : function(r) {
		if(!r){
			this.setValue(r);
			r = [];
		}else{
			r = Ext.Array.from(r);
			var vArray = Ext.Array.map(r,function(item,index,array ){
				return item.data;
			});
			this.setValue(vArray, true);
		}
		this.fireEvent('select', this, r);
	},
	findRecord : function(field, value) {
		var ds = this.store, idx = ds.findExact(field, value);
		return idx !== -1 ? ds.getAt(idx) : false;
	},
	findRecordByValue : function(value) {
		return this.findRecord(this.valueField, value[0][this.valueField]);
	},
	findRecordByDisplay : function(value) {
		return this.findRecord(this.displayField, value);
	},
	setValue : function(value, doSelect) {
		var me = this, txt = me.inputEl;
//		if (me.store.loading) {
//            // Called while the Store is loading. Ensure it is processed by the onLoad method.
//            me.value = value;
//            return me;
//      }
		if(!value){
			value = [];
		}
		
		if((typeof value) != "object"){
			me.store.model.load(value,{
			    scope: this,
			    failure: function(record, operation) {
			        //do something if the load failed
			        //record is null
			    	valueResult = [];
			    	valueResult = Ext.Array.from(valueResult);
					me.lastSelection = me.value = valueResult || [];
					
					me.setRawValue(me.getDisplayValue());
					if (txt && me.emptyText && !Ext.isEmpty(me.value))
						txt.removeCls(me.emptyCls);
					me.checkChange();
					if (doSelect)
						me.syncSelection();//
					me.applyEmptyText();
			    },
			    success: function(record, operation) {
			        //do something if the load succeeded
			    	var valueResult = record.data;
			    	valueResult = Ext.Array.from(valueResult);
					me.lastSelection = me.value = valueResult || [];
					
					me.setRawValue(me.getDisplayValue());
					if (txt && me.emptyText && !Ext.isEmpty(me.value))
						txt.removeCls(me.emptyCls);
					me.checkChange();
					if (doSelect)
						me.syncSelection();//
					me.applyEmptyText();
			    },
			    callback: function(record, operation, success) {
			        //do something whether the load succeeded or failed
			        //if operation is unsuccessful, record is null
			    }
			});
		}
		else{
			value = Ext.Array.from(value);
			me.lastSelection = me.value = value || [];
			
			me.setRawValue(me.getDisplayValue());
			if (txt && me.emptyText && !Ext.isEmpty(value))
				txt.removeCls(me.emptyCls);
			me.checkChange();
			if (doSelect)
				me.syncSelection();//
			me.applyEmptyText();
			return me;
		}
	},
	getDisplayValue : function() {
		var me = this, dv = [];
		Ext.Array.each(me.value, function(v) {
			var a = v[me.displayField];
			if(a)
				dv.push(a);
		});
		return dv.join(',');
	},
	getValue : function() {
		return this.value || [];
	},
	//keys, spliter, doSelect
	setSubmitValue: function(keys, sp, ds){
		var me = this, v = [], sp = sp || ',';
		if (keys) {
			Ext.Array.each(keys.split(sp), function(a) {
				var r = me.store.findRecord(me.valueField, a, 0, false, true, true);
				if(r){
					Ext.Array.merge(v,[r]);
				}
			});
		}
		me.select(v);
	},
	getSubmitValue : function() {
		var me = this, sv = [];
		Ext.Array.each(me.value, function(v) {
			sv.push(v[me.valueField]);
		});
		return sv.join(",");
	},
	isEqual : function(v1, v2) {
		var fa = Ext.Array.from, i, len;
		v1 = fa(v1);
		v2 = fa(v2);
		len = v1.length;
		if (len !== v2.length) {
			return false;
		}
		for (i = 0; i < len; i++) {
			if (v2[i] !== v1[i]) {
				return false;
			}
		}
		return true;
	},
	clearValue : function() {
		this.select(undefined);
	},
	syncSelection : function() {
		var me = this, pk = me.picker;
		if (pk && pk.grid) {
			var EA = Ext.Array, gd = pk.grid, st = gd.store;
			var cs = [];
			var sv = this.getSubmitValue().split(",");
			st.each(function(r){
				if (EA.contains(sv, String(r.get(me.valueField)))) {
					cs.push(r);
				}
			});
			gd.getSelectionModel().select(cs, false, true);
		}
	}
});

Ext.define('ColorField', {
    extend:'Ext.form.field.Picker',
    alias:'widget.colorfield',
    requires:['Ext.picker.Color'],
    triggerCls:'x-form-color-trigger',
    createPicker:function () {
        var me = this;
        return Ext.create('Ext.picker.Color', {
            pickerField:me,
            renderTo:document.body,
            floating:true,
            hidden:true,
            focusOnShow:true,
            listeners:{
                select:function (picker, selColor) {
                    me.setValue(selColor);
                    // 实现根据选择的颜色来改变背景颜色,根据背景颜色改变字体颜色,防止看不到值

                    var r = parseInt(selColor.substring(0,2),16);
                    var g = parseInt(selColor.substring(2,4),16);
                    var b = parseInt(selColor.substring(4,6),16);
                    var a = new Ext.draw.Color(r,g,b);
                    var l = a.getHSL()[2];                  
                    if (l > 0.5) {
                        me.setFieldStyle('background:#' + selColor + ';color:#000000');
                    }
                    else{
                        me.setFieldStyle('background:#' + selColor + ';color:#FFFFFF');
                    }
                }
            }
        });
    }
});