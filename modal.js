

$( document ).ready(function()
{

		// Get the modal
	var modal = document.getElementById('planningModal');

	// Get the button that opens the modal
	var btn = document.getElementById("plan");

	// Get the <span> element that closes the modal
	var span = document.getElementsByClassName("close")[0];

	// Get the <button> element that closes and saves the date to plan the modal
	var spansave = document.getElementsByClassName("saveday")[0];

	// When the user clicks on the button, open the modal
	btn.onclick = function() {
	    modal.style.display = "block";
	}

	// When the user clicks on <span> (x), close the modal
	span.onclick = function() {
	    modal.style.display = "none";
	}

	// When the user clicks on <span> (plan), close the modal
	spansave.onclick = function() {
	    modal.style.display = "none";
        jQuery.notify("Planned meal!", "success");
	}


	// When the user clicks anywhere outside of the modal, close it
	window.onclick = function(event) {
	    if (event.target == modal) {
		   modal.style.display = "none";
	    }
	}

	var days=["Sunday", "Monday", "Tueday", "Wednesday", "Thursday", "Friday", "Saturday"];
	var months=["January", "February", "March", "April", "May", "June", "July", "August",
					"September", "October", "November", "December"];

	var date = new Date();
	var weekDay = date.getDay();
	date.setDate(date.getDate() - (weekDay));
	jQuery("#Sun").html(days[date.getDay()]+ " "+months[date.getMonth()]+ " "+date.getDate());

	var date1=new Date();
	date1.setDate(date1.getDate()-(weekDay) + 1);
	jQuery("#Mon").html(days[date1.getDay()]+ " "+months[date1.getMonth()]+ " "+date1.getDate());

	var date2=new Date();
	date2.setDate(date2.getDate() - (weekDay) + 2);
	jQuery("#Tues").html(days[date2.getDay()]+ " "+months[date2.getMonth()]+ " "+date2.getDate());

	var date3=new Date();
	date3.setDate(date3.getDate() - (weekDay) + 3);
	jQuery("#Wed").html(days[date3.getDay()]+ " "+months[date3.getMonth()]+ " "+date3.getDate());

	var date4=new Date();
	date4.setDate(date4.getDate() - (weekDay)+ 4);
	jQuery("#Thurs").html(days[date4.getDay()]+ " "+months[date4.getMonth()]+ " "+date4.getDate());

	var date5=new Date();
	date5.setDate(date5.getDate() - (weekDay)+ 5);
	jQuery("#Fri").html(days[date5.getDay()]+ " "+months[date5.getMonth()]+ " "+date5.getDate());

	var date6=new Date();
	date6.setDate(date6.getDate()- (weekDay) + 6);
	jQuery("#Sat").html(days[date6.getDay()]+ " "+months[date6.getMonth()]+ " "+date6.getDate());

	Sun.onclick=function() {
		jQuery("#SelectedMealDate").html(date);
	}
	Mon.onclick=function() {
		jQuery("#SelectedMealDate").html(date1);
	}
	Tues.onclick=function() {
		jQuery("#SelectedMealDate").html(date2);
	}
	Wed.onclick=function() {
		jQuery("#SelectedMealDate").html(date3);
	}
	Thurs.onclick=function() {
		jQuery("#SelectedMealDate").html(date4);
	}
	Fri.onclick=function() {
		jQuery("#SelectedMealDate").html(date5);
	}
	Sat.onclick=function() {
		jQuery("#SelectedMealDate").html(date6);
	}

});

