# Contributing

**You need to _`fork`_ this repository & _`clone`_ it onto your system.** Inside the cloned folder, create a `.env` file with the following contents:

```ini
INPUT_USERNAME=EXAMPLE_USERNAME
INPUT_GH_TOKEN=EXAMPLE_GH_TOKEN
INPUT_CODETIME_COOKIE_KEY=EXAMPLE_CODETIME_COOKIE_KEY
```

**IMPORTANT: Never commit the `.env` file to the repository!**

## Using containers (recommended)

> I recommend using [Podman](https://podman.io/) with Compose for containerization. This approach simplifies the development process and helps avoid potential issues caused by varying local environments.
>
> By trying out different things, I figured out that it's better to use something similar to Docker on Github for testing 🤗.

```sh
# Build the project and watch the logs
$ podman compose -p codetime-readme -f ./docker-compose.yml up
# Cleanup when you're done
$ podman compose -p codetime-readme -f ./docker-compose.yml down
```

## Using Node.js

> If you prefer not to use containers, you can run the project directly with Node.js. Please ensure you have Node.js version 18.x or higher installed.

```sh
# Install dependencies
$ npm install
# Run the script
$ npm start
```

# Wrapping Up

In conclusion, for local development and testing, feel free to use Node.js directly. However, when you're ready to submit a pull request, I strongly recommend testing your changes using containers.

Happy contributing!