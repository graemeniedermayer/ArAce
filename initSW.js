navigator.serviceWorker.register('./sw.js')
	  .then(function(reg){
	  })
	  .catch(function(error) {
     			console.error('Service Worker Error', error);
	  })
