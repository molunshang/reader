define(["mui", "jquery", "siteconfig", "common", "gbk", "linqjs", "store"], function(mui, $, siteconfig, common, GBK,
	Enumerable, store) {
	function ajax(url, option, resolve, reject) {
		var info = {
			dataType: 'html',
			type: 'get',
			timeout: 10000,
			success: function(html, msg, xhr) {
				resolve({
					html: html,
					url: xhr.responseURL || url
				});
			},
			error: function(xhr) {
				if ((xhr.status >= 300 && xhr.status < 400) && xhr.status != 304) {
					//重定向网址在响应头中，取出再执行跳转
					var redirectUrl = xhr.getResponseHeader('X-Redirect');
					ajax(redirectUrl, method, resolve, reject);
					return;
				}
				$.each(arguments, function(i, e) {
					console.log(e)
				});
				reject();
			}
		};
		mui.extend(info, option, true);
		plus.navigator.removeAllCookie();
		mui.ajax(url, info);
	}
	var api = {
		encodeMap: {
			"gbk": GBK.URI.encodeURIComponent
		},
		getDocument: function(url, option) {
			return new Promise(function(success, fail) {
				ajax(url, option, function(html) {
					if (!html) {
						fail();
						return;
					}
					var doc = $($.trim(html.html));
					doc.find("body").append(api.deleteAllCookies);
					var images = doc.find("img");
					$.each(images, function(i, img) {
						$(img).attr("onerror", "");
					});
					doc.url = html.url;
					success(doc);
				}, fail);
			})
		}
	};
	api.parseDetail = function(doc, site) {
		var url = doc.url;
		var book = {
			href: url,
			updated: "",
			title: $.trim(doc.find(site.detailTitle).text()),
			author: $.trim(doc.find(site.detailAuthor).text().subFromStr("：")),
			cover: doc.find(site.detailCover).attr("src"),
			lastChapter: $.trim(doc.find(site.lastChapter).text().subFromStr("：")),
			sourceName: site.name
		}
		if (!book.title || !book.author) {
			return;
		}
		if (book.cover && book.cover.startsWith("/")) {
			book.cover = site.host + book.cover;
		} else if (!book.cover) {
			book.cover = "images/nocover.jpg";
		}
		var updateStr = doc.find(site.detailUpdated.css).text();
		var updated = updateStr.match(site.detailUpdated.regex);
		if (updated) {
			book.updateTime = updated[0];
		}
		var lines = doc.find(site.detailDesc).contents();
		var content = new StringBuilder();
		for (var i = 0; i < lines.length; i++) {
			var str = $.trim($(lines[i]).text());
			if (!str) {
				continue;
			}
			content.append("<p class='content'>");
			content.append(str);
			content.append("</p>");
		}
		book.desc = content.toString();
		var chapters = [];
		var list = doc.find(site.chapter);
		$.each(list, function(i, ele) {
			var $ele = $(ele);
			var href = $ele.attr("href");
			chapters.push({
				link: sites.reslovePath(site.host, url, href),
				title: $ele.text()
			});
		});
		book.chapters = chapters;
		return book;
	};
	api.getNovelDetail = function(url) {
		return new Promise(function(success, fail) {
			api.getDocument(url).then(function(doc) {
				var site = sites.findSite(url);
				if (!site) {
					success();
					return;
				}
				var book = api.parseDetail(doc, site);
				book.href = url;
				success(book);
			}).catch(fail);
		});
	};
	api.parseItems = function(doc, site) {
		var list = [];
		var eles = doc.find(site.item);
		$.each(eles, function(i, ele) {
			var info = $(ele);
			var item = {
				sourceName: site.name
			};
			var cover = info.find(site.cover).attr("src");
			if (cover && cover.startsWith("/")) {
				cover = site.host + cover;
			}
			item.cover = cover;
			item.title = $.trim(info.find(site.title).text());
			item.author = $.trim(info.find(site.author).text().subFromStr("："));
			item.desc = $.trim(info.find(site.desc).text()) || "暂无";
			if (site.updateTime.type == "css") {
				item.updateTime = info.find(site.updateTime.css).text();
			} else if (site.updateTime.type == "regex") {
				item.updateTime = info.text().match(site.updateTime.regex)[0];
			} else {
				item.updateTime = ""
			}
			if (item.updateTime.length > 0 && item.updateTime.length == 8) {
				item.updateTime = "20" + item.updateTime;
			}
			var href = info.find(site.detail).attr("href");
			if (href && href.startsWith("/")) {
				href = site.host + href;
			} else if (!href || href == "#/") {
				return;
			}
			item.href = href;
			if (site.listChapter) {
				item.lastChapter = $.trim(info.find(site.listChapter).text());
			} else {
				item.lastChapter = "";
			}
			list.push(item);
		});
		return list;
	};
	api.searchNovel = function(name) {
		return new Promise(function(success, fail) {
			plus.nativeUI.showWaiting();
			var tasks = [];
			$.each(sites, function(i, site) {
				var searchUrl = site.isPost ? site.searchUrl : site.searchUrl + encodeURIComponent(name);
				var postData = null;
				if (site.isPost) {
					postData = {};
					postData[site.paramName] = name;
				}
				var task = api.getDocument(searchUrl, {
					type: site.isPost ? "post" : 'get',
					encode: api.encodeMap[site.searchEncode],
					data: postData
				}).then(function(doc) {
					return [doc, site];
				}).catch(function() {
					return null;
				});
				tasks.push(task);
			})
			Promise.all(tasks).then(function(htmls) {
				var list = [];
				$.each(htmls, function(index, params) {
					if (!params) {
						return;
					}
					var doc = params[0],
						site = params[1];
					var items = api.parseItems(doc, site);
					if (items.length <= 0) {
						var item = api.parseDetail(doc, site);
						if (item) {
							items.push(item);
						}
					}
					list = list.concat(items);
				});
				var results = Enumerable.from(list).where(function(item) {
					return item.title.indexOf(name) > -1 || item.author.indexOf(name) > -1;
				}).groupBy(function(item) {
					return item.title + "||" + item.author
				}).select(function(group) {
					var result = group.orderByDescending(function(item) {
						return item.updateTime;
					}).first();
					result.sources = group.select(function(item) {
						return {
							sourceName: item.sourceName,
							href: item.href
						};
					}).toArray();
					return result;
				}).orderByDescending(function(item) {
					return item.updateTime;
				}).toArray();
				success(results);
			}).catch(fail);
		});
	};
	return api;
})
