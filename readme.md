[![Discord](https://discordapp.com/api/guilds/151219753434742784/widget.png)](https://discord.gg/VuZhs9V)

This is the frontend package for the Hourai Teahouse website.
Thus far it was written with a "get pieces working" mindset rather than a
proper design/plan and thus it requires significant UI/UX work to be public
ready.

The source code is written to the Angular 1.x framework.
ES2015 is used as the baseline for Javascript, using `webpack`, `babel` and `core-js`.
CSSNext is used as the baseline for CSS, using `postcss` with `postcss-cssnext`.

To run it locally, use your choice of method (http-server on WebContent directory, nginx config, whatever).
Sample nginx config has been provided.
Make sure to update the port # in app.js as appropriate for how you're running the backend.
In addition, make sure the server you use has URL rewriting enabled, so that the 'index.html' is returned
for file paths that can't be resolved. A server that works well is [spa-serve](https://github.com/adamshiervani/spa-serve), installable
via NPM.

Development
===

Setup
---

0. Install NodeJS (6.x LTS) (For Linux users, go [here](https://nodejs.org/en/download/package-manager/).
0. Run `npm install` in this directory.

Commands
---

* Build: `npm run build-all-development` or `npm run build-all-production`.
* Test: `npm test`

To properly serve the files locally, you must have a static file server capable
of working with single page applications. For this, we suggest using
[spa-serve](https://www.npmjs.com/package/spa-serve): simply install via `npm
install -g spa-serve`, and execute `spa-serve` in the built `dist` directory
after running the given build commands.

NOTE: Running `npm run build-all-production` will direct all API calls to the
production backend at `api.houraiteahouse.net`. For testing locally, use the
development version instead.

Major TODOs and Milestones:
===
- UI/UX work
- Public release
- Additional features (wiki, issue tracker, etc)
