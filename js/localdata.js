var store = {};
document.addEventListener("plusready", function() {
	store.saveObj = function(key, obj) {
		return new Promise(function(reslove, reject) {
			if (!obj) {
				reject();
				return;
			}
			plus.io.requestFileSystem(plus.io.PRIVATE_DOC, function(fs) {
				fs.root.getDirectory("database", {
					create: true
				}, function(dir) {
					key = encodeURIComponent(key);
					dir.getFile(key, {
						create: true
					}, function(entry) {
						entry.createWriter(function(writer) {
							writer.onwrite = function() {
								reslove();
							};
							writer.onerror = function() {
								reject();
							};
							var str = JSON.stringify(obj);
							writer.write(str);
						}, reject);
					}, reject);
				}, reject);
			}, reject);
		});
	}

	store.getObj = function(key) {
		return new Promise(function(reslove, reject) {
			plus.io.requestFileSystem(plus.io.PRIVATE_DOC, function(fs) {
				fs.root.getDirectory("database", {
					create: true
				}, function(dir) {
					key = encodeURIComponent(key);
					dir.getFile(key, {
						create: true
					}, function(entry) {
						entry.file(function(file) {
							var reader = new plus.io.FileReader();
							reader.onload = function(e) {
								if (e.target.result) {
									reslove(JSON.parse(e.target.result));
								} else {
									reslove();
								}
							};
							reader.onerror = function() {
								reject(arguments);
							};
							reader.readAsText(file);
						}, reject);
					}, function() {
						reject();
					});
				}, reject);
			}, reject);
		});
	}

	store.removeItem = function(key) {
		plus.io.requestFileSystem(plus.io.PRIVATE_DOC, function(fs) {
			fs.root.getDirectory("database", {}, function(dir) {
				key = encodeURIComponent(key);
				dir.getFile(key, {}, function(entry) {
					entry.remove()
				});
			})
		});
	}

	store.getBookList = function() {
		return new Promise(function(reslove, reject) {
			var bookList = [];
			store.getObj("bookList").then(function(ids) {
				if (!ids || ids.length == 0) {
					reslove(bookList);
					return;
				}
				var futures = [];
				for (var i = 0; i < ids.length; i++) {
					var detail = (function(id) {
						return store.getBook(id).then(function(book) {
							if (!book) {
								return;
							}
							bookList.push(book);
						});
					})(ids[i]);
					futures.push(detail);
				}
				Promise.all(futures).catch(function() {
					console.log(JSON.stringify(arguments));
				}).finally(function() {
					bookList.sort(function(f, t) {
						if (t.lastRead && f.lastRead) {
							return t.lastRead - f.lastRead;
						}
						if (f.lastRead) {
							return -1;
						}
						return 1;
					});
					reslove(bookList);
				});
			}).catch(function() {
				reslove(bookList);
			});
		});
	}

	store.existBook = function(bookId) {
		return new Promise(function(reslove, reject) {
			store.getBook(bookId).then(function(obj) {
				reslove(obj != null);
			}).catch(function() {
				reslove(false);
			});
		});

	}

	store.getBook = function(bookId) {
		return new Promise(function(reslove, reject) {
			return store.getObj("book:" + bookId).then(reslove).catch(function() {
				reslove(null);
			});
		});

	}

	store.appendBook = function(book) {
		store.getObj("bookList").then(function(ids) {
			if (!ids) {
				ids = [];
			}
			var set = new Set(ids);
			if (set.has(book.id)) {
				return;
			}
			ids.push(book.id);
			store.saveObj("bookList", ids);
			store.saveBook(book);
		})
	}

	store.saveBook = function(book) {
		store.saveObj("book:" + book.id, book);
	}

	store.getBookRead = function(bookId) {
		return new Promise(function(reslove) {
			store.getObj("book:read:" + bookId).then(function(obj) {
				if (!obj) {
					obj = {
						index: 0,
						page: 0
					};
				}
				reslove(obj);
			}).catch(function() {
				reslove({
					index: 0,
					page: 0
				});
			});
		});
	}

	store.setBookRead = function(bookId, index, page) {
		store.saveObj("book:read:" + bookId, {
			index: index,
			page: page
		});
	}

	store.getBookChapters = function(bookId) {
		return new Promise(function(reslove) {
			store.getObj("book:chapters:" + bookId).then(function(list) {
				reslove(list ? list : []);
			})
		});
	}

	store.saveBookChapters = function(bookId, chapters) {
		store.saveObj("book:chapters:" + bookId, chapters);
	}

	store.existsChapter = function(bookId, chapterId) {
		return new Promise(function(reslove, reject) {
			plus.io.requestFileSystem(plus.io.PUBLIC_DOWNLOADS, function(fs) {
				fs.root.getDirectory(bookId, {
					create: true
				}, function(dir) {
					chapterId = encodeURIComponent(chapterId);
					dir.getFile(chapterId, {}, function(entry) {
						reslove(true);
					}, function() {
						reslove(false);
					});
				}, function() {
					reslove(false);
				});
			}, function() {
				reslove(false);
			});
		});
	}

	store.getChapter = function(bookId, chapterId) {
		return new Promise(function(reslove, reject) {
			plus.io.requestFileSystem(plus.io.PUBLIC_DOWNLOADS, function(fs) {
				fs.root.getDirectory(bookId, {
					create: true
				}, function(dir) {
					chapterId = encodeURIComponent(chapterId);
					dir.getFile(chapterId, {}, function(entry) {
						entry.file(function(file) {
							var reader = new plus.io.FileReader();
							reader.onload = function(e) {
								if (e.target.result) {
									reslove(e.target.result);
								} else {
									reject();
								}
							};
							reader.onerror = function() {
								reject();
							};
							reader.readAsText(file);
						}, reject);
					}, reject);
				}, reject);
			}, reject);
		});
	}

	store.saveChapter = function(bookId, chapterId, content) {
		return new Promise(function(reslove, reject) {
			plus.io.requestFileSystem(plus.io.PUBLIC_DOWNLOADS, function(fs) {
				fs.root.getDirectory(bookId, {
					create: true
				}, function(dir) {
					chapterId = encodeURIComponent(chapterId);
					dir.getFile(chapterId, {
						create: true
					}, function(entry) {
						entry.createWriter(function(writer) {
							writer.onwrite = function() {
								reslove();
							};
							writer.onerror = function() {
								reject();
							};
							writer.write(content);
						}, reject);
					}, reject);
				}, reject);
			}, reject);
		});
	}

	store.deleteBook = function(bookId) {
		store.removeItem("book:chapters:" + bookId);
		store.removeItem("book:read:" + bookId);
		store.removeItem("book:" + bookId);
		plus.io.requestFileSystem(plus.io.PUBLIC_DOWNLOADS, function(fs) {
			fs.root.getDirectory(bookId, {}, function(dir) {
				dir.removeRecursively();
			}, function(error) {
				console.log(JSON.stringify(error));
			})
		});
		store.getObj("bookList").then(function(ids) {
			if (!ids) {
				return;
			}
			var index = ids.indexOf(bookId);
			if (index >= 0) {
				ids.splice(index, 1);
				store.saveObj("bookList", ids);
			}
		});
	}
}, false);
