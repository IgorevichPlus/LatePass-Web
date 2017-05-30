
var data, notificationInited = false;
if (("Notification" in window) && Notification.permission != 'granted') {
	Notification.requestPermission();
}
firebase.auth().onAuthStateChanged(function(user) {
	if (user) {
		firebase.database().ref("users/" + toFirebaseFormat(firebase.auth().currentUser.email) + "/name").once("value").then(function(ds) {
			document.getElementById("signout").innerHTML += " " + ds.val();
			document.getElementById("user_name").innerHTML += " " + ds.val();
		});
		document.getElementById("user_email").innerHTML += " " + firebase.auth().currentUser.email;
		var compressTxt = (text) => text.replace("\.", "").toLowerCase();
		var addRequest = function(request, realName) {
			// alert('ay lmoa');
			$('#request-container').prepend("<div class=\"request\" student=\"" + request.student + "\" destination=\"" + request.to + "\">\
				<div class = \"card\">\
				<div class = \"card-image blue\"\
				<span class = \"card-title\"> Request from " + realName + "Headed to " + request.to + "</span>\
				<a class= \"btn-floating halfway-fab waves-effect waves-light blue lighten-2\"><i class=\"small material-icons\">done</i></a>\
				<div class = \"card-content\"\
				<div class = \"card-content\">\
				<p>" + request.reason + "</p>\
				</div>\
				<br>\
				<button class = \"btn blue\" accept=true>Accept</button>\
				<button class = \"btn blue\" accept=false>Reject</button>\
				</div>\
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
				firebase.database().ref("users/" + toFirebaseFormat(firebase.auth().currentUser.email) + "/history").once("value").then(function(ds) {
					// firebase.database().ref("users/" + toFirebaseFormat(request.student) + "/history").once("value").then(function(ds) {
					let tmp = ds.val();
					let len = !tmp ? 0 : tmp.length;
					let ref = firebase.database().ref("users/" + toFirebaseFormat(firebase.auth().currentUser.email) + "/history");
					ref.child(len).set(request);
				});
				$(this).parent().remove();
			});
		}
		firebase.database().ref("teacherToEmail").once("value").then(function(tte) {
			$("#request-container").empty();
			teacherToEmail = tte.val();
			firebase.database().ref("users/" + toFirebaseFormat(firebase.auth().currentUser.email) + "/incoming").on("value", function(ds) {
				$("#request-container").empty();
				if (!ds.val()) return;
				for (var i = 0; i < ds.val().length; i++) {
					var curr = ds.val();
					console.log(i);

					var currI = i;
					console.log(currI);
					firebase.database().ref("users/" + toFirebaseFormat(ds.val()[i].student) + "/name").once("value").then(function(currI) {return function(name) {
						let realName = name.val();
						// let curr = ds.val()[i];
						// alert('ay lmoa');
						console.log(currI);
						console.log(curr[currI]);
						addRequest(curr[currI], realName);
					};}(i));
				}
			});
		});
		firebase.database().ref("users/" + toFirebaseFormat(firebase.auth().currentUser.email) + "/notifications").on("value", function(ds) {
			$("#notification-container").empty();
			if (!ds.val()) return;
			for (var j = 0; j < ds.val().length; j++) {
				// var currJ = j;
				firebase.database().ref("users/" + toFirebaseFormat(ds.val()[j].student) + "/name").once("value").then(function(currJ) {return function(name) {
					let realName = name.val();
					if (!("Notification" in window)) {
						console.log("Notifications are not supported.");
					} else if (notificationInited && Notification.permission == 'granted' && currJ == ds.val().length - 1) {
						var notification = new Notification(realName + " will be late.");
					}
					$("#notification-container").prepend("<div class=\"notification\"><h1>" + realName + " will be late.</h1><h2>" + ds.val()[currJ].reason + "-" + ds.val()[currJ].time + ", " + ds.val()[currJ].date + "</h2></div>");
				};}(j));
			}
			notificationInited = true;
		});
		firebase.database().ref("users/" + toFirebaseFormat(firebase.auth().currentUser.email) + "/history").on("value", function(ds) {
			$("#history-container").empty();
			if (!ds.val()) return;
			for (var k = 0; k < ds.val().length; k++) {
				// var currJ = j;

				firebase.database().ref("users/" + toFirebaseFormat(ds.val()[k].student) + "/name").once("value").then(function(currK, data) {return function(name) {
					let realName = name.val();
					$("#history-container").prepend("<div class=\"history-item\"><div class = \"row\"><div class = \"card\"><div class = \"card-image blue\"><h1><span class = \"card-title\">" + realName + " to " + data.val()[currK].to + "</span></h1></div><h2>Status: " + (data.val()[currK].status ? "ACCEPTED" : "REJECTED") + "</h2><h2>" + data.val()[currK].reason + "-" + data.val()[currK].time + ", " + data.val()[currK].date + "</h2></div>");
				};}(k, ds));
			}

		});
	} else window.location.replace("index.html");
});
