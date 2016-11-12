function addRecipe(recipe, callback)
{
    var temp = recipes_ref.orderByChild("name").equalTo(recipe['name']).on("value", function(snapshot) {
        recipes_ref.off("value", temp);
        existing_recipes = snapshot.val();
        var recipe_key = false;
        for (var key in existing_recipes) {
            if (existing_recipes.hasOwnProperty(key)) {
                var existing_recipe = existing_recipes[key];
                if (isEquivalent(existing_recipe['ingredients'], recipe['ingredients']) && existing_recipe['directions'] == recipe['directions'] && existing_recipe['prep_time'] == recipe['prep_time'] && existing_recipe['image'] == recipe['image']) {
                    recipe_key = key;
                    break;
                }
            }
        }
        if (recipe_key === false) {
            return_value = recipes_ref.push(recipe);
            recipe_key = return_value.key;
            for (var key in recipe['ingredients']) {
                if (recipe['ingredients'].hasOwnProperty(key)) {
                    associateIngredientNameWithRecipeIds(recipe['ingredients'][key]['name'], [recipe_key]);
                }
            }
        }
        if (callback == undefined) {
            callback = "addRecipeResult";
            window[callback](recipe_key);
        } else {
            callback(recipe_key);
        }
    })
}

function addRecipeResult(recipe_key)
{
    console.log(recipe_key);
}

function associateIngredientNameWithRecipeIds(ingredient_name, recipe_ids, callback)
{
    if (callback == undefined) {
        callback = "associateIngredientNameWithRecipeIdsResult";
    }

    ingredient_name_to_recipe_ids_ref.orderByChild("ingredient_name").equalTo(ingredient_name).once("value").then(function(snapshot){
        ingredient_name_to_recipe_ids_objects = snapshot.val();
        var key = false;
        for (key in ingredient_name_to_recipe_ids_objects) {
            if (ingredient_name_to_recipe_ids_objects.hasOwnProperty(key)) {
                break;//TODO if data integrity isn't preserved when data is written, multiple objects could be returned.
            }
        }
        var updated_ingredient_name_to_recipe_ids = {};
        if (key == false) {
            key = ingredient_name_to_recipe_ids_ref.push().key;
            updated_ingredient_name_to_recipe_ids["/" + ingredient_name_to_recipe_ids_table_name + "/" + key] = {"ingredient_name" : ingredient_name, "recipe_ids" : recipe_ids};
        } else {
            recipe_ids.forEach(function (recipe_id, _) {
                if (ingredient_name_to_recipe_ids_objects[key]['recipe_ids'].indexOf(recipe_id) == -1) {
                    ingredient_name_to_recipe_ids_objects[key]['recipe_ids'].push(recipe_id);
                }
            });
            updated_ingredient_name_to_recipe_ids["/" + ingredient_name_to_recipe_ids_table_name + "/" + key] = ingredient_name_to_recipe_ids_objects[key];
        }
        result = firebase.database().ref().update(updated_ingredient_name_to_recipe_ids);
        window[callback](result);
    });
}

function associateIngredientNameWithRecipeIdsResult(ingredient_name_to_recipe_ids)
{
    console.log(ingredient_name_to_recipe_ids);
}

function getIngredientNameToRecipeIdsByIngredientName(ingredient_name, callback)
{
    if (callback == undefined) {
        callback = "getIngredientNameToRecipeIdsByIngredientNameResult";
    }
    ingredient_name_to_recipe_ids_ref.orderByChild("ingredient_name").equalTo(ingredient_name).once("value").then(function(snapshot){
        ingredient_name_to_recipe_ids_objects = snapshot.val();
        var key = false;
        for (key in ingredient_name_to_recipe_ids_objects) {
            if (ingredient_name_to_recipe_ids_objects.hasOwnProperty(key)) {
                break;//TODO if data integrity isn't preserved when data is written, multiple objects could be returned.
            }
        }
        if (key == false) {
            ingredient_name_to_recipe_ids = {};
        } else {
            ingredient_name_to_recipe_ids = {"id" : key, "ingredient_name_to_recipe_ids" : ingredient_name_to_recipe_ids_objects[key]};
        }
        window[callback](ingredient_name_to_recipe_ids);
    })
}

function getIngredientNameToRecipeIdsByIngredientNameResult(ingredient_name_to_recipe_ids)
{
    console.log(ingredient_name_to_recipe_ids);
}

function getRecipeById(id, callback)
{
    if (callback == undefined) {
        callback = "getRecipeByIdResult";
    }
    recipes_ref.child(id).once("value").then(function(snapshot){
        recipe_object = snapshot.val();
        if (recipe_object == null) {
            recipe_object = {};
        } else {
            recipe_object = {"id" : snapshot.key, "recipe" : recipe_object};
        }
        window[callback](recipe_object);
    })
}

function getRecipeByIdResult(recipe)
{
    console.log(recipe);
}

jQuery(document).on("click", "#add_ingredient_button", function(){
    var ingredient_number = jQuery("#ingredients_div").children().length + 1;
    var html = "<form class='form-inline'>";
    html += "<div class='form-group' id='div_for_ingredient_" + ingredient_number + "'>";
    html += "<label class='sr-only' for='ingredient_" + ingredient_number + "_name'>Ingredient " + ingredient_number + " Name</label>";
    html += "<input type='text' class='form-control recipe_input' id='ingredient_" + ingredient_number + "_name' placeholder='Ingredient " + ingredient_number + " Name'>";
    html += "<label class='sr-only' for='ingredient_" + ingredient_number + "_quantity'>Ingredient " + ingredient_number + " Quantity</label>";
    html += "<input type='text' class='form-control recipe_input' id='ingredient_" + ingredient_number + "_quantity' placeholder='Ingredient " + ingredient_number + " Quantity'>";
    html += "<label class='sr-only' for='ingredient_" + ingredient_number + "_unit'>Ingredient " + ingredient_number + " Unit</label>";
    html += "<input type='text' class='form-control recipe_input' id='ingredient_" + ingredient_number + "_unit' placeholder='Ingredient " + ingredient_number + " Unit'>";
    html += "</div>";
    html += "</form>";
    jQuery("#ingredients_div").append(html);
});

jQuery(document).on("click", "#add_tag_button", function(){
    var tag_number = jQuery("#tags_div").children().length + 1;
    var html = "<div class='form-group' id='div_for_tag_" + tag_number + "'>";
    html += "<label class='sr-only' for='tag_" + tag_number + "'>Tag " + tag_number + "</label>";
    html += "<input type='text' class='form-control recipe_input' id='tag_" + tag_number + "' placeholder='Tag " + tag_number + "'>";
    html += "</div>";
    jQuery("#tags_div").append(html);
});

jQuery(document).on("click", "#add_recipe_button", function(){
    var recipe = {};
    recipe['name'] = jQuery("#recipe_name").val();
    recipe['prep_time'] = jQuery("#prep_time").val();
    recipe['directions'] = jQuery("#directions").val();
    recipe['ingredients'] = [];
    var ingredient_number = 1;
    while (jQuery("[id^=ingredient_" + ingredient_number + "_").length > 0) {
        var ingredient = {};
        ingredient['name'] = jQuery("#ingredient_" + ingredient_number + "_name").val();
        ingredient['quantity'] = jQuery("#ingredient_" + ingredient_number + "_quantity").val();
        ingredient['unit'] = jQuery("#ingredient_" + ingredient_number + "_unit").val();
        recipe['ingredients'].push(ingredient);
        ingredient_number++;
    }
    recipe['image'] = recipe_image;
    addRecipe(recipe, function(recipe_id){
        jQuery.notify("Successfully added recipe!", "success");
        jQuery(".recipe_input").val("");
        jQuery("#recipe_image_upload_label").html("Upload Picture");
        jQuery("#recipe_image_upload").val("");
    });
});

jQuery(document).on("change", "#recipe_image_upload", function(){
    var file_name = jQuery("#recipe_image_upload")[0].files[0]['name'];
    jQuery("#recipe_image_upload_label").html("(" + file_name + ")");
    file_reader = new FileReader();
    file_reader.onload = function() {
        recipe_image = file_reader.result;
    };
    file_reader.readAsDataURL(jQuery("#recipe_image_upload")[0].files[0]);
});


recipes_ref.on("child_added", function(recipe){
    recipe_object = recipe.val();
    var html = "<li id='persisted_recipe_" + recipe.key + "'>" + recipe_object['name'] + "</li>";
    jQuery("#existing_recipes").append(html);

    html = "<div class='col-md-4'><a class='thumbnail' href='#'><img class='recipe_image img-rounded' src='";
    if (recipe_object['image'] != "" && recipe_object['image'] != undefined) {
        html += recipe_object['image'];
    } else {
        html += "no_image.svg";
    }
    html += "' />";
    html += "<div class='caption'>" + recipe_object['name'] + "</div></div>";
    jQuery("#recipes_grid").append(html);
});













