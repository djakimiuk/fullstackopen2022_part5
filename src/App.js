import { useState, useEffect, useRef } from "react";
import Blog from "./components/Blog";
import Notification from "./components/Notification";
import Togglable from "./components/Togglable";
import BlogForm from "./components/BlogForm";
import blogService from "./services/blogs";
import loginService from "./services/login";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [notificationMsg, setNotificationMsg] = useState({
    body: null,
    error: false,
  });

  const blogFormRef = useRef();

  useEffect(() => {
    const fetchAndSortBlogs = async () => {
      const blogs = await blogService.getAll();
      blogs.sort((blogA, blogB) => blogB.likes - blogA.likes);
      setBlogs(blogs);
    };
    fetchAndSortBlogs();
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedInUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const user = await loginService.login({ username, password });

      window.localStorage.setItem("loggedInUser", JSON.stringify(user));

      blogService.setToken(user.token);
      setUser(user);
      setUsername("");
      setPassword("");
    } catch (exception) {
      setNotificationMsg({ body: "Wrong credentials", error: true });
      setTimeout(() => {
        setNotificationMsg({
          body: null,
          error: false,
        });
      }, 5000);
    }
  };

  const handleLogout = () => {
    window.localStorage.removeItem("loggedInUser");
    setUser(null);
  };

  const addBlog = async (blogObject) => {
    try {
      blogFormRef.current.toggleVisibility();
      const savedBlog = await blogService.create(blogObject);
      setBlogs(blogs.concat({ ...savedBlog, user }));
      setNotificationMsg({
        body: `a new blog ${savedBlog.title} added`,
        error: false,
      });
      setTimeout(() => {
        setNotificationMsg({
          body: null,
          error: false,
        });
      }, 5000);
    } catch (error) {
      setNotificationMsg({ body: error.message, error: true });
      setTimeout(() => {
        setNotificationMsg({
          body: null,
          error: false,
        });
      }, 5000);
    }
  };

  const modifyBlog = async (blogId, modifiedBlogObject) => {
    try {
      await blogService.modify(blogId, modifiedBlogObject);
    } catch (error) {
      setNotificationMsg({ body: error.message, error: true });
      setTimeout(() => {
        setNotificationMsg({
          body: null,
          error: false,
        });
      }, 5000);
    }
  };

  const deleteBlog = async (blogId) => {
    try {
      const blogsArrayCopy = [...blogs];
      await blogService.deleteItem(blogId);
      setBlogs(blogsArrayCopy.filter((blog) => blog.id !== blogId));
    } catch (error) {
      setNotificationMsg({ body: error.message, error: true });
      setTimeout(() => {
        setNotificationMsg({
          body: null,
          error: false,
        });
      }, 5000);
    }
  };

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        username
        <input
          type="text"
          value={username}
          name="Username"
          id="username"
          onChange={({ target }) => setUsername(target.value)}
        ></input>
      </div>
      <div>
        password
        <input
          type="password"
          value={password}
          name="Password"
          id="password"
          onChange={({ target }) => setPassword(target.value)}
        ></input>
      </div>
      <button type="submit" id="login-button">
        login
      </button>
    </form>
  );

  const blogsList = (user) => (
    <div>
      <h2>blogs</h2>
      <p>
        {user.name} logged in{" "}
        <button id="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </p>
      <Togglable buttonLabel="create new blog" ref={blogFormRef}>
        <BlogForm createBlog={addBlog} />
      </Togglable>
      {blogs.map((blog) => (
        <Blog
          key={blog.id}
          blog={blog}
          user={user}
          modifyBlog={modifyBlog}
          deleteBlog={deleteBlog}
        />
      ))}
    </div>
  );

  return (
    <>
      <Notification message={notificationMsg} />
      {user === null && loginForm()}
      {user !== null && blogsList(user)}
    </>
  );
};

export default App;
