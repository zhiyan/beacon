var domain = /taoche/.test(document.domain) ? 'dt.taoche.cn' : 'dt.daikuan.com'
var filePath = '/dt.gif'
var errFilePath = '/rd.gif'
var evtFilePath = '/dtevt.gif'

var config = {
	url: document.location.protocol + '//' + domain + filePath,
	errUrl: document.location.protocol + '//' + domain + errFilePath,
	evtUrl: document.location.protocol + '//' + domain + evtFilePath
}