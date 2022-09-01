class GameMap
{
    constructor(gridCols, gridRows, tileSize, gridData)
	{
		this.gridCols = gridCols;
		this.gridRows = gridRows;
		this.tileSize = tileSize;

		this.grid = gridData;

		let spawnTilePos = this.findSpawnTile(true);

		this.spawnTileX = spawnTilePos.tileX;
		this.spawnTileY = spawnTilePos.tileY;
		
		let spawnPos = this.findTileCenter(this.spawnTileX, this.spawnTileY);

		this.spawnX = spawnPos.x;
		this.spawnY = spawnPos.y;

		this.textureSheet = new Image();
		this.textureSheet.src = "imgs/walls.png";
    }

	get projectionWidth() { return this.gridCols * this.tileSize; }
	get projectionHeight() { return this.gridRows * this.tileSize; }

	findSpawnTile(destroy = false)
	{
		if(this.spawnFound)
		{
			return { tileX: this.spawnTileX, tileY: this.spawnTileY };
		}

		let tileX = 0;
		let tileY = 0;

		seekLoop:
        for (let y = 0; y < this.gridRows; y++)
		{
            for (let x = 0; x < this.gridCols; x++)
			{
				if(this.grid[y][x] == -1)
				{
					tileX = x;
					tileY = y;

					if(destroy)
					{
						this.grid[y][x] = 0;
					}

					break seekLoop;
				}
			}
		}

		return { tileX: tileX, tileY: tileY };
	}

	findTileCenter(tileX, tileY)
	{
		let x = (tileX * this.tileSize) + (this.tileSize / 2);
		let y = (tileY * this.tileSize) + (this.tileSize / 2);

		return {x: x, y: y};
	}

	getTilePos(x, y)
	{
		if (x < 0 || x > this.projectionWidth || y < 0 || y > this.projectionHeight)
		{
			return {tileX: -1, tileY: -1};
		}

		let tileX = Math.floor(x / this.tileSize);
        let tileY = Math.floor(y / this.tileSize);

		return {tileX: tileX, tileY: tileY};
	}

	getTileValue(x, y)
	{
		let tilePos = this.getTilePos(x, y);

		if (tilePos.tileX < 0 || tilePos.tileY < 0)
		{
			return 0;
		}

		return this.grid[tilePos.tileY][tilePos.tileX];	
	}

    isPassable(x, y)
	{
		let tilePos = this.getTilePos(x, y);

		if (tilePos.tileX < 0 || tilePos.tileY < 0)
		{
			return false;
		}

		return (this.grid[tilePos.tileY][tilePos.tileX] == 0);
    }

    renderMinimap(gfx, offsetX, offsetY, scale)
	{
        for (let y = 0; y < this.gridRows; y++)
		{
            for (let x = 0; x < this.gridCols; x++)
			{
                let tileX = x * this.tileSize;
                let tileY = y * this.tileSize;

				let tileColor = (this.grid[y][x] > 0)? "#222" : "#fff";

				let drawX = (scale * tileX) + offsetX;
				let drawY = (scale * tileY) + offsetY;
				let drawWidth = scale * this.tileSize;
				let drawHeight = drawWidth;

				gfx.drawRectangle(drawX, drawY, drawWidth, drawHeight, tileColor, 1, "#222");
            }
        }
    }

}
