jQuery.fn.iphoneSwitch = function(start_state, switched_on_callback, switched_off_callback, editor, options) {

	var state = start_state == 'on' ? start_state : 'off';

	// define default settings
	var settings = {
		mouse_over: 'pointer',
		mouse_out:  'default',
		switch_on_container_path: 'iphone_switch_container_on.png',
		switch_off_container_path: 'iphone_switch_container_off.png',
		switch_path: 'iphone_switch.png',
		switch_height: 24,
		switch_width: 80
	};

	if(options) {
		jQuery.extend(settings, options);
	}

	// click handling
	var switchPanel = function() {
		if(state == 'on') {
			jQuery(document).find('.iphone_switch').animate({backgroundPosition: -40}, 300, function() {
				jQuery(document).attr('src', settings.switch_off_container_path);
				switched_off_callback();
			});
			state = 'off';
		}
		else {
			jQuery(document).find('.iphone_switch').animate({backgroundPosition: 0}, 300, function() {
				switched_on_callback();
			});
			jQuery(document).find('.iphone_switch').attr('src', settings.switch_on_container_path);
			state = 'on';
		}
	}

	// click handling
	jQuery(this).click(switchPanel);
	jQuery(document).bind('keydown', 'Shift+tab',switchPanel);
	jQuery(editor).bind('keydown', 'Shift+tab', switchPanel);
	// jQuery(document).bind('keydown', 'tab',switchPanel);
	// jQuery(editor).bind('keydown', 'tab', switchPanel);

	// create the switch
	return this.each(function() {
		var container;
		var image;

		// make the container
		container = jQuery('<div class="iphone_switch_container" style="height:'+settings.switch_height+'px; width:'+settings.switch_width+'px; position: relative; overflow: hidden"></div>');

		// make the switch image based on starting state
		image = jQuery('<div class="iphone_switch" style="height:'+settings.switch_height+'px; width:'+settings.switch_width+'px; background-image:url('+settings.switch_path+'); background-repeat:none; background-position:'+(state == 'on' ? 0 : -40)+'px; border-radius: 3px; -webkit-border-radius: 3px; -moz-border-radius: 3px;" /></div>');

		// insert into placeholder
		jQuery(this).html(jQuery(container).html(jQuery(image)));

		jQuery(this).mouseover(function(){
			jQuery(this).css("cursor", settings.mouse_over);
		});

		jQuery(this).mouseout(function(){
			jQuery(this).css("background", settings.mouse_out);
		});
	});
};