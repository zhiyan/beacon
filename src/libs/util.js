var util = {
	extend: function(){
		var target = arguments[0]
		var arr = Array.prototype.slice.call(arguments, 1)

		this.each(arr, function(item){
			for(var key in item){
				target[key] = item[key]
			}
		})
		return target
	},

	each: function(arr, fn){
		var key = 0
		for(; key < arr.length; key++){
			fn(arr[key], key)
		}
	}
}