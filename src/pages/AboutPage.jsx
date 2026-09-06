function AboutPage() {
  return (
    <div>
      <h2>About</h2>
      <p>
        This is a todo list application built throughout Code the Dream's 11-week React course.
      </p>
      <p>
        With each lesson we learned new React concepts and applied them to this project to build
        a fully functional Todo List application
      </p>
      <h3>Features</h3>
      <ul>
        <li>
          User authentication - users can create an account to store their todo list items
        </li>
        <li>Todo list items can be updated and/or checked off as completed</li>
        <li>Items can be sorted creation date or title for readability</li>
      </ul>
      <h3>Technologies</h3>
      <ul>
        <li>React</li>
        <li>React Router</li>
        <li>Vite</li>
      </ul>
    </div>
  );
}

export default AboutPage;
