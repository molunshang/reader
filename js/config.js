var sites = [{
	name: "笔趣阁",
	host: "https://www.biduo.cc",
	searchUrl: "https://www.biduo.cc/search.php?keyword=",
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
	searchUrl: "https://www.biqubao.com/search.php?keyword=",
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
	searchUrl: "https://www.biquge.com.cn/search.php?keyword=",
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
	name: "510文学",
	host: "https://www.510wx.com",
	searchUrl: "https://www.510wx.com/plus/search.php?kwtype=0&searchtype=&q=",
	item: ".ul_b_list li",
	cover: "img",
	title: "h2 a",
	author: ".words .state a:first",
	updateTime: {
		type: "regex",
		regex: /\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/
	},
	listChapter: null,
	detail: "a",
	desc: ".words p:nth-of-type(3)",
	detailTitle: ".title h1",
	detailAuthor: ".info li:first a",
	detailUpdated: {
		css: ".words",
		regex: /\d{4}-\d{2}-\d{2} \d{2}:\d{2}/
	},
	detailCover: ".pic .lazy:first",
	lastChapter: ".words a:first",
	detailDesc: ".words p:last",
	chapter: ".list_box a",
	content: ".box_box",
	contentFilter: ":not(script)"
}, {
	name: "第一版主",
	host: "http://www.banzhuwang.org/",
	searchUrl: "http://www.banzhuwang.org/modules/article/search.php",
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
	detailTitle: ".introduce h1",
	detailAuthor: ".bq span:nth-child(2) a",
	detailUpdated: {
		css: ".bq span:nth-child(1)",
		regex: /\d{4}-\d{2}-\d{2} \d{2}:\d{2}/
	},
	detailCover: ".pic img",
	lastChapter: ".lastchapter a",
	detailDesc: ".introduce .jj",
	chapter: ".ml_list li a",
	content: ".articlecontent",
	contentFilter: null
}];

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
}