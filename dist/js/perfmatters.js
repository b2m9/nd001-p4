function insertLink(){var a=document.createElement("link");a.rel="stylesheet",a.href="//fonts.googleapis.com/css?family=Open+Sans:400,700";var b=document.getElementsByTagName("head")[0];b.parentNode.insertBefore(a,b)}function logCRP(){var a=window.performance.timing,b=a.domContentLoadedEventStart-a.domLoading,c=a.domComplete-a.domLoading,d=document.getElementById("crp-stats");d.textContent="DCL: "+b+"ms, onload: "+c+"ms"}window.addEventListener("load",function(a){logCRP(),insertLink(),function(a,b){a.GoogleAnalyticsObject=b,a[b]=a[b]||function(){(a[b].q=a[b].q||[]).push(arguments)},a[b].l=1*new Date}(window,"ga")});