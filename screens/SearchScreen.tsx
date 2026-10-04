import { useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const API_KEY = '65bdaf49';

export default function SearchScreen({ navigation }: any) {

  const [searchText, setSearchText] = useState('');
  const [movies, setMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState('');

  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);

  const searchMovies = async (pageNumber = 1) => {
    if (searchText.trim() === '') {
      setError('Please enter a movie title.');
      return;
    }

    Keyboard.dismiss();

    if (pageNumber === 1) {
      setLoading(true);
      setMovies([]);
      setPage(1);
    } else {
      setLoadingMore(true);
    }

    setError('');

    try {
      const response = await fetch(
        `https://www.omdbapi.com/?apikey=${API_KEY}&s=${encodeURIComponent(
          searchText
        )}&type=movie&page=${pageNumber}`
      );

      const data = await response.json();

      if (data.Response === 'True') {
        if (pageNumber === 1) {
          setMovies(data.Search);
        } else {
          setMovies((oldMovies) => [
            ...oldMovies,
            ...data.Search,
          ]);
        }

        setPage(pageNumber);
        setTotalResults(Number(data.totalResults));
      } else {
        if (pageNumber === 1) {
          setMovies([]);
          setError(data.Error || 'No movies found.');
        }
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const loadMore = () => {
    if (
      movies.length < totalResults &&
      !loadingMore
    ) {
      searchMovies(page + 1);
    }
  };

  const openMovie = (movie: any) => {
    navigation.navigate('MovieDetails', { id: movie.imdbID });
  };

  const renderMovie = ({ item }: any) => {
    return (
      <TouchableOpacity
        style={styles.movieCard}
        onPress={() => openMovie(item)}
      >
        {item.Poster && item.Poster !== 'N/A' ? (
          <Image
            source={{ uri: item.Poster }}
            style={styles.poster}
          />
        ) : (
          <View style={styles.noPoster}>
            <Text style={styles.noPosterText}>
              No Image
            </Text>
          </View>
        )}

        <View style={styles.movieInfo}>
          <Text
            style={styles.movieTitle}
            numberOfLines={2}
          >
            {item.Title}
          </Text>

          <Text style={styles.movieYear}>
            {item.Year}
          </Text>

          <Text style={styles.movieType}>
            {item.Type}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>
        Find a movie 🎬
      </Text>

      <Text style={styles.description}>
        Search for movies using the OMDb database.
      </Text>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter movie title..."
          placeholderTextColor="#9ca3af"
          value={searchText}
          onChangeText={setSearchText}
          onSubmitEditing={() => searchMovies(1)}
        />

        <TouchableOpacity
          style={styles.searchButton}
          onPress={() => searchMovies(1)}
        >
          <Text style={styles.searchButtonText}>
            Search
          </Text>
        </TouchableOpacity>
      </View>

      {loading && (
        <ActivityIndicator
          size="large"
          color="#fbbf24"
          style={styles.loader}
        />
      )}

      {error !== '' && (
        <Text style={styles.error}>
          {error}
        </Text>
      )}

      {!loading && movies.length > 0 && (
        <Text style={styles.resultsText}>
          Showing {movies.length} of {totalResults} movies
        </Text>
      )}

      <FlatList
        data={movies}
        keyExtractor={(item, index) =>
          `${item.imdbID}-${index}`
        }
        renderItem={renderMovie}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
        ListFooterComponent={
          loadingMore ? (
            <ActivityIndicator
              size="small"
              color="#fbbf24"
              style={styles.footerLoader}
            />
          ) : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111827',
    padding: 16,
  },

  heading: {
    color: '#ffffff',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },

  description: {
    color: '#9ca3af',
    fontSize: 15,
    marginBottom: 20,
  },

  searchContainer: {
    flexDirection: 'row',
    marginBottom: 15,
  },

  input: {
    flex: 1,
    backgroundColor: '#1f2937',
    color: '#ffffff',
    borderRadius: 10,
    paddingHorizontal: 15,
    height: 50,
    fontSize: 16,
    marginRight: 10,
  },

  searchButton: {
    backgroundColor: '#fbbf24',
    paddingHorizontal: 18,
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },

  searchButtonText: {
    color: '#111827',
    fontSize: 16,
    fontWeight: 'bold',
  },

  loader: {
    marginTop: 20,
  },

  error: {
    color: '#f87171',
    textAlign: 'center',
    marginBottom: 15,
  },

  resultsText: {
    color: '#fbbf24',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },

  list: {
    paddingBottom: 20,
  },

  movieCard: {
    flexDirection: 'row',
    backgroundColor: '#1f2937',
    marginBottom: 12,
    borderRadius: 12,
    padding: 10,
  },

  poster: {
    width: 90,
    height: 130,
    borderRadius: 8,
  },

  noPoster: {
    width: 90,
    height: 130,
    borderRadius: 8,
    backgroundColor: '#374151',
    justifyContent: 'center',
    alignItems: 'center',
  },

  noPosterText: {
    color: '#9ca3af',
  },

  movieInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },

  movieTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },

  movieYear: {
    color: '#fbbf24',
    fontSize: 15,
    marginBottom: 5,
  },

  movieType: {
    color: '#9ca3af',
    fontSize: 14,
  },

  footerLoader: {
    margin: 20,
  },
});

