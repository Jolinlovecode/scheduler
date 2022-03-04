# Interview Scheduler
#### This is a React-based single-page application (SPA) for users to create, edit and delete interview appointments in real-time.

It can:

1.Book interviews with selected time and interviewers.
2.Edit the details of an exiting interview.
3.Cancel an exiting interview.
4.Show and update how many slots are available for each day.
5.Present a confirmation when users attempt to cancel an interview.
6.Show a status indicator while asynchronous operations are in progress.
7.Show error message if request to the API is declined.
8.Makes API requests to load and persist data. We do not lose data after a browser refresh.

## Setup

- Clone this repository.
- Install dependencies using the npm install command.
- Start the web server using the npm start command.
- Clone the scheduler-api repository. Click here to link to [scheduler-api](https://github.com/SophiaL1024/scheduler-api).
- Follow its README.md to set up the api.
- Go to http://localhost:8000/ in your browser.

## Running Webpack Development Server


npm start


## Running Jest Test Framework


npm test


## Running Storybook Visual Testbed


npm run storybook


## Dependencies
- axios: ^0.21.1
- classnames: ^2.2.6,
- normalize.css: ^8.0.1,
- react: ^16.9.0,
- react-dom: ^16.9.0,
- react-scripts: 3.0.0


## Screenshots
***Create an Interview
![Create an interview](https://github.com/Jolinlovecode/scheduler/blob/master/doc/Create%20an%20Interview.png?raw=true)
***Show an interview
![Show an interview](https://github.com/Jolinlovecode/scheduler/blob/master/doc/Show%20an%20Interview.png?raw=true)
***Delete an interview
![Delete an interview](https://github.com/Jolinlovecode/scheduler/blob/master/doc/Delete%20an%20Interview.png?raw=true)
