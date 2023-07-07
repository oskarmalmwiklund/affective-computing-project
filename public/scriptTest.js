const VERSION = 3;

const EVENT_ON_MOUSE_MOVE = 0;
const EVENT_ON_CLICK = 1;
const EVENT_ON_DOUBLE_CLICK = 2;
const EVENT_ON_MOUSE_DOWN = 3;
const EVENT_ON_MOUSE_UP = 4;
const EVENT_ON_WHEEL = 5;
const EVENT_CONTEXT_MENU = 6;
const EVENT_WINDOW_SCROLL = 11;
const EVENT_WINDOW_RESIZE = 12;
const EVENT_KEY_DOWN = 13;
const EVENT_KEY_PRESS = 14;
const EVENT_KEY_UP = 15;
const EVENT_FOCUS = 16;
const EVENT_BLUR = 17;
const EVENT_ON_CHANGE_SELECTION_OBJECT = 18;
const EVENT_ON_CLICK_SELECTION_OBJECT = 19;
const EVENT_INIT_TRACKING = 100;
const EVENT_TRACKIND_END = 200;
const COMPONENT_TEXT_FIELD = 1;
const COMPONENT_COMBOBOX = 2;
const COMPONENT_OPTION = 3;
const COMPONENT_RADIO_BUTTON = 4;
const COMPONENT_CHECK_BOX = 5;

const user = createUser();

var abTest;
var list = [];
var sceneId = 0;
var eventCounter = 0;
var trackingOn = false;
var TOP_LIMIT = 500;
var sentRequest = 0;
var pendingRequest = 0;
// Continue with the function if checkReadyToLeave has been looped 5 fives
var retryCount = 0;

var pendingBackgroundsDelivered = 0;
var backgroundsDelivered = 0;
var eventsDelivered = false;
var finishedExperiment = false;

var newPage = null;
var elements = [];
var emittingData = false;

var idExperiment = 19;
var urlBase = 'https://156.35.82.106'

var url = urlBase + '/TrackerServer/restws/track';
var urlBackgroundTracker = urlBase + '/TrackerServer/restws/backgroundTracker';
var urlRegisterComponent = urlBase + '/TrackerServer/restws/registerComponent';
var urlRegisterUserData = urlBase + '/TrackerServer/restws/registerUserData';
var urlDemographicData = urlBase + '/TrackerServer/restws/registerDemographicData';
var urlExperimentStatus = urlBase + '/TrackerServer/restws/experiment/status/' + idExperiment;


function startExperiment() {
	//We create a new user
	var user = createUser();
	console.log("Creating user session " + user);
}

function finishExperiment() {
	//We flag the end of the experiment
	finishedExperiment = true;
}

/*
function takeSnapshot(sceneId) {
	html2canvas(document.body).then(canvas => {
		console.log("Delivering background for scene " + sceneId)
		deliverSnapshot(sceneId, canvas);
	});
}*/

function takeSnapshot(sceneId) {
	return new Promise((resolve, reject) => {
		html2canvas(document.body).then(canvas => {
			console.log("Delivering background for scene " + sceneId);
			deliverSnapshot(sceneId, canvas);
			resolve();
		}).catch(reject);
	});
}

function deliverSnapshot(sceneId, canvas) {

	var parametros = {
		"timezone": (new Date()).getTimezoneOffset() / 60 * (-1),
		"experiment": idExperiment,
		"sceneId": sceneId,
		"canvas": canvas.toDataURL("image/png"),
		"timeStamp": Date.now(),
		"sessionId": user
	};

	if (emittingData) {
		$.ajax({
			data: JSON.stringify(parametros),
			url: urlBackgroundTracker,
			type: 'post',
			beforeSend: function () {
				//We incremente the pendingbackgroundsdelivered number
				pendingBackgroundsDelivered++;
				console.log("Sending background. Pending backgrounds: " + pendingBackgroundsDelivered + "/" + sentRequest);
			},
			success: function (response) {
				pendingBackgroundsDelivered--;
				backgroundsDelivered++;
				console.log('Result: ' + response);
				console.log("Pending Backgrounds: " + pendingBackgroundsDelivered + "/" + sentRequest);
			},
			complete: function (jqXHR, textStatus) {
				console.log("Call completed. Status: " + textStatus + ", Pending Requests: " + pendingRequest + "/" + sentRequest);
				//checkReadyToLeave();
			},
			error: function (XMLHttpRequest, textStatus, errorThrown) {
				//alert("Status: " + textStatus); alert("Error: " + errorThrown);
				console.log("Status: " + textStatus);
				pendingBackgroundsDelivered--;
				console.log("Error: " + errorThrown);
			}
		}).always(function (jqXHR, textStatus) {
			if (textStatus != "success") {
				console.log("ERROR: " + jqXHR.statusText);
			}
		});
	}
}

function getDate() {
	var today = new Date();
	var day = today.getDate();
	var month = today.getMonth() + 1;
	var year = today.getFullYear();
	return (`${month}${day}${year}`);
}


function createUser() {
	if (localStorage.getItem("user") === null || localStorage.getItem("user") === undefined) {
		let lettrs = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
		localStorage.setItem("user",
			lettrs[Math.floor(Math.random() * lettrs.length)] +
			lettrs[Math.floor(Math.random() * lettrs.length)] +
			lettrs[Math.floor(Math.random() * lettrs.length)] +
			(Math.floor(Math.random() * (999999999999 - 100000000000)) + 100000000000).toString() +
			Date.now().toString() + getDate()
		);
	}
	return localStorage.getItem("user");
}

function registerUserData() {
	var parametros = {
		"timezone": (new Date()).getTimezoneOffset() / 60 * (-1),
		"timeOpened": new Date(),
		"pageon": window.location.pathname,
		"referrer": document.referrer,
		"previousSites": history.length,
		"browserName": navigator.appName,
		"browserEngine": navigator.product,
		"browserVersion1a": navigator.appVersion,
		"browserVersion1b": navigator.userAgent,
		"browserLanguage": navigator.language,
		"browserOnline": navigator.onLine,
		"browserPlatform": navigator.platform,
		"javaEnabled": navigator.javaEnabled(),
		"dataCookiesEnabled": navigator.cookieEnabled,
		"dataCookies1": document.cookie,
		"dataCookies2": decodeURIComponent(document.cookie.split(";")),
		"sizeScreenW": screen.width,
		"sizeScreenH": screen.height,
		"sizeDocW": document.body.clientWidth,
		"sizeDocH": document.body.clientHeight,
		"sizeInW": innerWidth,
		"sizeInH": innerHeight,
		"sizeAvailW": screen.availWidth,
		"sizeAvailH": screen.availHeight,
		"scrColorDepth": screen.colorDepth,
		"scrPixelDepth": screen.pixelDepth,
		"idExperiment": idExperiment,
		"sessionId": user
	};
	if (true) {
		$.ajax({
			data: JSON.stringify(parametros),
			url: urlRegisterUserData,
			type: 'post',
			beforeSend: function () {
				$("#resultado").html("Registering user data...");
			},
			success: function (response) {
				$("#result").html(response);
			},
			async: false
		});
	}
}

class Element {
	constructor(id, x, y, xF, yF, sceneId) {
		this.id = id;
		this.x = x;
		this.y = y;
		this.xF = xF;
		this.yF = yF;
		this.sceneId = sceneId;
	}
	getScene() {
		return this.sceneId;
	}
	isOver(mX, mY) {
		if (this.x < mX && mX < this.xF && this.y < mY && mY < this.yF) {
			return true;
		}
		else {
			return false;
		}
	}
}

function detectElement(x, y) {
	var found = -1;
	elements.forEach(function (entry) {
		if (entry.isOver(x, y) && entry.getScene() === sceneId) {
			found = entry.id;
		}
	});
	return found;
}

function detectElementByName(name) {
	var found = -1;
	elements.forEach(function (entry) {
		if (entry.id === name && entry.getScene() === sceneId) {
			found = entry.id;
		}
	});
	return found;
}

function registerElement(id, x, y, xF, yF, typeId, sceneId) {
	elements.push(new Element(id, x, y, xF, yF, sceneId));
	addFocusAndBlurEvents(id);
	if (typeId === COMPONENT_COMBOBOX || typeId === COMPONENT_OPTION) {
		addSelectionEvent(id);
	}
}

function addFocusAndBlurEvents(elementId) {
	var element = document.getElementById(elementId);
	if (element != undefined && element != null) {
		element.addEventListener('focus', function (event) {
			trackFocusEvent(event);
		});
		element.addEventListener('blur', function (event) {
			trackBlurEvent(event);
		});
	}
}

function addSelectionEvent(elementId) {
	var element = document.getElementById(elementId);
	if (element != undefined && element != null) {
		element.addEventListener('change', function (event) {
			trackOnChangeSelectionEvent(event);
		});
		element.addEventListener('click', function (event) {
			trackOnClickSelectionEvent(event);
		});
	}
}

function trackWithEvent(eventType, event) {
	if (trackingOn) {
		trackEventOverElement(eventType, -1, event);
	}
}

function trackEvent(eventType) {
	if (trackingOn) {
		trackEventOverElement(eventType, -1, null);
	}
}

function trackEventOverElement(eventType, elementId, event) {
	var item = new Object();
	item.id = eventCounter++;
	item.sceneId = sceneId;
	item.eventType = eventType;
	item.timeStamp = Date.now();
	if (window.event !== undefined) {
		item.x = window.event.clientX;
		item.y = window.event.clientY;
	}
	else {
		item.x = 0;
		item.y = 0;
	}

	if (item.x == null) {
		item.x = -1;
	}
	if (item.y == null) {
		item.y = -1;
	}

	item.keyValueEvent = -1;
	item.keyCodeEvent = -1;

	if (eventType == EVENT_KEY_DOWN || eventType == EVENT_KEY_PRESS || eventType == EVENT_KEY_UP) {
		item.keyValueEvent = event.key;
		item.keyCodeEvent = event.keyCode;
		item.elementId = detectElementByName(event.target.id);
	}
	else if (eventType == EVENT_FOCUS || eventType == EVENT_BLUR) {
		item.elementId = detectElementByName(event.target.id);
	}
	else if (eventType == EVENT_ON_CHANGE_SELECTION_OBJECT) {
		item.elementId = detectElementByName(event.target.id);
	}
	else if (eventType == EVENT_ON_CLICK_SELECTION_OBJECT) {
		item.elementId = detectElementByName(event.target.id);
	}
	else {
		item.elementId = detectElement(item.x, item.y);
	}

	list[list.length] = item;

	if (list.length >= TOP_LIMIT) {
		var deliverPackage = list;
		list = [];
		deliverData(deliverPackage);
	}
}

function initTracking(_sceneId) {
	trackingOn = true;
	getExperimentStatus();
	sceneId = _sceneId;
	console.log("Initializing tracking for scene " + _sceneId);

	trackEvent(EVENT_INIT_TRACKING);
	parent.addEventListener('scroll', function () {
		trackWindowScroll();
	});
	parent.addEventListener('resize', function () {
		trackWindowResize();
	});
	parent.addEventListener('mousemove', function () {
		trackMouseMovement();
	});
	parent.addEventListener('mousedown', function () {
		trackMouseDown();
	});
	parent.addEventListener('mouseup', function () {
		trackMouseUp();
	});
	parent.addEventListener('click', function () {
		trackClick();
	});
	parent.addEventListener('dblclick', function () {
		trackDblclick();
	});
	parent.addEventListener('contextmenu', function () {
		trackContextmenu();
	});
	parent.addEventListener('wheel', function () {
		trackWheel();
	});
	parent.addEventListener('keydown', function (event) {
		trackEventKeydown(event);
	});
	parent.addEventListener('keypress', function (event) {
		trackEventKeypress(event);
	});
	parent.addEventListener('keyup', function (event) {
		trackEventKeyup(event);
	});
}

function trackMouseMovement() {
	trackEvent(EVENT_ON_MOUSE_MOVE);
}

function trackClick() {
	trackEvent(EVENT_ON_CLICK);
}

function trackDblclick() {
	trackEvent(EVENT_ON_DOUBLE_CLICK);
}

function trackMouseDown() {
	trackEvent(EVENT_ON_MOUSE_DOWN);
}

function trackMouseUp() {
	trackEvent(EVENT_ON_MOUSE_UP);
}

function trackWheel() {
	trackEvent(EVENT_ON_WHEEL);
}

function trackContextmenu() {
	trackEvent(EVENT_CONTEXT_MENU);
}

function trackWindowScroll() {
	trackEvent(EVENT_WINDOW_SCROLL);
}

function trackWindowResize() {
	trackEvent(EVENT_WINDOW_RESIZE);
}

function trackEventKeydown(event) {
	trackWithEvent(EVENT_KEY_DOWN, event)
}

function trackEventKeypress(event) {
	trackWithEvent(EVENT_KEY_PRESS, event)
}

function trackEventKeyup(event) {
	trackWithEvent(EVENT_KEY_UP, event)
}

function trackFocusEvent(event) {
	trackWithEvent(EVENT_FOCUS, event);
}

function trackBlurEvent(event) {
	trackWithEvent(EVENT_BLUR, event);
}

function trackOnChangeSelectionEvent(event) {
	trackWithEvent(EVENT_ON_CHANGE_SELECTION_OBJECT, event);
}

function trackOnClickSelectionEvent(event) {
	trackWithEvent(EVENT_ON_CLICK_SELECTION_OBJECT, event);
}

// Original version

/*
function finishTracking(_newPage) {
	trackEvent(EVENT_TRACKIND_END);
	trackingOn = false;

	//We take the snapshot.
	takeSnapshot(this.sceneId);

	deliverData(list);
	list = [];
	newPage = _newPage;
	checkReadyToLeave();
}
*/

// Modified version

function finishTracking(_newPage) {
	trackEvent(EVENT_TRACKIND_END);
	trackingOn = false;
	takeSnapshot(this.sceneId);
	deliverData(list);
	list = [];
	newPage = _newPage;

	let readyCheck = checkReadyToLeave();
	// Pass the promise to loadingSpinner
	loadingSpinner(readyCheck);
}

// Original version

/*
function checkReadyToLeave() {

  if (eventsDelivered == false || pendingRequest > 0) {
	  // Set a flag to check if the first page works
	  console.log("Not ready to leave page, events still pending");
  }
  else {
	  //Events are delivered, we wait for the background delivery
	  if (pendingBackgroundsDelivered > 0 && retryCount < 1) {
		  console.log("Not ready to leave page, " + pendingBackgroundsDelivered + " backgrounds still pending");
		  retryCount++; // Increment the counter
		  setTimeout(() => {
			  this.checkReadyToLeave();
		  }, 2000);
		  return;
	  }

	  console.log("Ready to leave page, pending request:" + pendingRequest + ", pending backgrounds " + pendingBackgroundsDelivered + "/" + backgroundsDelivered);
	  if (finishedExperiment) {
		  //We delete the user
		  console.log("Experiment finished, deleting user " + localStorage.getItem("user"));
		  localStorage.removeItem("user");
	  }
	  if (newPage != null) {
		  window.location.href = newPage;
	  }
  }

}
*/

// Modified version

function checkReadyToLeave() {
	return new Promise(resolve => {
		if (eventsDelivered == false || pendingRequest > 0) {
			// Set a flag to check if the first page works
			console.log("Not ready to leave page, events still pending");
			resolve(false);
		} else {
			// Events are delivered, we wait for the background delivery
			if (pendingBackgroundsDelivered > 0 && retryCount < 2) {
				console.log("Not ready to leave page, " + pendingBackgroundsDelivered + " backgrounds still pending");
				retryCount++; // Increment the counter
				setTimeout(() => {
					resolve(checkReadyToLeave());
				}, 2000);
			} else {
				console.log("Ready to leave page, pending request:" + pendingRequest + ", pending backgrounds " + pendingBackgroundsDelivered + "/" + backgroundsDelivered);
				if (finishedExperiment) {
					// We delete the user
					console.log("Experiment finished, deleting user " + localStorage.getItem("user"));
					localStorage.removeItem("user");
				}
				if (newPage != null) {
					window.location.href = newPage;
				}
				resolve(true);
			}
		}
	});
}

function finishSubsceneTracking() {
	trackEvent(EVENT_TRACKIND_END);
	trackingOn = false;
	//We take the snapshot
	takeSnapshot(this.sceneId);
}

function registerComponent(sceneId, componentId, x, y, xF, yF, typeId, componentAssociated) {
	registerElement(componentId, x, y, xF, yF, typeId, sceneId);
	var parametros = {
		"timezone": (new Date()).getTimezoneOffset() / 60 * (-1),
		"sceneId": sceneId,
		"componentId": componentId,
		"x": Math.round(x),
		"y": Math.round(y),
		"xF": Math.round(xF),
		"yF": Math.round(yF),
		"timeStamp": Date.now(),
		"idExperiment": idExperiment,
		"typeId": typeId,
		"componentAssociated": componentAssociated,
		"sessionId": user
	};

	if (emittingData) {
		$.ajax({
			data: JSON.stringify(parametros),
			url: urlRegisterComponent,
			type: 'post',
			beforeSend: function () {

			},
			success: function (response) {

			}
		});
	}
}

function deliverChunk(chunk) {
	var parametros = {
		"timezone": (new Date()).getTimezoneOffset() / 60 * (-1),
		"list": chunk,
		"idExperiment": idExperiment,
		"sessionId": user
	};

	if (emittingData) {
		$.ajax({
			data: JSON.stringify(parametros),
			url: url,
			type: 'post',
			beforeSend: function () {
				pendingRequest++;
				sentRequest++;
				console.log("Sending request. Pending requests: " + pendingRequest + "/" + sentRequest);
			},
			success: function (response) {
				console.log('Result: ' + response);
				console.log("Pending Requests: " + pendingRequest + "/" + sentRequest);
			},
			complete: function (jqXHR, textStatus) {
				pendingRequest--;
				console.log("Call completed. Status: " + textStatus + ", Pending Requests: " + pendingRequest + "/" + sentRequest);

				if (pendingRequest == 0) {
					eventsDelivered = true;
				}
				checkReadyToLeave();
			},
			error: function (XMLHttpRequest, textStatus, errorThrown) {
				alert("Status: " + textStatus); alert("Error: " + errorThrown);
				console.log("Status: " + textStatus);
				console.log("Error: " + errorThrown);
			}
		}).always(function (jqXHR, textStatus) {
			if (textStatus != "success") {
				console.log("ERROR: " + jqXHR.statusText);
			}
		});
	}
}

// Original version

/*
function deliverData(list) {
	var i = 0;
	chunk = [];
	var chunkCounter = 0;
	list.forEach(myFunction);
	function myFunction(item, index) {
		chunk[i] = item;
		i++;
		if (i >= TOP_LIMIT) {
			i = 0;
			deliverChunk(chunk);
			chunkCounter++;
			chunk = [];
		}
	}
	deliverChunk(chunk);
	chunkCounter++;
	chunk = [];
}
*/

// Modified version

function deliverData(list) {
	return new Promise((resolve, reject) => {
		var i = 0;
		var chunk = [];
		var chunkCounter = 0;
		var promises = [];

		list.forEach(myFunction);

		function myFunction(item, index) {
			chunk[i] = item;
			i++;
			if (i >= TOP_LIMIT) {
				i = 0;
				// Assuming deliverChunk returns a Promise
				promises.push(deliverChunk(chunk));
				chunkCounter++;
				chunk = [];
			}
		}

		// Make sure to deliver the last chunk if any
		if (chunk.length > 0) {
			promises.push(deliverChunk(chunk));
		}

		// Wait for all chunks to be delivered
		Promise.all(promises).then(resolve).catch(reject);
	});
}


function getTracking(sessionId, sceneId) {
	var parametros = {
		"sessionId": sessionId,
		"sceneId": sceneId,
		"idExperiment": idExperiment
	};

	if (emittingData) {
		$.ajax({
			data: parametros,
			url: url,
			type: 'get',
			beforeSend: function () {
				$("#result").html("Procesando, espere por favor...");
			},
			success: function (response) {
				$("#result").html(response);
				paintTracking(response);
			}
		});
	}
}
function showTrace(sessionId, sceneId) {
	getBackground(sessionId, sceneId);
	getTracking(sessionId, sceneId);

}
function getBackground(sessionId, sceneId) {
	var parametros = {
		"sessionId": sessionId,
		"sceneId": sceneId,
		"idExperiment": idExperiment
	};
	if (emittingData) {
		$.ajax({
			data: parametros,
			url: urlBackgroundTracker,
			type: 'get',
			beforeSend: function () {
				$("#result").html("Procesando, espere por favor...");
			},
			success: function (response) {
				var img = new Image();
				img.src = response;

				var canvas = document.getElementById('myCanvas');
				var ctx = canvas.getContext('2d');
				img.onload = function () {
					if (ctx) {
						canvas.width = img.width;
						canvas.height = img.height;

						ctx.drawImage(img, 0, 0);
					}
				}
			}
		});
	}
}
function getExperimentStatus() {

	$.ajax({
		url: urlExperimentStatus,
		type: 'get',
		success: function (response) {
			if (response === 'OPEN') {
				emittingData = true;
			}
			else {
				emittingData = false;
			}
		},
		error: function () { }
	});
}

function paintTracking(response) {
	var c = document.getElementById("myCanvas");
	var ctx = c.getContext("2d");

	responseJSON = JSON.parse(response);

	responseJSON.list.forEach(paintPoint);
	function paintPoint(item, index) {
		ctx.beginPath();
		ctx.arc(item['x'], item['y'], 1, 0, 2 * Math.PI);
		ctx.strokeStyle = getColor(item['eventType']);
		ctx.stroke();
	}
}

function getColor(eventType) {
	switch (eventType) {
		case EVENT_ON_MOUSE_MOVE:
			return "#FF0000";
			break;
		case EVENT_ON_CLICK:
			return "#FFF000";
			break;
		case 2:
			return "#FFFF00";
			break;
		case 3:
			return "#FFFFF0";
			break;
		case 4:
			return "#FF00FF";
			break;
		case EVENT_INIT_TRACKING:
			return "#74FF33";
			break;
		case EVENT_TRACKIND_END:
			return "#336BFF";
			break;
		default:
			return "#000F00";
	}
}

function postNumberDD(id, value) {
	var parametros = {
		"timezone": (new Date()).getTimezoneOffset() / 60 * (-1),
		"id": id,
		"numberValue": value,
		"idExperiment": idExperiment,
		"sessionId": user
	};
	postAJAXDemographicData(parametros);
}

function postStringDD(id, value) {
	var parametros = {
		"timezone": (new Date()).getTimezoneOffset() / 60 * (-1),
		"id": id,
		"stringValue": value,
		"idExperiment": idExperiment,
		"sessionId": user
	};
	postAJAXDemographicData(parametros);
}

function postDateDD(id, value) {
	var parametros = {
		"timezone": (new Date()).getTimezoneOffset() / 60 * (-1),
		"id": id,
		"dateValue": value,
		"idExperiment": idExperiment,
		"sessionId": user
	};
	postAJAXDemographicData(parametros);
}

function postAJAXDemographicData(parametros) {
	if (emittingData) {
		$.ajax({
			data: JSON.stringify(parametros),
			url: urlDemographicData,
			type: 'post',
			success: function (response) {
			},
			error: function () {
			}
		});
	}
}

function registeralone_or_together(value) { postStringDD(103, value); } function registereducation_level(value) { postStringDD(104, value); } function registerbirthdate(value) { postDateDD(105, value); } function registergender(value) { postStringDD(106, value); } function registercurrent_mood(value) { postStringDD(107, value); } function registercurrent_location(value) { postStringDD(108, value); } function registercountry_of_origin(value) { postStringDD(109, value); } function registercurrent_occupation(value) { postStringDD(110, value); } function registeronline_subscriptions(value) { postNumberDD(111, value); } function registertech_comfortable(value) { postNumberDD(112, value); } function registercurrent_device(value) { postStringDD(113, value); } function registeruse_confidenty(value) { postNumberDD(114, value); } function registerattractive(value) { postNumberDD(115, value); } function registerpleasing_screen_layout(value) { postNumberDD(116, value); } function registercomplex(value) { postNumberDD(117, value); } function registerappealed_visually(value) { postNumberDD(118, value); } function registerquick_learn_of_system(value) { postNumberDD(119, value); } function registercumbersome(value) { postNumberDD(120, value); } function registerneeded_help(value) { postNumberDD(121, value); } function registertoo_much_inconsistency(value) { postNumberDD(122, value); } function registersystem_ease(value) { postNumberDD(123, value); } function registeraesthically_appealing(value) { postNumberDD(124, value); } function registernice_graphic_images(value) { postNumberDD(125, value); } function registerneed_of_learning(value) { postNumberDD(126, value); } function registerwell_integrated(value) { postNumberDD(127, value); } function registerfrequency_of_use(value) { postNumberDD(128, value); }

$(document).ready(function () {
	$('#startForm').on('submit', function (event) {

		// Prevent the form from being submitted
		event.preventDefault();

		// Loading graphic
		loadingSpinner();

		var gender = $('input[name="gender"]:checked').val();
		var dateVal = $('#birth-date').val();
		var origin = $('select[name="country-of-origin"]').val();
		var education = $('select[name="education"]').val();
		var occupation = $('input[name=current-occupation]:checked').val();
		var location = $('input[name=current_location]:checked').val();
		var setting = $('input[name=setting]:checked').val();
		var mood = $('input[name=current_mood]:checked').val();
		var techExp = $('input[name=tech-comfortable]:checked').val();
		var currentDevice = $('input[name=current-device]:checked').val();
		var subscriptions = $('input[name=online_subscriptions]:checked').val();

		if (!gender || !dateVal || !origin || !education || !occupation || !location || !setting || !mood || !techExp || !currentDevice || !subscriptions) {
			return;
		}

		var date = new Date(dateVal);
		var birthDate = date.toISOString().split('T')[0];

		registergender(gender);
		registerbirthdate(birthDate);
		registercountry_of_origin(origin);
		registereducation_level(education);
		registercurrent_occupation(occupation);
		registercurrent_location(location);
		registeralone_or_together(setting);
		registercurrent_mood(techExp);
		registertech_comfortable(techExp);
		registercurrent_device(currentDevice);
		registeronline_subscriptions(subscriptions);

		finishTracking('video.html');
	});
});

$(document).ready(function () {
	$('#finishForm').on('submit', function (event) {

		// Prevent the form from being submitted
		event.preventDefault();

		// Loading graphic
		loadingSpinner();

		var frequency = $('input[name=frequency_of_use]:checked').val();
		var complex = $('input[name=complex]:checked').val();
		var easeOfUse = $('input[name=system-ease]:checked').val();
		var needHelp = $('input[name="needed_help"]').val();
		var wellIntegrated = $('input[name=well_integrated]:checked').val();
		var inconsistency = $('input[name=too_much_inconsistency]:checked').val();
		var quickLearn = $('input[name=quick_learn_of_system]:checked').val();
		var cumbersome = $('input[name="cumbersome"]').val();
		var confidency = $('input[name=use_confidenty]:checked').val();
		var needLearning = $('input[name="need_of_learning"]:checked').val();
		var attractive = $('input[name=attractive]:checked').val();
		var aestethicallyAppealing = $('input[name=aesthically_appealing]:checked').val();
		var niceImages = $('input[name=nice_graphic_images]:checked').val();
		var visuallyAppealing = $('input[name=appealed_visually]:checked').val();
		var pleasingLayout = $('input[name=pleasing_screen_layout]:checked').val();

		registerneed_of_learning(needLearning);
		registercumbersome(cumbersome);
		registerneeded_help(needHelp);
		registerfrequency_of_use(frequency);
		registertoo_much_inconsistency(inconsistency);
		registercomplex(complex);
		registersystem_ease(easeOfUse);
		registerquick_learn_of_system(quickLearn);
		registerwell_integrated(wellIntegrated);
		registeruse_confidenty(confidency);
		registerattractive(attractive);
		registeraesthically_appealing(aestethicallyAppealing);
		registernice_graphic_images(niceImages);
		registerappealed_visually(visuallyAppealing);
		registerpleasing_screen_layout(pleasingLayout);

		finishExperiment();
		finishTracking('thank-you.html');
	});
});

var checkVariableInterval = setInterval(function() {
  if(window.myGlobalVariable) {
    abTest = window.myGlobalVariable;
    clearInterval(checkVariableInterval);
  }
}, 100);

// If after 5 seconds `window.myGlobalVariable` is not set, assign "A" to `abTest`
setTimeout(function() {
  if(!abTest) {
    abTest = "A";
  }
}, 5000);