/*!
 * jQuery Parallax Plugin v2.0
 * @AUTHOR: Clément Caillard
 *
 * Bang bang bang !
 */

//TODO: rotate, 3D, Z, ...
// Ratio à calculer dans le script et pas dans le plugin !! => peut etre faire tout de même une fonction pour updater les objets ?

(function($, window) {
	
	/** Parallax Constructor **/
	var Parallax = function(element, options, callback) {
		var self = this;
		
		this.$elmt    = $(element);
		this.options  = options;	
		this.callback = (typeof callback != 'undefined') ? callback : $.noop;
		
		var elmtPos = this.$elmt.position();
		this.posX   = elmtPos.left;
		this.posY   = elmtPos.top;
		
		this.strTranslateZ = (support.transform3d) ? 'translateZ(0)' : '';
		this.translateX = 0;
		this.translateY = 0;
		
		this.rotateZ = 0;
		
		this.init();
	}
	
	/** Parallax Prototype **/
	Parallax.prototype = {

        init: function() {
            var self = this;
            self.callback.call(self);
        },
        
        calculate: function(index, properties, loop) {
        	var self    = this,
        		nbSteps = (loop) ? self.options[properties].length : 1,
        		i  		= 0;
			
        	do {
        		var step = (loop) ? self.options[properties][i] : self.options[properties];
        				
				if (index < step.startIndex) 
				{
					var newValue = step.startValue;
					if (loop) break;
				} 
				else if (index >= step.startIndex && index <= step.endIndex) 
				{
					var easingFn = (typeof step.easing != 'undefined' && typeof $.easing[step.easing] == 'function') ? $.easing[step.easing] : $.easing['swing'],
						time 	 = index - step.startIndex,
						duration = step.endIndex - step.startIndex,
						percent  = time / duration,
						rate	 = easingFn(percent, time, 0, 1, duration),
						newValue = step.startValue + rate * (step.endValue - step.startValue);
					if (loop) break;
				}
				else if ((loop && i+1 == nbSteps) || !loop)
				{
					var newValue = step.endValue;
					//if (loop) break; // i+1 == nbSteps => fin de la boucle naturelle
				}
        		
        		i++
        	} while (i < nbSteps);
        	
			return newValue;
        },
        
		/** External Control **/
		update: function(index) {
			var self  = this;
			
			for (var properties in self.options) {
				var newValue = self.calculate(index, properties, $.isArray(self.options[properties]));
				
				if (properties == 'top' && support.transform) {
					self.translateY = newValue - self.posY;
					self.$elmt[0].style[support.transform] = 'translate(' + self.translateX + 'px, ' + self.translateY + 'px)' + self.strTranslateZ + ' rotateZ(' + self.rotateZ + 'deg)';
				} else if (properties == 'left' && support.transform) {
					self.translateX = newValue - self.posX;
					self.$elmt[0].style[support.transform] = 'translate(' + self.translateX + 'px, ' + self.translateY + 'px)' + self.strTranslateZ + ' rotateZ(' + self.rotateZ + 'deg)';
				} else if (properties == 'rotateZ' && support.transform) {
					self.rotateZ = newValue;
					self.$elmt[0].style[support.transform] = 'translate(' + self.translateX + 'px, ' + self.translateY + 'px)' + self.strTranslateZ + ' rotateZ(' + self.rotateZ + 'deg)';
				} else {
					self.$elmt.css(properties, newValue);
				}
			}
		}
	};
	
	/** jQuery plugin: Parallax instantiation **/
	$.fn.parallax = function(options, callback) { 
		return this.each(function() {
			var $self = $(this);
            if ($self.data('parallax')) return;
            var instance = new Parallax(this, options, callback);
            $self.data('parallax', instance);
        });
	};

	window.Parallax = Parallax;

})(jQuery, window, undefined);