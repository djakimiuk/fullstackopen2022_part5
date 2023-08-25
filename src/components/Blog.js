import { useState } from "react";
const Blog = ({ blog, modifyBlog, user, deleteBlog }) => {
  const [visible, setVisible] = useState(false);
  const [likes, setLikes] = useState(blog.likes);

  const showWhenVisible = { display: visible ? "" : "none" };
  const showDeleteBtn = {
    display: blog.user.username === user.username ? "" : "none",
  };

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };

  const visibilityHandler = () => {
    setVisible(!visible);
  };

  const increaseLikes = () => {
    const updatedLikes = likes + 1;
    setLikes(updatedLikes);
    const modifiedBlog = { ...blog, likes: updatedLikes };
    modifyBlog(blog.id, modifiedBlog);
  };

  const deleteHandler = () => {
    if (window.confirm(`Remove blog ${blog.title} ${blog.author}`)) {
      deleteBlog(blog.id);
    }
    return;
  };

  return (
    <div style={blogStyle}>
      {blog.title} {blog.author}
      <button onClick={visibilityHandler}>{visible ? "hide" : "view"}</button>
      <br></br>
      <div style={showWhenVisible}>
        <a href={blog.url}>{blog.url}</a>
        <br></br>
        {likes}
        <button onClick={increaseLikes}>like</button>
        <br></br>
        {blog.user.name}
        <br></br>
        <button style={showDeleteBtn} onClick={deleteHandler}>
          remove
        </button>
      </div>
    </div>
  );
};

export default Blog;
