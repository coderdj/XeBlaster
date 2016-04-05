class FallingObject{
    
    // Base class for falling object
    // Falling objects have a position, movement unit vector, 
    // speed scalar, and mesh
    
    constructor(mesh, speed, x, y, z, vx, vy, vz){
	this.mesh = mesh;
	this.speed = speed;
	this.mesh.position.x = x;
	this.mesh.position.y = y;
	this.mesh.position.z = z;
	this.v = new THREE.Vector3(vx, vy, vz);

	this.bottom = null;
	this.top = null;
	this.left = null;
	this.right = null;
	this.front = null;
	this.back = null;
	this.asymmetry=null;
	this.buffer=null;
    };

    obj(){
	return this.mesh;
    };

    // If you want the object to reappear at the top after falling
    // If the x-position should stay the same, give this t, b, null, null
    // For a random position between left and right give it t, b, l, r
    set_box_rules(top, bottom, left, right){
	this.bottom = bottom;
	this.top = top;
	this.left = left;
	this.right = right;
    }
    set_z_rules(front, back, asymmetry, buffer){
	this.front=front;
	this.back=back;
	this.asymmetry=asymmetry;
	this.buffer=buffer;
    }

    animate(clock_factor){
	this.mesh.position.x += this.v.x * this.speed * clock_factor;
	this.mesh.position.y+= this.v.y * this.speed * clock_factor;
	this.mesh.position.z+= this.v.z * this.speed * clock_factor;
	
	// If there are some rules set then obey them
	if(this.bottom!=null && this.top!=null && 
	   this.mesh.position.y < this.bottom)
	    this.place();
	
    };
    
    place(){
	this.mesh.position.y = this.top;

	// Random x if wanted
	if(this.left !=null && this.right!=null)
	    this.mesh.position.x = (Math.random() * (this.right - this.left)) -
	    ((this.right-this.left)/2);	
	// Random z if wanted
	if(this.buffer != null && this.asymmetry != null
	   && this.front!=null && this.back!=null){
	    var sign = -1;
	    var outer = this.back;
	    if(Math.random()>this.asymmetry){
		sign = 1;
		outer = this.front;
	    }
	    
	    this.mesh.position.z = (Math.random() * sign *
				    (outer - this.buffer))+(sign*this.buffer);
	}
    };
    

    move(x, y, z){
	this.mesh.position.x = x;
	this.mesh.position.y = y;
	this.mesh.potition.z = z;
    };

    set_movement(x, y, z){
	this.v.x = x;
	this.v.y = y;
	this.v.z = z;
    };

};


// Now some special cases
function CreateAsteroid(paths, size_factor, size_min,
			speed_factor, speed_min, left, right){
    //paths is a list of paths for textures
    //returns the mesh, you should add this to the scene and a container

    // Make the mesh
    var size = Math.random()*size_factor + size_min;
    var trand = Math.floor(Math.random()*paths.length);
    THREE.ImageUtils.crossOrigin = "anonymous";
    var texture= THREE.ImageUtils.loadTexture(paths[trand]);   
    var mesh = new THREE.Mesh(new THREE.SphereGeometry(size, 12, 12),
			      new THREE.MeshLambertMaterial({
                                     map: texture,                                  
                              }));
    var speed = Math.random() *speed_factor + speed_min;
    var asteroid = new FallingObject(mesh, speed, -1000, -1000, -1000, 0, -1, 0);
    asteroid.set_box_rules(2000, -1000, left, right);
    asteroid.set_z_rules(350, 750, .8, 150);
    asteroid.place();
    return asteroid;
}

// Sprites as the farthest-back animated objects
function CreateSprite(paths, size_factor, size_min,
		      speed_factor, speed_min, left, right){

    // Make the mesh               
    var size = Math.random()*size_factor + size_min;
    var trand = Math.floor(Math.random()*paths.length);
    var texture= THREE.ImageUtils.loadTexture(paths[trand]);
    var material = new THREE.SpriteMaterial( { map: texture, fog: true, } );
    var sprite = new THREE.Sprite( material );
    sprite.scale.set(size, size, size);
    var speed = Math.random() *speed_factor + speed_min;

    // Initial placement
    x = (Math.random()*(right-left))-((right-left)/2);
    y = (Math.random()*3000)-1000;
    sprite = new FallingObject(sprite, speed, x, y, -1000, 0, -1, 0);
    sprite.set_box_rules(2000, -1000, left, right);

    
    //sprite.place();

    return sprite;
}

// Dust can give a sense of speed
function CreateDust(colors, speed, size_factor, size_min){

    var rsize = Math.random()*size_factor + size_min;
    var crand = Math.floor(Math.random()*colors.length);    
    var material = new THREE.MeshLambertMaterial({color: colors[crand]} );
    var geometry = new THREE.SphereGeometry(rsize, 4, 4);
    var mesh = new THREE.Mesh(geometry, innerMaterial);

    sprite = FallingObject(mesh, speed, -1000, -1000, 0, 0, -1, 0);
    sprite.set_box_rules(1200, -400, -1*window.innerWidth, window.innerWidth);
    sprite.place();
    
    return sprite;
}
