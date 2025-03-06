# kafala

This application was generated using JHipster 8.5.0, you can find documentation and help at [https://www.jhipster.tech/documentation-archive/v8.5.0](https://www.jhipster.tech/documentation-archive/v8.5.0).

This application was generated using the [NodeJS blueprint](https://github.com/jhipster/generator-jhipster-nodejs) of JHipster 8.5.0, you can find documentation and help at [https://www.jhipster.tech/documentation-archive/v8.5.0](https://www.jhipster.tech/documentation-archive/v8.5.0). For any questions you can refer to the stream lead: [Angelo Manganiello](https://github.com/amanganiello90).

## Project Structure

Node is required for generation and recommended for development. `package.json` is always generated for a better development experience with prettier, commit hooks, scripts and so on.

In the project root, JHipster generates configuration files for tools like git, prettier, husky, and others that are well known and you can find references in the web.

- `.yo-rc.json` - Yeoman configuration file
  JHipster configuration is stored in this file at `generator-jhipster` key. You may find `generator-jhipster-*` for specific blueprints configuration.
- `.yo-resolve` (optional) - Yeoman conflict resolver
  Allows to use a specific action when conflicts are found skipping prompts for files that matches a pattern. Each line should match `[pattern] [action]` with pattern been a [Minimatch](https://github.com/isaacs/minimatch#minimatch) pattern and action been one of skip (default if ommited) or force. Lines starting with `#` are considered comments and are ignored.
- `.jhipster/*.json` - JHipster entity configuration files
- `/docker/` - Docker configurations for the application and services that the application depends on
- `/client/` - Web application.
- `/server/` - NodeJS server application.

## Development

### JWT authentication and authorization

Congratulations! You've selected an excellent way to secure your NHipster application. If you're not sure what JSON Web Token (JWT) is, please see [What the Heck is JWT?](https://jwt.io/introduction/)

Your app uses, to get and use the token, the `server//src/config/application.yml` settings:

```yaml
  ...
  security:
    authentication:
        jwt:
            # This token must be encoded using Base64 and be at least 256 bits long (you can type `openssl rand -base64 64` on your command line to generate a 512 bits one)
            base64-secret: {yourSecret}
            # Token is valid 24 hours
            token-validity-in-seconds: 86400
            token-validity-in-seconds-for-remember-me: 2592000
```

You can use the default secret created from the app, or change it.
So to get a token, you have to pass a POST request on the _api/authenticate_ url with **UserLoginDTO** as body.
For this you can use **swagger ui** on **/api/v2/api-docs** path, or the client login page (if you have generated it).

### Using NestJS CLI

You can also use [NestJS CLI][] to generate some custom server code.

For example, the following command:

    nest generate module my-module

will generate the file:

    create server//src/my-component/my-component.module.ts

### Building and running

#### Running

```bash
npm run start:app
```

#### Building

```bash
npm run build:app
```

The build folder with all compiled sources will be **server//dist**.

> For more explanation about full stack server/client build refer to [server//README.md](server//README.md)
> Before you can build this project, you must install and configure the following dependencies on your machine:

1. [Node.js](https://nodejs.org/): We use Node to run a development web server and build the project.
   Depending on your system, you can install Node either from source or as a pre-packaged bundle.

After installing Node, you should be able to run the following command to install development tools.
You will only need to run this command when dependencies change in [package.json](package.json).

```
npm install
```

We use npm scripts and [Webpack][] as our build system.

Run the following commands in two separate terminals to create a blissful development experience where your browser
auto-refreshes when files change on your hard drive.

```
./mvnw
npm start
```

Npm is also used to manage CSS and JavaScript dependencies used in this application. You can upgrade dependencies by
specifying a newer version in [package.json](package.json). You can also run `npm update` and `npm install` to manage dependencies.
Add the `help` flag on any command to see how you can use it. For example, `npm help update`.

The `npm run` command will list all of the scripts available to run for this project.

### PWA Support

JHipster ships with PWA (Progressive Web App) support, and it's turned off by default. One of the main components of a PWA is a service worker.

The service worker initialization code is commented out by default. To enable it, uncomment the following code in `client/src/index.html`:

```html
<script>
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./service-worker.js').then(function () {
      console.log('Service Worker Registered');
    });
  }
</script>
```

Note: [Workbox](https://developers.google.com/web/tools/workbox/) powers JHipster's service worker. It dynamically generates the `service-worker.js` file.

### Managing dependencies

For example, to add [Leaflet][] library as a runtime dependency of your application, you would run following command:

```
npm install --save --save-exact leaflet
```

To benefit from TypeScript type definitions from [DefinitelyTyped][] repository in development, you would run following command:

```
npm install --save-dev --save-exact @types/leaflet
```

Then you would import the JS and CSS files specified in library's installation instructions so that [Webpack][] knows about them:
Note: There are still a few other things remaining to do for Leaflet that we won't detail here.

For further instructions on how to develop with JHipster, have a look at [Using JHipster in development][].

## Building for production

## Testing

### Client tests

Unit tests are run by [Jest][]. They're located in [client/test/](client/test/) and can be run with:

```
npm test
```

## Others

### Code quality using Sonar

Sonar is used to analyse code quality. You can start a local Sonar server (accessible on http://localhost:9001) with:

```
docker compose -f src/main/docker/sonar.yml up -d
```

Note: we have turned off forced authentication redirect for UI in [src/main/docker/sonar.yml](src/main/docker/sonar.yml) for out of the box experience while trying out SonarQube, for real use cases turn it back on.

You can run a Sonar analysis with using the [sonar-scanner](https://docs.sonarqube.org/display/SCAN/Analyzing+with+SonarQube+Scanner).
Then, run a Sonar analysis in the server/ folder:

```sh
npm run sonar:scanner
```

For more information, refer to the [Code quality page][].

[JHipster Homepage and latest documentation]: https://www.jhipster.tech
[JHipster 8.5.0 archive]: https://www.jhipster.tech/documentation-archive/v8.5.0
[Using JHipster in development]: https://www.jhipster.tech/documentation-archive/v8.5.0/development/
[Using Docker and Docker-Compose]: https://www.jhipster.tech/documentation-archive/v8.5.0/docker-compose
[Using JHipster in production]: https://www.jhipster.tech/documentation-archive/v8.5.0/production/
[Running tests page]: https://www.jhipster.tech/documentation-archive/v8.5.0/running-tests/
[Code quality page]: https://www.jhipster.tech/documentation-archive/v8.5.0/code-quality/
[Setting up Continuous Integration]: https://www.jhipster.tech/documentation-archive/v8.5.0/setting-up-ci/
[Node.js]: https://nodejs.org/
[NPM]: https://www.npmjs.com/
[Node.js]: https://nodejs.org/
[Webpack]: https://webpack.github.io/
[Jest]: https://facebook.github.io/jest/
[NestJS]: https://nestjs.com/
[NestJS CLI]: https://docs.nestjs.com/cli/usages
[Webpack]: https://webpack.github.io/
[BrowserSync]: https://www.browsersync.io/
[Jest]: https://facebook.github.io/jest/
[Leaflet]: https://leafletjs.com/
[DefinitelyTyped]: https://definitelytyped.org/
