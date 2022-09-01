class GFX
{
	constructor(canvasId, width, height)
	{
		this.ready = false;
		
		this.width = 0;
		this.height = 0;
		
		this.canvas = null;
		this.context = null;
		
		// INIT
		this.setCanvas(canvasId, width, height);
	}

	setCanvas(id, width, height)
	{
		this.canvas = DOM.get(id);
		
		if(this.canvas == null)
		{
			console.error("Could not find canvas with id: " + id);
			return;
		}
		
		this.width = width;
		this.height = height;
		this.canvas.width = width;
		this.canvas.height = height;
		this.context = this.canvas.getContext('2d', { alpha: false });
		
		this.ready = true;
	}

	clear()
	{
		this.context.clearRect(0, 0, this.width, this.height);
	}

	fillBackground(colour)
	{
		this.context.fillStyle = colour;
		this.context.fillRect(0, 0, this.width, this.height);
	}

	write(text, posX, posY, fontSize, fontColour)
	{
		this.context.textAlign = "left";
		this.context.textBaseline = "top";
		this.context.fillStyle = fontColour;
		this.context.font = fontSize + "px Arial";
		this.context.fillText(text, posX, posY);
	}

	drawImage(img, srcX, srcY, srcWidth, srcHeight, destX, destY, destWidth, destHeight)
	{
		this.context.drawImage(img, Math.floor(srcX), Math.floor(srcY), Math.floor(srcWidth), Math.floor(srcHeight), Math.floor(destX), Math.floor(destY), Math.floor(destWidth), Math.floor(destHeight));
	}

	copyCanvas(canvas, destX, destY)
	{
		this.context.drawImage(canvas, destX, destY);
	}

	drawCircle(posX, posY, radius, fillColour, strokeWidth, strokeColour)
	{
		strokeWidth = strokeWidth || 0;
		strokeColour = strokeColour || "#000000";
		
		this.context.beginPath();
		this.context.arc(posX, posY, radius, 0, 2 * Math.PI, false);
		this.context.fillStyle = fillColour;
		this.context.fill();
		
		if(strokeWidth > 0)
		{
			this.context.lineWidth = strokeWidth;
			this.context.strokeStyle = strokeColour;
			this.context.stroke();
		}
	}

	drawRectangle(x, y, w, h, colour, strokeWidth = 0, strokeColour = colour)
	{
		this.context.lineCap = "square";
		this.context.lineWidth = strokeWidth;
		this.context.fillStyle = colour;
		this.context.strokeStyle = strokeColour;
		this.context.fillRect(x, y, w, h);
		if(strokeWidth > 0) { this.context.strokeRect(x, y, w, h); }
	}

	drawLine(x1, y1, x2, y2, width, colour)
	{
		this.context.beginPath();
		this.context.translate(0.5,0.5);
		this.context.lineCap = "square";
		this.context.lineWidth = width;
		this.context.fillStyle = colour;
		this.context.strokeStyle = colour;
		this.context.moveTo(x1,y1);
		this.context.lineTo(x2,y2);
		this.context.stroke();
		this.context.translate(-0.5,-0.5);
	}

}