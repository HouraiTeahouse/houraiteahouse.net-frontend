[![Discord](https://discordapp.com/api/guilds/151219753434742784/widget.png)](https://discord.gg/VuZhs9V)

This is the frontend package for the Hourai Teahouse website.  Thus far it was written with a "get pieces working" mindset rather than a proper design/plan and thus it requires significant UI/UX work to be public-ready.

This is written in Angular 1.x with ES2015 as the baseline for Javascript.
CSSNext is used as the baseline for CSS, with Autoprefixer taking care of cross browser compatibility.

~~To run it locally, use your choice of method (http-server on WebContent directory, nginx config, whatever).
Sample nginx config has been provided.
Make sure to update the port # in app.js as appropriate for how you're running the backend.~~

Development
===

Setup
---

1. Install NodeJS (6.x LTS)
2. Run `npm install` in this directory.

Commands
---

* Build: `npm run build-all-development` or `npm run build-all-production`.
* Serve (Static): `npm run start` or `npm run start-production`.
* Test: `npm test`

Major TODOs and Milestones:
===
- UI/UX work
- Build/bundle system
- Public release
- Additional features (wiki, issue tracker, etc)