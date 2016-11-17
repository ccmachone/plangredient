
var weekPlan = {};

$( document ).ready(function()
{
	getPlanForWeek(1);
	
});

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
		var mealTime = "";

		$('td', this).each(function ()
		{
			var $this = $(this);
			id = label + "_" + (date.getMonth() + 1) +"/"+date.getDate() +  "/" + date.getFullYear();
			$this.attr('id', id);
			if(label !== "")
			{
				if(!(weekPlan[date.getDay()]== undefined) && !(weekPlan[date.getDay()][label]== undefined))
				{
					mealKey = weekPlan[date.getDay()][label][0];
					mealTime = weekPlan[date.getDay()].time;
					mealTitle = recipes_ref.child(mealKey).once("value").then(function(snapShot)
					{
						mealTitle = snapShot.val().name;
				
						mealDiv = "<div>"+mealTitle+"<span onClick = 'unPlanRecipeForMealOnDate("+mealKey+","+label+","+mealTime+")'>   - </span></div><div> + </div>";
						var test = $this.html();
						$this.html(mealDiv);
						console.log("after: "+$(this).html());
					}); 
				}
			}
			
			
			date.setDate(date.getDate() +1);
		})

	})
}


function planRecipeForMealOnDate(recipe_id, meal_enum, date, callback)
{
    var logged_in_user = getLoggedInUser();
    if (logged_in_user['id'] == undefined) {
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
                    if (planned_recipes_objects[key]['date'] == date.getTime() && planned_recipes_objects[key]['meal'] == meal_enum) {
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
                planned_recipe["date"] = date.getTime();
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
        return false;
    } else {
        meal_enum = [MEAL_BREAKFAST, MEAL_LUNCH, MEAL_DINNER].indexOf(meal_enum) === -1 ? MEAL_BREAKFAST : meal_enum;
        date = new Date(date);
        planned_recipes_ref.orderByChild("email").equalTo(logged_in_user['user']['email']).once("value").then(function(snapshot) 
	   {
            planned_recipes_objects = snapshot.val();
            for (var key in planned_recipes_objects) {
                if (planned_recipes_objects.hasOwnProperty(key)) {
                    if (planned_recipes_objects[key]['date'] == date.getTime() && planned_recipes_objects[key]['meal'] == meal_enum && planned_recipes_objects[key]['recipe_ids'].indexOf(recipe_id) !== -1) {
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
        return false;
    } else {
        meal_enum = [MEAL_BREAKFAST, MEAL_LUNCH, MEAL_DINNER].indexOf(meal_enum) === -1 ? MEAL_BREAKFAST : meal_enum;
        date = new Date(date);
        planned_recipes_ref.orderByChild("email").equalTo(logged_in_user['user']['email']).once("value").then(function(snapshot) {
            planned_recipes_objects = snapshot.val();
            for (var key in planned_recipes_objects) {
                if (planned_recipes_objects.hasOwnProperty(key)) {
                    if (planned_recipes_objects[key]['date'] == date.getTime() && planned_recipes_objects[key]['meal'] == meal_enum) {
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
        return false;
    } else {
        date = new Date(date);
        planned_recipes_ref.orderByChild("email").equalTo(logged_in_user['user']['email']).once("value").then(function(snapshot) {
            planned_recipes_objects = snapshot.val();
            for (var key in planned_recipes_objects) {
                if (planned_recipes_objects.hasOwnProperty(key)) {
                    if (planned_recipes_objects[key]['date'] == date.getTime()) {
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
        return false;
    } else {
        var one_day_in_milliseconds = 60 * 60 * 24 * 1000;
        var week_start_day = new Date();
        if (week_number == 1) {
            while (week_start_day.getDay() != 0) {
                week_start_day = new Date(week_start_day.getTime() - one_day_in_milliseconds);
            }
        } else {
            do {
                week_start_day = new Date(week_start_day.getTime() + one_day_in_milliseconds);
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
                    if (planned_recipes_objects[key]['date'] >= week_start_day.getTime() && planned_recipes_objects[key]['date'] < week_start_day.getTime() + one_day_in_milliseconds * 7) {
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