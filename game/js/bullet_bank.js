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
	console.log(bin_size);
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

	var bin = this.GetBin(bullet.position.x);

	if(friendly) this.bullets[bin].push(bullet);
	else this.enemy_bullets[bin].push(bullet);
	this.scene.add(bullet);
    }
    GetBin(x){
	var bin = Math.floor(x / this.bullet_bin);
	if(bin < 0) bin = 0;
	if(bin > this.bullets.length -1) bin = this.bullets.length -1;
	return bin;
    }
    Collide(x1, x2, dx){
	if(Math.abs(x2-x1) <= dx)
	    return true;
	return false;
    }
    RemoveFriendlyBullet(i, j){
	this.scene.remove(this.bullets[i][j]);
	this.bullet_pool.push(this.bullets[i][j]);
	this.bullets[i].splice(j, 1);	
    }
    RemoveEnemyBullet(i, j){
	this.scene.remove(this.enemy_bullets[i][j]);
	this.enemy_bullet_pool.push(this.enemy_bullets[i][j]);
	this.enemy_bullets[i].splice(j, 1);	
    }
    CheckHit(x, y, z, sx, sy, sz, friendly){
	// friendly = true if this is the player

	// Which bins do we search? Def the one the bullet it in plus any overlap
	var bins = [];
	bins.push(this.GetBin(x));
	var bup = this.GetBin(x+sx);
	if(bup != bins[0])
	    bins.push(bup);
	bup = this.GetBin(x-sx);
	if(bup != bins[0])
	    bins.push(bup);
	//console.log(bins);
	for( var t=0; t<bins.length; t+=1){
	    var i = bins[t];
	    if(friendly){
		for(var j=0; j < this.enemy_bullets[i].length;j+=1){
		    // Check collision
		    if(this.Collide(this.enemy_bullets[i][j].position.x, x, sx) &&
		       this.Collide(this.enemy_bullets[i][j].position.y, y, sy) &&
		       this.Collide(this.enemy_bullets[i][j].position.z, z, sz) ){
			this.RemoveEnemyBullet(i, j);
			return true;
		    }
		}		
	    }
	    else{
		for(var j=0; j < this.bullets[i].length;j+=1){
		    // Check collision
		    if(this.Collide(this.bullets[i][j].position.x, x, sx) &&
		       this.Collide(this.bullets[i][j].position.y, y, sy) &&
		       this.Collide(this.bullets[i][j].position.z, z, sz) ){
			this.RemoveFriendlyBullet(i, j);
			return true;
		    }
		}
	    }
	}
	return false;
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
		    this.RemoveFriendlyBullet(x,y);
		    y-=1;
		    continue;
		}
	    }
	    for(var y=0; y<this.enemy_bullets[x].length; y+=1){
		this.enemy_bullets[x][y].position.y -= clock_corr*this.speed;
		if(this.enemy_bullets[x][y].position.y < this.bottom){
		    this.RemoveEnemyBullet(x, y);
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
