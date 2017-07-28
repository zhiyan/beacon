var util = {
	extend: function() {
		var target = arguments[0]
		var arr = Array.prototype.slice.call(arguments, 1)

		this.each(arr, function(item) {
			for (var key in item) {
				target[key] = item[key]
			}
		})
		return target
	},

	each: function(arr, fn) {
		var key = 0
		for (; key < arr.length; key++) {
			fn(arr[key], key)
		}
	},

	text: function(elem) {
		var nodeType = elem.nodeType
		var ret = ''
		if (nodeType === 1 || nodeType === 9 || nodeType === 11) {
			if (typeof elem.textContent === 'string') {
				return elem.textContent
			} else {
				for (elem = elem.firstChild; elem; elem = elem.nextSibling) {
					ret += this.text(elem)
				}
			}
		} else if (nodeType === 3 || nodeType === 4) {
			return elem.nodeValue
		}

		return ret
	},

	param: function(obj) {
		var ret = ''
		for (var i in obj) {
			ret += '&' + i + '=' + window.encodeURIComponent(obj[i])
		}

		return ret.replace(/^&/, '')
	},

	bindEvent: function(elem, type, fn) {
		if (elem.addEventListener) {
			elem.addEventListener(type, fn, false)
		} else if (elem.attachEvent) {
			elem.attachEvent('on' + type, fn)
		}
	}
}
