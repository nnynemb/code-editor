// apolloClient.js
import { ApolloClient, InMemoryCache } from '@apollo/client';
const base_url =  process.env.REACT_APP_API;

const client = new ApolloClient({
  uri: `${base_url}graphql`, // Replace with your GraphQL endpoint
  cache: new InMemoryCache(),
});

export default client;
