var util = {
	extend: function(){
		var target = arguments[0]
		for(var i = 1;i <= arguments.length; i++){
			for(var key in arguments[i]){
				target[key] = arguments[i][key]
			}
		}
		return target
	},
	
}