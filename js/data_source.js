var array=[
		{
			"name":"server",	
			"uuid":0,
			"parent":null,
			"type":"node"
		},
		{
			"name":"msg_hub1",	
			"uuid":0,
			"parent":null,
			"type":"node"
		},
		{
			"name":"msg_hub2",	
			"uuid":0,
			"parent":null,
			"type":"node"
		},
		{
			"name":"cell1",	
			"uuid":0,
			"parent":null,
			"type":"node"
		},
		{
			"name":"cell2",	
			"uuid":0,
			"parent":null,
			"type":"node"
		},
		{
			"name":"ws_port",	
			"uuid":0,
			"parent":2,
			"type":"plugin"
		},
		{
			"name":"login_verify",	
			"uuid":0,
			"parent":2,
			"type":"plugin"
		},
		{
			"name":"friend_list",	
			"uuid":0,
			"parent":2,
			"type":"plugin"
		}
		
];
var jsonEdges=[
		{"from":0,"to":1},


		{"from":1,"to":3},


		{"from":4,"to":2},


		{"from":2,"to":0},

		{"from":5,"to":6},
		{"from":6,"to":7}
];
var jsontest={ "name": "cxh", "sex": "man" };
var topo=[
		{
			"name":"server",	
			"uuid":0,
			"children":null,
			"type":"node"
		},
		{
			"name":"msg_hub1",	
			"uuid":0,
			"children":null,
			"type":"node"
		},
		{
			"name":"msg_hub2",	
			"uuid":0,
			"children":[{
							"name":"ws_port",	
							"uuid":0,
							"type":"plugin"
						},
						{
							"name":"login_verify",	
							"uuid":0,
							"type":"plugin"
						},
						{
							"name":"friend_list",	
							"uuid":0,
							"type":"plugin"
						},
						{
							"name":"Paths",
							"children":[
										{
											"type":"hh",
											"subtype":"hh",
											"Edges":[{"from":"ws_port","to":"login_verify"},
													 {"from":"login_verify","to":"login_verify"},
												     {"from":"login_verify","to":"friend_list"}
												    ]
										},
	
										{
											"type":"yy",
											"subtype":"yy",
											"Edges":[{"from":"friend_list","to":"login_verify"},
													 {"from":"login_verify","to":"login_verify"},
												     {"from":"login_verify","to":"ws_port"}
												    ]
										}
										]

						}],
			"type":"node"
		},
		{
			"name":"cell1",	
			"uuid":0,
			"children":null,
			"type":"node"
		},
		{
			"name":"cell2",	
			"uuid":0,
			"children":null,
			"type":"node"
		},
		{
			"name":"Edges",
			"children":[
						{"from":"server","to":"msg_hub1"},
						{"from":"msg_hub1","to":"cell1"},
						{"from":"cell2","to":"msg_hub2"},
					   ]
		}
];