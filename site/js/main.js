/* eslint-disable no-var, vars-on-top, prefer-template */

(function() {
  var defaultTitle = 'Home - Napkin';

  // Width at which UI switches to horizontal layout.
  var horizontalLayoutBreakpoint = 768;

  // With the current content, any device with a >=560px of viewable area
  // should be able to contain the entire site in the viewport with no scrollbars.
  // This variable is used to clip off the extra unneeded scroll area.
  var minSiteHeight = 560;

  var funcs = {
    normalizeBookHeights: function() {
      if ($(window).width() >= horizontalLayoutBreakpoint) {
        $('.books-dynamic-height').css('min-height', '0');
        return;
      }

      var height = Math.max.apply(null, $('.book').map(function() {
        return $(this).outerHeight();
      }).get());
      $('.books-dynamic-height').css('min-height', height + 'px');
    },

    limitHeightToViewport: function() {
      if (window.innerWidth < horizontalLayoutBreakpoint && window.innerHeight >= minSiteHeight) {
        $('.napkin-container > .columns').css('min-height', window.innerHeight);
      }
      else {
        $('.napkin-container > .columns').css('min-height', '100vh');
      }
    },

    // Handler for opening and closing the collapsible that appears on small devices.
    // This switches between short and long names of the books,
    // depending on what state it's in.
    // Defined separately so it can be used in the `resize` handler too.
    toggleCollapsible: function(close) {
      var shouldOpen = !$(this).parent().hasClass('opened');
      if (close) shouldOpen = false;

      if (shouldOpen) {
        $('.long-name').hide();
        $('.short-name').show();
      }
      else {
        $('.long-name').show();
        $('.short-name').hide();
      }
      var dataAttr = shouldOpen ? 'opened-html' : 'closed-html';
      $(this).html($(this).data(dataAttr));

      if (shouldOpen) $(this).parent().addClass('opened');
      else $(this).parent().removeClass('opened');

      funcs.normalizeBookHeights();
      funcs.limitHeightToViewport();
    },

    resizeHandler: function() {
      // Chrome and FF both have a weird bug where the columns start scaling weirdly
      // when you zoom out and then zoom back in. This forces a `redraw` of a sort after
      // each resize event
      var columnsHtml = $('.books > .columns').html();
      $('.books > .columns').html(columnsHtml);

      // close the collapsible when the viewport width reaches >= 768px
      if ($(window).width() >= horizontalLayoutBreakpoint) {
        funcs.toggleCollapsible.call($('.collapsible > .collapsible-trigger'), true);
      }
      else {
        funcs.normalizeBookHeights();
        funcs.limitHeightToViewport();
      }
    }
  };

  $(document).ready(function() {
    // Handlers for opening and closing the books that change the
    // page title based on what book is opened
    $(document).on('click', '.book-container', function() {
      var book = $(this).find('.book');
      document.title = book.data('short-name') + ' - Napkin';

      $('.books > .columns').hide();
      var bookDescriptionMarkup = book.siblings('.book-details').prop('outerHTML');
      $('.current-book-description-holder').html(bookDescriptionMarkup).addClass('opened');
      funcs.limitHeightToViewport();
    });

    $(document).on('click', '.book-close', function() {
      document.title = defaultTitle;
      $('.books > .columns').show();
      $('.current-book-description-holder').empty().removeClass('opened');
    });

    $(document).on('click', '.collapsible > .collapsible-trigger', function() {
      funcs.toggleCollapsible.call(this);
    });

    $(window).resize(funcs.resizeHandler);

    funcs.resizeHandler();
    funcs.normalizeBookHeights();
    funcs.limitHeightToViewport();
  });
})();
