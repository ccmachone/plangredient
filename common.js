users_table_name = "users";
recipes_table_name = "recipes";
ingredient_name_to_recipe_ids_table_name = "ingredient_name_to_recipe_ids";
planned_recipes_table_name = "planned_recipes";

firebase.initializeApp(firebase_config);

users_ref = firebase.database().ref(users_table_name + '/');
recipes_ref = firebase.database().ref(recipes_table_name + '/');
ingredient_name_to_recipe_ids_ref = firebase.database().ref(ingredient_name_to_recipe_ids_table_name + '/');
planned_recipes_ref = firebase.database().ref(planned_recipes_table_name + "/");

function isEquivalent(a, b) {
    if (a.length != b.length) {
        return false;
    }
    for (var i in a) {
        // Create arrays of property names
        var aProps = Object.getOwnPropertyNames(a[i]);
        var bProps = Object.getOwnPropertyNames(b[i]);

        // If number of properties is different,
        // objects are not equivalent
        if (aProps.length != bProps.length) {
            return false;
        }

        for (var j = 0; j < aProps[i].length; j++) {
            var propName = aProps[i][j];

            // If values of same property are not equal,
            // objects are not equivalent
            if (a[i][propName] !== b[i][propName]) {
                return false;
            }
        }
    }

    // If we made it this far, objects
    // are considered equivalent
    return true;
}

$.urlParam = function(name){
    var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
    return results[1] || 0;
}

function getLoggedInUser()
{
    if (window.sessionStorage.getItem("user") != null) {
        return JSON.parse(window.sessionStorage.getItem("user"));
    } else {
        return {};
    }
}

var MEAL_BREAKFAST = "breakfast";
var MEAL_LUNCH = "lunch";
var MEAL_DINNER = "dinner";

// {
//   "users" : [
//       "email",
//       "password"
//   ],
//   "recipes" : [
//       "name",
//       "ingredients" : [{
//           "name",
//           "quantity",
//           "measuring_unit"
//       }],
//       "directions",
//       "prep_time",
//       "image"
//   ],
//   "planned_recipes" : [
//       "email",
//       "date", Date.getTime()
//       "meal", enum(breakfast,lunch,dinner)
//       "recipe_ids" : []
//   ],
//   "ingredient_name_to_recipe_ids" : [
//       "ingredient_name",
//       "recipe_ids" : []
//   ]
// }

