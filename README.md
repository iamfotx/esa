# ESA - Event Sourcing Application!

ESA emits events created in real-time using [Remix.run](https://remix.run/docs), Socket.io, and Mongoose!

# Why Remix?

[Remix.run](https://remix.run/docs) is a full stack web framework that lets you focus on the user interface and work back through web standards to deliver a fast, slick, and resilient user experience. People are gonna love using your stuff.

### Things you get out of the box with Remix.run:

- It handles race conditions, cancellations, errors, and revalidations w/o even coding anything at all. It's baked in the framework.
- Most web apps fetch inside of components, creating request waterfalls, slower loads, and jank. Remix loads data in parallel on the server and sends a fully formed HTML document. Way faster, jank free.
- Through nested routes, Remix can eliminate nearly every loading state.
- Your websites run into problems, but with Remix they don’t need to be refreshed. Error handling is hard to remember and hard to do. That’s why it’s built in.

# Areas that could be improved?

- Styling - Current state is horrible (honestly, couldn't even write a bit).
- React pages/components can further be optimized using native react performance techniques to prevent unnecessary renders i.e with the uses of these hooks -> `useCallback`, `useMemo`, `React.memo`.
- Components/Files can be more modular.
- Testing
- Cleanup work can be done.

## Development

> Make sure you've correct .env file in the root of the project - if you need one shoot me an email at: `iamfotx@gmail.com`.
> Clone the repo and run `yarn` to install dependencies.

- Seed the DB

  - `yarn seed`

- Start the Remix development asset server and the Express server by running:

  - `yarn dev`

This starts your app in development mode, which will purge the server require cache when Remix rebuilds assets so you don't need a process manager restarting the express server.

- Visit [localhost:3000](http://localhost:3000/) in your browser.

## Deployment

First, build your app for production:

```sh
npm run build
```

Then run the app in production mode:

```sh
npm start
```

Now you'll need to pick a host to deploy it to.

### DIY

If you're familiar with deploying express applications you should be right at home just make sure to deploy the output of `remix build`
