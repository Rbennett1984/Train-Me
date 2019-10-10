let WORKOUT_URL = 'workout';
let JOURNAL_URL = 'journal';
let user = localStorage.getItem('currentUser');
let date = new Date();

function getWorkout() {
	console.log('Getting workout info')
	let authToken = localStorage.getItem('authToken');
	$.ajax({
		method: 'GET',
		url: `${WORKOUT_URL}/user/${user}`,
		headers: {
			Authorization: `Bearer ${authToken}`
		},
		contentType: 'application/json',
		success: function(userData) {
			console.log(userData);
			showWorkoutResults(userData);
		}
	});
}

function getJournal() {
	console.log('Getting journal info')
	let authToken = localStorage.getItem('authToken');
	$.ajax({
		method: 'GET',
		url: `${JOURNAL_URL}/user/${user}`,
		headers: {
			Authorization: `Bearer ${authToken}`
		},
		contentType: 'application/json',
		success: function(userData) {
			console.log(userData);
			showJournalResults(userData);
		}
	});
}

function showWorkoutResults(workoutArray) {
	$('#showName').html(user);
	let buildWorkoutList = "";

	$.each(workoutArray, function (workoutArrayKey, workoutArrayValue) {
		buildWorkoutList += `<div class="workoutItem" data-id=${workoutArrayValue._id}>` 
		buildWorkoutList += `<p class="workoutName">${workoutArrayValue.name}</p>`
		buildWorkoutList += `<div class="workoutInfo" style="display:none">` 
		buildWorkoutList += `<p class="startDate">Started: ${workoutArrayValue.startDate}</p>` 
		buildWorkoutList += `<p class="finshDate">Finished: ${workouttArrayValue.harvestDate}</p>` 
		buildWorkoutList+= `<p class="workoutComments">Comments: ${workoutArrayValue.comments}</p>` 
		buildWorkoutList += `<button type="submit" class="updateWorkout homePageButtons">Update</button>`
		buildWorkoutList += `<button type="submit" class="deleteWorkout homePageButtons">Delete</button>`
		buildWorkoutList += `</div>` 
		buildWorkoutList += `</div>`
		
		$('.workoutListSection').html(buildWorkoutList);
	});
}

function showJournalResults(journalArray) {
	let buildJournal = "";

	$.each(journalArray, function(journalArrayKey, journalArrayValue) {
		buildJournal += `<div class="journalItem" data-id=${journalArrayValue._id}>`
		buildJournal += `<p class="journalDateAndTime">${journalArrayValue.publishDate}</p>`
		buildJournal += `<div class="journalInfo" style="display:none">`
		buildJournal += `<p class="journalContent">${journalArrayValue.content}</p>`
		buildJournal += `<button type="submit" class="updateJournal homePageButtons">Update</button>`
		buildJournal += `<button type="submit" class="deleteJournal homePageButtons">Delete</button>`
		buildJournal += `</div>`
		buildJournal += `</div>`
	
		$('.journalSection').html(buildJournal);
	})
}

function addWorkout(plant) {
	console.log('Adding workout' + workout);
	let authToken = localStorage.getItem('authToken');
	$.ajax({
		method: 'POST',
		url: WORKOUT_URL,
		headers: {
			Authorization: `Bearer ${authToken}`
		},
		data: JSON.stringify(workout),
		success: function(data) {
			getWorkout(data);
		},
		error: function(err) {
			console.log(err);
		},
		dataType: 'json',
		contentType: 'application/json'
	});
}

function addJournalEntry(journalPosts) {
	console.log('Adding journal post' + journalPosts);
	let authToken = localStorage.getItem('authToken');
	$.ajax({
		method: 'POST',
		url: JOURNAL_URL,
		headers: {
			Authorization: `Bearer ${authToken}` 
		},
		data: JSON.stringify(journalPosts),
		success: function(data) {
			console.log(data);
			getJournal(data);
		},
		error: function(err) {
			console.log(err);
		},
		dataType: 'json',
		contentType: 'application/json'
	});
}

function updateWorkoutForm(id, element) {
	let authToken = localStorage.getItem('authToken');
	$.ajax({
		method: 'GET',
		url: `${WORKOUT_URL}/${id}`,
		headers: {
			Authorization: `Bearer ${authToken}`
		},
		contentType: 'application/json',
		success: function(workoutData) {
			console.log(workoutData);

			let updateTemplate = `
				<form class="row updateWorkoutSection" data-id=${id}>
					<h2>Update training record</h2><br>
					<label for="updateWorkoutName">Workout:</label>
					<input type="text" name="updateWorkoutName" class="updateWorkoutName" value=${workoutData.name}>
					<label for="updateStartDate">Start Date:</label>
					<input type="text" name="updateStartDate" class="updateStartDate" value=${workoutData.startDate}>
					<label for="updateHarvestDate">Finish Date:</label>
					<input type="text" name="updateFinishDate" class="updateFinishDate" value=${workoutData.finishDate}>
					<label for="updateComments">Comments:</label>
					<input type="text" name="updateComments" class="updateComments" value=${workoutData.comments}>
					<button type="submit" id="updateWorkoutInfo" class="homePageButtons">Update it!</button>
				</form>`
			$(element).find(".workoutInfo").hide();
			$(element).after(updateTemplate);
		}
	});
}

function updateJournalForm(id, element) {
	let authToken = localStorage.getItem('authToken');
	$.ajax({
		method: 'GET',
		url: `${JOURNAL_URL}/${id}`,
		headers: {
			Authorization: `Bearer ${authToken}`
		},
		contentType: 'application/json',
		success: function(journalData) {
			console.log(journalData);

			let updateJournalTemplate = `
				<form class="row updateJournalSection" data-id=${id}>
					<label for="newJournalEntry">What's new today?</label>
					<input type="text" name="updateJournalEntry" class="updateJournalEntry" placeholder="Write something!" required value=${journalData.content}>
					<button type="submit" id="updateJournalInfo" class="homePageButtons">Update it!</button>
				</form>`
			$(element).find(".journalInfo").hide();
			$(element).after(updateJournalTemplate);
		}
	});
}	

function updateWorkout(id, workout) {
	console.log(`Updating workout ${id}`);
	let authToken = localStorage.getItem('authToken');
	$.ajax({
		url: WORKOUT_URL + '/' + id,
		headers: {
			Authorization: `Bearer ${authToken}`
		},
		method: 'PUT',
		dateType: 'json',
		contentType: 'application/json',
		data: JSON.stringify(workout),
		success: function(data) {
			getWorkout(data);
		},
		error: function(err) {
			console.log(err);
		}
	});
}

function updateJournal(id, journalPosts) {
	console.log(`Updating journal entry ${id}`);
	let authToken = localStorage.getItem('authToken');
	$.ajax({
		url: JOURNAL_URL + '/' + id,
		headers: {
			Authorization: `Bearer ${authToken}`
		},
		method: 'PUT',
		dataType: 'json',
		contentType: 'application/json',
		data: JSON.stringify(journalPosts),
		success: function(data) {
			getJournal(data);
		},
		error: function(err) {
			console.log(err);
		}
	});
}

function deleteWorkout(id) {
	console.log(`Deleting workout ${id}`);
	let authToken = localStorage.getItem('authToken');
	$.ajax({
		url: WORKOUT_URL + '/' + id,
		headers: {
			Authorization: `Bearer ${authToken}`
		},
		method: 'DELETE',
		success: function(data) {
			getWorkout(data);
		},
		error: function(err) {
			console.log(err);
		}
	});
}

function deleteJournalEntry(id) {
	console.log(`Deleting journal entry ${id}`);
	let authToken = localStorage.getItem('authToken');
	$.ajax({
		url: JOURNAL_URL + '/' + id,
		headers: {
			Authorization: `Bearer ${authToken}`
		},
		method: 'DELETE',
		success: function(data) {
			getJournal(data);
		},
		error: function(err) {
			console.log(err);
		}
	});
}

function handleWorkoutAdd() {
	$('#addWorkoutSection').submit(function(e) {
	    e.preventDefault();
	    addWorkout({
	    	user: user,
	    	name: $(e.currentTarget).find('#addWorkoutName').val(),
	    	startDate: $(e.currentTarget).find('#addStartDate').val(),
	    	finishDate: $(e.currentTarget).find('#addFinishDate').val(),
	    	comments: $(e.currentTarget).find('#addComments').val()
	    });
	    $("#addWorkoutSection input[type='text']").val('');
	    $(".updateWorkoutSection").hide();
		$("#addWorkoutSection").hide();
		$("#cancel-add-workout").hide();
		$(".workoutListSection").show();
  });
}

function handleJournalAdd() {
	$("#addJournalSection").submit(function(e) {
		e.preventDefault();
		addJournalEntry({
			user: user,
			content: $(e.currentTarget).find('#newJournalEntry').val(),
			publishDate: date.toDateString()
		});
		$("#addJournalSection input[type='text']").val('');
		$("#addJournalSection").hide();
		$(".updateJournalSection").hide();
		$("#cancel-journal-entry").hide();
		$(".journalSection").show();
	})
}

function handleWorkoutUpdate() {
	$('#updateWorkoutInfo').on('click', function(e) {
		console.log('you updated your workout!');
		e.preventDefault();
		updateWorkout({
			user: user,
			name: $(e.currentTarget).find('.updateWorkoutName').val(),
			startDate: $(e.currentTarget).find('.updateStartDate').val(),
			FinishDate: $(e.currentTarget).find('.updateFinishDate').val(),
			comments: $(e.currentTarget).find('.updateComments').val(),
		});
		$(".updateWorkoutSection").hide();
		$("#addWorkoutSection").hide();
		$("#workoutListSection").show();
	});
}

function handleJournalUpdate() {
	$("#updateJournal").on('click', function(e) {
		alert('you updated your journal!');
		e.preventDefault();
		updateJournal({
			user: user,
			content: $(e.currentTarget).find('.updateJournalEntry').val(),
			publishDate: date.toDateString()
		});
		$("updateJournalForm").hide();
		$("addJournalSection").hide();
		$("journalSection").show();
	})
}

function handleWorkoutDelete() {
	$('.workoutListSection').on('click', '.deleteWorkout', function(e) {
		e.preventDefault();
		deleteWorkout(
			$(e.currentTarget).closest('.WorkoutItem').attr('data-id'));
	});
}

function handleJournalDelete() {
	$(".journalSection").on('click', '.deleteJournal', function(e) {
		e.preventDefault();
		deleteJournalEntry(
			$(e.currentTarget).closest('.journalItem').attr('data-id'));
	})
}

$(document).ready(function() {

	$("#login-page").hide();
	$("#register-page").hide();
	$(".login-section").show();
	$(".detail-section").show();

	$("#login-button").click(function() {
		$("#register-page").hide();
		$(".login-section").hide();
		$(".detail-section").hide();
		$("#login-page").show();
	})

	$("#register-link").click(function() {
		$("#login-page").hide();
		$(".login-section").hide();
		$(".detail-section").hide();
		$("#register-page").show();
	}) 

	$("#register-button").click(function() {
		$("#login-page").hide();
		$(".login-section").hide();
		$(".detail-section").hide();
		$("#register-page").show();
	})

	$("#loginForm").submit(function(e) {
		e.preventDefault();
		let username = $("#GET-username").val();
		let password = $("#GET-password").val();
		let userInfo = {username, password};
		let settings = {
			url:"/auth/login",
			type: 'POST',
			contentType: 'application/json',
			data: JSON.stringify(userInfo),
			success: function(data) {
				console.log('successfully logged in');
				localStorage.setItem("authToken", data.authToken);
				localStorage.setItem("currentUser", username);
				user = username;
				$("#login-page").hide();
				$("#register-page").hide();
				$(".login-section").hide();
				$(".detail-section").hide();
				$(".home").show();
				$(".logout").show();
				$(".workoutDetails").show();
				console.log(data);
				getGarden(data);
				getJournal(data);
			},
			error: function(err) {
				console.log(err);
			}
		};
		$.ajax(settings);
	}) 

	$("#registerForm").submit(function(e) {
		e.preventDefault();
		let username = $("#POST-username").val();
		console.log('client-side username is:', username);
		let password = $("#POST-password").val();
		let retypePass = $("#retype-password").val();
		let user = {username, password};
		let settings = {
			url:"/users/",
			type: 'POST',
			contentType: 'application/json',
			data: JSON.stringify(user),
			success: function(data) {
				console.log('successfully registered');
				$("#registerForm input[type='text']").val('');
				$("#register-page").hide();
				$(".login-section").hide();
				$(".detail-section").hide();
				$("#login-page").show();
			},
			error: function(err) {
				console.log(err);
				if (password.length < 10) {
					$("#errorTenChar").html("Password must be at least 10 characters")
				}
				if (password.length !== retypePass.length) {
					$("#errorMatchPass").html("Passwords must match")
				}
				if (password !== retypePass) {
					$("#errorMatchPass").html("Passwords must match")
				}
			}
		};
		$.ajax(settings);
	})

	$(".updateWorkoutSection").hide();
	$("#addWorkoutSection").hide();
	$(".workoutListSection").show();

	$("body").on("click", ".workoutName", function() {
		console.log("you clicked the workout name");
		event.preventDefault();
		$(this).parent().find(".workoutInfo").slideToggle(300);
	});

	$("body").on("click", ".journalDateAndTime", function() {
		console.log("you clicked the date and time");
		event.preventDefault();
		$(this).parent().find(".journalInfo").slideToggle(300);
	})

	$("body").on("click", ".updateWorkout", function() {
		console.log('you clicked update!!');
		let workout = $(this).parent().parent();
		let id = $(this).parent().parent().attr("data-id");
		console.log(id);
		updateWorkoutForm(id, workout);
	})

	$("body").on("click", ".updateJournal", function() {
		console.log('you clicked update journal!')
		let journalEntry = $(this).parent().parent();
		console.log(journalEntry);
		let id = $(this).parent().parent().attr("data-id");
		console.log(id);
		updateJournalForm(id, journalEntry);
	})

	$("body").on("submit", ".updateWorkoutSection", function(e) {
		e.preventDefault();
		let id = $(this).attr("data-id")
		console.log(`you submitted updateWorkoutSection for ${id}`);
		let updatedWorkout = {
			id: id,
			name: $('.updateWorkoutName').val(),
			startDate: $('.updateStartDate').val(),
			finishDate: $('.updateFinishDate').val(),
			comments: $('.updateComments').val(),
		}
		updateWorkout(id, updatedWorkout);
		console.log("workout updated")
	})

	$("body").on("submit", ".updateJournalSection", function(e) {
		e.preventDefault();
		let id = $(this).attr("data-id")
		console.log(`you submitted updateJournalSection for ${id}`);
		let updatedJournal = {
			id: id,
			content: $('.updateJournalEntry').val(),
			publishDate: date.toDateString()
		}
		updateJournal(id, updatedJournal);
		console.log("journal updated")
	})

	$("#cancel-add-workout").click(function() {
		$("#addWorkoutSection input[type='text']").val('');
		$("#addWorkoutSection").hide();
		$("#cancel-add-workout").hide();
	})

	$("#add-workout").click(function() {
		$(".updateWorkoutSection").hide();
		$("#cancel-add-workout").show();
		$("#workoutListSection").show();
		$("#addWorkoutSection").show();
	})

	$("#cancel-journal-entry").click(function() {
		$("#addJournalSection input[type='text']").val('');
		$("#addJournalSection").hide();
		$("#cancel-journal-entry").hide();
	})

	$("#add-journal-entry").click(function() {
		$("#cancel-journal-entry").show();
		$("#addJournalSection").show();
	})

	$(".logout").click(function() {
		console.log('you clicked logout!');
		localStorage.clear();
		user = null;
		window.location.reload(true);
	});

	$(function() {
		handleWorkoutAdd();
		handleJournalAdd();
		handleWorkoutUpdate();
		handleJournalUpdate();
		handleWorkoutDelete();
		handleJournalDelete();
	});
})
plant