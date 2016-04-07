// raf shim
window.requestAnimFrame = (function() {
  return window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function(callback) {
      window.setTimeout(callback, 1000 / 60);
    };
})();

(function(w, d) {
  var movingPizzas = [];
  var movingPizzasLength = 0;
  var ticking = false;
  var frame = 0;
  var lastScrollTop = 0;
  var label = d.querySelector("#pizzaSize");
  var windowWidth = d.querySelector("#randomPizzas").offsetWidth;
  var pizzas = null;

  // Safari doesn't support User Timing API
  var perfAvailable = (w.performance.mark && w.performance.measure) ? true : false;
  // using Web Worker to create pizza menu
  var menuWorker = new Worker("js/worker.js");

  d.addEventListener("DOMContentLoaded", build);
  d.querySelector("#sizeSlider").addEventListener("change", resizePizzas);
  w.addEventListener("scroll", onScroll);

  // worker creates an HTML string that needs to be added to DOM tree
  menuWorker.onmessage = function(ev) {
    requestAnimFrame(function() {
      d.querySelector("#randomPizzas").innerHTML += ev.data;

      if (perfAvailable) {
        w.performance.mark("mark_end_generating");
        w.performance.measure("measure_pizza_generation", "mark_start_generating", "mark_end_generating");

        console.log("Time to generate pizzas on load: " + w.performance.getEntriesByName("measure_pizza_generation")[0].duration + "ms");
      }

      menuWorker.terminate();
    });
  };

  function build() {
    if (perfAvailable) {
      // non-representative perf marker for creating menu
      w.performance.mark("mark_start_generating");
    }

    // building pizza menu in web worker
    menuWorker.postMessage({});

    // building moving background images
    createMovingPizzas();
  }

  // create as many moving pizzas as needed, but not more
  // TODO: respond to resize
  // TODO: move it to a worker?
  function createMovingPizzas() {
    var width = w.screen.width;
    var height = w.screen.height;
    var cols = Math.floor(width / 200);
    var stepHeight = 256;
    var rows = Math.floor(height / stepHeight);
    var length = cols * rows;
    var i = 0;
    var root = d.createElement("div");
    var elem;

    // create container to batch DOM insertion
    root.className = "col-md-12";
    root.id = "movingPizzas1";

    for (; i < length; i++) {
      elem = d.createElement("img");
      elem.className = "mover";
      elem.src = "images/pizza.png";
      elem.style.height = "100px";
      elem.style.width = "73.333px";
      elem.style.top = (Math.floor(i / cols) * stepHeight) + "px";
      elem.basicLeft = (i % cols) * stepHeight;
      root.appendChild(elem);
    }

    d.querySelector("#header").appendChild(root);
    movingPizzas = root.querySelectorAll(".mover");
    movingPizzasLength = movingPizzas.length;
    updatePizzaPositions();
  }

  function updatePizzaPositions() {
    var i = 0;
    var phase, el;

    frame++;
    if (perfAvailable) {
      w.performance.mark("mark_start_frame");
    }

    for (; i < movingPizzasLength; i++) {
      el = movingPizzas[i];
      phase = Math.sin(lastScrollTop + (i % 5));

      el.style.transform = "translateX(" + (el.basicLeft + 100 * phase) + "px)";
    }

    if (perfAvailable) {
      w.performance.mark("mark_end_frame");
      w.performance.measure("measure_frame_duration", "mark_start_frame", "mark_end_frame");

      if (frame % 10 === 0) {
        var timesToUpdatePosition = w.performance.getEntriesByName("measure_frame_duration");
        logAverageFrame(timesToUpdatePosition);
      }
    }

    ticking = false;
  }

  function onScroll() {
    // only use RAF if no queue
    if (!ticking) {
      ticking = true;
      requestAnimFrame(updatePizzaPositions);
      lastScrollTop = d.body.scrollTop / 1250;
    }
  }

  function resizePizzas(ev) {
    if (perfAvailable) {
      w.performance.mark("mark_start_resize"); // User Timing API function
    }

    pizzas = pizzas ? pizzas : d.querySelectorAll(".randomPizzaContainer");
    changeSliderLabel(ev.target.value);
    changePizzaSizes(ev.target.value);

    if (perfAvailable) {
      // User Timing API is awesome
      w.performance.mark("mark_end_resize");
      w.performance.measure("measure_pizza_resize", "mark_start_resize", "mark_end_resize");
      var timeToResize = w.performance.getEntriesByName("measure_pizza_resize");
      console.log("Time to resize pizzas: " + timeToResize[timeToResize.length - 1].duration + "ms");
    }
  }

  function changeSliderLabel(size) {
    switch (size) {
      case "1":
        label.innerHTML = "Small";
        return;
      case "2":
        label.innerHTML = "Medium";
        return;
      case "3":
        label.innerHTML = "Large";
        return;
      default:
        console.log("bug in changeSliderLabel");
    }
  }

  function changePizzaSizes(size) {
    var len = pizzas.length;
    var i, dx, newwidth;

    for (i = 0; i < len; i++) {
      dx = determineDx(pizzas[i].offsetWidth, size);
      newwidth = (pizzas[i].offsetWidth + dx) + "px";

      pizzas[i].style.width = newwidth;
    }
  }

  function determineDx(offset, size) {
    var oldSize = offset / windowWidth;

    //   // Optional TODO: change to 3 sizes? no more xl?
    //   // Changes the slider value to a percent width

    return (sizeSwitcher(size) - oldSize) * windowWidth;
  }

  function sizeSwitcher(size) {
    switch (size) {
      case "1":
        return 0.25;
      case "2":
        return 0.3333;
      case "3":
        return 0.5;
      default:
        console.log("bug in sizeSwitcher");
    }
  }

  // Logs average amount of time per 10 frames needed to move the sliding background pizzas on scroll.
  // times is the array of User Timing measurements from updatePizzaPositions()
  function logAverageFrame(times) {
    var numberOfEntries = times.length;
    var sum = 0;

    for (var i = numberOfEntries - 1; i > numberOfEntries - 11; i--) {
      sum = sum + times[i].duration;
    }

    console.log("Average time to generate last 10 frames: " + sum / 10 + "ms");
  }

}(window, document));

// The following code for sliding background pizzas was pulled from Ilya's demo found at:
// https://www.igvita.com/slides/2012/devtools-tips-and-tricks/jank-demo.html


// TODO: put the generation in a web worker

// TODO: RESIZE THE DAMN PICTURE
