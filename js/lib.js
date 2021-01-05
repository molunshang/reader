(function(path) {
	require.config({
		baseUrl: path || "../js",
		paths: {
			"jquery": "jquery-1.9.0.min",
			"mui": "mui",
			"mui.lazyload": "mui.lazyload",
			"mui.lazyload.img": "mui.lazyload.img",
			"vue": "vue.min",
			"linqjs": "linq.min",
			"siteconfig": "config",
			"lib": "lib",
			"common": "common",
			"gbk": "gbk",
			"store": "localdata"
		}
	})
})(window.baseJsPath);
