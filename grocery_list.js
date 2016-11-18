jQuery(document).ready(function(){
	$(".check_del").hide();
    getGroceries(buildGroceryList);
    $(".delete").click(function() {
    	$(this).siblings(".check_del").show();
    });
    $(".yes").click(function() {
        console.log(".check_del".parent);
        $(this).parent(".check_del").parent().hide();
    });
    $(".cancel").click(function() {
        $(this).parent(".check_del").hide();
    });

});



function printDiv() {    
    $(".heading").hide();
    $("#print_list").hide();

     print();
     $(".heading").show();
     $("#print_list").show();
    }

function buildGroceryList(grocery_list, planned_recipes)
{
    console.log(grocery_list);
    console.log(planned_recipes);
}


/**
 * Returns an object with all groceries needed ***in the future*** (including today)
 * @param callback
 * @returns {boolean}
 */
function getGroceries(callback)
{
    var logged_in_user = getLoggedInUser();
    if (logged_in_user['id'] == undefined) {
        return false;
    } else {
        var today = new Date();
        today.setHours(0);
        today.setMinutes(0);
        today.setSeconds(0);
        today.setMilliseconds(0);

        planned_recipes_ref.orderByChild("email").equalTo(logged_in_user['user']['email']).once("value").then(function(snapshot) {
            planned_recipes_objects = snapshot.val();
            var planned_recipe_ids = {};
            for (var key in planned_recipes_objects) {
                if (planned_recipes_objects.hasOwnProperty(key)) {
                    if (planned_recipes_objects[key]['date'] >= today.getTime()) {
                        for (var temp_key in planned_recipes_objects[key]['recipe_ids']) {
                            if (planned_recipes_objects[key]['recipe_ids'].hasOwnProperty(temp_key)) {
                                recipe_id = planned_recipes_objects[key]['recipe_ids'][temp_key];
                                planned_recipe_ids[recipe_id] = planned_recipe_ids[recipe_id] == undefined ? 1 : planned_recipe_ids[recipe_id] + 1;
                            }
                        }
                    }
                }
            }
            var grocery_list = {};
            var planned_recipes = [];
            recipes_ref.once("value").then(function(snapshot){
                recipes_objects = snapshot.val();
                for (var recipe_id in recipes_objects) {
                    if (recipes_objects.hasOwnProperty(recipe_id)) {
                        if (planned_recipe_ids[recipe_id] != undefined) {
                            planned_recipes.push({"id" : recipe_id, "recipe" : recipes_objects[recipe_id]});
                            for (var ingredient_index in recipes_objects[recipe_id]['ingredients']) {
                                if (recipes_objects[recipe_id]['ingredients'].hasOwnProperty(ingredient_index)) {
                                    var ingredient_name = recipes_objects[recipe_id]['ingredients'][ingredient_index]['name'];
                                    var ingredient_quantity = recipes_objects[recipe_id]['ingredients'][ingredient_index]['quantity'];
                                    var ingredient_unit = recipes_objects[recipe_id]['ingredients'][ingredient_index]['unit'];
                                    grocery_list[ingredient_name] = grocery_list[ingredient_name] == undefined ? {} : grocery_list[ingredient_name];
                                    grocery_list[ingredient_name][ingredient_unit] = grocery_list[ingredient_name][ingredient_unit] == undefined ? 0 : grocery_list[ingredient_name][ingredient_unit];
                                    grocery_list[ingredient_name][ingredient_unit] += ingredient_quantity * planned_recipe_ids[recipe_id];
                                }
                            }
                        }
                    }
                }
            });
            if (callback == undefined) {
                callback = "getGroceriesResult";
                window[callback](grocery_list, planned_recipes);
            } else {
                callback(grocery_list, planned_recipes);
            }
        })
    }
}

function getGroceriesResult(grocery_list, planned_recipes)
{
    console.log(grocery_list);
    console.log(planned_recipes);
}

