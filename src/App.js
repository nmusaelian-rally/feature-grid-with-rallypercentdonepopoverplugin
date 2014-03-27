Ext.define('CustomApp', {
    extend: 'Rally.app.App',
    componentCls: 'app',
    scopeType: 'release',
    comboboxConfig: {
        fieldLabel: 'Select a Release:',
        labelWidth: 100,
        width: 300
    },
    items:[
	{
	    xtype: 'panel',
	    //title: 'Features by Release',
	    layout: {
		type: 'accordion',
		titleCollapse: false,
		animate: true,
		activeOnTop: true
	    },
	    items: [{
		title: 'Select Release',
		itemId: 'container-for-combobox',
		height: 200
	    },{
		title: 'Table',
		layout: {
		    type: 'table',
		    columns: 1,
		    tableAttrs: {
		       style: {
			  width: '100%',
			  height: '100%'
		       }
		    }
		},
		items:[{
		    //title:'Grid',
		    itemId: 'container-for-grid'
		    }
		]
	    }
	    ]
	}
    ],
    
    launch: function() {
        var that = this;
        var release;
   	this._relComboBox = Ext.create('Rally.ui.combobox.ReleaseComboBox',{
   		listeners:{
   			ready: function(combobox){
   				release = combobox.getRecord(); 
   				this._loadFeatures(release);
   			},
   			select: function(combobox){
   				release = combobox.getRecord(); 
   				this._loadFeatures(release);
   			},
   			scope: this
   		}
   	});
   	this.down('#container-for-combobox').add(that._relComboBox);
   },
   
   _loadFeatures: function(release){
        var releaseRef;
        var releaseStart = Rally.util.DateTime.toIsoString(release.get('ReleaseStartDate'),true);
        console.log('releaseStart', releaseStart);
   	releaseRef = release.get('_ref');
   	var myStoreConfig = 
	{
   		model: 'PortfolioItem/Feature',
		pageSize: 200,
		remoteSort: false,
   		fetch: ['Name','FormattedID','PercentDoneByStoryCount', 'PercentDoneByStoryPlanEstimate'],
   		filters:[
   			{
   				property : 'Release',
   				operator : '=',
   				value : releaseRef
   			}
   		]
   	};
	this._updateGrid(myStoreConfig);
   },
   
   _createGrid: function(myStoreConfig){
   	this._myGrid = Ext.create('Rally.ui.grid.Grid', {
		storeConfig: myStoreConfig,
   		columnCfgs: [
   		        {text: 'ID', dataIndex: 'FormattedID', xtype: 'templatecolumn',
                            tpl: Ext.create('Rally.ui.renderer.template.FormattedIDTemplate')},
   			{text: 'Name', dataIndex: 'Name', flex: 2},
			{text: 'PercentDoneByStoryCount', dataIndex: 'PercentDoneByStoryCount'},
			{text: 'PercentDoneByStoryPlanEstimate', dataIndex: 'PercentDoneByStoryPlanEstimate'}
   		],
		plugins: ['rallypercentdonepopoverplugin'],
		height: 650

   	});
   	this.down('#container-for-grid').add(this._myGrid);
   },
   
   _updateGrid: function(myStore){
   	if(this._myGrid === undefined){
   		this._createGrid(myStore);
   	}
   	else{
		this._myGrid.store.clearFilter(true);
		this._myGrid.store.filter([{property : 'Release',value : this._relComboBox.getValue()}])
   	}
   }
});