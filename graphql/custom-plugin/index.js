const { makeWrapResolversPlugin } = require("graphile-utils");

// Create custom wrapper for resolver createUser
const createEventResolverWrapper = () => {
    return async (resolve, source, args, context, resolveInfo) => {
        console.info(source, args);

        // Let resolver execute against database
        return await resolve();
    };
};

// Register custom resolvers
module.exports = makeWrapResolversPlugin({
    Mutation: {
        createEvent: createEventResolverWrapper(),
    },
});