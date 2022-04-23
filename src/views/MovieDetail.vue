<template>
  <v-container>
    <ApolloQuery
      :query="require('../gql/getMovieByUUID.gql')"
      :variables="{ id: movieId }"
    >
      <template v-slot="{ result: { loading, error, data } }">
        <!-- Loading -->
        <div v-if="loading" class="loading apollo">Loading...</div>

        <!-- Error -->
        <div v-else-if="error" class="error apollo">An error occurred</div>

        <!-- Result -->
        <div v-else-if="data" class="result apollo">
          <h1>{{ data.movie_by_pk.title }}</h1>
          <v-img
            height="300"
            max-width="400"
            :src="data.movie_by_pk.image_path"
          ></v-img>
          <h4>{{ data.movie_by_pk.description }}</h4>

          <p>{{ data.movie_by_pk.rating }}</p>
        </div>

        <!-- No result -->
        <div v-else class="no-result apollo">No result :(</div>
      </template>
    </ApolloQuery>
  </v-container>
</template>

<script>
export default {
  name: "MovieDetailPage",
  computed: {
    movieId() {
      return this.$route.params.id;
    },
  },
};
</script>
