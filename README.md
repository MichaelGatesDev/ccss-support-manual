# CCSS Support Manual [![Build Status](https://travis-ci.com/MichaelGatesDev/ccss-support-manual.svg?branch=master)](https://travis-ci.com/MichaelGatesDev/ccss-support-manual)


## Notes

This platform is designed specifically for SUNY Plattsburgh. Although you can make it work for any other workplace, it may become frustrating as some things are hardcoded (e.g. navigation links). Feel free to submit a pull-request to make it more modular if you'd like.


## Purpose

The purpose of this project is to create a data-modular, centralized platform for troubleshooting classroom issues.

The application is designed to work for SUNY Plattsburgh, but can easily be modified to work at any other organization or university as well.


## Development

To understand this project, you should know that the application is split into two main parts: the backend, which serves everything with an Express server, and the frontend, which is written in React and serves as the interface. 

It is best to think of this project as having multiple NodeJS sub-projects which all worktogether.

### Building

#### Pre-requisites

* [NodeJS](https://nodejs.org/en/) version 12.0 or higher
* [Yarn](https://yarnpkg.com/) version 1.19.1 or higher

#### Getting Started

1. Clone the repo
```
git clone git@github.com:MichaelGatesDev/ccss-support-manual.git
cd ccss-support-manual
```
2. Install dependencies
```
yarn
```
3. Transpile all typescript
```
yarn tsc
```

### Packaging the application into binaries

This package uses [zeit/pkg]() to create multiplatform binaries of NodeJS projects. It is a very powerful, useful, and lightweight tool which leaves our binaries at ~100MB which is a safe size. 

To package the binaries, run the following:
```
yarn build
```

This will create a `build` folder in the project root, which will contain 3 binaries: mac, windows, and linux. You do not need to include binaries that you do not need. (e.g. you don't need the window and mac binaries if you are running the program on linux)


### Running the application

The application is split into two main parts: backend, frontend. To run the application, you need to run **both** the backend **and** the frontend. 

To run the backend:

`yarn start:backend`

To run the frontend:

`yarn start:frontend`

If you are only developing on the backend, you do not need to run the frontend. If you are only writing code which does not rely on backend functions (e.g. RESTful data), then you can just run the frontend. Most times you'll end up running both.

### Contributing

#### Pull Requests

This project was written completely by myself but I am not opposed to community input. Feel free to [submit a pull request](https://github.com/MichaelGatesDev/ccss-support-manual/pulls) if you implement some cool features.

#### Issues / Feature Requests

If there's an issue with the application, whether it be a bug or glitch or a missing feature you'd like to see, please [submit an issue ticket](https://github.com/MichaelGatesDev/ccss-support-manual/issues). There is a handy search feature to find similar issues which can help you troubleshoot.


## Screenshots

### Home Page

![](https://i.imgur.com/vIbb8Vr.png)

### Room Example

![](https://i.imgur.com/cBtv1mz.png)