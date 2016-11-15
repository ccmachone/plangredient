
$( document ).ready(function()
{
	setCalendarDateIds("calendarWeek1",0);
	setCalendarDateIds("calendarWeek2",7);
});

/*
	Pass in the id for the table, and the dateOffset will be how many days into the future from the current date you want the first day to be on the table.
	EX:  IF you want to make a calendar with today as the first day, pass in 0 for dateOffset.  If you want a table for next week from today, pass in 7.  Etc. 
*/
function setCalendarDateIds(tableId, dateOffset)
{
	var meal = "";
	var rowCounter = 0;
	var id = "";
	
	$("#"+tableId+" tr").each(function ()
	{
		rowCounter = rowCounter +1;
		
		switch(rowCounter)
		{
			case 3: 
				meal = "breakfast";
				break;
			case 5:
				meal = "lunch";
				break;
			case 7:
				meal = "dinner";
				break;
			default:
				meal = "";
				break;
		}
		
		var date = new Date();
		date.setDate(date.getDate() +dateOffset);
		
		$('td', this).each(function () 
		{
			id = meal + "_" + date.getDate() +"/"+date.getMonth() +  "/" + date.getYear()
			$(this).attr('id', id);
			
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
        planned_recipes_ref.orderByChild("email").equalTo(logged_in_user['user']['email']).once("value").then(function(snapshot) {
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