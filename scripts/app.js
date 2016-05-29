$(document).ready(function(){
	var width = window.innerWidth*0.8;
	var height = window.innerHeight;
	var scene = new THREE.Scene();
	var camera = new THREE.PerspectiveCamera(30, width/height, 0.1, 500);
	var renderer = new THREE.WebGLRenderer({antialias: true});
	var textureLoader = new THREE.TextureLoader();	
	renderer.setClearColor(0x000000);
	renderer.setSize(width, height);
	renderer.shadowMap.enabled = true;
	renderer.shadowMap.soft = true;
	renderer.gammaInput = true;
	renderer.gammaOutput = true;	


	// -- start planet

	var planet;
	var texture = textureLoader.load('textures/jupiter_diffuse.jpg');	
	var geometry = new THREE.SphereGeometry(7, 64, 64);
	var material  = new THREE.MeshPhongMaterial({map:texture});
	material.bumpMap = texture;
	material.bumpScale = -0.05;
	material.specularMap = texture;
	material.specular  = new THREE.Color(0xaacc33);
	material.shininess = 10;	
	//material.lightMap = texture;
	material.lightMapIntensity = 1;
	console.log(material);
	planet = new THREE.Mesh(geometry, material);
	planet.receiveShadow = true;
	planet.castShadow = true;

	// clouds

	var geometry   = new THREE.SphereGeometry(7.1, 64, 64);
	var cloudTexture = textureLoader.load('textures/clouds3.png');
	var cloudMaterial  = new THREE.MeshLambertMaterial({
	  map         : cloudTexture,
	  bumpMap 	  : cloudTexture,
	  specularMap : cloudTexture,
	  reflectivity : 1,
	  //color 	  : 0xf7fc98,
	  bumpScale   : 0.2,	  
	  side        : THREE.DoubleSide,
	  opacity     : 0.5,
	  transparent : true,
	  depthWrite  : false,
	});
	console.log(cloudMaterial);
	var Clouds1 = new THREE.Mesh(geometry, cloudMaterial);	
	Clouds1.receiveShadow = true;
	planet.add(Clouds1);

	var geometry   = new THREE.SphereGeometry(7.08, 64, 64);
	var cloudTexture = textureLoader.load('textures/clouds2.png');
	var cloudMaterial  = new THREE.MeshLambertMaterial({
	  map         : cloudTexture,
	  bumpMap 	  : cloudTexture,
	  color 	  : 0xff0000,
	  bumpScale   : 1,	  
	  side        : THREE.DoubleSide,
	  specularMap : cloudTexture,
	  opacity     : 0.1,
	  transparent : true,
	  depthWrite  : false,
	});
	console.log(cloudMaterial);
	var Clouds2 = new THREE.Mesh(geometry, cloudMaterial);	
	Clouds2.receiveShadow = true;
	planet.add(Clouds2);	
	// end clouds



	scene.add(planet);	



	// -- end planet

	// start spotlight
	var spotLight = new THREE.AmbientLight(0xffffff);
	spotLight.intensity = 0.01;
	//spotLight.castShadow = false;
	//spotLight.position.set(15,30,50);
	scene.add(spotLight);
	//end spotlight

	// star
	var starGeomentry = new THREE.SphereGeometry(0.2, 16, 16);
	starTexture = textureLoader.load('textures/sun.jpg');
	var starMaterial = new THREE.MeshPhongMaterial({
		map : starTexture,
		color 	  : 0xD9D493,
		transparent: true,
		opacity     : 1,
	});
	var star = new THREE.Mesh(starGeomentry, starMaterial);
	star.position.x = -7;
	star.position.y = -5;
	star.position.z = 5;
	star.receiveShadow = false;
	star.castShadow = false;
	scene.add(star);

	var starLight = new THREE.SpotLight(0xffffff);	
	starLight.position.set( star.position.x, star.position.y, star.position.z )
	starLight.intensity = 1;
	starLight.castShadow = true;
	starLight.angle = Math.PI/2;
	starLight.target.position.x = planet.position.x;
	starLight.target.position.y = planet.position.y;
	starLight.target.position.z = planet.position.z;
	star.add(starLight);
	scene.add( starLight.target );
	// end star

	// lens flare
	// var textureFlare = textureLoader.load( "textures/lensflare0.png" );
	// var flareColor = new THREE.Color( 0xffffff );
	// flareColor.setHSL( 0.55, 0.9, 0.5 );
	// var lensFlare = new THREE.LensFlare( textureFlare, 700, 0.0, THREE.AdditiveBlending, flareColor );
	// lensFlare.position.copy( star.position );
	// scene.add( lensFlare );	
	// end lens flare

	camera.position.x = 20;
	camera.position.y = 15;
	camera.position.z = 20;
	camera.lookAt(scene.position);
	scene.add(camera);
	// gui
	var guiControls = new function(){
		this.clouds1Rotation = 0.001;
		this.planetRotation = 0.001;
		this.clouds2Rotation = 0.001;		
		this.starPositionX = -7;
		this.starPositionY = 5;
		this.starPositionZ = 5;		
	}
	var datGUI = new dat.GUI({autoPlace: false});
	datGUI.add(guiControls, 'planetRotation', -0.01, 0.01);
	datGUI.add(guiControls, 'clouds1Rotation', -0.02, 0.02);	
	datGUI.add(guiControls, 'clouds2Rotation', -0.02, 0.02);
	datGUI.add(guiControls, 'starPositionX', -100, 100);
	datGUI.add(guiControls, 'starPositionY', -100, 100);
	datGUI.add(guiControls, 'starPositionZ', -100, 100);
	var guiContainer = document.getElementById('gui-container');
	guiContainer.appendChild(datGUI.domElement);
	// end gui

	function render(){
		planet.rotation.y+=guiControls.planetRotation;
		Clouds1.rotation.y+=guiControls.clouds1Rotation;
		Clouds2.rotation.y+=guiControls.clouds2Rotation;
		star.position.x = guiControls.starPositionX;
		star.position.y = guiControls.starPositionY;
		star.position.z = guiControls.starPositionZ;
		requestAnimationFrame(render);
		renderer.render(scene,camera);
	}
	render();		
	$("#render").append(renderer.domElement);
});