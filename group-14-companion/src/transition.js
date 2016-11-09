/*
 *     Copyright (C) 2010-2016 Marvell International Ltd.
 *     Copyright (C) 2002-2010 Kinoma, Inc.
 *
 *     Licensed under the Apache License, Version 2.0 (the "License");
 *     you may not use this file except in compliance with the License.
 *     You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *     Unless required by applicable law or agreed to in writing, software
 *     distributed under the License is distributed on an "AS IS" BASIS,
 *     WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *     See the License for the specific language governing permissions and
 *     limitations under the License.
 */
 var AbstractTransition = function(duration) {
	if (!duration) duration = 500;
	Transition.call(this, duration);
}
AbstractTransition.prototype = Object.create(Transition.prototype, {
	easeType: { value: 'quadEaseOut', writable: true },
	removeFormerContent: { value: true, writable: true },
	addCurrentContent: { value: true, writable: true },
	addCurrentBehind: { value: false, writable: true },
	optionFields: { value: 'easeType,removeFormerContent,addCurrentContent,addCurrentBehind', writable: true },
	onBegin: { value: 
		function(container, formerContent, currentContent, formerData, currentData) {
			// make these transitions compatible with mobile framework pattern (where options will be supplied in currentData)
  			var options = (undefined != currentData) ? currentData : formerData;
  			this.applyOptions(options);
  			if (this.addCurrentContent) {
  				if (false == this.addCurrentBehind)
					container.add( currentContent );
				else
					container.insert( currentContent, container.first );
			}
			this.formerLayer = new Layer({alpha: false});
			this.currentLayer = new Layer({alpha: false});
			this.formerLayer.attach( formerContent );
			this.currentLayer.attach( currentContent );   
			this.onBeginTransition( container, formerContent, currentContent, formerData, currentData );
		},
	},
	onStep: { value: 
		function(fraction) {
			if ( this.easeType != "linear" )
				fraction = Math[this.easeType]( fraction );
			this.onStepTransition( fraction );
		},
	},
	onEnd: { value: 
		function(container, formerContent, currentContent) {
			this.currentLayer.detach();
            this.formerLayer.detach();
            if ( this.removeFormerContent )
            	container.remove( formerContent);  
            this.onEndTransition( container, formerContent, currentContent );
		},
	},
	applyOptions: { value: 
		function(options) {
			if ( undefined != options ) {
				this.applyDurationOption(options);            
		 		var optionFields = this.optionFields;
		 		optionFields = optionFields.split(",");
		 		for ( var i=0; i < optionFields.length; i++)	
					this.applyFieldOption(options, optionFields[i]);     
			}
		},
	},
	applyDurationOption: { value: 
		function(options) {
			if ("duration" in options)
		 		this.duration = options.duration;
		},
	},
	applyFieldOption: { value: 
		function(options, fieldName) {
			if (fieldName in options)
		 		this[fieldName] = options[fieldName];
		},
	},
	onBeginTransition: { value: 
		function(container, formerContent, currentContent, formerData, currentData) {
			
		},
	},
	onStepTransition: { value: 
		function(fraction) {
			
		},
	},
	onEndTransition: { value: 
		function(container, formerContent, currentContent) {
			
		},
	},
});

export var CrossFade = function(duration) {
	if (!duration) duration = 1500;
	AbstractTransition.call(this, duration);
}
CrossFade.prototype = Object.create(AbstractTransition.prototype, {
	easeType: { value: 'linear', writable: true },
	onStepTransition: { value: 
		function(fraction) {
			this.currentLayer.opacity = fraction;
		},
	},
});


export var Push = function(duration) {
	if (!duration) duration = 500;
	AbstractTransition.call(this, duration);
}
Push.prototype = Object.create(AbstractTransition.prototype, {
	direction: { value: 'left', writable: true },
	optionFields: { value: 'easeType,removeFormerContent,addCurrentContent,direction', writable: true },
	onBeginTransition: { value: 
		function(container, formerContent, currentContent, formerData, currentData) {
			this.formerFromX = this.formerToX = this.currentFromX = this.currentToX = 0;
			this.formerFromY = this.formerToY = this.currentFromY = this.currentToY = 0;
			switch (this.direction) {
				case "left":
					this.formerFromX = 0;
					this.formerToX = - formerContent.width
					this.currentLayer.translation = { x : currentContent.width, y : 0 }
					this.currentFromX = currentContent.width
					this.currentToX = 0
					break
				case "right":
					this.formerFromX = 0;
					this.formerToX = formerContent.width
					this.currentLayer.translation = { x : -currentContent.width, y : 0 }
					this.currentFromX = -currentContent.width
					this.currentToX = 0
					break
				case "up":
					this.formerFromY = 0;
					this.formerToY = -formerContent.height
					this.currentLayer.translation = { x : 0, y : currentContent.height }
					this.currentFromY = currentContent.height
					this.currentToY = 0
					break
				case "down":
					this.formerFromY = 0;
					this.formerToY = formerContent.height
					this.currentLayer.translation = { x : 0, y : -currentContent.height }
					this.currentFromY = -currentContent.height
					this.currentToY = 0
					break
			}
		},
	},
	onStepTransition: { value: 
		function(fraction) {
			var formerX = lerp( this.formerFromX, this.formerToX, fraction );
			var formerY = lerp( this.formerFromY, this.formerToY, fraction );
			this.formerLayer.translation = { x : formerX, y : formerY }
			var currentX = lerp( this.currentFromX, this.currentToX, fraction );
			var currentY = lerp( this.currentFromY, this.currentToY, fraction );
			this.currentLayer.translation = { x : currentX, y : currentY }
		},
	},
});


export var Flip = function(duration) {
	if (!duration) duration = 500;
	AbstractTransition.call(this, duration);
}
Flip.prototype = Object.create(AbstractTransition.prototype, {
	direction: { value: 'left', writable: true },
	optionFields: { value: 'easeType,removeFormerContent,addCurrentContent,direction', writable: true },
	onBeginTransition: { value: 
		function(container, formerContent, currentContent, formerData, currentData) {
			var formerLayer = this.formerLayer;
			formerLayer.origin = { y: formerLayer.height / 2 };
			this.formerStarts = [
				{ x: 0, y: 0 },
				{ x: 1, y: 0 },
				{ x: 1, y: 1 },
				{ x: 0, y: 1 },
			];
			this.formerSteps = [
				{ x: 0, y: 0 },
				{ x: 1, y: 0 },
				{ x: 1, y: 1 },
				{ x: 0, y: 1 },
			];
			var currentLayer = this.currentLayer;
			currentLayer.origin = { y: currentLayer.height / 2 };
			this.currentStops = [
				{ x: 0, y: 0 },
				{ x: 1, y: 0 },
				{ x: 1, y: 1 },
				{ x: 0, y: 1 },
			];
			this.currentSteps = [
				{ x: 0, y: 0 },
				{ x: 1, y: 0 },
				{ x: 1, y: 1 },
				{ x: 0, y: 1 },
			];
			switch ( this.direction ) {
				case "left":
					this.formerStops = [
						{ x: 0.49, y: 0.1 },
						{ x: 0.51, y: -0.1 },
						{ x: 0.51, y: 1.1 },
						{ x: 0.49, y: 0.9 },
					];
					this.currentStarts = [
						{ x: 0.49, y: -0.1 },
						{ x: 0.51, y: 0.1 },
						{ x: 0.51, y: 0.9 },
						{ x: 0.49, y: 1.1 },
					];
					break
				case "right":		
					this.formerStops = [
						{ x: 0.49, y: -0.1 },
						{ x: 0.51, y: 0.1 },
						{ x: 0.51, y: 0.9 },
						{ x: 0.49, y: 1.1 },
					];
					this.currentStarts = [
						{ x: 0.49, y: 0.1 },
						{ x: 0.51, y: -0.1 },
						{ x: 0.51, y: 1.1 },
						{ x: 0.49, y: 0.9 },
					];
					break
				case "up":		
					this.currentStarts = [
						{ x: -0.2, y: 0.49 },
						{ x: 1.2, y: 0.49 },
						{ x: 0.8, y: 0.51 },
						{ x: 0.2, y: 0.51 },
					];
					this.formerStops = [
						{ x: 0.2, y: 0.49 },
						{ x: 0.8, y: 0.49 },
						{ x: 1.2, y: 0.51 },
						{ x: -0.2, y: 0.51 },
					];
					break
				case "down":		
					this.formerStops = [
						{ x: -0.2, y: 0.49 },
						{ x: 1.2, y: 0.49 },
						{ x: 0.8, y: 0.51 },
						{ x: 0.2, y: 0.51 },
					];			
					this.currentStarts = [
						{ x: 0.2, y: 0.49 },
						{ x: 0.8, y: 0.49 },
						{ x: 1.2, y: 0.51 },
						{ x: -0.2, y: 0.51 },
					];
					break
			}
		},
	},
	onStepTransition: { value: 
		function(fraction) {
			if (fraction <= 0.5) {
				fraction *= 2;
				var layer = this.formerLayer;
				var starts = this.formerStarts;
				var stops = this.formerStops;
				var steps = this.formerSteps;
				for (var i = 0; i < 4; i++) {
					var start = starts[i];
					var stop = stops[i];
					var step = steps[i];
					step.x = (start.x * (1 - fraction)) + (stop.x * fraction);
					step.y = (start.y * (1 - fraction)) + (stop.y * fraction);
				}
				layer.opacity = 1;
				layer.corners = steps;
				this.currentLayer.opacity = 0;
			}
			else {
				fraction = 2 * (fraction - 0.5);
				var layer = this.currentLayer;
				var starts = this.currentStarts;
				var stops = this.currentStops;
				var steps = this.currentSteps;
				for (var i = 0; i < 4; i++) {
					var start = starts[i];
					var stop = stops[i];
					var step = steps[i];
					step.x = (start.x * (1 - fraction)) + (stop.x * fraction);
					step.y = (start.y * (1 - fraction)) + (stop.y * fraction);
				}
				layer.opacity = 1;
				layer.corners = steps;
				this.formerLayer.opacity = 0;
			}
		},
	},
});


export var Reveal = function(duration) {
	if (!duration) duration = 350;
	AbstractTransition.call(this, duration);
}
Reveal.prototype = Object.create(AbstractTransition.prototype, {
	direction: { value: 'up', writable: true },
	optionFields: { value: 'easeType,removeFormerContent,addCurrentContent,direction', writable: true },
	onBeginTransition: { value: 
		function(container, formerContent, currentContent, formerData, currentData) {
			this.currentFromX = this.currentToX = 0;
			this.currentFromY = this.currentToY = 0;
			
			this.effect = new Effect();
			
			switch (this.direction) {
				case "left":
					this.currentLayer.translation = { x : currentContent.width, y : 0 }
					this.currentFromX = currentContent.width
					break
				case "right":
					this.currentLayer.translation = { x : -currentContent.width, y : 0 }
					this.currentFromX = -currentContent.width
					break
				case "up":
					this.currentLayer.translation = { x : 0, y : currentContent.height }
					this.currentFromY = currentContent.height
					break
				case "down":
					this.currentLayer.translation = { x : 0, y : -currentContent.height }
					this.currentFromY = -currentContent.height
					break
			}
		},
	},
	onStepTransition: { value: 
		function(fraction) {
			var currentX = lerp( this.currentFromX, this.currentToX, fraction );
			var currentY = lerp( this.currentFromY, this.currentToY, fraction );
			this.currentLayer.translation = { x : currentX, y : currentY }
			
			var effect = new Effect();
			effect.colorize("black", fraction / 2);
			this.formerLayer.effect = effect;
		},
	},
});


export var Hide = function(duration) {
	if (!duration) duration = 350;
	AbstractTransition.call(this, duration);
}
Hide.prototype = Object.create(AbstractTransition.prototype, {
	direction: { value: 'down', writable: true },
	addCurrentBehind: { value: 'true', writable: true },
	easeType: { value: 'quadEaseIn', writable: true },
	optionFields: { value: 'easeType,removeFormerContent,addCurrentContent,direction', writable: true },
	onBeginTransition: { value: 
		function(container, formerContent, currentContent, formerData, currentData) {
			this.formerFromX = this.formerToX = 0;
			this.formerFromY = this.formerToY = 0;
			
			switch (this.direction) {
				case "left":
					this.formerToX = -formerContent.width
					break
				case "right":
					this.formerToX = formerContent.width
					break
				case "up":
					this.formerToY = -formerContent.height;
					break
				case "down":
					this.formerToY = formerContent.height;
					break
			}
		},
	},
	onStepTransition: { value: 
		function(fraction) {
			var formerX = lerp( this.formerFromX, this.formerToX, fraction );
			var formerY = lerp( this.formerFromY, this.formerToY, fraction );
			this.formerLayer.translation = { x : formerX, y : formerY }

			var effect = new Effect();
			effect.colorize("black", 0.5 - (fraction / 2));
			this.currentLayer.effect = effect;
		},
	},
});

export var TimeTravel = function(duration) {
	if (!duration) duration = 500;
	AbstractTransition.call(this, duration);
}
TimeTravel.prototype = Object.create(AbstractTransition.prototype, {
	direction: { value: 'forward', writable: true },
	optionFields: { value: 'easeType,removeFormerContent,addCurrentContent,direction,xOrigin,yOrigin', writable: true },
	onBeginTransition: { value: 
		function(container, formerContent, currentContent, formerData, currentData) {
			if (this.hasOwnProperty("xOrigin") && this.hasOwnProperty("yOrigin")) {
				this.formerLayer.origin = { x : this.xOrigin, y : this.yOrigin };
				this.currentLayer.origin = { x : this.xOrigin, y : this.yOrigin };
			}
			else {
				this.formerLayer.origin = { x : this.formerLayer.width / 2, y : this.formerLayer.height / 2 };
				this.currentLayer.origin = { x : this.currentLayer.width / 2, y : this.currentLayer.height / 2 };
			}
			switch (this.direction) {
				case "forward":
					this.fromFormerScale = 1.0;
					this.toFormerScale = 2.0;
					this.fromCurrentScale = 0.5;
					this.toCurrentScale = 1.0;
					break
				case "back":
					this.fromFormerScale = 1.0;
					this.toFormerScale = 0.5;
					this.fromCurrentScale = 2.0;
					this.toCurrentScale = 1.0;
					break
			}
			this.onStepTransition( 0 );
		},
	},
	onStepTransition: { value: 
		function(fraction) {
			var formerScale = lerp( this.fromFormerScale, this.toFormerScale, fraction );
			this.formerLayer.scale = { x : formerScale, y : formerScale }
			this.formerLayer.opacity = 1 - fraction
			var currentScale = lerp( this.fromCurrentScale, this.toCurrentScale, fraction );
			this.currentLayer.scale = { x : currentScale, y : currentScale }
			this.currentLayer.opacity = fraction
		},
	},
});

export var ZoomAndSlide = function(duration) {
	if (!duration) duration = 500;
	AbstractTransition.call(this, duration);
}
ZoomAndSlide.prototype = Object.create(AbstractTransition.prototype, {
	direction: { value: 'forward', writable: true },
	optionFields: { value: 'easeType,removeFormerContent,addCurrentContent,addCurrentBehind,direction', writable: true },
	onBeginTransition: { value: 
		function(container, formerContent, currentContent, formerData, currentData) {
			this.formerLayer.origin = { x : this.formerLayer.width / 2, y : this.formerLayer.height / 2 };
			this.currentLayer.origin = { x : this.currentLayer.width / 2, y : this.currentLayer.height / 2 };
			this.currentaFromX = currentContent.width
			this.formerFromY = this.formerToY = this.currentFromY = this.currentToY = 0;
			switch (this.direction) {
				case "forward":
					this.fromFormerScale = 1.0;
					this.toFormerScale = 0.8;
					this.currentLayer.translation = { x : currentContent.width, y : 0 };
					this.currentFromX = currentContent.width;
					this.currentToX = 0;
					break
				case "back":
					this.fromCurrentScale = 0.8;
					this.toCurrentScale = 1.0;
					this.formerLayer.translation = { x : 0, y : 0 };
					this.formerFromX = 0;
					this.formerToX = currentContent.width
					break
			}
		},
	},
	onStepTransition: { value: 
		function(fraction) {
			switch (this.direction) {
				case "forward":
					var formerScale = lerp( this.fromFormerScale, this.toFormerScale, fraction);
					this.formerLayer.scale = { x : formerScale, y : formerScale };
					var currentX = lerp( this.currentFromX, this.currentToX, fraction );
					this.currentLayer.translation = { x : currentX, y : 0 };
				break
				case "back":
					var currentScale = lerp( this.fromCurrentScale, this.toCurrentScale, fraction);
					this.currentLayer.scale = { x : currentScale, y : currentScale };
					var formerX = lerp( this.formerFromX, this.formerToX, fraction );
					this.formerLayer.translation = { x : formerX, y : 0 };
				break
			}
		},
	},
});

var lerp = function(from, to, fraction) {
	return from + fraction * (to - from);
}