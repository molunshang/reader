function formatDate(dateStr) {
	var date = new Date(dateStr);
	return date.getFullYear() + "-" + ("0" + (1 + date.getMonth())).substr(-2) + "-" + ("0" + date.getDate()).substr(-2) + " " + ("0" + date.getHours()).substr(-2) + ":" + ("0" + date.getMinutes()).substr(-2);
}

function StringBuilder() {
	var self = this;
	self.chars = [];
	self.append = function (str) {
		self.chars.push(str);
	};
	self.toString = function () {
		return self.chars.join("");
	};
}

if (!Promise.prototype.finally) {
	Promise.prototype.finally = function (callback) {
		return this.then(function (d) {
			return callback(d, undefined)
		}, function (e) {
			return callback(undefined, e)
		})
	}
}

String.prototype.subFromStr = function (str) {
	var index = this.indexOf(str);
	if (index < 0) {
		return this;
	}
	index = index + str.length;
	if (index == this.length) {
		return "";
	}
	return this.substr(index);
}