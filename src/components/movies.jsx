import * as React from "react";
import { Component } from "react";
import { getMovies } from "../services/fakeMovieService";
import { getGenres } from "../services/fakeGenreService";
import Pagination from "../common/pagination";
import { paginate } from "../utils/paginate";
import ListGroup from "../common/listGroup";
import MoviesTable from "./moviesTable";

class Movies extends Component {
  state = {
    movies: [],
    genres: [],
    pageSize: 4,
    currentPage: 1
  };

  componentDidMount() {
    const genres = [{ _id: "", name: "All Genres" }, ...getGenres()];
    this.setState({ movies: getMovies(), genres: genres });
  }

  handleDelete = movie => {
    const movies = this.state.movies.filter(m => m._id !== movie._id);
    this.setState({ movies });
  };

  handleLike = movie => {
    const movies = [...this.state.movies];
    const index = movies.indexOf(movie);
    movies[index] = { ...movies[index] };
    movies[index].liked = !movies[index].liked;
    this.setState({ movies });
  };

  handlePageChange = page => {
    this.setState({ currentPage: page });
  };

  handleGenreSelect = genre => {
    this.setState({ selectedGenre: genre, currentPage: 1 });
  };

  handleSort = path => {};

  render() {
    const { length: count } = this.state.movies;
    const {
      pageSize,
      currentPage,
      movies: allMovies,
      genres,
      selectedGenre
    } = this.state;

    if (count === 0) {
      return <p>There are no movies in the database.</p>;
    }

    //Filter the movie list before rendering based on selected genre
    const filteredMovies =
      selectedGenre && selectedGenre._id
        ? allMovies.filter(m => m.genre._id === selectedGenre._id)
        : allMovies;

    //get movieList per page from paginate util
    const movieList = paginate(filteredMovies, currentPage, pageSize);

    return (
      <div className="row">
        <div className="col-3">
          <ListGroup
            items={genres}
            selectedItem={selectedGenre}
            onItemSelect={this.handleGenreSelect}
          />
        </div>
        <div className="col">
          <p>Showing {filteredMovies.length} movies in the database</p>
          <MoviesTable
            movies={movieList}
            onLike={this.handleLike}
            onDelete={this.handleDelete}
            onSort={this.handleSort}
          ></MoviesTable>
          <Pagination
            itemsCount={filteredMovies.length}
            pageSize={pageSize}
            currentPage={currentPage}
            onPageChange={this.handlePageChange}
          />
        </div>
      </div>
    );
  }
}

export default Movies;
