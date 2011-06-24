$(document).ready(function() {
  $(this).children('ul').hide();

  $('.window-button').click(function(e) {
    e.preventDefault();
    makeWindow('#window');
  });

  $('.opener').click(function(e) {
    e.stopPropagation();
    e.preventDefault();
    if($(this).hasClass('open')) {
      hideWindow($(this));
    }
    else {
      showWindow($(this));
      var startLink = $(this);
      $('.canvas').click(function() {
        hideWindow(startLink);
      });
    }
  });
  $('.opener').bind('mouseenter', function(e) {
    var allMenus = $('.open');
    // Check if there is a menu open, or if there was and now the user
    // is reading the tipsy tooltip (menu-link class)
    if (allMenus.length != 0 || $('.menu-link').length != 0) {
      // Hide all the opened menus
      allMenus.each(function() {
        hideWindow($(this));
      });
      // Remove the helper class
      $('.menu-link').each(function() {
        $(this).removeClass('menu-link');
      });
      // Show this one
      showWindow($(this));
      var startLink = $(this);
      $('.canvas').click(function() {
        hideWindow(startLink);
      });
    }
  });

  $('.submenu').hover(function() {
    $(this).children('ul').show();
    $(this).children('ul').addClass('visible');
  },

  function() {
    $(this).children('ul').removeClass('visible');
    $(this).children('ul').hide();
  });
});

function hideWindow(startLink) {
  var popup = startLink.next('.popup');
  var openButton = startLink;
  openButton.removeClass('open');
  popup.removeClass('open');
  popup.hide();
  $('.canvas').remove();
}

function showWindow(startLink) {
  var popup = startLink.next('.popup');
  popup.show();
  startLink.addClass('open');
  popup.addClass('open');
  $('<div class="canvas"></div>').appendTo('body');
}

function makeOverlay() {

  $('body').css('overflow', 'hidden');
  var overlay = document.createElement('div');
  overlay.id = 'overlay';
  $('body').append(overlay);
  $('#overlay').addClass('visible');
};

function close(windowName) {
  $('body').css('overflow', 'auto');
  $(windowName).removeClass('visible');
  $('#overlay').removeClass('visible');
  $('#overlay').remove();
  $(windowName).hide();
}

function makeWindow(windowName) {
  makeOverlay();
  $(windowName).hide();
  $(windowName).show();
  $(windowName).addClass('visible');
  $('.close-button').click(function() {
    close(windowName);
  });
}
