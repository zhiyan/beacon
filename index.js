/**
 * Beacon system
 */
function Beacon(){
    this.initData()
    this.send('pv')
    this.bindEvent()

    if(!this.cookie('__bc__')){
        this.cookie('__bc__', this.uuid(), {expires:1/*, domain:'.daikuan.com'*/})
        this.send('uv')
    }

    this.cache = []
}

Beacon.prototype.version = '0.1'

Beacon.prototype.url = '//192.168.151.72:8081/test/bc.gif'

/**
 * 初始化基本数据
 */
Beacon.prototype.initData = function(){
    this.data = {
        // 客户端
        _bc_sys: this.GetWindowsVersion(),

        // 屏幕尺寸
        _bc_scr: this.GetScreenSize(),

        // 浏览器useragent
        _bc_ua: this.GetBrowserVersion(),

        _bc_url: window.location.origin + window.location.pathname,

        _bc_host: window.location.host,

        _bc_param: window.location.search,

        _bc_ref: document.referrer || '-1',

        // 页面id
        _bc_pid: window.pageId || ''
    }
}

/**
 * 获得客户端操作系统版本
 */
Beacon.prototype.GetWindowsVersion = function(){
    var ua = navigator.userAgent.toLowerCase()
    var isWin81 = ua.indexOf('nt 6.3') > -1
    var isWin8 = ua.indexOf('nt 6.2') > -1
    var isWin7 = ua.indexOf('nt 6.1') > -1
    var isVista = ua.indexOf('nt 6.0') > -1
    var isWin2003 = ua.indexOf('nt 5.2') > -1
    var isWinXp = ua.indexOf('nt 5.1') > -1
    var isWin2000 = ua.indexOf('nt 5.0') > -1
    var isWindows = (ua.indexOf('windows') !== -1 || ua.indexOf('win32') !== -1)
    var isMac = (ua.indexOf('macintosh') !== -1 || ua.indexOf('mac os x') !== -1)
    var isAir = (ua.indexOf('adobeair') !== -1)
    var isLinux = (ua.indexOf('linux') !== -1)
    var sys = ''


    if (isWin81) {
        sys = 'Windows 8.1'
    } else if (isWin8) {
        sys = 'Windows 8'
    } else if (isWin7) {
        sys = 'Windows 7'
    } else if (isVista) {
        sys = 'Windows Vista'
    } else if (isWinXp) {
        sys = 'Windows XP'
    } else if (isWin2003) {
        sys = 'Windows 2003'
    } else if (isWin2000) {
        sys = 'Windows 2000'
    } else if (isWindows) {
        sys = 'Windows'
    } else if (isMac) {
        sys = 'Macintosh'
    } else if (isAir) {
        sys = 'Adobeair'
    } else if (isLinux) {
        sys = 'Linux'
    } else {
        sys = 'Unknow'
    }
    return sys
}

/**
 * 获得屏幕尺寸
 */
Beacon.prototype.GetScreenSize = function(){
    return screen.availWidth + '*' + screen.availHeight
}

/**
 * 浏览器版本
 */
Beacon.prototype.GetBrowserVersion = function(){
    var Sys = {}
    var ua = navigator.userAgent.toLowerCase()
    var s
    ;(s = ua.match(/rv:([\d.]+)\) like gecko/)) ? Sys.ie = s[1] :
    (s = ua.match(/msie ([\d.]+)/)) ? Sys.ie = s[1] :
    (s = ua.match(/firefox\/([\d.]+)/)) ? Sys.firefox = s[1] :
    (s = ua.match(/chrome\/([\d.]+)/)) ? Sys.chrome = s[1] :
    (s = ua.match(/opera.([\d.]+)/)) ? Sys.opera = s[1] :
    (s = ua.match(/version\/([\d.]+).*safari/)) ? Sys.safari = s[1] : 0

    if (Sys.ie) {return ('IE: ' + Sys.ie)}
    else if (Sys.firefox) {return ('Firefox: ' + Sys.firefox)}
    else if (Sys.chrome) {return ('Chrome: ' + Sys.chrome)}
    else if (Sys.opera) {return ('Opera: ' + Sys.opera)}
    else if (Sys.safari) {return ('Safari: ' + Sys.safari)}
    else {return 'Unknown'}
}

/**
 * 格式化参数
 */
Beacon.prototype.formatParams = function(params){
    console.log(params)
    var s = []
    for( var k in params ) {
      s.push( k + '=' + encodeURIComponent(params[k]) )
    }    
    return s.join('&')
}

/**
 * 绑定事件
 */
Beacon.prototype.bindEvent = function(){
    var that = this
    $('body').on('click', '*', function(){
        if(that.detectElement(this)){
            var element = $(this).closest('a')[0] || this
            var tag = element.tagName.toLowerCase()
            var $element = $(element)
            var data = {
                _bc_type:'clk',
                _bc_tag: tag
            }

            var refData = {
                track : $element.attr('data-trackerid'),
                id : $element.attr('id'),
                name: $element.attr('name'),
                text: $element.text().replace(/\s/g,'').substring(0,10),
            }

            $.each(refData, function(key, value){
                if(value){
                    refData[key] = '['+key+']'+value
                }
            })

            switch(tag){
                // case 'a':
                    // data._bc_con = refData.track || refData.id || refData.text
                    // break
                case 'input':
                case 'textarea':
                case 'select':
                    data._bc_con = refData.track || refData.name || refData.id
                    break
                default:
                    data._bc_con = refData.track || refData.id || refData.text
                    break
            }
            if(data._bc_con && that.cache.indexOf(data._bc_con) < 0){
                that.send(data)
                that.setCache(data._bc_con)
            }
        }
    })
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
              options.expires ? '; expires=' + options.expires.toUTCString() : '',
              options.path ? '; path=' + options.path : '; path=/',
              options.domain ? '; domain=' + options.domain : '',
              options.secure ? '; secure' : ''
      ].join(''))
    }

    options = value || {}
    var result, decode = options.raw ? function (s) { return s } : decodeURIComponent
    return (result = new RegExp('(?:^|; )' + encodeURIComponent(key) + '=([^;]*)').exec(document.cookie)) ? decode(result[1]) : null 
}

/**
 * 发送数据
 */
Beacon.prototype.send = function(params, content){
    if(typeof params === 'string'){
        params = {
            _bc_type: params
        }
    }else{
        params = params || {}
    }

    if(content){
        params._bc_con = content
    }

    new Image().src= this.url + '?' + this.formatParams($.extend({t: +new Date() + Math.random(),}, this.data, params))
}

/**
 * 确认元素是否符合条件
 */
Beacon.prototype.detectElement = function(element){
    return !element.children.length && !$(element).closest('a').length
        || element.tagName === 'SELECT' 
        || element.tagName === 'A'
}

/**
 * 生成uuid
 */
Beacon.prototype.uuid = function() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0, v = c === 'x' ? r : (r&0x3|0x8)
        return v.toString(16)
    })
}

Beacon.prototype.setCache = function(content){
    var that = this
    this.cache.push(content)
    setTimeout(function(){
        that.cache.splice(that.cache.indexOf(content), 1)
    },3000)
}

window.beacon = window.bc = new Beacon()


