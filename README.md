# Todo List

A responsive todo list application developed with React, styled with CSS, and built with Vite.

## Screenshots

### Desktop

<img width="1908" height="963" alt="demo" src="https://github.com/user-attachments/assets/eeb6dbdb-fb1f-4e5a-98df-49a0cb3336d6" />

### Mobile

<img width="396" height="779" alt="mobiledemo" src="https://github.com/user-attachments/assets/c97d3697-8fc2-478f-8f3c-98c862212632" />

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

## Available Scripts

`npm run dev` - start the dev server in the current directory

`npm run build` - build the application for production

`npm run lint` - lint the application code using ESLint

`npm run preview` - locally preview the production build

## Design Decisions

I tried to go with a minimal stying approach to limit distractions since this is a todo list application.

## What I learned

This project was built throughout Code The Dream's 11-week React course. Each week I learned new concepts and applied them to this Todo List application. The most important concept I learned was state management using hooks such as `useState` and `useEffect`. One of the more challenging things I learned was how to use `useReducer`. I had come across reducers previously in my React learning journey, but the idea of dispatching actions instead of setting state had always confused me. After reading Code the Dream's lesson on `useReducer` and completing the curriculum exercise on this topic, I was able to grasp the concept and successfully refactor my many `useState` calls into a single `useReducer` call, making my code more organized and readable.

## Future Plans

- Support for multiple todo lists
- Ability to add due dates to todo items
- Dark mode and light/dark mode toggle

## License Information

MIT License

Copyright (c) 2019-present, VoidZero Inc. and Vite contributors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

## Contact Information

My github profile:

[https://github.com/jacquelineb](https://github.com/jacquelineb)
