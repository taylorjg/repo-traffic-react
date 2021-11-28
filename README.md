# Description

I have used `React` for a few years and I have some familiarity with `TypeScript`
but this is my first attempt at using them together. The backend Express server
also uses `TypeScript`.

This little app lists your GitHub repos along with some traffic details.
It is a GitHub OAuth App - you need to authorize it to allow access to your GitHub repos.
Once authorized, it maintains the GitHub access token in an
encrypted cookie (`github-token`).

# Authorization steps

![Authorization steps](screenshots/collage.jpg)

# Things in this project that I already have experience with

* React and Hooks
* JavaScript
* Node.js
* Express
* Async/await, generators and async generators
* GitHub REST API
* Deployment to Heroku

# Things in this project that were new to me

* Node.js Express server with TypeScript
* React with TypeScript
* react-query
* MUI
* GitHub OAuth Apps
* CI/CD workflow using GitHub Actions (TODO)

# TODO

* ~~Turn this into a GitHub OAuth App~~
* ~~Add screenshots showing the authorization process~~
* Show totals (views, clones, stars, forks)
* Show user details
* Add CI/CD workflow using GitHub Actions
* Responsive UI
* Tests

# Links

* [GitHub REST API](https://docs.github.com/en/rest)
* [GitHub Actions](https://github.com/features/actions)
* [Building OAuth Apps](https://docs.github.com/en/developers/apps/building-oauth-apps)
* [OAuth Applications API](https://docs.github.com/en/rest/reference/apps#oauth-applications-api)
* [MUI: The React component library you always wanted](https://mui.com/)
* [React Query - Hooks for fetching, caching and updating asynchronous data in React](https://react-query.tanstack.com/)
