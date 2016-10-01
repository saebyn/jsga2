# jsga2

This is a rewrite of [jsga](https://github.com/saebyn/jsga), a genetic algorithm demo I wrote about five years ago.

I have a version of this running at http://jsga2.saebyn.info/

I was looking for an excuse to try writing a
very basic React app, just to try that out without
any extras (Clojurescript, Om, etc).


# Running locally

If you have [docker-compose](https://www.docker.com/products/docker-compose) installed, you can run this project by executing:

```bash
docker-compose up
```

Otherwise, you'll need a fairly recent NodeJS version installed to run:

```bash
npm install
npm run serve
```

In either case, you should see something like this:

```
gulp_1  | [12:37:52] Finished 'webpack:watch' after 8.32 s
gulp_1  | [12:37:52] Starting 'watch'...
gulp_1  | [12:37:52] Finished 'watch' after 58 ms
gulp_1  | [12:37:52] Starting 'browsersync'...
gulp_1  | [12:37:52] Finished 'browsersync' after 37 ms
gulp_1  | [12:37:52] Finished 'serve' after 8.42 s
gulp_1  | [BS] [BrowserSync SPA] Running...
gulp_1  | [BS] Access URLs:
gulp_1  |  -----------------------------------
gulp_1  |        Local: http://localhost:3000
gulp_1  |     External: http://172.20.0.2:3000
gulp_1  |  -----------------------------------
gulp_1  |           UI: http://localhost:3001
gulp_1  |  UI External: http://172.20.0.2:3001
gulp_1  |  -----------------------------------
gulp_1  | [BS] Serving files from: .tmp
gulp_1  | [BS] Serving files from: src
```

Then you can use the local access URL (http://localhost:3000) to view the app.


## License

Copyright (c) 2012-2016 John Weaver
All Rights Reserved.

The source files included in this repository are licensed under the [MIT license](http://www.opensource.org/licenses/mit-license.php).
