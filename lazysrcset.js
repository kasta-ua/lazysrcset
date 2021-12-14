(function() {
  var img = document.createElement('img');
  var isSupported = 'sizes' in img;
  var marker = '_lazysrcset';


  function getWidth(el) {
    var width;
    while (!width && el) {
      width = el.offsetWidth;
      el = el.parentElement;
    }
    return width;
  }


  function _renderImage(el) {
    var width = getWidth(el);
    el.setAttribute('sizes', width + 'px');
    el.setAttribute('srcset', el.getAttribute('data-srcset'));
  }

  if (!isSupported) {
    _renderImage = function(el) {
      el.setAttribute('src', el.getAttribute('data-src'));
    };
  }


  var renderImage = (function() {
    var queue = [];
    var scheduled = null;

    function run() {
      scheduled = null;
      while (queue.length) {
        _renderImage(queue.shift());
      }
    }

    return function(el) {
      queue.push(el);
      if (!scheduled) {
        scheduled = requestAnimationFrame(run);
      }
    };
  })();


  var obs = new IntersectionObserver(function(entries, obs) {
    for (var i = 0; i < entries.length; i++) {
      var entry = entries[i];

        // isIntersecting is often `true` in FF even when it shouldn't be
      if (entry.intersectionRatio > 0.01) {
        renderImage(entry.target);
        obs.unobserve(entry.target);
      }
    }
  }, {rootMargin: '400px', threshold: 0.01});


  function handle(e) {
    var el = e.target;
    el = el.body || el;
    if (el.hasAttribute('data-srcset')) {
      obs.observe(el);
    }
    var els = el.querySelectorAll('[data-srcset]');
    for (var i = 0; i < els.length; i++) {
      obs.observe(els[i]);
    }
  }

  document.addEventListener('DOMContentLoaded', handle);
  // here we are listening for new arriving HTML fragments from TwinSpark.js,
  // modify to handle yours
  document.addEventListener('ts-ready', handle);
})();
