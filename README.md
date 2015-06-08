Refer Madness
=============

[Refer Madness](https://www.refer-madness.com) is a web application for finding and submitting referral codes for any subscription service. The goal of this application is to replace the "friend" from "Refer-a-Friend" with "stranger" or "anonymous internet person."

Backend is written in Go, frontend is largely ReactJS and SASS. The easiest way to compile and run the app is with [docker-compose](https://github.com/docker/compose):

```
$ docker-compose build
$ docker-compose up
```

Which will download the application dependencies and then watch the SASS, JSX, and Go directories for changes and recompile as necessary. A new dependency means re-running `docker-compose build` to generate a new refermadness image.
