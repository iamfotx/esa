# ESA - Event Sourcing Application!

ESA emits events created in real-time using [Remix.run](https://remix.run/docs), Socket.io, and Mongoose!

# About the Application

This section illustrates what this application is capable of doing and what pages are available.

## Public Routes

### Home Page (`/`);

- It displays a list of first 20 events sorted by `createdAt` in descending order that are currently in the system.
  > if you see none, please be sure to follow `seed the DB` step listed under [Development](#development) section.
- One can scroll down to the bottom and will see a button `Load More` that will load the next 20 events unless it reaches to the end and replaces the button with `No More Events`.

- If a user is somewhere in the middle of the list and a new events is created from a different device/window, the list will be updated and the user will be scrolled to the top of the list.

### Login Page (`/login`);

> There's no way to sign up for the app. But you can create a user with the help of Seed Script. See [Seed the DB](#seed-the-db).

- It displays a login form.
- If the user is already logged in, it redirects to the [Create Event Page](#create-event-page-create-event).

## Protected Routes

### Create Event Page (`/create-event`);

- It displays a form to create an event.
- Once the user submits the form, it creates an event and redirects to the [Home Page](#home-page-).
- If the user is not logged in, it redirects to the [Home Page](#home-page-).

# Why Remix?

[Remix.run](https://remix.run/docs) is a full stack web framework that lets you focus on the user interface and work back through web standards to deliver a fast, slick, and resilient user experience. People are gonna love using your stuff.

### Things you get out of the box with Remix.run:

- It handles race conditions, cancellations, errors, and revalidations w/o even coding anything at all. It's baked in the framework.
- Most web apps fetch inside of components, creating request waterfalls, slower loads, and jank. Remix loads data in parallel on the server and sends a fully formed HTML document. Way faster, jank free.
- Through nested routes, Remix can eliminate nearly every loading state.
- Your websites run into problems, but with Remix they don’t need to be refreshed. Error handling is hard to remember and hard to do. That’s why it’s built in.

# Areas that could be improved and given some more thoughts?

- Styling - Current state is horrible (honestly, couldn't even write a bit).
- React pages/components can further be optimized using native react performance techniques to prevent unnecessary renders i.e with the uses of these hooks -> `useCallback`, `useMemo`, `React.memo`.
- Components/Files can be more modular.
- Error Handling - Currently, the error handling is very basic.
- Testing
- Cleanup work can be done.

## Development

> Make sure you've correct .env file in the root of the project - if you need one shoot me an email at: iamfotx@gmail.com.
> Clone the repo and run `yarn` to install dependencies.

### Seed the DB

This command will seed the database with some events along with an admin user with the email & password passed via `.env` file. Which you can then use to create more events.

```sh
yarn seed
```

### Run the server

Start the Remix development asset server and the Express server by running:

```sh
yarn dev
```

This starts your app in development mode, which will purge the server require cache when Remix rebuilds assets so you don't need a process manager restarting the express server.

Visit [localhost:3000](http://localhost:3000/) in your browser.

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
