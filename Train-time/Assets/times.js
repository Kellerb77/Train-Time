/**
 * pulls information from the form and build the query URL
 * @returns {string} URL for NYT API based on form inputs
 */
function buildQueryURL() {
    // queryURL is the url we'll use to query the API
    var queryURL = "https://api.nytimes.com/svc/search/v2/articlesearch.json?";
  
    // Begin building an object to contain our API call's query parameters
    // Set the API key
    var queryParams = { "api-key": "b9f91d369ff59547cd47b931d8cbc56b:0:74623931" };
  
    // Grab text the user typed into the search input, add to the queryParams object
    queryParams.q = $("#dest")
      .val()
      .trim();
  
    // If the user provides a firstTrain, include it in the queryParams object
    var firstTrain = $("#firstTrain")
      .val()
      .trim();
  
    if (parseInt(firstTrain)) {
      queryParams.begin_date = firstTrain + "0101";
    }
  
    // If the user provides an frequencyTrain, include it in the queryParams object
    var frequencyTrain = $("#frequencyTrain")
      .val()
      .trim();
  
    if (parseInt(frequencyTrain)) {
      queryParams.end_date = frequencyTrain + "0101";
    }
  
    // Logging the URL so we have access to it for troubleshooting
    console.log("---------------\nURL: " + queryURL + "\n---------------");
    console.log(queryURL + $.param(queryParams));
    return queryURL + $.param(queryParams);
  }
  
  /**
   * takes API data (JSON/object) and turns it into elements on the page
   * @param {object} NYTData - object containing NYT API data
   */
  function updatePage(NYTData) {
    // Get from the form the number of results to display
    // API doesn't have a "limit" parameter, so we have to do this ourselves
    var numArticles = $("#article-count").val();
  
    // Log the NYTData to console, where it will show up as an object
    console.log(NYTData);
    console.log("------------------------------------");
  
    // Loop through and build elements for the defined number of articles
    for (var i = 0; i < numArticles; i++) {
      // Get specific article info for current index
      var article = NYTData.response.docs[i];
  

      // Increase the count (track article # - starting at 1)
      var count = i + 1;
  
      // Create the  list group to contain the articles and add the article content for each
      var $list = $("<ul>");
      $list.addClass("list-group");
  
      // Add the newly created element to the DOM
      $("#article-section").append($list);
  
      // If the article has a headline, log and append to $list
      var headline = article.headline;
      var $listItem = $("<li class='list-group-item articleHeadline'>");
  
      if (headline && headline.main) {
        console.log(headline.main);
        $listItem.append(
          "<span class='label label-primary'>" +
            count +
            "</span>" +
            "<strong> " +
            headline.main +
            "</strong>"
        );
      }
  
      // If the article has a byline, log and append to $list
      var byline = article.byline;
  
      if (byline && byline.original) {
        console.log(byline.original);
        $listItem.append("<h5>" + byline.original + "</h5>");
      }
  
      // Log section, and append to document if exists
      var section = article.section_name;
      console.log(article.section_name);
      if (section) {
        $listItem.append("<h5>Section: " + section + "</h5>");
      }
  
      // Log published date, and append to document if exists
      var date = article.datedate;
      console.log(article.date_date);
      if (date) {
        $listItem.append("<h5>" + article.date_date + "</h5>");
      }
  
      // Append and log url
      $listItem.append("<a href='" + article.web_url + "'>" + article.web_url + "</a>");
      console.log(article.web_url);
  
      // Append the article
      $list.append($listItem);
    }
  }
  
  // Function to empty out the articles
  function clear() {
    $("#article-section").empty();
  }
  
  // CLICK HANDLERS
  // ==========================================================
  
  // .on("click") function associated with the Search Button
  $("#run-search").on("click", function(event) {
    // This line allows us to take advantage of the HTML "submit" property
    // This way we can hit enter on the keyboard and it registers the search
    // (in addition to clicks). Prevents the page from reloading on form submit.
    event.preventDefault();
  
    // Empty the region associated with the articles
    clear();
  
    // Build the query URL for the ajax request to the NYT API
    var queryURL = buildQueryURL();
  
    // Make the AJAX request to the API - GETs the JSON data at the queryURL.
    // The data then gets passed as an argument to the updatePage function
    $.ajax({
      url: queryURL,
      method: "GET"
    }).then(updatePage);
  });
  
  //  .on("click") function associated with the clear button
  $("#clear-all").on("click", clear);
  