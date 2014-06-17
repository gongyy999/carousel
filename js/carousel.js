 /*
 * DOM轮播组件
 * @author GongYunyun(gongyy999@126.com)
 * @date    2014-06-05
 * @version V1.2
 */

function carousel(o){
    this.data=o['data']; //轮播数据
    this.dir=o["dir"]||"left"; //轮播方向
    this.order=o['order'];
    this.nextBtn=$(o["next"]);  
    this.prevBtn=$(o["prev"]);
    this.main=$(o["main"]);    //轮播区域外框
    this.list=$(o["list"]);      //列表区域
    this.time=o["time"] || 2000;
    this.moveVal=o["moveVal"]; //移动单位值
    this.auto=typeof o["auto"] != "undefined" ? o["auto"] : true; //是否自动
    this.tpl= typeof o["tpl"] != "undefined" ? o["tpl"] : "<li><img src=\"{%s}\" /></li>"; //轮播元素模板
    this.res=typeof o["res"] != "undefined" ? o["res"] : false; //是否需要自适应容器大小
    this.callback=o.callback;   //轮播后回调
    
    this.isSupportTouch = "ontouchstart" in document ? true : false;  //是否支持touch事件
    this.moveMain=null; //轮播区域
    this.timeout=null;
    this.ing=false;

    
    this.index=0; //当前状态


    var _t=this;

    //自动轮播
    this.play = function(){
         _t.timeout = window.setInterval(function(){_t.next()},_t.time);
    };

    //停止自动轮播
    this.stop = function(){
        window.clearInterval(_t.timeout);
    };

    //初始化
    this.init=function(){
        

        //数据写入
        if(this.data){
            var tpl=_t.tpl,
                first="",
                html="",
                list="",
                len=_t.data.length,
                i=0,
                j;
            for(i=0;i<len;i++){
                j=0;
                html+=tpl.replace(/\{%s%\}/g,function(){
                    return _t.data[i][_t.order[j++]];
                });

                //额外增加头尾用于循环
                if(i==0){
                    first=html;
                }else if(i==len-1){
                    html+=first;
                    j=0;
                    html+=tpl.replace(/\{%s%\}/g,function(){
                        return _t.data[i][_t.order[j++]];
                    });
                }
                
                list+=list==""?"<span class=\"selected\">&nbsp;</span>":"<span>&nbsp;</span>";
            }

            _t.moveMain=$("<ul>").addClass("clearfix").html(html);

            
            _t.main.html(_t.moveMain);
            if( typeof _t.list[0]!="undefined"){
                _t.list.html(list);
            }
        }else{
            _t.moveMain=_t.main.children("ul");
            var last=_t.moveMain.children("li:last").clone();
            _t.moveMain.children("li:first").clone().appendTo(_t.moveMain);
            last.appendTo(_t.moveMain);

        }

        this.len=this.moveMain.children("li").length;
        
        var lastLiStyle={};
        lastLiStyle["position"]="relative";
        lastLiStyle[_t.dir]="-"+(_t.len*_t.moveVal)+"px";
         _t.moveMain.children("li:last").css(lastLiStyle);


        if(_t.dir=="left"){
            _t.moveMain.width(_t.moveVal*_t.len);
        }

        //翻页
        _t.prevBtn.bind("click",function(){_t.prev()});
        _t.nextBtn.bind("click",function(){_t.next()});

        //索引效果
        _t.list.bind("click",function(e){
            if(e.target.tagName==="SPAN"&&_t.ing===false){
                _t.index=$(e.target).index();
                _t.slider(_t.index);
            }
        })

        //自适应容器宽度
        if(_t.res){
            var width=_t.main.width();
            _t.moveVal=width;
            _t.moveMain.find("li").css("width",width);
            $(window).resize(function(){
                width=_t.main.width();
                _t.moveVal=width;
                _t.moveMain.css({"width":_t.len*width,"margin-left":"-"+_t.moveVal*_t.index+"px"});

                _t.moveMain.find("li:last").css(lastLiStyle).
                _t.main.find("li").css("width",width);
            })
        }

        if(_t.auto){
            _t.play(); 
        }
    };

    this.init();

    //触屏划动事件
    if(this.isSupportTouch){
        _t.touch={
            moveStart:0,
            moveEnd:0,
            moveIng:0
        };
        this.getVal=function(type){
            if(_t.dir==="left"){
                return type === "start" ? event.touches[0].screenX : event.touches[0].screenX - _t.touch.moveStart;
            } else {
                return type === "start" ? event.touches[0].screenY : event.touches[0].screenY - _t.touch.moveStart;
            }
        };
        
        this.main[0].addEventListener("touchstart",touchEvent, false);
        this.main[0].addEventListener("touchend", touchEvent, false);
        this.main[0].addEventListener("touchmove", touchEvent, false);

        function touchEvent(){
            var style={},
                val=0;
            switch(event.type){
                case "touchstart":
                   // _t.start();
                    _t.touch.moveStart=_t.getVal("start");

                    break;
                case "touchend":
                    _t.touch.moveEnd=event.changedTouches[0].screenX;
                    //_t.play();
                    val=_t.touch.moveStart-_t.touch.moveEnd;
                    if(Math.abs(val)<(_t.moveVal/3)){   //划动区域不到三分之一，回复状态
                        _t.slider(_t.index);
                    }else{  //滚动
                        if(val>0){
                            _t.nextBtn.click();
                        }else{
                            _t.prevBtn.click();
                        }
                    }
                    break;
                case "touchmove":
                    _t.touch.moveIng=_t.getVal();
                    style["margin-"+_t.dir]=(_t.touch.moveIng-_t.index*_t.moveVal)+"px";
                    _t.moveMain.css(style);
                    event.preventDefault(); //阻止滚动
                    break;
                default :
                    return ;
            }
        }
    }
};


//开始动画
carousel.prototype.start=function(){
    var _t=this;
    _t.ing=true;
    if(_t.auto){
        _t.stop(); 
    }
}

//结束动画
carousel.prototype.end=function(){
    var _t=this;
    _t.ing=false;
    if(_t.auto){
        _t.play(); 
    }
    _t.list.find("span").eq(_t.index).addClass("selected").siblings("span").removeClass("selected");
}

carousel.prototype.next=function(){

    var _t=this;
    if(_t.ing){ //动画进行中
        return false;
    }
    _t.start();
    
    if(_t.index==_t.len-3){ //轮回
        var anima={};
        anima["margin-"+_t.dir]="-"+(_t.moveVal*(_t.index+1));
        _t.moveMain.animate(anima ,500,function(){
            _t.moveMain.css("margin-"+_t.dir,"0");
            _t.end();
        });
        _t.index=0;
        
    }else{
        _t.index++;
        var anima={};
        anima["margin-"+_t.dir]="-"+(_t.moveVal*_t.index)+"px";
        _t.moveMain.animate( anima, 500,function(){
            _t.end();
        });
    }
};

carousel.prototype.prev=function(){
    var _t=this;
    if(_t.ing){ //动画进行中
        return false;
    }
    _t.start();

    if(_t.index==0){ //轮回
        var anima={},
            style={};
        anima["margin-"+_t.dir]=_t.moveVal;
        style["margin-"+_t.dir]="-"+(_t.moveVal*(_t.len-3))+"px";
        _t.moveMain.animate(anima,500,function(){
            _t.moveMain.css(style);
            _t.end();
        });
        _t.index=_t.len-3;
    }else{
        _t.index--;
        var style={};
        style["margin-"+_t.dir]="-"+(_t.moveVal*_t.index);
        _t.moveMain.animate(style, 500,function(){
            _t.end();
        });
    }
    
};

carousel.prototype.slider=function(index){
    var _t=this,
        style={};
    _t.index=index*1;

    style["margin-"+_t.dir]="-"+(_t.moveVal*index);
    _t.start();
    _t.moveMain.animate(style, 300,function(){
        _t.end();
    });

    if(typeof _t.callback!="undefined"){
        _t.callback(_t.index);
    }
};
