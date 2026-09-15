import styles from './AboutPage.module.css';

function AboutPage() {
  return (
    <div className={styles.aboutPage}>
      <h2>About</h2>
      <p>
        A responsive todo list application developed with React, styled with CSS, and built with
        Vite.
      </p>
      <p>
        This application was built throughout Code the Dream's 11-week React course. With each
        lesson I learned new React concepts and applied them to this project to build a fully
        functional Todo List application
      </p>
      <h3>Features</h3>
      <ul>
        <li>Create, update, and/or delete todo list items</li>
        <li>Organize todos with sorting and filtering</li>
        <li>User authentication and private routes</li>
        <li>Responsive design for mobile, tablet, and desktop devices</li>
      </ul>
      <h3>Technologies</h3>
      <ul>
        <li>Frontend: React, React Router, CSS Modules</li>
        <li>State Management: Context API, useReducer</li>
        <li>Build Tools: Vite</li>
      </ul>
    </div>
  );
}

export default AboutPage;
