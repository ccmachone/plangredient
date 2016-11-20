jQuery(document).ready(function(){
    getGroceries();
});

jQuery(document).on("click", ".delete", function(){
    jQuery(this).siblings(".check_del").show();
});

jQuery(document).on("click", ".yes", function(){
    jQuery(this).parent(".check_del").parent().hide();
});

jQuery(document).on("click", ".cancel", function(){
    jQuery(this).parent().hide();
})

jQuery(document).on("submit", "grocery_list_items", function(e){
    e.stopPropagation();
    e.preventDefault();
});



function printDiv()
{
    $(".heading").hide();
    $("#print_list").hide();
    jQuery(".non_printable").hide();
    jQuery(".printable").show();
    jQuery(".check_del").hide();

    print();
    $(".heading").show();
    $("#print_list").show();
    jQuery(".non_printable").show();
    jQuery(".printable").hide();
}

function buildGroceryList(grocery_list, planned_recipes)
{
    var list_items_html = "";
    for (var ingredient_name in grocery_list) {
        if (grocery_list.hasOwnProperty(ingredient_name)) {
            for (var ingredient_measurement in grocery_list[ingredient_name]){
                if (grocery_list[ingredient_name].hasOwnProperty(ingredient_measurement)) {
                    ingredient_amount = grocery_list[ingredient_name][ingredient_measurement];
                    list_items_html += "<div class='form-group'>";
                    list_items_html += "<label class='col-sm-6 control-label'>" + ingredient_name + " (" + ingredient_measurement + ")</label>";
                    list_items_html += "<div class='col-sm-2'>";
                    list_items_html += "<input type='number' class='form-control' value='" + ingredient_amount + "' step='1' min='0' style='max-width:100px;'/>";
                    list_items_html += "</div>";
                    list_items_html += "<div class='col-sm-2 non_printable'>";
                    list_items_html += "<button class='delete non_printable'>x</button>";
                    list_items_html += "<div class='check_del'>Remove?";
                    list_items_html += "<button class='yes'>Yes</button>";
                    list_items_html += "<button class='cancel'>Cancel</button>";
                    list_items_html += "</div>";
                    list_items_html += "</div>";
                    list_items_html += "</div>";
                    break;
                }
            }
        }
    }
    jQuery("#grocery_list_items").html(list_items_html);
    $(".check_del").hide();

    list_items_html = "";
    for (var key in planned_recipes) {
        if (planned_recipes.hasOwnProperty(key)) {
            list_items_html += "<li><span class='printable' style='display:none;'>" + planned_recipes[key]['recipe']['name'] + "</span><a class='non_printable' href='recipe_display.html?recipe_id=" + planned_recipes[key]['id'] + "'>" + planned_recipes[key]['recipe']['name'] + "</a></li>";
        }
    }
    jQuery("#meal_list_items").html(list_items_html);
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
        console.log("false");
        window.location.href = "account.html";
        return false;
    } else {
        var today = new Date();
        today.setHours(0);
        today.setMinutes(0);
        today.setSeconds(0);
        today.setMilliseconds(0);

        planned_recipes_ref.orderByChild("email").equalTo(logged_in_user['user']['email']).once("value").then(function(snapshot) {
            console.log("working...");
            planned_recipes_objects = snapshot.val();
            var planned_recipe_ids = {};
            for (var key in planned_recipes_objects) {
                if (planned_recipes_objects.hasOwnProperty(key)) {
                    var planned_recipe_date = new Date(planned_recipes_objects[key]['date']);
                    if (planned_recipe_date.getTime() >= today.getTime()) {
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
            console.log("still working...");
            recipes_ref.once("value").then(function(snapshot){
                console.log("still working...");
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
                console.log("still working...");
                buildGroceryList(grocery_list, planned_recipes);
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