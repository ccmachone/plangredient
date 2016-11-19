
var currentSelectedFilters = [];


$( document ).ready(function()
{

	$("#searchButton").click(function()
	{

		var searchTerm = $("#searchBar").val();
		recipesSearch(searchTerm);

	});

	$("#filterButton").click(function()
	{
		var input = $("#filterBar").val();
		currentSelectedFilters.push(input);
		updateFilterDisplay();
	});

});



function updateFilterDisplay()
{
	var activeFilters = "<ul>";
	for(filter in currentSelectedFilters)
	{
		activeFilters = activeFilters + "<li>"+currentSelectedFilters[filter]+"<img style = 'height: 10px; width: 10px; margin-left: 5px;' src = 'http://vignette4.wikia.nocookie.net/five-nights-at-tubbyland/images/a/a5/X.png/revision/latest?cb=20160216225020' onclick = 'removeFilter(\""+currentSelectedFilters[filter]+"\")'></img></li>";
	}
	$("#selectedFilters").html(activeFilters);
}

function removeFilter(filter)
{
	var index = currentSelectedFilters.indexOf(filter);
	if (index > -1)
	{
		currentSelectedFilters.splice(index, 1);
	}
	updateFilterDisplay();
}


function recipesSearch(searchTerm)
{
	recipes_ref.orderByChild("name").equalTo(searchTerm).once("value").then(function(snapshot)
	{
		var queryResults = snapshot.val();
		var finalResults = {};
		var size = currentSelectedFilters.length;
		var recipesPopulationList = [];

		if(size === 0)
		{
			finalResults = queryResults;
		}
		else
		{
			for(var i = 0; i < size; i++)
			{

			/*	if(currentSelectedFilters[i] === )
				{
					finalResults[i] =
				} */
			}
		}

		for(var key in finalResults)
		{
			if (finalResults.hasOwnProperty(key))
			{
				recipesPopulationList.push({"id" : key, "recipe" : finalResults[key]});
			}
		}

		populateDisplayGridWithRecipes(recipesPopulationList);

	});
}


function populateDisplayGridWithRecipes(recipes)
{
    jQuery("#recipes_grid").html("");
    for (var key in recipes) {
        if (recipes.hasOwnProperty(key)) {
            addRecipeToDisplayGrid(recipes[key]['id'], recipes[key]['recipe']);
        }
    }
}

function addRecipeToDisplayGrid(recipe_id, recipe_object)
{
    var html = "<li id='persisted_recipe_" + recipe_id + "'>" + recipe_object['name'] + "</li>";
    jQuery("#existing_recipes").append(html);
    var num_recipes_grid_children = jQuery("#recipes_grid").children().length;
    html = "";
    var add_closing_html = false;
    if (num_recipes_grid_children == 0 || jQuery(jQuery(jQuery("#recipes_grid").children()[num_recipes_grid_children - 1]).children()[0]).children().length == 4) {
        add_closing_html = true;
        html += "<div class='row'><div class='col-md-12'><div class='thumbnails'>"
    }

    html += "<div class='col-md-3 clickableRecipe'><div style='cursor: pointer;' onclick='window.location.href=\"recipe_display.html?recipe_id=" + recipe_id + "\"'><img class='recipe_image img-rounded' src='";
    if (recipe_object['image'] != "" && recipe_object['image'] != undefined) {
        html += recipe_object['image'];
    } else {
        html += "no_image.svg";
    }
    html += "' />";
    html += "<div class='caption'>" + recipe_object['name'] + "</div></div>";
    if (add_closing_html) {
        html += "</div></div></div>";
        jQuery("#recipes_grid").append(html);
    } else {
        jQuery(jQuery(jQuery("#recipes_grid").children()[num_recipes_grid_children - 1]).children()[0]).append(html);
    }
}