import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { HYDRATE } from 'next-redux-wrapper';

type Pokemon = {
  species: { name: string };
  sprites: { front_shiny: string; front_default: string; back_default: string };
  game_indices: { version: { name: string; url: string } }[];
  height: number;
  moves: { move: { name: string; url: string } }[];
};

export const pokemonApi = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://pokeapi.co/api/v2/',
  }),
  extractRehydrationInfo: (action, { reducerPath }) => {
    if (action.type === HYDRATE) {
      return action.payload[reducerPath];
    }
  },
  endpoints: (builder) => ({
    getPokemonName: builder.query<Pokemon, string>({
      query: (name) => `pokemon/${name}`,
    }),
    getPokemonList: builder.query<Pokemon[], void>({
      query: () => 'pokemon',
    }),
  }),
});

export const {
  useGetPokemonListQuery,
  useGetPokemonNameQuery,
  util: { getRunningOperationPromises },
} = pokemonApi;

export const { getPokemonName, getPokemonList } = pokemonApi.endpoints;
