var color_bar=function (){
    this.colors=["#ff0000","#ff8000","#ffff00","#00ff00","#00ffff","#0000ff","#8000ff"];
    this.addbutton=null;
    this.init();
}
color_bar.prototype={
    init:function(){
                var group =$("<div class='btn-group clr_group'></div>");
                for(var i in this.colors){
                    var button=$("<button class='btn clr_btn'></button>");
                    button.css("background",this.colors[i]);
                    group.append(button);
                }
                this.addbutton=$("<button class='btn add_btn'></button>");
                this.addbutton.attr("title","add a new Path");
                var img =$("<img src='images2/add.png'></img>");
                    this.addbutton.css("background","white");
                    this.addbutton.append(img);
                    group.append(this.addbutton);
                    this.addbutton.on('click',function(){
                        $('#myModal1').modal("show");
                    });
                $('.top-menu').append(group);
                $('.clr_btn').on('click',color_ischoosed);
    },
    settypebyindex:function(i,type,subtype){//为dot提供
        $('.clr_btn:eq('+i+')').attr("title",type+","+subtype);
    },
    clearalltype:function(){
        $('.clr_btn').attr("title","");
    },
    add_newcolor:function(color,type,subtype){//为手动添加提供
        this.colors.push(color);
        $('.add_btn').remove();
        var button=$("<button class='btn clr_btn'></button>");
        button.attr("title",type+","+subtype);
        button.css("background",color);
        
        $('.clr_group').append(button);
        $('.clr_btn').on('click',color_ischoosed);
        $('.clr_group').append(this.addbutton);
        this.addbutton.on('click',function(){
                        $('#myModal1').modal("show");
        });
    },
    getcolorbyindex:function(i){
        return this.colors[i];
    },
    getcolorlength:function(){
        return this.colors.length;
    }
}
function color_ischoosed(){
        var save=$(this);
        if(!$(this).attr("title"))
            $('#myModal').modal("show");
        else {
            var str=$(this).attr("title").split(",");
            cur_manager.set_curpath(str[0],str[1],rgbToHex($(this).css("background")));
        }
         $('#myModal').on('hide.bs.modal', function () {
            if(!$('.type').val()||!$('.subtype').val())
                alert("保存失败");
            else{
                save.attr("title",$('.type').val()+","+$(".subtype").val());
            }
            
        });
}
function init_toolbar(){
   function setInteractionMode(evt, info, interactionProperties) {
        graph.interactionMode = info.value;
        graph.interactionProperties = interactionProperties || info;
    }
    var buttons={
        "Mode":[
                {name: "默认模式", value: Q.Consts.INTERACTION_MODE_DEFAULT, selected: true, icon: 'images2/default_icon.png', action: setInteractionMode},
                {name: '框选模式', value: Q.Consts.INTERACTION_MODE_SELECTION, icon: 'images2/rectangle_selection_icon.png', action: setInteractionMode},
                {name: '浏览模式', value: Q.Consts.INTERACTION_MODE_VIEW, icon: 'images2/pan_icon.png', action: setInteractionMode},
                {name: '建立连线', value: Q.Consts.INTERACTION_MODE_CREATE_SIMPLE_EDGE, icon: 'images2/edge_icon.png', action: setInteractionMode},
        ]
    };
    create_toolbar(buttons);
}
function create_toolbar(buttons){
    for(var n in buttons){
        var info=buttons[n];
        var group=$('<div class="btn-group  group"></div>');
        for(var i in info){
            group.append(create_button(info[i],i,n));
        }
        $('.top-menu').append(group);
    }
}
function create_button(info,i,name){
   //  var button=$("<input class='btn' id="+i+"></input>");
   // // var label=$("<label for="+i+"></label>");
   //  button.attr({"type":"radio","name":name});
    var button=$("<button class='btn btn-default'></button>");
    var img=$("<img></img>");
    img.attr("src",info.icon);
    button.append(img);
    button.attr("title",info.name);
   // label.css("background",info.icon+" no-repeat");
    //label.html(info.name);
    //button.append(label);
    button.on('click',function(evt){
        info.action.call(graph, evt, info);
    });
    return button;
}
function rgbToHex (rgb){
                // rgb(x, y, z)
    var color = rgb.toString().match(/\d+/g); // 把 x,y,z 推送到 color 数组里
    var hex = "#";
    for (var i = 0; i < 3; i++) {
                    // 'Number.toString(16)' 是JS默认能实现转换成16进制数的方法.
                    // 'color[i]' 是数组，要转换成字符串.
                    // 如果结果是一位数，就在前面补零。例如： A变成0A
        hex += ("0" + Number(color[i]).toString(16)).slice(-2);
    }
    return hex;
}
var dot=function(name,id,startX,startY,children){
        this.name=name;
    	this.id=id; 
		this.parent=parent;
		this.left=null;
		this.right=null;
        this.startX=startX;
        this.startY=startY;
        this.children=children;
		this.type=null;
		this.element=null;
		this.type=null;
		this.width=0;
		this.height=0;
		this.x=0;
		this.y=0;
		this.init_div();
}
dot.prototype={
    init_div:function(){
		var string="<div id="+this.id+"></div>";
		this.element=$(string);
		var panelement=$('.right-show');
		this.element.css({
			'position': 'absolute',
			'left':this.startX+"px",
			'top':this.startY+"px",
			'width':'200px',
			'height':'100px',
            'min-width':'200px',
            'min-height':'100px',
			'display': 'block',
			'border':'solid 1px black',
			'cursor': 'move',
            'background':'lightblue',
            "z-index":1,
            "border-radius":"5px"
		});
		panelement.append(this.element);
		//添加控制块
		var ne = $('<div class="controler ne"></div>');//东北  
        var nw = $('<div class="controler nw"></div>');//西北  
        var se = $('<div class="controler se"></div>');//东南  
        var sw = $('<div class="controler sw"></div>');//西南   
        this.append_component([ne,nw,se,sw],this.element);
        var conn=$('<div class="shape-conn"><br>conn</div>');
        var string=(parseInt(this.element.css("height"))-36)/2;
        conn.css("top",string);
        this.element.append(conn);
        //添加事件
        this.bindevent(this.element);
	},
	append_component:function(coms,target){
		var i;
		for( i in coms){			
			target.append(coms[i]);
		}
	},
	bindevent:function(element){
            var self=this;
		    var ox = 0; //原始事件x位置  
            var oy = 0; //原始事件y位置  
            var ow = 0; //原始宽度  
            var oh = 0; //原始高度  
  
            var oleft = 0; //原始元素位置  
            var otop = 0;  
            var org = $('.right-show');  
            var children=this.children;
            var id=this.id;
            var nemove = false;  
            function init_pathtype(Paths,map){
                for(var i in Paths){
                    color_manager.settypebyindex(i,Paths[i].type,Paths[i].subtype);
                    var Edges=Paths[i].Edges;
                    for(var j=0;j<Edges.length;j++){
                        var edge=graph.createEdge("",map[Edges[j].from],map[Edges[j].to]);
                        edge.setStyle(Q.Styles.EDGE_COLOR,color_manager.getcolorbyindex(i));
                        model.add(edge);
                    }
                }
            }

            element.on('mouseenter',function(){
            	var string="#"+this.id+"> .shape-conn";
            	$(string).css("display","block");
            }).on('mouseleave',function(){
            	var string="#"+this.id+"> .shape-conn";
            	$(string).css("display","none");
            });
            element.on('mousedown','.ne', function(e) {  
                ox = e.pageX;//原始x位置  
                oy = e.pageY;  
                ow = element.width();  
                oh = element.height();  
                nemove = true;  
                otop = parseInt(element.css('top').replace('px', ''));  
            });  
            //西北  
            var nwmove = false;  
            element.on('mousedown','.nw', function(e) {  
                ox = e.pageX;//原始x位置  
                oy = e.pageY;  
                ow = element.width();  
                oh = element.height();  
                otop = parseInt(element.css('top').replace('px', ''));  
                oleft = parseInt(element.css('left').replace('px', ''));  
                nwmove = true;  
            });  
            //东南  
            var semove = false;  
            element.on('mousedown','.se', function(e) {  
                ox = e.pageX;//原始x位置  
                oy = e.pageY;  
                ow = element.width();  
                oh = element.height();  
                semove = true;  
            });  
            //西南  
            var swmove = false;  
            element.on('mousedown','.sw', function(e) {  
                ox = e.pageX;//原始x位置  
                oy = e.pageY;  
                ow = element.width();  
                oh = element.height();  
                swmove = true;  
                oleft = parseInt(element.css('left').replace('px', ''));  
            });  
              //拖拽  
            var drag = false;  
            element.on('mousedown', function(e) {  
                ox = e.pageX;//原始x位置  
                oy = e.pageY;  
                otop = parseInt(element.css('top').replace('px', ''));  
                oleft = parseInt(element.css('left').replace('px', ''));  
                drag = true;  
            });  
            var conn=false;
            element.on('mousedown','.shape-conn', function(e) {  
            	//画一条线出来
            	return false;
            });  
            element.on('click',function(){
                    element.children('.controler').css("display","block");
                    cur_manager.init();
                    cur_manager.set_curdot(id);
                    model.clear();
                    color_manager.clearalltype();
                    graph.interactionMode=Q.Consts.INTERACTION_MODE_DEFAULT;
                    children=self.children;
                    if(children==null||!children.length) return false;
                    map={};
                    var i;
                    for(i=0;i<children.length-1;i++){
                        var node=graph.createNode(children[i].name,0,0);
                        model.add(node);
                        map[children[i].name]=node;
                    }
                    var Paths=children[i].children;
                    // var j;
                    
                    init_pathtype(Paths,map);
                    layouter.layoutType = Q.Consts.LAYOUT_TYPE_TWO_SIDE;
                     layouter.doLayout({callback: function(){
                     graph.zoomToOverview();
                     }});
                return false;
            });
            org.on('mousemove', function(e) {  
              
			    if(nemove) {  
                    var x = e.pageX - ox;  
                    var y = e.pageY - oy;  
                    element.css({  
                        height: oh - y,  
                        top: otop + y,  
                        width: ow + x  
                    }); 
                } else if(nwmove) {  
                    var x = e.pageX - ox;  
                    var y = e.pageY - oy;  
                    element.css({  
                        height: oh - y,  
                        top: otop + y,  
                        width: ow - x,  
                        left: oleft + x  
                    });  
                } else if(semove) {  
                    var x = e.pageX - ox;  
                    var y = e.pageY - oy;  
                    element.css({  
                        width: ow + x,  
                        height: oh + y  
                    }); 
                } else if(swmove) {  
                    var x = e.pageX - ox;  
                    var y = e.pageY - oy;  
                    element.css({  
                        width: ow - x,  
                        left: oleft + x,  
                        height: oh + y  
                    });  
                } else if(drag) {  
                    var x = e.pageX - ox;  
                    var y = e.pageY - oy;  
                    element.css({  
                        left: oleft + x,  
                        top: otop + y  
                    }); 
                }
                var string=(parseInt(element.css("height"))-36)/2;
                element.children('.shape-conn').css("top",string);
            }).on('mouseup', function(e) {  
               nemove = false;  
               nwmove = false;  
               swmove = false;  
               semove = false;   
               drag=false;
            });  
	},
    change_children:function(children){
        this.children=children;
    },
    autoadjuest_conn:function(element){
                var string=(parseInt(element.css("height"))-36)/2;
                element.children('.shape-conn').css("top",string);
    },
    get_json:function(){
        return {
            "name":this.name,
            "uuid":0,
            "type":"node",
             "children":this.children
            };
    }

    // addplugin:function(child){
    //     var children=this.children;
    //     var childdiv=$('<div class="plugin"><div>');
    //     childdiv.css({"top":(children.length*80+20)+"px","left":"50px"});
    //     this.element.append(childdiv);
    //     var add=children.length?80:0;
    //     children.push(child);
    //     this.element.css("min-height",(parseInt(this.element.css("min-height"))+add)+"px");
    //     this.autoadjuest_conn(this.element);
    // }
}
var line=function(name,id,from,to,startX,startY,endX,endY){
        this.name=name;
        this.id=id;
        this.from=from;
        this.to=to;
        this.element=null;
        this.ctx=null;
        this.start=null;
        this.end=null;
        this.startX=startX;
        this.startY=startY;
        this.endX=endX;
        this.endY=endY;
        this.width=Math.abs(endX-startX);
        this.height=Math.abs(endY-startY);
        this.k=(endY-startY)/(endX-startX);
        this.init_div();
}
line.prototype={
    init_div:function(){
        this.element=$("<div id="+this.id+"></div>");
        if(this.k>0)
        this.element.css({
            'width':this.width+"px",
            'height': this.height+"px", 
            'position': 'absolute',
            'top': this.startY+"px",
            'left':this.startX+"px"
        });
        else
        this.element.css({
            'width':this.width+"px",
            'height': this.height+"px", 
            'position': 'absolute',
            'top': this.startY+"px",
            'left':this.startX+"px"
        });
        var panelement=$('.right-show');
        panelement.append(this.element);
        //添加canvas
        var canvas=$("<canvas id="+this.id+"1 width="+this.width+ " height="+this.height+"></canvas>");
        this.element.append(canvas);
        this.ctx=document.getElementById(this.id+"1").getContext("2d");
        //画线
        var start=$('<div class="line-controler start"></div>');
        var end=$('<div class="line-controler end"></div>');
        this.start=start;
        this.end=end;
        if(this.k>0){        
            start.css({
                'top':'0px',
                'left':'0px'
            });
            end.css({
                 'bottom':'0px',
                 'right':'0px'
            });
        }
        else{
            start.css({
                'top':'0px',
                'right':'0px'
            });
            end.css({
                 'bottom':'0px',
                 'left':'0px'
            });
        }
        this.element.append(start);
        this.element.append(end);
        this.ctx.lineWidth=2;
        this.ctx.beginPath();
        if(this.k<0){
            this.ctx.moveTo(this.width,0);
            this.ctx.lineTo(0,this.height);
        }else{
             this.ctx.moveTo(0,0);
             this.ctx.lineTo(this.width,this.height);
        }
        this.ctx.stroke();
        this.ctx.closePath();
        //bind事件
        this.bindevent(this.element,this.ctx);
    },
    bindevent:function(element,ctx){
            var ox=0;
            var oy=0;
            var otop=0;
            var oleft=0;
            var org=element.parent();
            element.on('mousemove',function(event){
                otop=parseInt($(this).css("top"));
                oleft=parseInt($(this).css("left"));
                ox=event.pageX-oleft-parseInt(org.css("left"));
                oy=event.pageY-otop-parseInt(org.css("top"));

              if(ctx.isPointInStroke(ox,oy)){
              //  console.log(ox+" "+oy);
                element.css("cursor","pointer");
                }
              else{
                 element.css("cursor","default");
              }
            });
            element.on('click',function(event){
                otop=parseInt($(this).css("top"));
                oleft=parseInt($(this).css("left"));
                ox=event.pageX-oleft-parseInt(org.css("left"));
                oy=event.pageY-otop-parseInt(org.css("top"));
                if(ctx.isPointInStroke(ox,oy)){
                    var string="#"+this.id+"> .line-controler";
                    $(string).css("display","block");
                }
                else{
                    var string="#"+this.id+"> .line-controler";
                    $(string).css("display","none");
                }
                return false;
            });
    }
}
function factory(topo,kvmap){
    var i=0;
    for(i=0;i<topo.length-1;i++){
        var node=new dot(topo[i].name,i,40,40+i*120,topo[i].children);
        kvmap.push(node);
        
    }
        // if(topo[i].children!=null){
        // var children= topo[i].children;
        // var j;
        // for(j=0;j<children.length-1;j++){
        //     //给dot类添加plugin并且为之添加div和事件，根据个数设置dot一个大小和坐标
        //     node.addplugin(children[j]);
        // }
        // }
}
var cur_status=function(){
    this.cur_node;//当前实例id
    this.cur_type;//当前路径的type
    this.cur_subtype;//当前路径的subtype
    this.cur_value;//当前选择的插件值
    this.cur_clr;//当前路径的颜色
    this.init();
}
cur_status.prototype={
    init:function(){
        this.cur_node="";
        this.cur_type="";
        this.cur_subtype="";
        this.cur_value="";
        this.cur_clr="#000000";
    },
    set_type:function(type){
        this.cur_type=type;
    },
    set_subtype:function(subtype){
        this.cur_subtype=subtype;
    },
    set_color:function(color){
        this.cur_clr=color;
    },
    set_curpath:function(type,subtype,color){
        this.cur_type=type;
        this.cur_subtype=subtype;
        this.cur_clr=color;        
    },
    set_curdot:function(id){
        this.cur_node=id;
    },
    set_curplugin:function(plugin){
        this.cur_value=plugin;
    },
    get_curpath:function(){
        return {
            "type":this.cur_type,
            "subtype":this.cur_type,
            "color":this.cur_clr
        };
    },
    get_currdot:function(){
        return this.cur_node;
    },
    get_curplugin:function(){
        return this.cur_value;
    },
    get_curcolor:function(){
        return this.cur_clr;
    }
}
var dragdiv=function(){
         this.plugin_down=false; 
         this.div=$("<div class='drag'></div>");
         this.init();
}
dragdiv.prototype={
             init:function(){
                    var self=this;
                    var x=0;
                    var y=0;

                    $('body').on('mousedown','.plugin',function(evt){
                            self.plugin_down=true;
                            cur_manager.set_curplugin($(this).attr("id"));
                            $('body').append(self.div);
                    });
                    $('body').on('mousemove',function(evt){
                        if(self.plugin_down){
                            x=evt.pageX;
                            y=evt.pageY;
                            self.div.css({
                                "top":y+"px",
                                "left":x+"px"
                            });
                        }
                     });

                    $('body').on('mouseup',function(evt){
                        if(self.plugin_down){
                            self.div.remove();
                            self.plugin_down=false;
                            x=evt.pageX;
                            y=evt.pageY;
                            var body=$('body');
                            var canvas=$('#canvas');
                            var width=parseInt(canvas.css("width"));
                            var height=parseInt(canvas.css("height"));
                            var maxX=parseInt(body.css("width"));
                            var minX=maxX-width;
                            var minY=parseInt(canvas.css("top"));
                            var maxY=minY+height;
                                if(x>=minX&&x<=maxX&&y>=minY&&y<=maxY){
                                        var p = graph.globalToLocal(evt);
                                        var l = graph.toLogical(p.x, p.y);
                                        var node = graph.createNode(cur_manager.get_curplugin(), l.x, l.y);
                                        model.add(node);
                                }
                            }
                        }
                    );
            }       
}
var plugin_list=function(){
    this.plugins=["friend_list","ws_port","crypto"];
    this.init();
}
plugin_list.prototype={
    init:function(){
        var plugins=this.plugins;
        for(var i in plugins){
            var button=$('<button class="plugin threedbutton orange" id='+plugins[i]+'>'+plugins[i]+'</button>');
            $('.left-menu').append(button);
        }
    }
}
var save_to_dot=function(){
    this.save_btn;
    this.init();
}
save_to_dot.prototype={
    init:function(){
        var self=this;
        this.save_btn=$('<button class="save orange ">SAVE</button>');
        $(".show-canvas").append(this.save_btn);
        this.save_btn.on('click',function(){
            if(cur_manager.get_currdot()!=""){
                var dot_temp=kvmap[cur_manager.get_currdot()];
                dot_temp.change_children(self.parseJson());
            }
        });
     },
    parseJson:function(){
        var path_array=[];
        var color_paths=[];
        var children=[];
        for(var i =0;i<color_manager.getcolorlength();i++){
            var clr_btn=$('.clr_btn:eq('+i+')');
            if(clr_btn.attr("title")){
                var str=clr_btn.attr("title").split(",");
                color_paths.push(color_path_json(str[0],str[1],rgbToHex(clr_btn.css("background"))));
            }
        }
        model.forEach(function(d){
            if(d instanceof Q.Node){
                children.push(pluginjson(d.name));
            }
            else if(d instanceof Q.Edge){
                var color=d.getStyle(Q.Styles.EDGE_COLOR);
                for(var j in color_paths){
                    if(color_paths[j].color==color){
                        var eee=color_paths[j].detail.Edges;
                        eee.push(Edge_json(d.from.name,d.to.name));
                    }
                }
            }
        });
        for(var k in color_paths){
            path_array.push(color_paths[k].detail);
        }
        children.push({
            "name":"Paths",
            "children":path_array
        });
        return children;
    }
}
 function color_path_json(ntype,nsubtype,color){
        return {"color":color,
                    "detail":{
                        "type":ntype,
                        "subtype":nsubtype,
                        "Edges":[]
                    }
                };
    }
   function pluginjson(name){
        return{
                            "name":name,   
                            "uuid":0,
                            "type":"plugin"
             };
    }
     function Edge_json(from,to){
        return {"from":from,"to":to};
    }