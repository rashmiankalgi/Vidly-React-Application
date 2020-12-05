import React, { Component } from "react";
import { deleteMovie, getMovies } from "../services/movieService";
import MoviesTable from "./moviesTable";
import Pagination from "./common/pagination";
import { getGenres } from "../services/genreService";
import ListGroup from "./common/listGroup";
import { paginate } from "../utils/paginate";
import { Link } from "react-router-dom";
import _ from "lodash";
import Search from "./common/search";

class Movies extends Component {
  state = {
    movies: [],
    genres: [],
    currentPage: 1,
    pageSize: 4,
    searchQuery: "",
    selectedGenre: null,
    sortColumn: { path: "title", order: "asc" },
  };

  async componentDidMount() {
    const { data } = await getGenres();
    const genres = [{ _id: "", name: "All Genres" }, ...data];

    const { data: movies } = await getMovies();

    this.setState({ movies, genres });
  }

  handleLike = (movie) => {
    const movies = [...this.state.movies];
    const index = movies.indexOf(movie);
    movies[index] = { ...movies[index] };
    movies[index].liked = !movies[index].liked;
    this.setState({ movies });
  };

  handleDelete = async (movieId) => {
    const originalMovies = this.state.movies;
    const movies = originalMovies.filter((m) => m._id !== movieId);
    this.setState({ movies });
    try {
      await deleteMovie(movieId);
    } catch (er) {
      if (er.response && er.response.status === 404)
        alert("This movie is deleted");
      this.setState({ movies: originalMovies });
    }
  };

  handleOnPageChange = (page) => {
    this.setState({ currentPage: page });
  };

  handleGenre = (genre) => {
    this.setState({ selectedGenre: genre, currentPage: 1, searchQuery: "" });
  };

  handleSort = (sortColumn) => {
    this.setState({ sortColumn });
  };

  handleSearch = (query) => {
    this.setState({ searchQuery: query, selectedGenre: null, currentPage: 1 });
  };

  getPagesData = () => {
    let filtered = this.state.movies;
    if (this.state.searchQuery)
      filtered = this.state.movies.filter((m) =>
        m.title.toLowerCase().startsWith(this.state.searchQuery.toLowerCase())
      );
    else if (this.state.selectedGenre && this.state.selectedGenre._id)
      filtered = this.state.movies.filter(
        (m) => m.genre._id === this.state.selectedGenre._id
      );

    const sorted = _.orderBy(
      filtered,
      [this.state.sortColumn.path],
      [this.state.sortColumn.order]
    );

    const movies = paginate(
      sorted,
      this.state.currentPage,
      this.state.pageSize
    );
    return { totalCount: filtered.length, data: movies };
  };

  render() {
    const { user } = this.props.user;
    if (this.state.movies.length === 0) return <p> There are no movies</p>;

    const { totalCount, data: movies, searchQuery } = this.getPagesData();

    return (
      <React.Fragment>
        <div className="row">
          <div className="col-3">
            <ListGroup
              items={this.state.genres}
              onItemSelect={this.handleGenre}
              selectedItem={this.state.selectedGenre}
            />
          </div>
          <div className="col">
            {user && (
              <Link to="movies/new" className="btn btn-primary">
                New Movie
              </Link>
            )}
            <p> There are {totalCount} movies</p>
            <Search value={searchQuery} onChange={this.handleSearch} />

            <MoviesTable
              movies={movies}
              sortColumn={this.state.sortColumn}
              onLike={this.handleLike}
              onDelete={this.handleDelete}
              onSort={this.handleSort}
            />

            <Pagination
              itemCount={totalCount}
              pageSize={this.state.pageSize}
              currentPage={this.state.currentPage}
              onPageChange={this.handleOnPageChange}
            />
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default Movies;
