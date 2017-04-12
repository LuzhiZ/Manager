function machine(){
	var id;
	var name;

	function init_machine(x,namex){
		id=x;
		name=namex;
	}
	return{
		init:init_machine
	}
};
function node(){
	var _id;
	var _name;
	var uuid;
	var parent;
	var type;
	function init_node(idx,namex,uuidx,parentx,typex){
		_id=idx;
		_name=namex;
		uuid=uuidx;
		parent=parentx;
		type=typex;
	}
	function get_id(){
		return _id;
    }
    function get_parent(){
    	return parent;
    }
    function get_type(){
    	return type;
    }
	return {
		getparent:get_parent,
		gettype:get_type,
		init:init_node
	}
};
function edge(){
	var id;
	var type;
	var from;
	var to;
	function init_edge(idx,typex,fromx,tox){
		id=idx;
		type=typex;
		from=fromx;
		to=tox;
	}
	return {
		init:init_edge
	}
};
var nodes_show=[];
var edges_show=[];
var nodes_storge=[];
var edges_storge=[];
var machine_storge=[];
var machine_show=[];