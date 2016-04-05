class BulletBank{
    constructor(top, bottom, left, right, scene){

	this.scene=scene;
	this.speed=40;
	this.bullets = [];
	this.enemy_bullets = [];
	this.bullet_pool = [];
	this.enemy_bullet_pool = [];
	this.right_edges = [];
	
	this.top = top;
	this.bottoms = bottom;
	this.left = left;
	this.right = right;

	this.friendlycolor = 0x44aa44;
	this.enemycolor = 0xaa4444;
	
	var bin_size = ( this.right - this.left )/10;
	this.bullet_bin = bin_size;
	for(var x=0; x<10; x+=1){
	    this.bullets.push([]);
	    this.enemy_bullets.push([]);
	    
	    this.right_edges.push(this.left + x*bin_size);
	}
	this.right_edges[9]+=bin_size;

	// We're going to allow 100 bullets of each type
	for(var x=0; x<100; x+=1){
	    this.AddBullet(true);
	    this.AddBullet(false);
	}
    }


    Fire(friendly, x, y, z){
	if(friendly)
	    var bullet = this.bullet_pool.shift();
	else
	    var bullet = this.enemy_bullet_pool.shift();

	bullet.position.set(x, y, z);

	var bin = Math.floor(bullet.position.x / this.bullet_bin);
	if(bin < 0) bin = 0;
	if(bin > this.bullets.length-1) bin = this.bullets.length-1;

	if(friendly) this.bullets[bin].push(bullet);
	else this.enemy_bullets[bin].push(bullet);
	this.scene.add(bullet);
    }
    AddBullet(friendly){
	var color = this.friendlycolor;
	if(!friendly)
	    color = this.enemycolor;
	
	var laserBeam= new THREEx.LaserBeam(color);
	var object3d= laserBeam.object3d
	object3d.rotation.z= -Math.PI/2;
	object3d.scale.set(15, 80, 15);
	object3d.position.set(-10000, -10000, -10000);
	
	if(friendly)
	    this.bullet_pool.push(object3d);
	else
	    this.enemy_bullet_pool.push(object3d);	
    }
    animate(clock_corr){
	for(var x=0;x<this.bullets.length; x+=1){
	    for(var y=0; y<this.bullets[x].length; y+=1){
		this.bullets[x][y].position.y += clock_corr*this.speed;
		if(this.bullets[x][y].position.y > this.top){
		    this.scene.remove(this.bullets[x][y]);
		    this.bullet_pool.push(this.bullets[x][y]);
		    this.bullets[x].splice(y, 1);
		    y-=1;
		    continue;
		}
	    }
	    for(var y=0; y<this.enemy_bullets[x].length; y+=1){
		this.enemy_bullets[x][y].position.y -= clock_corr*this.speed;
		if(this.enemy_bullets[x][y].position.y < this.bottom){
		    this.scene.remove(this.enemy_bullets[x][y]);
		    this.enemy_bullet_pool.push(this.enemy_bullets[x][y]);
		    this.enemy_bullets[x].splice(y, 1);
		    y-=1;
		    continue;
		}
	    }
	}
    }
    // Add bullet
    // Animate
    // Check hit
    // Cleanup list
    
}
