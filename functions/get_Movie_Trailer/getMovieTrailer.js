/**
 * This microservice is a basicIO function that sends back the trailer url 
 */
const movieTrailer = require('movie-trailer');

module.exports = async(context, basicIO) => {
    const trailer = await movieTrailer(basicIO.getArgument('movie_name'));
    basicIO.write(trailer);
    context.close();
};