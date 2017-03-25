const PubSub = require('./pubsub');
const SubscriptionManager = require('./subscriptionManager');
const SubscriptionServer = require('./server');

// start a subscription (for testing)
function test(subscriptionManager) {
  subscriptionManager.subscribe({
    query: `
      subscription AuthorSubscription(
        $options: JSON
        $create: Boolean 
        $update: Boolean
        $remove: Boolean
      ) {
        Author(input: {
          options: $options
          create: $create 
          update: $update 
          remove: $remove
        }) {
          author {
            id first_name last_name
          }
          where type target clientSubscriptionId
        }
      }
    `,
    variables: {
      options: {},
      create: true,
      update: true,
      remove: true,
    },
    context: {},
    callback: (err, data) => {
      console.log('subs output', data);
    },
  }).catch(err => console.log(`An error occured: ${err}`));
}

module.exports = function startSubscriptionServer(models, schema, options) {
  const subscriptionManager = SubscriptionManager(models, schema, new PubSub());
  SubscriptionServer(subscriptionManager, options);
};
