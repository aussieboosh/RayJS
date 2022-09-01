class GameController
{
	constructor()
	{
		this.rotationDirection = 0;
		this.movementDirection = 0;

		this.forwardKeyDown = false;
		this.backKeyDown = false;
		this.leftKeyDown = false;
		this.rightKeyDown = false;

		DOM.on(document, "keydown", (e) => { this.onKeyDown(e); });
		DOM.on(document, "keyup", (e) => { this.onKeyUp(e); });
	}

	onKeyDown(event)
	{
		event = event || window.event;
	
		switch(event.keyCode)
		{ 
			case GameConstants.KEYCODE_FORWARD:
		
				this.forwardKeyDown = true;
				this.movementDirection = +1;
				break;

			case GameConstants.KEYCODE_BACK: 
		
				this.backKeyDown = true;
				this.movementDirection = -1;
				break;

			case GameConstants.KEYCODE_LEFT: 

				this.leftKeyDown = true;
				this.rotationDirection = -1;
				break;
				
			case GameConstants.KEYCODE_RIGHT: 
			
				this.rightKeyDown = true;
				this.rotationDirection = +1;
				break;
		}
	}

	onKeyUp(event)
	{
		event = event || window.event;
	
		switch(event.keyCode)
		{
			case GameConstants.KEYCODE_FORWARD:

				this.forwardKeyDown = false;
				this.movementDirection = (this.backKeyDown)? -1 : 0;
				break;

			case GameConstants.KEYCODE_BACK:
		
				this.backKeyDown = false;
				this.movementDirection = (this.forwardKeyDown)? +1 : 0;
				break;
			
			case GameConstants.KEYCODE_LEFT:

				this.leftKeyDown = false;
				this.rotationDirection = (this.rightKeyDown)? +1 : 0;
				break;

			case GameConstants.KEYCODE_RIGHT:

				this.rightKeyDown = false;
				this.rotationDirection = (this.leftKeyDown)? -1 : 0;
				break;
		}
	}

}