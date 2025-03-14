import { makeExecutableSchema } from '@graphql-tools/schema';
import { mergeTypeDefs, mergeResolvers } from '@graphql-tools/merge';
import { typeDefs as globalTypeDefs } from './typeDefs';
import { dinosaurTypeDefs } from './dinosaurTypeDefs';
import { resolvers as globalResolvers } from './resolvers';
import { dinosaurResolvers } from './dinosaurResolvers';

const mergedTypeDefs = mergeTypeDefs([globalTypeDefs, dinosaurTypeDefs]);
const mergedResolvers = mergeResolvers([globalResolvers, dinosaurResolvers]);

const schema = makeExecutableSchema({
  typeDefs: mergedTypeDefs,
  resolvers: mergedResolvers,
});

export default schema;
