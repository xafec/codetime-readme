# CodeTime Stats in Readme

<p>
<a href="https://codetime.dev">CodeTime</a> Stats on your Profile Readme:
</p>

![preview](./assets/image.png)

## Update your Readme

Add a comment to your README like the follows

```md
<!--START_SECTION:codetime-->
<!--END_SECTION:codetime-->
```

The lines will be our entrypoints for this action.

## Using it

To use CodeTime Stats in your README, you need to obtain a cookie token from CodeTime and add it to your repository secrets. Here's how:

1. Go to the [CodeTime website](https://codetime.dev) and sign in to your account.
2. Once you're signed in, open the developer tools in your browser (usually by right-clicking on the page and selecting `Inspect` or `Inspect Element`).
3. In the developer tools, navigate to the `Network` tab.
4. Refresh the page to see the network requests.
5. Look for a request with the name like `top?field=platform&minutes...` and click on it.
6. In the request details, go to the `Headers` section.
7. Find the cookie and copy everything after CODETIME_SESSION=. Example: `CODETIME_SESSION=MASDkhiagbdyhoi21d89y21bndsgaDPADHoiha98yd9qw=`, `MASDkhiagbdyhoi21d89y21bndsgaDPADHoiha98yd9qw=` is the token.

Once you have the cookie token, you can add it to your repository secrets:

1. Go to your repository on GitHub.
2. Click on the `Settings` tab.
3. In the left sidebar, click on `Secrets and variables` and `Actions`.
4. Click on `New repository secret`.
5. Enter a name for the secret (e.g., `CODETIME_COOKIE_KEY`) and paste the cookie token value in the `Value` field.
6. Click on `Add secret` to save it.

That's it. The Action runs everyday at 00.00 UTC

### Profile Repository

**You wouldn't need an GitHub Access Token since GitHub Actions already makes one for you.**

Here is a sample workflow file for you to get started:
```yml
name: CodeTime - Readme

on:
  schedule:
    - cron: "0 0 * * *"

jobs:
  update-readme:
    name: CodeTime's Graph in Readme
    runs-on: ubuntu-latest
    steps:
      - uses: xafec/codetime-readme@beta09
        with:
          CODETIME_COOKIE_KEY: ${{ secrets.CODETIME_COOKIE_KEY }}
```

## Contribution

Feel free to contribute to this project. Any kind of help is appreciated ❤️