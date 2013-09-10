(function(){    var _ibox,_dbox,        _isch,_hash,        _cache = {},        _ckey  = 'tab-click-',        _reg0  = /^.*?#/,        _reg1  = /(?:^\s+)|(?:\s+$)/g,        _conf  = window.nej_doc_conf||{},        _msxml = ['Msxml2.XMLHTTP.6.0'                 ,'Msxml2.XMLHTTP.3.0'];    /* get ajax proxy */    var _getXHR = function(){        if (!!window.XMLHttpRequest)            return new XMLHttpRequest();        try{            for(var i=0,l=_msxml.length;i<l;i++)                return new ActiveXObject(_msxml[i]);        }catch(ex){            return null;        }    };    /* get event target element */    var _getElement = function(_event){        _event = _event||event;        return _event.target||_event.srcElement;    };    /* get max client height*/    var _getClientHeight = function(){        return Math.max(document.body.clientHeight,                        document.documentElement.clientHeight);    };    var _getScrollHeight = function(){        return Math.max(document.body.scrollHeight,                        document.documentElement.scrollHeight);    };    /* get max scroll top */    var _getScrollTop = function(){        return Math.max(document.body.scrollTop,                        document.documentElement.scrollTop);    };    /* set scroll top */    var _setScrollTop = function(_top){        _top = parseInt(_top)||0;        document.body.scrollTop = _top;        document.documentElement.scrollTop = _top;    };    /* add class name */    var _doAddClassName = function(_node,_class){        var _name = _node.className;        if (_name.indexOf(_class)>=0) return;        _node.className = _name+' '+_class;    };    /* delete class name */    var _doDelClassName = function(_node,_class){        var _name = _node.className;        if (_name.indexOf(_class)<0) return;        _node.className = _name.replace(_class,'').replace(_reg1,'');    };    /* show item sub list */    var _doShowSubList = function(_node){        /* no sub list */        if (!_node||!!_node.parentNode.id) return;        /* show sub list */        _doAddClassName(_node.parentNode.parentNode,'js-show');    };    /* hide item sub list */    var _doHideSubList = function(_node){        /* no sub list */        if (!_node||!!_node.parentNode.id) return;        /* hide sub list */        _doDelClassName(_node.parentNode.parentNode,'js-show');    };    /* 同步最小高度 */    var _doSyncMinHeight = function(){        var _ch = _getClientHeight(),            _to = _conf.topOffset||0,            _bo = _conf.bottomOffset||0,            _height = _ch-_to-_bo;        _dbox.style.minHeight = _height+'px';    };    /* sync index box item selected */    var _doSyncIndexSelect = function(_name){        var _newadd = !0,            _list = nej_index_dom.getElementsByTagName('a');        for(var i=0,l=_list.length,_node,_value;i<l;i++){            _node = _list[i];            _value = _node.href.replace(_reg0,'');            if (!_name&&i==0){                _name = _value;            }            if (_name!=_value){                _doDelClassName(_node,'js-selected');                continue;            }            _newadd = _node.className.indexOf('js-selected')<0;            _doAddClassName(_node,'js-selected');            _doShowSubList(_node);        }        return _newadd?_name:'';    };    /* load api/class detail */    var _doLoadDetail = function(_name){        if (!!_cache[_name]){            _doShowDetail(_cache[_name]);            return;        }        /* load from server */        var _xhr = _getXHR();        _xhr.onreadystatechange = function(){            if (_xhr.readyState!=4) return;            if (_xhr.status!=200){                _doShowDetail('<p>暂时无法载入数据，请稍候再试！</p>');                return;            }            _cache[_name] = _xhr.responseText;            _doShowDetail(_cache[_name]);        };        _xhr.open('GET',(_conf.root||'')+_name,!0);        _xhr.send(null);    };    /* show api/class detail */    var _doShowDetail = function(_html){        _dbox.innerHTML = _html;        _setScrollTop(0);    };    /* listen hash change */    var _doCheckLocation = function(){        var _value = location.hash;        if (_value==_hash)             return;        _hash = _value;        var _name = _hash.replace(_reg0,'')                         .split('|')[0];        _name = _doSyncIndexSelect(_name);        if (!!_name) _doLoadDetail(_name);    };    /* check index box position     var _doCheckPosition = function(){        if (!_ibox) return;        var _sh = _getScrollHeight(),            _ch = _getClientHeight(),            _st = _getScrollTop(),            _to = _conf.topOffset||0,            _bo = _conf.bottomOffset||0,            _height = _sh>=_ch+_st+_bo                    ? _ch-Math.max(0,_to-_st)                    : _sh-_bo-Math.max(_st,_to);        nej_index_dom.style.top = Math.max(0,_st-_to)+'px';        _ibox.style.height = Math.max(_height-_ibox.offsetTop,50)+'px';    };*/    /* check index box position */    var _doCheckPosition = function(){        if (!_ibox) return;        var _sh = _getScrollHeight(),            _ch = _getClientHeight(),            _st = _getScrollTop(),            _to = _conf.topOffset||0,            _bo = _conf.bottomOffset||0,            _style1 = _ibox.style,            _style2 = nej_index_dom.style;        _style2.position = _st<=_to?'':'fixed';        if (_style2.position=='fixed'){            _style2.left = nej_index_dom.parentNode.offsetLeft+'px';        }else{            _style2.left = '';        }        _style1.height = Math.min(_sh-_bo,_st+_ch)-                         Math.max(_to,_st)-_ibox.offsetTop+'px';    };    /* check need hide block */    var _isRequireHide = function(_node){        var _list = _node.getElementsByTagName('a');        for(var i=0,l=_list.length;i<l;i++)            if (_list[i].style.display!='none')                return !1;        return !0;    };    /* check api class sub list */    var _doCheckListBlock = function(_force){        if (!_ibox) return;        var _list = _ibox.childNodes;        for(var i=0,l=_list.length,_node,_name;i<l;i++){            _node = _list[i];            _name = _node.className;            if (!!_name&&                _name.indexOf('js-block')>=0){                _node.style.display =                      _force!=null?_force:(                     _isRequireHide(_node)?'none':'');            }        }    };    /* show box click */    var _doShowBoxClick = function(_event){        var _element = _getElement(_event),            _nid = _element.id;        if (_nid.indexOf(_ckey)<0) return;        var _list = _element.parentNode.getElementsByTagName('div');        for(var i=0,l=_list.length,_node,_id,_nbox;i<l;i++){            _node = _list[i];            _id = _node.id;            _nbox = document.getElementById(_id.replace(_ckey,'box-'));            if (_id==_nid){                _doAddClassName(_node,'js-selected');                if (!!_nbox) _nbox.style.display = '';            }else{                _doDelClassName(_node,'js-selected');                if (!!_nbox) _nbox.style.display = 'none';            }        }    };    /* index box click */    var _doIndexBoxClick = function(_event){        var _element = _getElement(_event);        if (_element.className                    .indexOf('js-toggle-btn')<0)            return;        /* toggle show */        var _parent = _element.parentNode;        _parent.className.indexOf('js-show')<0        ? _doAddClassName(_parent,'js-show')        : _doDelClassName(_parent,'js-show');    };    /* revert index list */    var _doRevertIndexList = function(){        var _list = nej_index_dom.getElementsByTagName('a'),            _snode;        for(var i=0,l=_list.length,_node;i<l;i++){            _node = _list[i];            _node.style.display = '';            if (_node.className.indexOf('js-selected')>=0)                _snode = _node;            _doHideSubList(_node)        }        _doShowSubList(_snode);        _doCheckListBlock('');    };    /* show search result */    var _doShowSearchResult = function(_key){        var _list = nej_index_dom.getElementsByTagName('a');        for(var i=0,l=_list.length,_node,_test;i<l;i++){            _node = _list[i];            _doShowSubList(_node);            _test = _node.title.toLowerCase().indexOf(_key)>=0;            _node.style.display = _test?'':'none';        }        _doCheckListBlock();    };    /* search input change */    var _doSearchInputChange = function(_event){        var _value = _isch.value.replace(_reg1,'').toLowerCase();        !_value ? _doRevertIndexList()                : _doShowSearchResult(_value);    };    /* init page */    var _doInitPage = function(){        var _parent = _conf.parent||document.body;        /* append index node */        if (!nej_index_dom) return;        _parent.appendChild(nej_index_dom);        _ibox = document.getElementById('nej-index-box');        _isch = nej_index_dom.getElementsByTagName('input')[0];        nej_index_dom.onclick = _doIndexBoxClick;        _isch[('oninput' in _isch)?'oninput':'onpropertychange'] = _doSearchInputChange;        /* append detail node */        _dbox = document.createElement('div');        _dbox.className = 'm-nej m-show';        _doSyncMinHeight();        _parent.appendChild(_dbox);        _dbox.onclick = _doShowBoxClick;        /* check location hash change */        window.setInterval(function(){            _doCheckLocation();            _doCheckPosition();        },150);    };    _doInitPage();})();