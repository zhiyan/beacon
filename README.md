# Beacon 统计代码

### 页面引用
    (function() {
            var bc = document.createElement('script'); bc.type = 'text/javascript'; bc.async = true;
            bc.src = ('https:' == document.location.protocol ? 'https://' : 'http://') + '192.168.151.72:8081/index.js';
            var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(bc, s);
    })();

### 参数含义

* _bc_sys : 客户端
* _bc_scr : 屏幕尺寸
* _bc_ua	: 浏览器ua
* _bc_url : 页面url(不带参数)
* _bc_host: 页面host
* _bc_param: 页面参数
* _bc_ref : 页面referer
* _bc_pid : 页面id
* _bc_type : 统计类型 uv|pv|clk
* _bc_tag : 点击元素tagName
* _bc_con : 点击统计索引
    * [track] : data-trackid
    * [id] : 元素id
    * [name] : 元素name
    * [text] : 元素文本

### 提供方法

    window.beacon 或 window.bc

	bc.send('clk')

	bc.send('clk', 'xxx')

	bc.send({
		_bc_type: 'clk',
		_bc_con : 'xxx'
	})
	