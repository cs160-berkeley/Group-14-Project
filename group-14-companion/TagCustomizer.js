import * as common from "common";
var colorSelected = "0";
var letterSelected = "0";
var saveChanged = "0";
var colorContainer = Container.template($=>({
	name:$.name,top:0,height:40,left:6,right:6,bottom:0,skin:$.skin,active:true,
	behavior: Behavior({
				container.skin= new Skin({
			}
			colorSelected="1";//letting system know that a color has been selected
			if(colorSelected ==="1" && letterSelected==="1"){//checking if letter has been selected and if so allow user to save
				if(saveChanged!=="1"){
					container.container.container.container.container.buttonLine.SAVE.skin = common.blueSkin;
					container.container.container.container.container.buttonLine.SAVE.active = true;
					saveChanged="1";
				}
			}
			container.container.container.delegate("updateSelected", container.name);
			container.container.container.container.container.previewTag.skin=new Skin({
 }));
 
 var letterContainer = Container.template($=>({
	name:$.name,top:0,height:40,left:5,right:5,bottom:0,skin:new Skin({name:"Skin",
	contents:[
		new Label({ top: 0, left: 0,right:0,height:40 ,
            		style: new Style({ font: "20px Roboto Medium", color: "white" }), 
            		string: $.name })
	],
	behavior: Behavior({
            	container.skin=new Skin({
            }
        	container.skin= new Skin({name:"Skin",
			letterSelected="1";//letting system know that a letter has been selected
			if(colorSelected ==="1" && letterSelected==="1"){//if color has also been selected, allow user to save
				if(saveChanged!=="1"){
					container.container.container.container.container.buttonLine.SAVE.skin = common.blueSkin;
					container.container.container.container.container.buttonLine.SAVE.active = true;
					saveChanged="1";
				}
			}
			
			container.container.container.container.container.previewTag.char.string=container.name;
			container.container.container.delegate("updateSave", "letter");
 }));
 
var previewTag = new Container({
	name:"previewTag",top:10,height:42,left:221,right:53,skin:new Skin({fill:"#cccccc"}),
	contents:[new Label({ name:"char",top: 0, left: 0,right:0,height:42 ,
            		style: new Style({ font: "22px Roboto Medium", color: "white" }), 
            		string: "?" })]
});
let CancelButton = new common.NormalButton({
let SaveButton = new common.NormalButton({
   	  onCreate(content){
   	  	//content.active=true;
   	  	content.skin=common.greySkin;
   	  }
var tagChooser = Container.template($=>({
       		top:30,bottom:30,left:6,right:6,skin:new Skin({fill:  "white"}),
       		contents:[
       		    new Label({ top: 5, left: 10,height:20 ,
            		style: new Style({ font: "16px Roboto Medium", color: "#595959" }), 
            		string: "Customize Tag" }),
            		previewTag,
       			new Label({ top: 20, left: 20,height:20 ,
            		style: new Style({ font: "17px Roboto Medium", color: "#595959" }), 
            		string: "Tag Preview" }),
            	new Container({top:65,height:1,left:10,right:10,skin: new Skin({fill:"#595959"})}),
            	new Container({top:75,left:0,right:0,active:true,//Super Container to manage colors and letters
            		contents:[
		            	new Container({top:0,left:0,right:0,active:true,//COLOR CONTAINER to manage colors
		              		contents:[
				            	new Line({top:0,height:40,left:0,right:0,
				            		contents:[
				            			new colorContainer({name:"red",skin:common.redSkin,color:common.red}),
				            			new colorContainer({name:"orange",skin:common.orangeSkin,color:common.orange}),
				            			new colorContainer({name:"yellow",skin:common.yellowSkin,color:common.yellow}),
				            			new colorContainer({name:"green",skin:common.greenSkin,color:common.green}),
				            			new colorContainer({name:"sky",skin:common.skySkin,color:common.sky}),
				            			new colorContainer({name:"blue",skin:common.blueSkin,color:common.blue}),
				            			new colorContainer({name:"purple",skin:common.purpleSkin,color:common.purple})
				            		]
				            	})
				            ],	
			            	behavior: Behavior({
			            		updateSelected: function(content,colorname) {
		       			 	})
		               }),
		               new Container({top:50,height:1,left:80,right:80,skin: new Skin({fill:"#595959"})}),
		               new Container({top:60,left:0,right:0,active:true,//ALPHABET CONTAINER to manage alphabets
		              		contents:[
					               new Line({top:0,height:40,left:0,right:0,
					            		contents:[
					            			new letterContainer({name:"A"}),
					            			new letterContainer({name:"B"}),
					            			new letterContainer({name:"C"}),
					            			new letterContainer({name:"D"}),
					            			new letterContainer({name:"E"}),
					            			new letterContainer({name:"F"}),
					            			new letterContainer({name:"G"}),
					            		]
					               }),
					               new Line({top:50,height:40,left:0,right:0,
					            		contents:[
					            			new letterContainer({name:"H"}),
					            			new letterContainer({name:"I"}),
					            			new letterContainer({name:"J"}),
					            			new letterContainer({name:"K"}),
					            			new letterContainer({name:"L"}),
					            			new letterContainer({name:"M"}),
					            			new letterContainer({name:"N"}),
					            		]
					               }),
					               new Line({top:100,height:40,left:0,right:0,
					            		contents:[
					            			new letterContainer({name:"O"}),
					            			new letterContainer({name:"P"}),
					            			new letterContainer({name:"Q"}),
					            			new letterContainer({name:"R"}),
					            			new letterContainer({name:"S"}),
					            			new letterContainer({name:"T"}),
					            			new letterContainer({name:"U"}),
					            		]
					               }),
					               new Line({top:150,height:40,left:0,right:88,
					            		contents:[
					            			new letterContainer({name:"V"}),
					            			new letterContainer({name:"W"}),
					            			new letterContainer({name:"X"}),
					            			new letterContainer({name:"Y"}),
					            			new letterContainer({name:"Z"}),
					            		]
					               })
				              ],
				              behavior: Behavior({
		       				  })
				       }),
					]
				}),
               new Line({name:"buttonLine",top:345,contents: [CancelButton,new Container({top:0,left:10,right:0}), SaveButton]})
        ],
