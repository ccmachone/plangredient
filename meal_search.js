
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
		
		//PUt in recipes_grid

	});
}