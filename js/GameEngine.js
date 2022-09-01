class GameEngine
{
	constructor(outputCanvasId, bufferCanvasId, gridCols, gridRows, tileSize)
	{
		this.running = false;
		this.framesPerSecond = 0;
		this.milisecondsPerFrame = 0;

		this.lastUpdate = 0;

		this.map = new GameMap(gridCols, gridRows, tileSize, this.loadMapData());
		this.gfx = new GFX(bufferCanvasId, (gridCols * tileSize), (gridRows * tileSize));
		this.gfxOut = new GFX(outputCanvasId, (gridCols * tileSize), (gridRows * tileSize));

		this.camera = new GameCamera(this.map.spawnX, this.map.spawnY, this.map.projectionWidth, this.map.projectionHeight);

		this.controller = new GameController();

		this.rayCache = [];

		this.blankImageData = this.gfx.context.createImageData(this.map.projectionWidth, this.map.projectionHeight);
		this.blankPixelData = this.blankImageData.data.slice();
	}

	begin()
	{
		this.running = true;
		this.lastUpdate = NUM.timestamp(); // in milliseconds
		this.gameLoop();
	}

	gameLoop()
	{
		let currentTime = NUM.timestamp(); // in milliseconds
		let timeLapsed = currentTime - this.lastUpdate;

		this.update(timeLapsed);
		this.render();

		this.milisecondsPerFrame = timeLapsed;

		this.lastUpdate = NUM.timestamp(); // in milliseconds

		if(this.running)
		{				
			window.requestAnimationFrame(() => { this.gameLoop(); });	
		}
	}

	stop()
	{
		this.running = false;
	}

	update(timeLapsed)
	{
		this.camera.update(this.controller, this.map, timeLapsed);
		this.castRays();
	}

	render()
	{
		this.gfx.clear();
		this.gfx.drawRectangle(0, 0, this.map.projectionWidth, (this.map.projectionHeight / 2), "#202020");
		this.gfx.drawRectangle(0, (this.map.projectionHeight / 2), this.map.projectionWidth, (this.map.projectionHeight / 2), "#383838");

		this.projectWalls();
		
		this.map.renderMinimap(this.gfx, GameConstants.MINIMAP_OFFSET_X, GameConstants.MINIMAP_OFFSET_Y, GameConstants.MINIMAP_SCALE);

		for(let ray of this.rayCache)
		{
			ray.renderMinimap(this.gfx, this.camera, GameConstants.MINIMAP_OFFSET_X, GameConstants.MINIMAP_OFFSET_Y, GameConstants.MINIMAP_SCALE);
		}

		this.camera.renderMinimap(this.gfx, GameConstants.MINIMAP_OFFSET_X, GameConstants.MINIMAP_OFFSET_Y, GameConstants.MINIMAP_SCALE);

		this.gfx.write(`${this.milisecondsPerFrame} ms / frame`, 5, 5, 9, "gold");

		this.gfxOut.copyCanvas(this.gfx.canvas, 0 , 0);
	}

	castRays()
	{	
		this.rayCache = []; // empty

		let columnId = 0;		
		let rayCount = this.map.projectionWidth / GameConstants.PROJECTED_SCALE;

		for (let i = 0; i < rayCount; i++)
		{
			let rayAngle = this.camera.rotationAngle + Math.atan((columnId - rayCount / 2) / this.camera.projectionPlaneOffset);

			let ray = new GameRay(rayAngle);

			ray.cast(this.map, this.camera);

			this.rayCache.push(ray);
	
			rayAngle += this.camera.fieldOfView / rayCount;
	
			columnId++;
		}
	}

	projectWalls()
	{
		let distanceProjectionPlane = this.camera.projectionPlaneOffset;

		let column = 0;
		for(let ray of this.rayCache)
		{			
			// fix the fish eye distortion
			let correctWallDistance = ray.distance * Math.cos(ray.angle - this.camera.rotationAngle);
			
			let wallHeight = (this.map.tileSize / correctWallDistance) * distanceProjectionPlane;
			
			let wallX = column * GameConstants.PROJECTED_SCALE;
			let wallY = (this.map.projectionHeight / 2) - (wallHeight / 2);
			let wallWidth = GameConstants.PROJECTED_SCALE;

			let textureX = (ray.isVerticalIntercept)? ray.interceptY: ray.interceptX;
				textureX %= this.map.tileSize;
				textureX += (ray.isVerticalIntercept)? 0 : this.map.tileSize;
			
			let textureY = (ray.interceptType - 1) * 64;
			
			this.gfx.drawImage(this.map.textureSheet, textureX, textureY, 1, this.map.tileSize, wallX, wallY, wallWidth, wallHeight);

			column++;
		}
	}

	loadMapData()
	{
		return [
			[3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
			[3, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 3],
			[3, 0, 0, 2, 2, 0, 0, 4, 0, 1, 0, 0, 1, 0, 3],
			[3, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3],
			[3, -1, 0, 0, 0, 0, 0, 4, 0, 0, 2, 2, 0, 0, 3],
			[3, 0, 0, 0, 0, 0, 0, 4, 0, 0, 2, 2, 0, 0, 3],
			[3, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3],
			[3, 0, 0, 2, 2, 0, 0, 4, 0, 1, 0, 0, 1, 0, 3],
			[3, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 3],
			[3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3]
		];
	}
}