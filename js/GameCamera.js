class GameCamera
{
    constructor(x, y, projectionWidth, projectionHeight)
	{
        this.x = x; 
        this.y = y;
        this.radius = 4;
        this.rotationAngle = 180 * (Math.PI / 2);
        this.moveSpeed = 320.0;
        this.rotationSpeed = 320.0 * (Math.PI / 180);

        this.fieldOfView = 60 * (Math.PI / 180); // in radians
        this.projectionWidth = projectionWidth;
        this.projectionHeight = projectionHeight;
        this.projectionPlaneOffset = ((this.projectionWidth / 2) / Math.tan(this.fieldOfView / 2));
    }

    update(controller, map, timeLapsed)
	{
        this.rotationAngle += controller.rotationDirection * (this.rotationSpeed * (timeLapsed / 1000));

        var moveStep = controller.movementDirection * (this.moveSpeed * (timeLapsed / 1000));

        var newPlayerX = this.x + Math.cos(this.rotationAngle) * moveStep;
        var newPlayerY = this.y + Math.sin(this.rotationAngle) * moveStep;

        // run seperate checks (one of each axis) to allow "sliding" along walls
        // which just feels less jarring (user experience vs raw performance)

        this.x = (map.isPassable(newPlayerX, this.y))? newPlayerX: this.x;
        this.y = (map.isPassable(this.x, newPlayerY))? newPlayerY: this.y;
    }

    renderMinimap(gfx, offsetX, offsetY, scale)
	{
        let drawX1 = (scale * this.x) + offsetX;
        let drawY1 = (scale * this.y) + offsetY;
        let drawRadius = (scale * this.radius);

        gfx.drawCircle(drawX1, drawY1, drawRadius, "blue", 0, "black");

        let drawX2 = (scale * (this.x + Math.cos(this.rotationAngle) * 30)) + offsetX;
        let drawY2 = (scale * (this.y + Math.sin(this.rotationAngle) * 30)) + offsetY;

		gfx.drawLine(drawX1, drawY1, drawX2, drawY2, 1, "black");
    }

}