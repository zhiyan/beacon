/**
 * Beacon system
 */
function Beacon(){
		var that = this
    this.initOption = $.extend({
        clk: true,
        pv: true
    }, window.BEACON_INIT || {})

    if(!this.cookie('_utrace')){
    	new Fingerprint2().get(function(utrave){
    		var domain = document.domain.match(/\.[^\.]+\.[^\.]+$/)
    		if(domain && domain.length){
    			domain = domain[0]
    		}else{
    			domain = '.' + document.domain
    		}
        that.cookie('_utrace', utrave, {expires:999, domain: domain})
        that.init()
			})
    }else{
    	this.init()
    }
}

Beacon.prototype.version = '3.0.0'

Beacon.prototype.url = config.url
Beacon.prototype.errUrl = config.errUrl


Beacon.prototype.init = function(){
	this.resetSession()
  this.initData()

  if(this.initOption.clk){
      this.bindClk()
  }

  if(this.initOption.pv){
      this.send('pv')
      this.bindPv()
  }

  if(this.initOption.trigger){
      if(this[this.initOption.trigger.type]){
          this[this.initOption.trigger.type](this.initOption.trigger.msg)
      }
  }

  this.cache = []
}

Beacon.prototype.resetSession = function(){
  // 记录session时间
  this.session = +new Date()
}

Beacon.prototype.getSessionStatus = function(){
	// 30分钟会话时间
	var expired = 60 * 30 * 1000 
	var currentTime = +new Date()
	if(currentTime - this.session >= expired){
		this.resetSession()
		return false
	}
	return true
}

/**
 * 初始化基本数据
 */
Beacon.prototype.initData = function(){
    this.data = $.extend({

    		uid: this.cookie('_utrace'),

        // 屏幕尺寸
        scr: this.GetScreenSize(),

        // title
        title: document.title,

        // 客户端语言
        lang: (navigator.language || navigator.browserLanguage || '').toLowerCase(),

        requrl: window.location.href,

        refurl: document.referrer || ''
    }, this.initOption.data || {})
}

/**
 * 获得屏幕尺寸
 */
Beacon.prototype.GetScreenSize = function(){
    return screen.availWidth + '*' + screen.availHeight
}

/**
 * 格式化参数
 */
Beacon.prototype.formatParams = function(params){
    var s = []
    for( var k in params ) {
      s.push( k + '=' + encodeURIComponent(params[k]) )
    }    
    return s.join('&')
}

/**
 * 绑定点击事件
 */
Beacon.prototype.bindClk = function(){
    var that = this
    $('body').on('click', '*', function(){
        if(that.detectElement(this)){
            var element = $(this).closest('a')[0] || this
            var tag = element.tagName.toLowerCase()
            var $element = $(element)
            var data = {
                etype:'clk',
                etag: tag,
                eid : that.getXpath($element[0]),
                etxt: $element.text().replace(/\s/g,'')
            }

            if($.inArray(element, that.cache) < 0){
                that.send(data)
                that.setCache(element)
            }
        }
    })
}

/**
 * 绑定pv事件
 */
Beacon.prototype.bindPv = function(){
	var that = this
	if('visibilityState' in document && 'hidden' in document){
  	document.addEventListener('visibilitychange', function(){
  		if(!document.hidden && !that.getSessionStatus()){
  			setTimeout(function(){
  				if(!document.hidden){
	    			that.send('pv')
  				}
  			},3000)
  		}
  	})
	}
}

/**
 * cookie operation
 */
Beacon.prototype.cookie = function( key , value , options ){

    if (arguments.length > 1 && String(value) !== "[object Object]") {
      options = options || {}

      if (value === null || value === undefined) {
        options.expires = -1
      }

      if (typeof options.expires === 'number') {
        var days = options.expires, t = options.expires = new Date()
        t.setDate(t.getDate() + days)
      }

      value = String(value)

      return (document.cookie = [
              encodeURIComponent(key), '=',
              options.raw ? value : encodeURIComponent(value),
              options.expires ? ';expires=' + options.expires.toUTCString() : '',
              options.path ? ';path=' + options.path : ';path=/',
              options.domain ? ';domain=' + options.domain : '',
              options.secure ? ';secure' : ''
      ].join(''))
    }

    options = value || {}
    var result, decode = options.raw ? function (s) { return s } : decodeURIComponent
    return (result = new RegExp('(?:^|; )' + encodeURIComponent(key) + '=([^;]*)').exec(document.cookie)) ? decode(result[1]) : null 
}

/**
 * 发送数据
 */
Beacon.prototype.send = function(params, msg){
    if(typeof params === 'string'){
        params = {
            etype: params
        }
    }else{
        params = params || {}
    }

    if(typeof msg === 'object'){
    	$.extend(params, msg)
    }else if(msg){
    	params.msg = msg
    }

    new Image().src= ( params.type ? this.errUrl : this.url) + '?' + this.formatParams($.extend({t: +new Date() + Math.random()}, this.data, params))
}


Beacon.prototype.getXpath = function(element){
    var parent = element.parentElement
    var hasId = element.id
    var path = hasId ? '#' + element.id : element.tagName.toLowerCase()
    var similar

    if(!hasId){
        path += element.className ? '.' + element.className.replace(/^\s+|\s+$/g,'').replace(/\s+/g,' ').split(' ').join('.') : ''
        similar = $(parent).find(path)
        path += similar.length > 1 ? '[' + similar.index(element) + ']' : ''
    }

    return element === document.body ? '' : 
    			 hasId ? '/' + path : 
    			 this.getXpath(parent) + '/' + path
}
/**
 * 确认元素是否符合条件
 */
Beacon.prototype.detectElement = function(element){
    return !element.children.length && !$(element).closest('a').length
        || element.tagName === 'SELECT' 
        || element.tagName === 'A'
        || element.tagName === 'BUTTON'
}

Beacon.prototype.setCache = function(element){
    var that = this
    this.cache.push(element)
    setTimeout(function(){
        that.cache.splice($.inArray(element, that.cache), 1)
    },3000)
}

Beacon.prototype.info = function(msg){
    this.send({type:1}, msg || '')
}
Beacon.prototype.error = function(msg){
    this.send({type:2}, msg || '')
}
Beacon.prototype.debug = function(msg){
    this.send({type:3}, msg || '')
}

Beacon.prototype.evt = {
	api: config.evtUrl,
	send: function(btype, evtname, ex1, ex2, ex3){
		var sourceData = window.bc.data
		var data = {
			evtname: evtname,
			btype: btype,
			ctype: /^m\.|\.m\./.test(document.domain) ? 'm' : 'pc',
			ex1: ex1 || '',
			ex2: ex2 || '',
			ex3: ex3 || '',
			uid: sourceData.uid,
			t: +new Date()
		}
		if(sourceData.pid){
			data.pid = sourceData.pid
		}
		new Image().src = this.api + '?' + $.param(data)
	}
}

// 对外提供便捷方法
$(['clk', 'pv', 'exp']).each(function(key, etype){
	Beacon.prototype[etype] = function(data){
		var params = data || {}
		params.etype = etype
		this.send(params)
	}
})

window.beacon = window.bc = new Beacon()

