# Contributions

🎉 Thanks for considering contributing to this project! 🎉

These guidelines will help you send a pull request.

If you're submitting an issue instead, please skip this document.

If your pull request is related to a typo or the documentation being unclear, please click on the relevant page's `Edit`
button (pencil icon) and directly suggest a correction instead.

This project was made with ❤️. The simplest way to give back is by starring and sharing it online.

Everyone is welcome regardless of personal background. We enforce a [Code of conduct](CODE_OF_CONDUCT.md) in order to
promote a positive and inclusive environment.

## Development process

1. [Fork](https://help.github.com/articles/fork-a-repo/) this repository to your own GitHub account and then [clone](https://help.github.com/articles/cloning-a-repository/) it to your local device
2. Install dependencies with `yarn install`
3. You can look at the `packages` directory and find the `api` and `client` directory.
4. Create a new file `.env` inside of the `client` directory. If it doesn't exist, then copy the contents of `.env.example` into it to be able to run the client on a development environment.
5. Do the same for `api` create a `.env` inside of the `api` directory. If it doesn't exist, then copy the contents of `.env.example` into it to be able to run the server on a development environment.

### Running the server locally

1. Startup the server - Run `yarn start | yarn dev`

2. This will run the api and the client on http://localhost:9999 and http://localhost:8080 respectively.

### Testing

For now no test has been written. But we're looking towards writting tests.

## Pull Requests

We actively welcome your pull requests. Fork the repo and create your branch from `main`.

## Releasing

Merge the release PR

### Creating a prerelease

1. Create a branch named `releases/<tag>/<version>` with the version and tag you'd like to release.
2. Push the branch to the repo.

For example, a branch named `releases/rc/4.0.0` will create the version `v4.0.0-rc` and publish it under the `rc` tag.

## License

By contributing to Brimble, you agree that your contributions will be licensed
under its [Apache-2.0 license](LICENSE).
