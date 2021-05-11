// allows us to read csv files
let csv = require('neat-csv')

// allows us to read files from disk
let fs = require('fs')

// defines a lambda function
exports.handler = async function(event) {
  // write the event object to the back-end console
  console.log(event)

  // read movies CSV file from disk
  let moviesFile = fs.readFileSync(`./movies.csv`)
  
  // turn the movies file into a JavaScript object, wait for that to happen
  let moviesFromCsv = await csv(moviesFile)

  // write the movies to the back-end console, check it out
  console.log(moviesFromCsv)

  // 🔥 hw6: your recipe and code starts here!

  // define year and genre variables
  let year = event.queryStringParameters.year
  let genre = event.queryStringParameters.genre
  
  // Pass the two query string parameters
  if (year == undefined || genre == undefined) {
    return {
      statusCode: 200, // https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
      body: `Error! Please input a value for year and genre!` // a string of data
    }
  }
  else {
    let returnValue = {
      numResults: 0,
      movies: []
    }

    for (let i=0; i < moviesFromCsv.length; i++) {
      // save each of teh movies to the memory
      let movie = moviesFromCsv[i]
      
      // sort only results for the genre and the year
      if (movie.startYear == year && movie.genres.includes(genre) && movie.runtimeMinutes != `\\N` && movie.genres != `\\N`) {
        movie = {
          title: movie.primaryTitle,
          year: movie.startYear,
          genres: movie.genres
        }
        // include movie 
        returnValue.movies.push(movie)
      }
    }

    // confirm the length of the movie array
    returnValue.numResults = returnValue.movies.length
    return {
      statusCode: 200, // https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
      body: JSON.stringify(returnValue) // a string of data
    }
  }
}