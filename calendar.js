var weekPlan = {};

$( document ).ready(function()
{
	getPlanForWeek(1);
	
	var quickPlanModal = document.getElementById('quickPlanModal');

	$('#planMealSubmit').click(function()
	{
		var date = $("#SelectedMealDate").html();
		var mealTime = $("#SelectedMealMeal").val();
		var recipe_id = getParameterByName("recipe_id","");
		console.log("IN planMealSUbmit");
		planRecipeForMealOnDate(recipe_id,mealTime,date);

	});
	
	$('#quickPlanModalClose').click(function()
	{
		quickPlanModal.style.display="none";
	});
});



function getParameterByName(name, url)
{
	if (!url)
	{
		url = window.location.href;
	}
	name = name.replace(/[\[\]]/g, "\\$&");
	var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
		results = regex.exec(url);
	if (!results) return null;
	if (!results[2]) return '';
	return decodeURIComponent(results[2].replace(/\+/g, " "));
}



/*
	weekNumber as 1 will be the current week.
	weekNumber as 2 will set up dates for next week.
*/
function setCalendarDateIds(tableId, weekNumber)
{
	var label = "";
	var rowCounter = 0;
	var id = "";

	$("#"+tableId+" tr").each(function ()
	{
		rowCounter = rowCounter +1;

		switch(rowCounter)
		{

			case 3:
				label = "breakfast";
				break;

			case 5:
				label = "lunch";
				break;

			case 7:
				label = "dinner";
				break;
			default:
				label = "";
				break;
		}

		var date = new Date();

		if(weekNumber === 2)
		{
			date.setDate(date.getDate() + 7);
		}

		var weekDay = date.getDay();
		date.setDate(date.getDate() - (weekDay));  //Get the month day for this week's monday.
		var mealTitle = "";
		var mealDiv = "";
		var mealKey = "";
		var mealKeys = [];
		var mealTime = "";
		var counter = 0;

		$('td', this).each(function ()
		{
			var $this = $(this);
			var idDatePortion = (date.getMonth() + 1) +"/"+date.getDate() +  "/" + date.getFullYear();
			id = label + "_" + idDatePortion;
			$this.attr('id', id);
			if(label !== "")
			{
				$this.append("<img src='http://images.clipartpanda.com/addition-clipart-green-plus-sign-md.png' style='height: 10px; width: 10px;' onclick='quickAdd(\""+idDatePortion+"\",\""+label+"\")'></img>");
				var innerMealLabel = label;
				if(weekPlan[date.getDay()] != undefined && weekPlan[date.getDay()][innerMealLabel] != undefined)
				{
					mealKeys = weekPlan[date.getDay()][innerMealLabel];
					for(key in mealKeys)
					{
						mealKey = mealKeys[key];
						var cellId = id;
						mealTitle = recipes_ref.child(mealKey).once("value").then(function(snapShot)
						{
							counter = counter +1;
							var testing = snapShot.val();
							var idSplit = cellId.split("_");
							mealTime = idSplit[1];
							mealTitle = snapShot.val().name;
							mealDiv = "<div id = '"+cellId+counter+"'>"+mealTitle+"<img style = 'height: 10px; width: 10px; margin-left: 5px;' src = 'http://vignette4.wikia.nocookie.net/five-nights-at-tubbyland/images/a/a5/X.png/revision/latest?cb=20160216225020' onClick = 'unplanMeal(\""+snapShot.key+"\",\""+innerMealLabel+"\",\""+mealTime+"\",\""+cellId+counter+"\")'></img></div>";

							$this.append(mealDiv);
						});
					}

				}
			}


			date.setDate(date.getDate() +1);
		})

	})
}

function unplanMeal(mealKey, meal, mealTime,cellId)
{
	document.getElementById(cellId).innerHTML = "<div></div>";
	unPlanRecipeForMealOnDate(mealKey, meal, mealTime);
}

//Modal for quick planning-----------------------------------------------------------------------
function quickAdd(date, mealType)
{
	quickPlanModal.style.display = "block";
	
	recipes_ref.orderByChild("name").once("value").then(function(snapshot)
	{
		var displayOptions = "<ul>";
		recipeObjects = snapshot.val();
		for(recipe in recipeObjects)
		{
			displayOptions = displayOptions + "<li>"+recipeObjects[recipe].name+"<button class = 'btn btn-info myBTN' onclick='planRecipeForMealOnDate(\""+recipe+"\",\""+mealType+"\",\""+date+"\"); showCheck(\"check"+recipe+"\")'>Plan</button><img id='check"+recipe+"' class = 'checkDisplayHide' style = 'width: 20px; height: 20px; margin-left: 5px' src='https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcQl4-AIMQ3WLihy27R4RcFjheNTnSi2wzkyuDe8bRb71tl7c75YrOkTt5k'></img>"
		}
		displayOptions = displayOptions + "</ul>";
		$("#quickPlanMealSelection").html(displayOptions);
	})
}

function showCheck(id)
{
	$("#"+id).toggleClass("checkDisplayHide");
}
//-----------------------------------------------------------------------------------------------

function planRecipeForMealOnDate(recipe_id, meal_enum, date, callback)
{
    var logged_in_user = getLoggedInUser();
    if (logged_in_user['id'] == undefined) {
        window.location.href = "account.html";
        return false;
    } else {
        meal_enum = [MEAL_BREAKFAST, MEAL_LUNCH, MEAL_DINNER].indexOf(meal_enum) === -1 ? MEAL_BREAKFAST : meal_enum;
        date = new Date(date);
        planned_recipes_ref.orderByChild("email").equalTo(logged_in_user['user']['email']).once("value").then(function(snapshot) {
            planned_recipes_objects = snapshot.val();
            var planned_recipes_key = false;
            console.log(meal_enum);
            for (var key in planned_recipes_objects) {
                if (planned_recipes_objects.hasOwnProperty(key)) {
                    if (planned_recipes_objects[key]['date'] == date.toDateString() && planned_recipes_objects[key]['meal'] == meal_enum) {
                        planned_recipes_key = key;
                        break;
                    }
                }
            }

            var updated_planned_recipe = {};
            if (planned_recipes_key == false) {
                planned_recipes_key = planned_recipes_ref.push().key;
                var planned_recipe = {};
                planned_recipe["email"] = logged_in_user['user']['email'];
                planned_recipe["date"] = date.toDateString();
                planned_recipe['meal'] = meal_enum;
                planned_recipe['recipe_ids'] = [recipe_id];
                updated_planned_recipe[planned_recipes_table_name + "/" + planned_recipes_key] = planned_recipe;
            } else {
                planned_recipes_objects[planned_recipes_key]['recipe_ids'] = planned_recipes_objects[planned_recipes_key]['recipe_ids'] == undefined ? [] : planned_recipes_objects[planned_recipes_key]['recipe_ids'];
                planned_recipes_objects[planned_recipes_key]['recipe_ids'].push(recipe_id);
                updated_planned_recipe[planned_recipes_table_name + "/" + planned_recipes_key] = planned_recipes_objects[planned_recipes_key];
            }
            result = firebase.database().ref().update(updated_planned_recipe);
            if (callback == undefined) {
                callback = "planRecipeForMealOnDateResult";
                window[callback](result);
            } else {
                callback(result);
            }
        })
    }
}

function planRecipeForMealOnDateResult(promise)
{
    console.log(promise);
}

function unPlanRecipeForMealOnDate(recipe_id, meal_enum, date, callback)
{
    var logged_in_user = getLoggedInUser();
    if (logged_in_user['id'] == undefined) {
        window.location.href = "account.html";
        return false;
    } else {
        meal_enum = [MEAL_BREAKFAST, MEAL_LUNCH, MEAL_DINNER].indexOf(meal_enum) === -1 ? MEAL_BREAKFAST : meal_enum;
        date = new Date(date);
        planned_recipes_ref.orderByChild("email").equalTo(logged_in_user['user']['email']).once("value").then(function(snapshot)
	   {
            planned_recipes_objects = snapshot.val();
            for (var key in planned_recipes_objects) {
                if (planned_recipes_objects.hasOwnProperty(key)) {
				 var test = date.toDateString();
				 var test2 = planned_recipes_objects[key]['meal'];
                    if (planned_recipes_objects[key]['date'] == date.toDateString() && planned_recipes_objects[key]['meal'] == meal_enum && planned_recipes_objects[key]['recipe_ids'].indexOf(recipe_id) !== -1) {
                        var updated_planned_recipe = {};
                        planned_recipes_objects[key]['recipe_ids'].splice(planned_recipes_objects[key]['recipe_ids'].indexOf(recipe_id), 1);
                        updated_planned_recipe[planned_recipes_table_name + "/" + key + "/recipe_ids"] = planned_recipes_objects[key]['recipe_ids'];
                        result = firebase.database().ref().update(updated_planned_recipe);
                        if (callback == undefined) {
                            callback = "unPlanRecipeForMealOnDateResult";
                            window[callback](result);
                        } else {
                            callback(result);
                        }
                    }
                }
            }
        })
    }
}

function unPlanRecipeForMealOnDateResult(promise)
{
    console.log(promise);
}

function unPlanAllRecipesForMealOnDate(meal_enum, date, callback)
{
    var logged_in_user = getLoggedInUser();
    if (logged_in_user['id'] == undefined) {
        window.location.href = "account.html";
        return false;
    } else {
        meal_enum = [MEAL_BREAKFAST, MEAL_LUNCH, MEAL_DINNER].indexOf(meal_enum) === -1 ? MEAL_BREAKFAST : meal_enum;
        date = new Date(date);
        planned_recipes_ref.orderByChild("email").equalTo(logged_in_user['user']['email']).once("value").then(function(snapshot) {
            planned_recipes_objects = snapshot.val();
            for (var key in planned_recipes_objects) {
                if (planned_recipes_objects.hasOwnProperty(key)) {
                    if (planned_recipes_objects[key]['date'] == date.toDateString() && planned_recipes_objects[key]['meal'] == meal_enum) {
                        var updated_planned_recipe = {};
                        updated_planned_recipe[planned_recipes_table_name + "/" + key] = null;
                        result = firebase.database().ref().update(updated_planned_recipe);
                        if (callback == undefined) {
                            callback = "unPlanAllRecipesForMealOnDateResult";
                            window[callback](result);
                        } else {
                            callback(result);
                        }
                    }
                }
            }
        })
    }
}

function unPlanAllRecipesForMealOnDateResult(promise)
{
    console.log(promise);
}

function unPlanAllRecipesOnDate(date, callback)
{
    var logged_in_user = getLoggedInUser();
    if (logged_in_user['id'] == undefined) {

        window.location.href = "account.html";
        return false;
    } else {
        date = new Date(date);
        planned_recipes_ref.orderByChild("email").equalTo(logged_in_user['user']['email']).once("value").then(function(snapshot) {
            planned_recipes_objects = snapshot.val();
            for (var key in planned_recipes_objects) {
                if (planned_recipes_objects.hasOwnProperty(key)) {
                    if (planned_recipes_objects[key]['date'] == date.toDateString()) {
                        var updated_planned_recipe = {};
                        updated_planned_recipe[planned_recipes_table_name + "/" + key] = null;
                        result = firebase.database().ref().update(updated_planned_recipe);
                        if (callback == undefined) {
                            callback = "unPlanAllRecipesOnDateResult";
                            window[callback](result);
                        } else {
                            callback(result);
                        }
                    }
                }
            }
        })
    }
}

function unPlanAllRecipesOnDateResult(promise)
{
    console.log(promise);
}

function getPlanForWeek(week_number, callback)
{
    var logged_in_user = getLoggedInUser();
    if (logged_in_user['id'] == undefined) {
        window.location.href = "account.html";
        return false;
    } else {
        var one_day_in_milliseconds = 60 * 60 * 24 * 1000;
        var week_start_day = new Date();
        if (week_number == 1) {
            while (week_start_day.getDay() != 0) {
                // week_start_day = new Date(week_start_day.getTime() - one_day_in_milliseconds);
                week_start_day.setTime(week_start_day.getTime() - one_day_in_milliseconds);
            }
        } else {
            do {
                // week_start_day = new Date(week_start_day.getTime() + one_day_in_milliseconds);
                week_start_day.setTime(week_start_day.getTime() + one_day_in_milliseconds);
            } while (week_start_day.getDay() != 0);
        }
        week_start_day.setHours(0);
        week_start_day.setMinutes(0);
        week_start_day.setSeconds(0);
        week_start_day.setMilliseconds(0);

        planned_recipes_ref.orderByChild("email").equalTo(logged_in_user['user']['email']).once("value").then(function(snapshot) {
            planned_recipes_objects = snapshot.val();
            var week_plan = {};
            for (var key in planned_recipes_objects) {
                if (planned_recipes_objects.hasOwnProperty(key)) {
                    var planned_recipe_date = new Date(planned_recipes_objects[key]['date']);
                    if (planned_recipe_date.getTime() >= week_start_day.getTime() && planned_recipe_date.getTime() < week_start_day.getTime() + one_day_in_milliseconds * 7) {
                        var temp_date = new Date(planned_recipes_objects[key]['date']);
                        if (week_plan[temp_date.getDay()] == undefined) {
                            week_plan[temp_date.getDay()] = {};
					   week_plan[temp_date.getDay()].time = planned_recipes_objects[key]['date'];
                        }
                        week_plan[temp_date.getDay()][planned_recipes_objects[key]['meal']] = planned_recipes_objects[key]['recipe_ids'];
                    }
                }
            }
            if (callback == undefined) {
                callback = "getPlanForWeekResult";
                window[callback](week_plan);
            } else {
                callback(week_plan);
            }
        })
    }
}

function getPlanForWeekResult(week_plan)
{
	weekPlan = week_plan;
	setCalendarDateIds("calendarWeek1",1);
	setCalendarDateIds("calendarWeek2",2);
    console.log(week_plan);
}