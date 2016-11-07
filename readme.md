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

Development
===

Setup
---

1. Install NodeJS (6.x LTS)
2. Run `npm install` in this directory.

Commands
---

* Build: `npm run build-all-development` or `npm run build-all-production`.
* Test: `npm test`

Major TODOs and Milestones:
===
- UI/UX work
- Public release
- Additional features (wiki, issue tracker, etc)