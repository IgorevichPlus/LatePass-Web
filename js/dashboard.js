var data;
firebase.auth().onAuthStateChanged(function(user) {
	if (user) {
		var compressTxt = (text) => text.replace("\.", "").toLowerCase();
var addRequest = function(request, realName) {
	$('#request-container').prepend("<div class=\"request\" student=\"" + request.student + "\" destination=\"" + request.to + "\">\
		<h1>Request from " + realName + "</h1>\
		<h2>Headed to " + request.to + "'s Class</h2>\
		<h3>" + request.reason + "</h3>\
		<br>\
		<button accept=true>Accept</button>\
		<button accept=false>Reject</button>\
		</div>");
	$(".request[student=\"" + request.student + "\"][destination=\"" + request.to + "\"] button").click(function() {
		let dest = teacherToEmail[toFirebaseFormat(request.to)];
		dest = toFirebaseFormat(dest);
		var accepted = $(this).attr('accept') == 'true';
		request.status = accepted;
		if (accepted) {
			firebase.database().ref("users/" + dest + "/notifications").once("value").then(function(ds) {
				let tmp = ds.val();
				let len = !tmp ? 0 : tmp.length;
				let ref = firebase.database().ref("users/" + dest + "/notifications");
				ref.child(len).set(request);
			});
		}
		firebase.database().ref("users/" + toFirebaseFormat(firebase.auth().currentUser.email) + "/incoming").once("value").then(function(ds) {
			let tmp = ds.val();
			let remove = false;
			let ref = firebase.database().ref("users/" + toFirebaseFormat(firebase.auth().currentUser.email) + "/incoming");
			for (let i = 0; i < tmp.length; i++) {
				if (remove) {
					ref.child(i - 1).set(tmp[i]);
					continue;
				}
				if (tmp.student == request.student && tmp.to == request.to) {
					remove = true;
				}
			}
			ref.child(tmp.length - 1).remove();
		});
		firebase.database().ref("users/" + toFirebaseFormat(request.student) + "/history").once("value").then(function(ds) {
			let tmp = ds.val();
			let len = !tmp ? 0 : tmp.length;
			let ref = firebase.database().ref("users/" + toFirebaseFormat(request.student) + "/history");
			ref.child(len).set(request);
		});
		$(this).parent().remove();
	});
}
firebase.database().ref("teacherToEmail").once("value").then(function(tte) {
	teacherToEmail = tte.val();
	firebase.database().ref("users/" + toFirebaseFormat(firebase.auth().currentUser.email) + "/incoming").once("value").then(function(ds) {
		if (!ds.val()) return;
		for (var i = 0; i < ds.val().length; i++) {
			var curr = ds.val();
			console.log(i);

			var currI = i;
			console.log(currI);
			firebase.database().ref("users/" + toFirebaseFormat(ds.val()[i].student) + "/name").once("value").then(function(currI) {return function(name) {
				let realName = name.val();
				// let curr = ds.val()[i];
				console.log(currI);
				console.log(curr[currI]);
				addRequest(curr[currI], realName);
			};}(i));
		}
	});
});
firebase.database().ref("users/" + toFirebaseFormat(firebase.auth().currentUser.email) + "/notifications").once("value").then(function(ds) {
	if (!ds.val()) return;
	for (var j = 0; j < ds.val().length; j++) {
		// var currJ = j;
		firebase.database().ref("users/" + toFirebaseFormat(ds.val()[j].student) + "/name").once("value").then(function(currJ) {return function(name) {
			let realName = name.val();
			$("#notification-container").prepend("<div class=\"notification\"><h1>" + realName + " will be late.</h1><h2>" + ds.val()[currJ].reason + "-" + ds.val()[currJ].time + ", " + ds.val()[currJ].date + "</h2></div>");
		};}(j));
	}
	
});
	} else window.location.replace("index.html");
});


