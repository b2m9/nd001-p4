window.requestAnimFrame=function(){return window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||window.oRequestAnimationFrame||window.msRequestAnimationFrame||function(a){window.setTimeout(a,1e3/60)}}(),function(a,b){function c(){u&&a.performance.mark("mark_start_generating"),v.postMessage({}),d()}function d(){var c,d=a.screen.width,f=a.screen.height,g=Math.floor(d/200),h=256,i=Math.floor(f/h),j=g*i,k=0,l=b.createElement("div");for(l.className="col-md-12",l.id="movingPizzas1";j>k;k++)c=b.createElement("img"),c.className="mover",c.src="images/pizza.png",c.style.height="100px",c.style.width="73.333px",c.style.top=Math.floor(k/g)*h+"px",c.basicLeft=k%g*h,l.appendChild(c);b.querySelector("#header").appendChild(l),m=l.querySelectorAll(".mover"),n=m.length,e()}function e(){var b,c,d=0;for(p++,u&&a.performance.mark("mark_start_frame");n>d;d++)c=m[d],b=Math.sin(q+d%5),c.style.transform="translateX("+(c.basicLeft+100*b)+"px)";if(u&&(a.performance.mark("mark_end_frame"),a.performance.measure("measure_frame_duration","mark_start_frame","mark_end_frame"),p%10===0)){var e=a.performance.getEntriesByName("measure_frame_duration");l(e)}o=!1}function f(){o||(o=!0,requestAnimFrame(e),q=b.body.scrollTop/1250)}function g(c){if(u&&a.performance.mark("mark_start_resize"),t=t?t:b.querySelectorAll(".randomPizzaContainer"),h(c.target.value),i(c.target.value),u){a.performance.mark("mark_end_resize"),a.performance.measure("measure_pizza_resize","mark_start_resize","mark_end_resize");var d=a.performance.getEntriesByName("measure_pizza_resize");console.log("Time to resize pizzas: "+d[d.length-1].duration+"ms")}}function h(a){switch(a){case"1":return void(r.innerHTML="Small");case"2":return void(r.innerHTML="Medium");case"3":return void(r.innerHTML="Large");default:console.log("bug in changeSliderLabel")}}function i(a){var b,c,d,e=t.length,f=t[0].offsetWidth;for(b=0;e>b;b++)c=j(f,a),d=f+c+"px",t[b].style.width=d}function j(a,b){return(k(b)-a/s)*s}function k(a){switch(a){case"1":return.25;case"2":return.3333;case"3":return.5;default:console.log("bug in sizeSwitcher")}}function l(a){var b,c=a.length,d=0;for(b=c-1;b>c-11;b--)d+=a[b].duration;console.log("Average time to generate last 10 frames: "+d/10+"ms")}var m=[],n=0,o=!1,p=0,q=0,r=b.querySelector("#pizzaSize"),s=b.querySelector("#randomPizzas").offsetWidth,t=null,u=!(!a.performance.mark||!a.performance.measure),v=new Worker("js/worker.js");b.addEventListener("DOMContentLoaded",c),b.querySelector("#sizeSlider").addEventListener("change",g),a.addEventListener("scroll",f),v.onmessage=function(c){requestAnimFrame(function(){b.querySelector("#randomPizzas").innerHTML+=c.data,u&&(a.performance.mark("mark_end_generating"),a.performance.measure("measure_pizza_generation","mark_start_generating","mark_end_generating"),console.log("Non-representative time to generate pizzas on load: "+a.performance.getEntriesByName("measure_pizza_generation")[0].duration+"ms")),v.terminate()})}}(window,document);