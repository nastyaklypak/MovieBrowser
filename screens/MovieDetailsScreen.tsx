import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

const API_KEY = '65bdaf49';
export default function MovieDetailsScreen({ route }: any)  {
  const { id } = route.params;

  const [movie, setMovie] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getMovieDetails();
  }, [id]);

  const getMovieDetails = async () => {
    try {
      const response = await fetch(
        `https://www.omdbapi.com/?apikey=${API_KEY}&i=${id}&plot=full`
      );

      const data = await response.json();

      if (data.Response === 'True') {
        setMovie(data);
      } else {
        setError(data.Error || 'Movie not found.');
      }
    } catch (err) {
      setError('Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#fbbf24" />
        <Text style={styles.loadingText}>
          Loading movie details...
        </Text>
      </View>
    );
  }

  if (error !== '') {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>{error}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {movie.Poster && movie.Poster !== 'N/A' ? (
        <Image
          source={{ uri: movie.Poster }}
          style={styles.poster}
        />
      ) : null}

      <Text style={styles.title}>
        {movie.Title}
      </Text>

      <Text style={styles.year}>
        {movie.Year} • {movie.Runtime}
      </Text>

      <Text style={styles.rating}>
        ⭐ IMDb: {movie.imdbRating}
      </Text>

      <View style={styles.section}>
        <Text style={styles.label}>Genre</Text>
        <Text style={styles.text}>{movie.Genre}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Director</Text>
        <Text style={styles.text}>{movie.Director}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Actors</Text>
        <Text style={styles.text}>{movie.Actors}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Country</Text>
        <Text style={styles.text}>{movie.Country}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Language</Text>
        <Text style={styles.text}>{movie.Language}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Awards</Text>
        <Text style={styles.text}>{movie.Awards}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Plot</Text>
        <Text style={styles.plot}>{movie.Plot}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111827',
    padding: 16,
  },

  center: {
    flex: 1,
    backgroundColor: '#111827',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },

  loadingText: {
    color: '#ffffff',
    marginTop: 15,
    fontSize: 16,
  },

  error: {
    color: '#f87171',
    fontSize: 18,
    textAlign: 'center',
  },

  poster: {
    width: '100%',
    height: 500,
    resizeMode: 'contain',
    marginBottom: 20,
  },

  title: {
    color: '#ffffff',
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 8,
  },

  year: {
    color: '#9ca3af',
    fontSize: 16,
    marginBottom: 10,
  },

  rating: {
    color: '#fbbf24',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },

  section: {
    marginBottom: 18,
  },

  label: {
    color: '#fbbf24',
    fontSize: 17,
    fontWeight: 'bold',
    marginBottom: 5,
  },

  text: {
    color: '#ffffff',
    fontSize: 16,
    lineHeight: 23,
  },

  plot: {
    color: '#ffffff',
    fontSize: 16,
    lineHeight: 25,
  },
});