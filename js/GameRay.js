class GameRay
{
    constructor(angle)
	{
        this.angle = NUM.normalizeAngle(angle);
        this.distance = 0;

        this.interceptX = 0;
        this.interceptY = 0;
		this.interceptType = 0;

        this.isVerticalIntercept = false;

        this.isFacingDown = this.angle > 0 && this.angle < Math.PI;
        this.isFacingUp = !this.isFacingDown;

        this.isFacingRight = this.angle < 0.5 * Math.PI || this.angle > 1.5 * Math.PI;
        this.isFacingLeft = !this.isFacingRight;
    }

    cast(map, camera)
	{
        let interceptX, interceptY;
        let stepX, stepY;
        let nextX, nextY;

        // FIND HORIZONTAL INTERCEPT ///////////////////////////////////////////
        
        let horizIntercept = false;
        let horizInterceptX = 0;
        let horizInterceptY = 0;
		let horizInterceptType = 0;

        // Find position of the nearest interception of a horizontal grid lines.

        interceptY = Math.floor(camera.y / map.tileSize) * map.tileSize;
        interceptY += (this.isFacingDown)? map.tileSize: 0;

        interceptX = camera.x + (interceptY - camera.y) / Math.tan(this.angle);

        // Calculate the step distance between horizontal grid lines.

        stepY = map.tileSize;
        stepY *= (this.isFacingUp)? -1: 1;

        stepX = map.tileSize / Math.tan(this.angle);
        stepX *= (this.isFacingLeft && stepX > 0)? -1: 1;
        stepX *= (this.isFacingRight && stepX < 0)? -1: 1;

        nextX = interceptX;
        nextY = interceptY;

        // Step between horizontal grid lines until a wall is hit or the edge of the map is reached.

        while (nextX >= 0 && nextX <= map.projectionWidth && nextY >= 0 && nextY <= map.projectionHeight)
		{
			let checkX = nextX;
			let checkY = nextY - (this.isFacingUp ? 1 : 0); // correct in to block

            if (!map.isPassable(checkX, checkY))
			{
                horizIntercept = true;
                horizInterceptX = nextX;
                horizInterceptY = nextY;
				horizInterceptType = map.getTileValue(checkX, checkY);

                break;
            }
			else
			{
                nextX += stepX;
                nextY += stepY;
            }
        }
        
        // FIND VERTICAL INTERCEPT /////////////////////////////////////////////

        let vertIntercept = false;
        let vertInterceptX = 0;
        let vertInterceptY = 0;
		let vertInterceptType = 0;

        // Find position of the nearest interception of a vertical grid lines.

        interceptX = Math.floor(camera.x / map.tileSize) * map.tileSize;
        interceptX += this.isFacingRight ? map.tileSize : 0;

        interceptY = camera.y + (interceptX - camera.x) * Math.tan(this.angle);

        // Calculate the step distance between vertical grid lines.

        stepX = map.tileSize;
        stepX *= this.isFacingLeft ? -1 : 1;

        stepY = map.tileSize * Math.tan(this.angle);
        stepY *= (this.isFacingUp && stepY > 0) ? -1 : 1;
        stepY *= (this.isFacingDown && stepY < 0) ? -1 : 1;

        nextX = interceptX;
        nextY = interceptY;

        // Step between vertical grid lines until a wall is hit or the edge of the map is reached.

        while (nextX >= 0 && nextX <= map.projectionWidth && nextY >= 0 && nextY <= map.projectionHeight)
		{
			let checkX = nextX - (this.isFacingLeft ? 1 : 0); // correct in to block
        	let checkY = nextY;

            if (!map.isPassable(checkX, checkY))
			{
                vertIntercept = true;
                vertInterceptX = nextX;
                vertInterceptY = nextY;
				vertInterceptType = map.getTileValue(checkX, checkY);

                break;
            }
			else 
			{
                nextX += stepX;
                nextY += stepY;
            }
        }

        // STORE INTERCEPT WITH SHORTEST DISTANCE //////////////////////////////

        let horzDistance = (horizIntercept)
            ? NUM.distance(camera.x, camera.y, horizInterceptX, horizInterceptY)
            : Number.MAX_VALUE;

        let vertDistance = (vertIntercept)
            ? NUM.distance(camera.x, camera.y, vertInterceptX, vertInterceptY)
            : Number.MAX_VALUE;

		if (vertDistance < horzDistance)
		{
			this.distance = vertDistance;
			this.interceptX = vertInterceptX;
			this.interceptY = vertInterceptY;
			this.interceptType = vertInterceptType;
			this.isVerticalIntercept = true;
		}
		else
		{
			this.distance = horzDistance;
			this.interceptX = horizInterceptX;
			this.interceptY = horizInterceptY;
			this.interceptType = horizInterceptType;
			this.isVerticalIntercept = false;
		}
    }

    renderMinimap(gfx, camera, offsetX, offsetY, scale)
	{
		let drawX1 = (scale * camera.x) + offsetX;
		let drawY1 = (scale * camera.y) + offsetY;

		let drawX2 = (scale * this.interceptX) + offsetX;
		let drawY2 = (scale * this.interceptY) + offsetY;

        let rayColour = (this.isVerticalIntercept)? "#483D8B": "#FF8C00";

		gfx.drawLine(drawX1, drawY1, drawX2, drawY2, 1, rayColour);
    }

}