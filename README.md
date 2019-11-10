
# Survyay API Documents

In order to provide ease of access to the database for our Up in the Gunks project, I have created an api that when running, provides the team with all of the access they will need.

## Getting Started

These instructions will run the API that is currently connected to our production server. Please make any needed changes to the code that would properly grant you access to the database that you intend to make changes to.

### Prerequisites

What things you need to install the software. Must have Node.js and npm installed. Check that you have it by running the following in cmd.
```
node -v
npm -v
```

### Installing

What to do in order to install the project

Clone or branch the api using bash

```
git clone <Project URL>
```

Open command prompt and navigate to the project folder

```
C:\Users\(...)\SurvyayAPI>
```
Use npm to install all dependencies then start the express port

```
npm install
```
```
npm start
```
### Testing access

What to do in order to ensure that you are connected

In a browser or from a REST client, access the following

```
'localhost:<Port>/projects' (ex.http://localhost:7000/projects)
```

Here you can view all projects that have been created as a part of the database. Feel free to also run some of the direct routes of the api to test a get or post
