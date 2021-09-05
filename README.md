# FitMania React Native App

**Find a training partner, open running groups, plan football games and train together with friends!**

## Overview

This repo is the mobile frontend for my FitMania full-stack project. FitMania is a social platform to interact with people with common sport preferences and hobbies. It consists from 3 different repositories, a Nodejs backend, a React web app and a React Native app.

This is React Native app written in Typescript.

The app allows user authentication, post and comment publication. The user may create sport workout session, where other users may join and participate. Users may create groups based on their preferred sport and join other groups. All of the events surrounding workout session and comments on posts trigger app notifications. Users may create and update their profile and show other users their preferable and undesirable sports.

## Project folder structure

> Entrypoint -> index.js

- Android

  - Build and other configs related to Android

- Ios

  - Build and other configs related to IOS

> Src

- Components

  - Shared components used thourghout the app

- i18n

  - Internalization files

- Interfaces

  - Entities of the system

- Navigation

  - Auth navigator - shown only to unauthorized users and allows users to register and login
  - Home navigator - shown only to authorized users and allows access to all app functionality

- Redux
  - Actions
    - Functions that affect global state
  - Reducers
    - App level state separated into logical blocks
  - Types
    - Unique string declarations per use case
- Screen
  - A screen per use case
- Utils
  - Utilities used thourghout the app

### How to run

First setup your system to run either ios or android builds.

[Start here](https://reactnative.dev/docs/environment-setup)

#### Environment setup

> Node version 14+ is mandatory

Replace all in angle brackets to run locally

- ENV: \<development|production\>
- API_URL: \<localhost|domain\>

Run locally

```
npm i
npm start
npm run android
```

Build Android apk

```
cd android
./gradlew assembleRelease
```