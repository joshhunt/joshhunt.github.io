(function() {
  var getParameterByName;

  getParameterByName = function(name) {
    var regex, results;
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
    results = regex.exec(location.search);
    if (results === null) {
      return "";
    } else {
      return decodeURIComponent(results[1].replace(/\+/g, ' '));
    }
  };

  $(function() {
    var $fakeloading, $searchTemplate, $searches, $showTemplate, getShows, groupTitle, groupToFetch, pagesUrl, _do;
    $showTemplate = $('#templates .show');
    $searchTemplate = $('#templates .search');
    $searches = $('.searches');
    pagesUrl = 'http://v5.pages.api.stan.com.au/';
    groupToFetch = getParameterByName('group');
    getShows = function(url, resultTitle, _results, searchTerm) {
      var $loading;
      $loading = $('<div class="loading"></div>');
      $searches.prepend($loading);
      return $.getJSON(url, function(data) {
        var $next, $results, $search, $show, show, _i, _len, _ref;
        if (_results) {
          $results = _results;
        } else {
          $search = $searchTemplate.clone();
          $results = $search.find('.search__results');
          if (resultTitle) {
            $search.find('.search__title').text(resultTitle);
          } else {
            $search.find('.search__count').text(data.total);
            $search.find('.search__term').text(searchTerm);
          }
        }
        _ref = data.entries;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          show = _ref[_i];
          $show = $showTemplate.clone();
          if (show.images['Poster Art']) {
            $show.find('.show__cover').attr('src', show.images['Poster Art'].url);
          } else {
            $show.html(show.title);
          }
          $results.append($show);
        }
        if (data.next) {
          $next = $showTemplate.clone();
          $next.addClass('show--more');
          $next.html("<a href='" + data.next + "'>Load more</a>");
          $results.append($next);
          $next.find('a').on('click', function(ev) {
            var moreUrl;
            $next.remove();
            $next = void 0;
            ev.preventDefault();
            moreUrl = $(this).attr('href');
            return getShows(moreUrl, void 0, $results);
          });
        }
        if ($search) {
          $searches.prepend($search);
        }
        $loading.remove();
        return $loading = void 0;
      });
    };
    if (groupToFetch) {
      $fakeloading = $('<div class="loading"></div>');
      $searches.prepend($fakeloading);
      groupTitle = getParameterByName('groupName') || 'Group items';
      _do = function() {
        $fakeloading.remove();
        $fakeloading = void 0;
        return getShows(groupToFetch, groupTitle);
      };
      setTimeout(_do, 500);
    }
    $.getJSON(pagesUrl, function(_arg) {
      var $loading, $results, $search, $show, entries, page, pageLink, _i, _len;
      page = _arg.page;
      entries = page.entries;
      $loading = $('<div class="loading"></div>');
      $searches.prepend($loading);
      $search = $searchTemplate.clone();
      $results = $search.find('.search__results');
      $search.find('.search__title').text('Groups');
      for (_i = 0, _len = entries.length; _i < _len; _i++) {
        page = entries[_i];
        $show = $showTemplate.clone();
        $show.addClass('show--link');
        pageLink = '/?group=' + encodeURIComponent(page.url) + '&groupName=' + page.title;
        $show.html("<a href='" + pageLink + "'>" + page.title + "</a>");
        $results.append($show);
      }
      $searches.prepend($search);
      $loading.remove();
      return $loading = void 0;
    });
    return $('form.search-form').on('submit', function(ev) {
      var searchTerm, searchUrl;
      ev.preventDefault();
      searchTerm = $('.search-field').val();
      searchUrl = 'http://streamco-search-prod.elasticbeanstalk.com/search?q=' + searchTerm;
      return getShows(searchUrl, void 0, void 0, searchTerm);
    });
  });

}).call(this);
