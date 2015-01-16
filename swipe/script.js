(function() {
  var getTranslateX, inOutQuart, outQuart, translate3d, _xformProp;

  _xformProp = getTransformProperty(new Image());

  getTranslateX = function(ele) {
    return (new WebKitCSSMatrix(ele.style[_xformProp])).m41;
  };

  translate3d = function(x, y, z) {
    if (x == null) {
      x = 0;
    }
    if (y == null) {
      y = 0;
    }
    if (z == null) {
      z = 0;
    }
    return "translate3d(" + x + "px, " + y + "px, " + z + "px)";
  };

  inOutQuart = function(n) {
    n *= 2;
    if (n < 1) {
      return 0.5 * n * n * n * n;
    }
    return -0.5 * ((n -= 2) * n * n * n - 2);
  };

  outQuart = function(n) {
    return 1 - (--n * n * n * n);
  };

  document.addEventListener('DOMContentLoaded', function() {
    var BASE_DURATION, START_X, TRESHOLD, isTransitioning, mc, onPanEnd, row, snapTo, transformX;
    row = document.querySelector('.swipeable');
    mc = new Hammer(row, {});
    TRESHOLD = -80;
    BASE_DURATION = 600;
    isTransitioning = false;
    START_X = 0;
    transformX = function(value) {
      return window.requestAnimationFrame(function() {
        return row.style[_xformProp] = translate3d(value);
      });
    };
    snapTo = function(destX) {
      var animate, distance, duration, startTime, startX, stop, x;
      isTransitioning = true;
      stop = false;
      startX = getTranslateX(row);
      x = startX;
      distance = Math.min(100, destX - startX);
      duration = BASE_DURATION * Math.min(1.2, Math.max(0.6, Math.abs(distance / 768)));
      startTime = Date.now();
      animate = null;
      animate = function() {
        var now, p, timeSoFar, val;
        if (stop) {
          isTransitioning = false;
          console.groupEnd();
          START_X = destX;
          return;
        }
        window.requestAnimationFrame(animate);
        now = Date.now();
        timeSoFar = now - startTime;
        console.log('timeSoFar:', timeSoFar);
        if (timeSoFar >= duration) {
          stop = true;
        }
        p = (now - startTime) / duration;
        val = outQuart(p);
        x = startX + (destX - startX) * val;
        console.log('Moving to', x);
        return row.style[_xformProp] = translate3d(x);
      };
      console.groupCollapsed('Animating...', {
        startX: startX,
        x: x,
        destX: destX,
        distance: distance,
        duration: duration
      });
      return animate();
    };
    window.snapTo = snapTo;
    onPanEnd = function(ev) {
      var move;
      START_X = getTranslateX(row);
      if (START_X > TRESHOLD / 2) {
        move = 0;
      } else {
        move = TRESHOLD;
      }
      return snapTo(move);
    };
    mc.on('panend', onPanEnd);
    mc.on('pancancel', onPanEnd);
    mc.on('tap', function() {
      return snapTo(0);
    });
    return mc.on('panleft panright', function(ev) {
      var move;
      if (isTransitioning) {
        return;
      }
      if (ev.deltaX > 0) {
        snapTo(0);
        return;
      }
      move = START_X + ev.deltaX;
      if (move > 0) {
        return;
      }
      return transformX(move);
    });
  });

}).call(this);
