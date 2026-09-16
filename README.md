# Todo List

A responsive todo list application developed with React, styled with CSS, and built with Vite.

## Screenshots

ADD SCREENSHOTS

## Features

- Create, update, and/or delete todo list items
- Organize todos with sorting and filtering
- User authentication and private routes
- Responsive design for mobile, tablet, and desktop devices

## Technologies

- **Frontend**: React, React Router, CSS Modules
- **State Management**: Context API, useReducer
- **Build Tool**: Vite

## Installation and Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/jacquelineb/todo-list-CTD.git
   ```

2. Open a terminal at the root of the project and install the dependencies

   ```bash
   cd todo-list-CTD
   npm install
   ```

3. Run the development server

   ```bash
   npm run dev
   ```

4. View the application by visiting [http://localhost:3001](http:localhost:3001) in your browser

## What I learned

This project was built throughout Code The Dream's 11-week React course. Each week I learned new concepts and applied them to this Todo List application. The most important concept I learned was state management using hooks such as `useState` and `useEffect`. One of the more challenging things I learned was how to use `useReducer`. I had come across reducers previously in my React learning journey, but the idea of dispatching actions instead of setting state had always confused me. After reading Code the Dream's lesson on `useReducer` and completing the curriculum exercise on this topic, I was able to grasp the concept and successfully refactor my many `useState` calls into a single `useReducer` call, making my code more organized and readable.

## Future Plans

- Support for multiple todo lists
- Ability to add due dates to todo items
- Dark mode and light/dark mode toggle
