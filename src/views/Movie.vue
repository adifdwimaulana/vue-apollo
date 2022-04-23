<template>
  <v-container>
    <ApolloQuery :query="require('../gql/getAllMovies.gql')">
      <template v-slot="{ result: { loading, error, data } }">
        <!-- Loading -->
        <div v-if="loading" class="loading apollo">Loading...</div>

        <!-- Error -->
        <div v-else-if="error" class="error apollo">An error occurred</div>

        <!-- Result -->
        <div v-else-if="data" class="result apollo">
          <v-row>
            <v-col cols="3" v-for="movie in data.movie" :key="movie.id">
              <v-card :loading="loading" class="mx-auto my-12" height="480">
                <v-img height="300" :src="movie.image_path"></v-img>

                <v-card-title>{{ movie.title }}</v-card-title>

                <v-card-text>
                  <v-row align="center" class="mx-0">
                    <v-rating
                      :value="movie.rating / 2"
                      color="amber"
                      dense
                      half-increments
                      readonly
                      size="14"
                    ></v-rating>

                    <div class="grey--text ms-4">{{ movie.rating }} (413)</div>
                  </v-row>

                  <div>
                    {{ movie.description }}
                  </div>
                </v-card-text>

                <v-card-actions>
                  <v-btn
                    color="deep-purple lighten-2"
                    text
                    @click="redirect(movie.id)"
                  >
                    See Detail
                  </v-btn>

                  <v-divider></v-divider>

                  <v-btn
                    color="deep-purple lighten-2"
                    text
                    @click="deleteMovie(movie.id)"
                  >
                    Delete
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-col>
          </v-row>
        </div>

        <!-- No result -->
        <div v-else class="no-result apollo">No result :(</div>
      </template>
    </ApolloQuery>

    <ApolloMutation
      :mutation="require('../gql/AddMovie.gql')"
      :variables="{ title, genre, description, rating, image_path: imagePath }"
      :update="updateCache"
    >
      <template v-slot="{ mutate, loading, error }">
        <v-form>
          <v-container>
            <v-row>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="title"
                  hint="Movie Title"
                  label="Title"
                ></v-text-field>
              </v-col>

              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="description"
                  counter
                  hint="Movie Description"
                  label="Description"
                ></v-text-field>
              </v-col>

              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="genre"
                  hint="Movie Genre"
                  label="Genre"
                ></v-text-field>
              </v-col>

              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="rating"
                  type="number"
                  hint="Movie Rating"
                  label="Rating"
                >
                </v-text-field>
              </v-col>

              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="imagePath"
                  hint="Image Path"
                  label="Poster Path"
                >
                </v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-form>
        <v-btn :disabled="loading" depressed color="primary" @click="mutate()"
          >Submit</v-btn
        >
        <p v-if="error">An error occurred: {{ error }}</p>
      </template>
    </ApolloMutation>
  </v-container>
</template>

<script>
export default {
  name: "MoviePage",
  data() {
    return {
      title: "",
      genre: "",
      description: "",
      rating: 0,
      imagePath: "",
    };
  },
  methods: {
    redirect(id) {
      this.$router.push(`/movie/${id}`);
    },
    onDone() {
      window.location.reload();
    },
    updateCache(store, { data: { insert_movie_one } }) {
      const query = {
        query: require("../gql/getAllMovies.gql"),
      };
      // Read the query from cache
      const data = store.readQuery(query);
      // Mutate cache result
      data.movie.push(insert_movie_one);
      // Write back to the cache
      store.writeQuery({
        ...query,
        data,
      });
    },
    deleteMovie(id) {
      this.$apollo.mutate({
        // Query
        mutation: require("../gql/MutationDeleteMovie.gql"),
        // Parameters
        variables: {
          id,
        },
        update: (store, { data: { delete_movie_by_pk } }) => {
          // Read the data from our cache for this query.
          const query = {
            query: require("../gql/getAllMovies.gql"),
          };
          // Read the query from cache
          const data = store.readQuery(query);

          const index = data.movie.findIndex(
            (movie) => movie.id === delete_movie_by_pk.id
          );

          if (index !== -1) {
            // Mutate cache result
            data.movie.splice(index, 1);
            // Write back to the cache
            store.writeQuery({
              ...query,
              data,
            });
          }
        },
      });
    },
  },
};
</script>
