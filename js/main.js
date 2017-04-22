var toFirebaseFormat = (target) => target.replace("\.", "__PERIOD__");
var fromFirebaseFormat = (target) => target.replace("__PERIOD__", "\.");
console.log(toFirebaseFormat("test@test.test"));