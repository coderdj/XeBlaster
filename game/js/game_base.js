class XeBlaster{
    constructor(div_name, menu_div){
	this.div = div_name;
	this.menu = menu_div;
	document.game = this;
	
	// Set up screen size
	this.windowWidth = window.innerWidth;
	this.windowHeight = window.innerHeight;
	if( this.windowWidth < 1000 )
	    this.windowWidth = 1000;
	if( this.windowHeight < 600 )
	    this.windowHeight = 600;
	this.left_bound = -(this.windowWidth/2)-(this.windowWidth*0.1);
	this.right_bound = -this.left_bound;
	this.top_bound = 1200;
	this.bottom_bound = -100;
	
	this.animate = false;
	
	// Set up audio
	//later
	
	// Set up visual
	this.renderer = new THREE.WebGLRenderer({ blending: THREE.AdditiveBlending,
						  alpha: true});
	this.camera = new THREE.PerspectiveCamera(90,
						  this.windowWidth/this.windowHeight,
						  0.1, 10000);
	this.effects = null;
	
	this.scene = new THREE.Scene();
	this.scene.add(this.camera);
	this.camera.position.z = 500;
	this.camera.position.y = this.windowHeight/2;
	this.camera.position.x = 0;

	// Background image
	this.backgroundScene = new THREE.Scene();
	this.backgroundCamera = new THREE.Camera();
	this.backgroundMesh = null;
	this.backgroundScene.add(this.backgroundCamera);
	
	// Set up timer
	this.clock = new THREE.Clock();
	this.clock_corr=70;
	this.clock.start();

	this.renderer.setSize(this.windowWidth, this.windowHeight);

	// Set containers for stuff that will be part of scene
	this.player = null;
	this.bullets = [];
	this.en_bullets = [];
	this.fallingObjects = [];
	this.enemies = [];
	
	this.ResetScore();
	this.ResetContainers();

	this.BulletBank = new BulletBank(this.top_bound+100, this.bottom_bound-100,
					 this.left_bound-100, this.right_bound+100,
					 this.scene);
	
	$("#" + this.div).append(this.renderer.domElement);

	var thegame = this;
	$(document).on("keyup", function(e){
	    if(e.which == 13)
		thegame.BulletBank.Fire(true, thegame.player.obj().position.x,
					thegame.player.obj().position.y+10,
					thegame.player.obj().position.z);
	});
	
    }
    GetPlayerPosition(){
	return this.player.obj().position;
    }
    LoadBackground(path){
	if(this.backgroundMesh != null)
	    this.backgroundScene.remove(this.backgroundMesh);
	var texture = new THREE.ImageUtils.loadTexture( path );
	var backgroundMesh = new THREE.Mesh(
	    new THREE.PlaneGeometry(2, 2),
	    new THREE.MeshBasicMaterial({
		map: texture,
	    }));
	backgroundMesh.material.depthTest = false;
	backgroundMesh.material.depthWrite = false;
	backgroundMesh.position.x=0;
	backgroundMesh.position.y=0;
	backgroundMesh.position.z =0;
	this.backgroundMesh = backgroundMesh;
	this.backgroundScene.add(backgroundMesh);
    }
    ResetScore(){
	this.score = 0;
    }
    AddPoints(points){
	this.score += points;
    }
    ResetContainers(){

	for(var x=0;x<this.bullets.length;x+=1){
	    for(y=0;y<this.bullets[x].length;y+=1){
		scene.remove(this.bullets[x][y].obj());
	    }
	}
	this.bullets = [];
	for(var x=0; x<this.en_bullets.length; x+=1){
	    for(var y=0;y<this.en_bullets[x].length;y+=1){
		scene.remove(this.en_bullets[x][y].obj());
	    }
	}
	this.en_bullets =[];
	for(var x=0;x<this.fallingObjects.length;x+=1)
	    this.scene.remove(this.fallingObjects[x].obj());
	this.fallingObjects = [];
	for(var x=0;x<this.enemies.length;x+=1)
	    this.scene.remove(this.enemies[x].obj());
	this.enemies = [];

	if( this.player!= null)
	    scene.remove(this.player.obj());
	this.player = null;
	
    }

    Start(){

	var thegame = this;
	this.player = new player(this.top_bound, this.bottom_bound,
				 this.left_bound, this.right_bound, 15,
				 function(){
				     thegame.scene.add(thegame.player.obj());
				     thegame.scene.add(thegame.player.getlight());
				     thegame.scene.add(
					 thegame.player.getlight().target);

				     thegame.LoadLevel_0();
				     thegame.animate = true;
				     thegame.Animate();
				     $("#"+thegame.menu).hide();
				     
				 });
	
    }
    
    LoadLevel_0(){

	this.LoadBackground("game/img/nebula.png");
	
	// Might want to change numbers based on
	// system settings
	var n_asteroids = 15;
	var n_sprites = 50;
	var n_dust = 50;
	var n_enemies = 50;
	
	// Load Asteroids
	var apaths = [ "game/img/asteroid_0.jpg",
		   "game/img/asteroid_1.gif",
		   "game/img/asteroid_2.jpg"
		 ];
	for(var x=0; x<n_asteroids; x+=1){
	    var mesh = CreateAsteroid(apaths, 100, 20, 3, 1, -this.windowWidth,
				     this.windowWidth);
	    this.fallingObjects.push(mesh);
	    this.scene.add(mesh.obj());
	}

	// Load background sprites
	var spaths = ["game/img/ast_0.png",
		      "game/img/ast_1.png",
		      "game/img/ast_2.png",
		      "game/img/ast_3.png",
		      "game/img/neb_0.png",
	              "game/img/neb_1.png",
		      "game/img/neb_2.png",
		      "game/img/neb_3.png",
		     ];
	for(var x=0; x<n_sprites; x+=1){
	    var mesh = CreateSprite(spaths, 20, 40, 0, .5, -2*this.windowWidth,
				    2*this.windowWidth);
	    this.fallingObjects.push(mesh);
	    this.scene.add(mesh.obj());
	}
	for(var x=0; x<n_enemies; x+=1){
	    var enemy = new basic_enemy(this.top_bound, this.bottom_bound,
					this.left_bound, this.right_bound,
					5, this.effects, this.BulletBank,
					this.scene, this, 0.5, 100, 5);
	    this.enemies.push(enemy);
	}
		
    }    

    Animate(){
	if(!this.animate) return;
	
	var  clock_delta = this.clock.getDelta();
	var clock_corr = this.clock_corr * clock_delta;

	this.player.animate(clock_corr);
	this.BulletBank.animate(clock_corr);
	for(var x=0; x<this.fallingObjects.length; x+=1)
	    this.fallingObjects[x].animate(clock_corr);
	for(var x=0; x<this.enemies.length; x+=1)
	    this.enemies[x].animate(clock_corr);
	
	var object = this;
	setTimeout( function() {
	    requestAnimationFrame( function(){ object.Animate();} );
	}, 1000 / 100 );

	this.renderer.autoClear = false;
	this.renderer.clear();
	this.renderer.render(this.backgroundScene, this.backgroundCamera);
	this.renderer.render(this.scene, this.camera);
	
    }
	
}
    
