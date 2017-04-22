firebase.auth().onAuthStateChanged(function(user) {
	if (user) {
		//TODO: Add stuff
	} else window.location.replace("index.html");
})