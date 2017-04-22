firebase.auth().onAuthStateChanged(function(user) {
	if (user) window.location.replace("dashboard.html");
})
var logIn = function() {
	// alert("f");
	let username = document.getElementById("username"), password = document.getElementById("password");
	// alert(username.val);
	firebase.auth().signInWithEmailAndPassword(username.value, password.value).catch(function(error) {
		let errCode = error.code;
		let errMsg = error.message;
		let content;
		switch(errCode) {
			case 'auth/invalid-email':
				content = 'The username is not a valid email.';
				break;
			case 'auth/user-disabled':
				content = 'Your account is disabled.';
				break;
			case 'auth/user-not-found':
				content = 'This user does not exist.';
				break;
			case 'auth/wrong-password':
				content = 'This password is incorrect.';
				break;
			default:
				content = errMsg;
				break;
		}
		document.getElementById("error").innerHTML = content;
	});
}