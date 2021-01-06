(function() {
	var sites = window.sites;
	if (!sites) {
		sites = [];
		var map = new Map();
		window.sites = sites;
		sites.findSite = function(url) {
			var matcher = url.match(/^(http:||https:)\/\/(.+?)\//);
			if (!matcher) {
				return;
			}
			var host = matcher[2];
			for (let index = 0; index < sites.length; index++) {
				const site = sites[index];
				if (site.host.indexOf(host) > -1) {
					return site;
				}
			}
		};
		sites.addSite = function(site) {
			if (map.has(site.host)) {
				sites[map.get(site.host)] = site;
			} else {
				map.set(site.host, sites.length);
				sites.push(site);
			};
		};
		sites.reslovePath = function(host, base, current) {
			if (current.startsWith("http://") || current.startsWith("https://")) {
				return current;
			}
			if (current.startsWith("/")) {
				return host + current;
			}
			return base.substr(0, base.lastIndexOf("/") + 1) + current;
		};
	}
	var baseSites = [{
		name: "笔趣阁",
		host: "https://www.biduo.cc",
		searchUrl: "https://www.biduo.cc/search.php?q=",
		item: ".result-item",
		cover: "img",
		title: "h3",
		author: ".result-game-item-info p:first-of-type span:nth-child(2)",
		updateTime: {
			type: "css",
			css: ".result-game-item-info p:nth-of-type(3) span:nth-child(2)"
		},
		detail: "a",
		desc: ".result-game-item-desc",
		detailTitle: "#info h1",
		detailAuthor: "#info p:first-of-type",
		detailUpdated: {
			css: "#info p:nth-of-type(3)",
			regex: /\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/
		},
		detailCover: "#fmimg img:first",
		lastChapter: "#info p:nth-of-type(4)",
		detailDesc: "#intro",
		chapter: "#list a",
		content: "#content"
	}, {
		name: "笔趣阁",
		host: "https://www.biqubao.com",
		searchUrl: "https://www.biqubao.com/search.php?q=",
		item: ".result-item",
		cover: "img",
		title: "h3",
		author: ".result-game-item-info p:first-of-type span:nth-child(2)",
		updateTime: {
			type: "css",
			css: ".result-game-item-info p:nth-of-type(3) span:nth-child(2)"
		},
		listChapter: "a[cpos=newchapter]",
		detail: "a",
		desc: ".result-game-item-desc",
		detailTitle: "#info h1",
		detailAuthor: "#info p:first-of-type",
		detailUpdated: {
			css: "#info p:nth-of-type(3)",
			regex: /\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/
		},
		detailCover: "#fmimg img:first",
		lastChapter: "#info p:nth-of-type(4)",
		detailDesc: "#intro",
		chapter: "#list a",
		content: "#content"
	}, {
		name: "笔趣阁",
		host: "https://www.biquge.com.cn",
		searchUrl: "https://www.biquge.com.cn/search.php?q=",
		item: ".result-item",
		cover: "img",
		title: "h3",
		author: ".result-game-item-info p:first",
		updateTime: {
			type: "css",
			css: ".result-game-item-info p:nth-of-type(3) span:nth-child(2)"
		},
		listChapter: "a[cpos=newchapter]",
		detail: "a",
		desc: ".result-game-item-desc",
		detailTitle: "#info h1",
		detailAuthor: "#info p:first-of-type",
		detailUpdated: {
			css: "#info p:nth-of-type(3)",
			regex: /\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/
		},
		detailCover: "#fmimg img:first",
		lastChapter: "#info p:nth-of-type(4)",
		detailDesc: "#intro",
		chapter: "#list a",
		content: "#content"
	}, {
		name: "新笔趣阁",
		host: "https://www.xsbiquge.com",
		searchUrl: "https://www.xsbiquge.com/search.php?keyword=",
		item: ".result-item",
		cover: "img",
		title: "h3",
		author: ".result-game-item-info p:first",
		updateTime: {
			type: "css",
			css: ".result-game-item-info p:nth-of-type(3) span:nth-child(2)"
		},
		listChapter: "a[cpos=newchapter]",
		detail: "a",
		desc: ".result-game-item-desc",
		detailTitle: "#info h1",
		detailAuthor: "#info p:first-of-type",
		detailUpdated: {
			css: "#info p:nth-of-type(3)",
			regex: /\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/
		},
		detailCover: "#fmimg img:first",
		lastChapter: "#info p:nth-of-type(4)",
		detailDesc: "#intro",
		chapter: "#list a",
		content: "#content"
	}, {
		name: "第一版主",
		host: "http://www.bz001.cc",
		searchUrl: "http://www.bz001.cc/modules/article/search.php",
		searchEncode: "gbk",
		isPost: true,
		paramName: "searchkey",
		item: "table tr:nth-child(1)~tr",
		cover: "",
		title: "td:nth-child(1)",
		author: "td:nth-child(3)",
		updateTime: {
			type: "css",
			css: "td:nth-child(5)"
		},
		listChapter: "td:nth-child(2)",
		detail: "td:nth-child(1) a",
		desc: "",
		detailTitle: "#info h1",
		detailAuthor: "#info p:nth-child(2)",
		detailUpdated: {
			css: "#info p:nth-child(4)",
			regex: "\\d{4}-\\d{2}-\\d{2} \\d{2}:\\d{2}:\\d{2}"
		},
		detailCover: "#fming img",
		lastChapter: "#list dd:last-child a",
		detailDesc: ".intro p",
		chapter: "#list dd a",
		content: "#content",
		contentFilter: null
	}, {
		name: "笔下文学",
		host: "https://www.bxwx66.com",
		searchUrl: "https://www.bxwx66.com/search.html",
		isPost: true,
		paramName: "searchkey",
		item: "#sitembox dl",
		cover: "img",
		title: "h3",
		author: ".book_other span:nth-child(1)",
		updateTime: {
			type: "css",
			css: ".book_other:nth-child(5) span"
		},
		listChapter: ".book_other:nth-child(5) a",
		detail: "h3 a",
		desc: ".book_des",
		detailTitle: "#info h1",
		detailAuthor: "#info p:nth-child(2) a",
		detailUpdated: {
			css: "#info p:nth-child(4)",
			regex: /\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/
		},
		detailCover: "#fmimg img",
		lastChapter: "#info p:nth-child(5) a",
		detailDesc: "#intro p:nth-child(1)",
		chapter: "#list dt:nth-of-type(2)~ dd a",
		content: "#content p",
		contentFilter: null
	}, {
		"name": "顶点小说网",
		"host": "https://www.xindingdianxsw.com",
		"searchUrl": "https://www.xindingdianxsw.com/search.html?searchtype=all",
		"isPost": true,
		"paramName": "searchkey",
		"item": "#sitembox dl",
		"cover": "img",
		"title": "h3",
		"author": ".book_other span:nth-child(1)",
		"updateTime": {
			"type": "css",
			"css": ".book_other:nth-of-type(4) span"
		},
		"detail": "a",
		"desc": ".book_des",
		"detailTitle": "#info h1",
		"detailAuthor": "#info p:first-of-type",
		"detailUpdated": {
			"css": "#info p:nth-of-type(3)",
			"regex": "\\d{4}-\\d{2}-\\d{2} \\d{2}:\\d{2}:\\d{2}"
		},
		"detailCover": "#fmimg img:first",
		"lastChapter": "#info p:nth-of-type(4)",
		"detailDesc": "#intro p:first-of-type",
		"chapter": "#list dt:nth-of-type(2 )~ dd a",
		"content": "#content p",
		"contentFilter": null
	}];
	for (var i = 0; i < baseSites.length; i++) {
		sites.addSite(baseSites[i]);
	}
})();
