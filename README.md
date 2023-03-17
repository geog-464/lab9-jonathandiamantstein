# lab9 - Creating a web atlas template

The goal of this lab is to have you create a basic web atlas. The distinction we are making here between a simple map and atlas refers to the fact that our web atlas will allow the user to toggle and reload different data layers. 

In addition to becoming more familiar with JS objects and the Leaflet API, this lab will also introduce you to event handling, which allow you to attach functionality to existing DOM elements and trigger specific changes on the webpage when the event occurs.

As a final step, you will need to [publish your repo](https://geog-464.github.io/github-page-howto) as a website to the public.

Refer to the previous lab for help with setting up your workspace.

# Fetching data from a server

- Add the following function declaration to your script file (*main.js*).

```javascript
function fetchData(){
    //load the data
    fetch()
        .then(function(response){
            return response.json();
        })
        .then(function(json){
            //create a Leaflet GeoJSON layer using the fetched json and add it to the map object
            L.geoJson(json).addTo(myMap);
        })
};
```

Last time, we made a simple webpage that linked to data in a *data/* folder. This time, we will be using the fetch API.

> Javascript is a [synchronous](https://www.freecodecamp.org/news/synchronous-vs-asynchronous-in-javascript/), single-threaded language. Since it runs on a single thead, it can only execute one command at a time, meaning other commands need to wait a previous command's execution before running. Retrieving data from a server can be more complicated though, since once the HTTP request is made, JavaScript doesn't know how long the data (potentially on the other side of the world), will take to be retrieved, and will continue to run subsequent commands with or without it. You could go a long time learning and coding in JavaScript without engaging with [synchronicity/asynchronicity](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous/Introducing), but that would limit you when it comes to dynamically retrieving data to populate something like a web map. The `fetch` method is used to accomodate JavaScript by telling it to continue running *only when the fetched data has been received*.

> You might notice the above code includes `.then` notation, which have to do with [promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise). Promises allow you to create asynchronous processes in JavaScript, essentially "promising" the main action sequence that there will be a return value from this task at some point, and can result in success or failure. This is *asynchronous JavaScipt*, and has to do with JavaScript's [event loop](https://developer.mozilla.org/en-US/docs/Web/JavaScript/EventLoop), which is a [complex topic](https://www.youtube.com/watch?v=8aGhZQkoFbQ) that is beyond the scope of this lab. For the sake of this exercise though, we are using promises to await the data from Github, which could take some time depending on how accessible the server is, how large the dataset is, etc.

- Call the `fetchData()` function from within your `loadMap()` function (be mindful of where inside the *loadMap* function you choose to call it!)

The sample data you need has been made available on the lab source repo. You will want to pass the url for this dataset to your JS *fetch* method!

- Visit the [URL for the sample data](https://github.com/geog-464/geog-464.github.io/blob/main/Amtrak_Stations.geojson) representing train stations.
- Click **Raw**. This will give you a link to the actual data, rather than Github's rendering of it.
- Pass this URL as a string to the fetch method.

Once you've saved your script and reloaded your web browser, you should see loaded placemarks. That's a lot of placemarks!

- 📝 [Q1] Use the [free tileset providers reference](https://leaflet-extras.github.io/leaflet-providers/preview/) to add a new tilelayer of your choice to your map. The new tileset must be selectable from your baselayer selector widget. You should be able to complete this pretty easily since a template is already provided for you.

# Styling our layer(s)

As you've already seen, GeoJSON data can be added to a leaflet map using the [geoJson](https://leafletjs.com/reference.html#geojson) method of the leaflet API (*L*). When referring to the linked documentation, we notice the method also accepts *Options*, which can be passed as additional keyword parameters. Unlike Python though, it's not as intuitive to pass keyword parameters to functions in JS... You can [make it work](https://exploringjs.com/impatient-js/ch_callables.html#named-parameters) however by passing them inside a JS object as an additional second argument...

We will start by passing two built-in *options* recognized by the *geoJson* method: *pointToLayer* and *style* (notice there are others as well such as [filter](https://leafletjs.com/reference.html#geojson-filter)). (1) The *pointToLayer* parameter defines a function to convert GeoJSON points into Leaflet layers. (2) The *style* option will allow us to [style the leaflet layer](https://leafletjs.com/reference.html#path-option). We will pass functions to these options which we will declare elsewhere. 

- Add the following JS object as an additional parameter in the *L.geoJson* function call, directly following the *json* argument: `{style: styleAll, pointToLayer: generateCircles}`.
- Elsewhere in your script file, declare the functions you are calling (use template below):

```javascript
function generateCircles(feature, latlng) {
	return L.circleMarker(latlng);
}

function styleAll(feature, latlng) {
	
	var styles = {dashArray:null, dashOffset:null, lineJoin:null, lineCap:null, stroke:false, color:'#000', opacity:1, weight:1, fillColor:null, fillOpacity:0 };

	if (feature.geometry.type == "Point") {
		styles.fillColor = '#fff'
		,styles.fillOpacity = 0.5
		,styles.stroke=true
		,styles.radius=9
	}
	
	return styles;
}

```
- Save your script and reload your browser to make sure the changes are reflected in your map...

- 📝 [Q2] What is happening in the *styleAll* function? Explain what the *styles* variable is and what it contains, what the conditional statement is doing and what gets returned by the function. Write your answer inside a \<p> tag above your mapdiv.

Notice you are accessing property found in your GeoJSON data here (accessible from the default *feature* parameter)... what else could you access here? Notice our *generateCircles* function gets passed 2 parameters from [*pointToLayer*](https://leafletjs.com/reference.html#geojson-pointtolayer), and adds a [circleMarker](https://leafletjs.com/reference.html#circlemarker) for every *latlng* (a leaflet object that contains coordinates). You can do a lot with this...

- paste a `console.log()` statement at the top of your *styleAll* function so that it prints the ZIP codes and reload your page. You can access the data's ZIP code values inside the feature object... Observe the ZIP codes in your inspector console (you might want to look at the link to your raw data on Github again...)

- 📝 [Q3] Add a conditional statement to your *styleAll* function that will style the *fillColor* of features containing a Canadian postal code. Use the colour 'cyan' instead of '#fff' for these.

# Adding some basic interactivity for data browsing

- We will now add the [onEachFeature](https://leafletjs.com/SlavaUkraini/reference.html#geojson-oneachfeature) parameter to leaflet's *geoJson* method call. This will allow us to add some additional functionality to our geographic features. append the following to your options called from the *L.geoJson* method: `onEachFeature: addPopups`. As you can see, the value passed to *onEachFeature* is a function call we are naming *addPopups*.
- Declare the *addPopups* as an empty function elsewhere in your script. This function can receive 2 variables from *onEachFeature* which we will refer to as *feature* and *layer* (add these as arguments to your *addPopups* declaration).
- Inside this function, console.log() both *feature* and *layer* to check what they contain. In your console, explore these objects and their many attributes...

As you can see, like the other functions we've been adding, you have access to a lot of elements here, which you can refer to or modify freely using JavaScript.

- 📝 [Q4] What is *feature* and what is *layer* here? What do they refer to?

- Add the next few lines inside your *addPopups* function (this is just an exercise):
```javascript
console.log(layer._radius)
console.log(layer.options.fill)
console.log(layer.getLatLng())
```

- 📝 [Q5] What is the fundamental difference between [*layer.options.fill*](https://leafletjs.com/reference.html#path-fill) and [layer.getLatLng()](https://leafletjs.com/reference.html#marker-getlatlng), beyond the fact that they return different pieces of information?

- Set *layer.options.fill* to *false* (i.e. `layer.options.fill = false`) and *layer._radius* to *80*.

- 📝 [Q6] Reload your web browser... What happened!?

As you can see, you can directly access map elements yourself by knowing your way around these JavaScript objects (in addition, see [object prototypes](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/Object_prototypes) for a deeper understanding of JS objects)! Indeed, there are *many* possibilities for elaborate customization here, which you can control more powerfully using your knowledge of programming (conditional statements, looping, etc.). You can use these attributes outside of your map too in your webpage to modify JS, HTML, CSS, SVG, etc.

- Delete all those console.logs you added. Remember that this is our function for adding popups, not for fooling around with styling (even though you could technically do that here since you have access to these elements)!
- Add the [bindPopup](https://leafletjs.com/SlavaUkraini/reference.html#layer-bindpopup) method to your function, which you can access from the layer object (i.e. paste `layer.bindPopup();`).
- You can pass anything you like to the bindPopup method, and it will display as a popup on your map features. It's likely that you want to pass some data attributes to it though, which are accessible within both the *feature* and *layer* objects. Pass the station name attribute to this method and reload your web browser. Note that you could also pass additional [popup options](https://leafletjs.com/SlavaUkraini/reference.html#popup-option) to the bindPopup method as well to customize your popups.

# Interactively reloading a map

Let's say you wanted to allow users to browse different datasets interactively. You should probably create some kind of HTML object that can handle events.

> [Events](https://developer.mozilla.org/en-US/docs/Web/Events/Event_handlers) can be dealt with in several ways. Events are things like *clicks* or *mouseovers*, which trigger JavaScript functions. For example, you can [call functions from HTML](https://www.w3schools.com/tags/ref_eventattributes.asp) as *event handlers* such as [onclick](https://www.w3schools.com/jsref/event_onclick.asp), commonly used with things like HTML [*buttons*](https://www.w3schools.com/tags/tag_button.asp). However, you can also add [*event listeners*](https://developer.mozilla.org/en-US/docs/Web/Events/Event_handlers#eventtarget.addeventlistener) to HTML objects using JavaScript, which is a better way of doing things since it isn't hardcoded into your HTML (i.e. since adding event listeners is done with JS, you can dynamically add and remove them to enable and disable interactivity in your website).

In this example, we will start by simply hardcoding it into our HTML as a simple *event handler*. The HTML [*select*](https://www.w3schools.com/tags/tag_select.asp) object features an [*onChange*](https://www.w3schools.com/jsref/event_onchange.asp) attribute from which you can call a function (the function is contained inside a string here because this is an inline JS script inside HTML). This will trigger the function whenever the selected item from the dropdown menu is changed.

```javascript
<select class="li-nav" name="mapdropdown" id="mapdropdown" onChange="loadMap(this.value);">
	<option value="map0" selected="selected" disabled>Load a map</option>
	<option value='mapa'>Map A</option>
	<option value='mapb'>Map B</option>
</select>
```

- Paste the above code into your HTML page. Note the property that is being passed as an argument to our loadMap function as well as [how](https://www.w3schools.com/js/js_this.asp)...
- Since we are now launching our map using interactivity, you might want to comment out/remove *window.onload*...
- Reload your web browser and select from your dropdown, does a map load?
- As you can see in the code above, you are now passing a parameter to *loadMap()*, so you should probably give this function declaration a parameter... calling this variable *mapid* would make sense. Make sure to console.log *mapid* inside your loadMap function to make sure it's getting passed in properly.
- Now, create a conditional statement that checks whether *mapid* is equal to *mapa* or *mapb*. Depending on which one it is, you will load a map using different options (center, zoom, maxZoom, etc.), and call *fetchData()* using a different dataset (use a link to the Amtrak stations for *mapa* and to *[megacities.geojson](https://github.com/geog-464/geog-464.github.io/blob/main/megacities.geojson)* for mapb!). Make sure that the map settings are coherent with the extents and scales of these different datasets!
- If everything works so far, you may still encounter an issue: loading a new leaflet map with an existing leaflet map instance already loaded could be problematic. You might therefore need to remove any existing map instances before loading a new one (this allows for the user to continuously switch between map load options). Observe the following code: you can use this code and embed your previous conditional statements inside it:
```javascript
try {
	myMap.remove()
} catch(e) {
	console.log(e)
	console.log("no map to delete")
} finally {
	//put your map loading code in here
}
```

Above we are looking at some JavaScript control flow (very similar to what you can also find in Python). [Try...catch](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/try...catch) functionality will allow you to handle things that might be unexpected, making your code more flexible and less likely to stop working as intended. In this case, we are attempting to remove *myMap*, which is your leaflet map instance. If there is no map to remove, the code won't stall: it will display an error code and then move on.

Good luck debugging!

## Adding an Event *listener* using JavaScript

As an additional final step, you are asked to replace the hardcoded event handler with one that is loaded into the page using JavaScript:

- 📝 [Q7] Replace the *OnChange* event handler in the HTML select object with a function in your *main.js* script that will add this as an event listener to the *select* object. The `[addEventListener()](https://www.w3schools.com/jsref/met_document_addeventlistener.asp)` function will help you in doing this.

# Deliverables

All answered questions inside your *index.html* (2 points each) and a functioning webmap that contains the data, styles and functionalities according to the modifications made throughout the lab (tilesets, styles, popups, map loading dropdown). Each of these enhancements is graded separately based on completion and functionality (1,1,2,4 points respectively).

Finally, make sure your repo is deployed as a Github page, or your lab will not be graded!
