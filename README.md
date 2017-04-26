# Beacon 统计代码

### 页面引用
    (function() {
            var bc = document.createElement('script'); bc.type = 'text/javascript'; bc.async = true;
            bc.src = ('https:' == document.location.protocol ? 'https://' : 'http://') + 'dt.daikuan.com/bc.js';
            var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(bc, s);
    })();

### 参数含义

* uid : 唯一号uuid
* scr : 屏幕尺寸
* title : 页面标题
* lang : 客户端语言
* requrl : 页面链接
* refurl : 页面来源页
* pid : (可选)页面id
* msg : (可选)报错信息
* etype:[event]事件类型 clk|exp
* etag :[event:clk]触发事件标签
* eid : [event:clk]触发事件元素xpath
* etxt: [event:clk]触发事件元素内文本


### 提供方法

    window.beacon 或 window.bc

	bc.send('clk')

	bc.send('clk', 'xxx')

	bc.send({
		_bc_type: 'clk',
		_bc_con : 'xxx'
	})

    bc.clk({...})
    bc.pv({...})
    bc.exp({...})
	