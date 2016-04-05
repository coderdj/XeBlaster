class player{

    constructor(top, bottom, left, right, speed, callback){
	this.moveLeft=false;
	this.moveRight=false;
	this.moveUp=false;
	this.moveDown=false;
	this.speed = speed;
	
	this.mesh=null;
	this.light=null;

	this.topbound = top;
	this.bottombound = bottom;
	this.leftbound = left;
	this.rightbound = right;
	
	// Create dude
	var theplayer = this;
	this.CreateMesh(callback);

	$(document).on("keydown", function (e) {
	    if(e.which == 87)
		theplayer.moveUp=true;
	    else if(e.which == 83)
		theplayer.moveDown=true;
	    else if(e.which == 65)
		theplayer.moveLeft=true;
	    else if(e.which == 68)
		theplayer.moveRight=true;
	});
	$(document).on("keyup", function (e) {
	    if(e.which == 87)
		theplayer.moveUp=false;
	    else if(e.which == 83)
		theplayer.moveDown=false;
	    else if(e.which == 65)
		theplayer.moveLeft=false;
	    else if(e.which == 68)
		theplayer.moveRight=false;
	});		    
		
    }

    
    obj(){
	return this.mesh;
    }
    getlight(){
	return this.light;
    }
    set_move_left(){
	this.moveLeft = set;
    }
    set_move_right(){
	this.moveRight = set;
    }
    set_move_up(){
	this.moveUp = set;
    }
    set_move_down(set){
	this.moveDown = set;
    }
    animate(time_constant){

	if(this.moveLeft &&
	   this.mesh.position.x - this.speed*time_constant > this.leftbound)
	    this.mesh.position.x-=this.speed*time_constant;
	if(this.moveRight &&
	   this.mesh.position.x + this.speed*time_constant < this.rightbound)
	    this.mesh.position.x+=this.speed*time_constant;
	if(this.moveUp &&
	   this.mesh.position.y + this.speed*time_constant < this.topbound)
	    this.mesh.position.y+=this.speed*time_constant;
	if(this.moveDown &&
	   this.mesh.position.y - this.speed*time_constant > this.bottombound)
	    this.mesh.position.y-=this.speed*time_constant;

	
	this.light.position.x = this.mesh.position.x;
	this.light.position.y = this.mesh.position.y -70;
	this.light.position.z = this.mesh.position.z +50;
	this.light.target.position.x = this.mesh.position.x;
	this.light.target.position.y = this.mesh.position.y +100;
	this.light.target.position.z =0;
    }
    
    CreateMesh(callback){
	var loader = new THREE.JSONLoader();
	var player = this;
	loader.load("game/models/SpaceShip.json",
		    function (geometry, materials){
			materials[1].color.setHex(0x4444aa);
			materials[0].color.setHex(0x222244);
			//materials[1].emissive.setHex(0x4444aa);
			//materials[0].emissive.setHex(0x222244);
			
			var player_material =
			    new THREE.MeshFaceMaterial(materials);
			player.mesh = new THREE.Mesh(geometry, player_material);
			player.mesh.scale.set(10, 10, 10);
			player.mesh.position.x=0;
			player.mesh.position.y=0;
			player.mesh.position.z=0;
			player.mesh.rotation.x = -Math.PI/2;
//			player.mesh.rotation.y = Math.PI;
			player.mesh.rotation.z = Math.PI;
			
			player.CreateLight(callback);
		    });
    }

    CreateLight(callback){
	this.light = new THREE.SpotLight( 0xffffff, 5., 0., Math.PI/2 );
	this.light.position.set(0, -50, 30);
	this.light.target.position.set(0, 5000, 10);
	callback();
    }
    
}
