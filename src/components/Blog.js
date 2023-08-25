import { useState } from "react";
const Blog = ({ blog, modifyBlog }) => {
  const [visible, setVisible] = useState(false);
  const [likes, setLikes] = useState(blog.likes);

  const showWhenVisible = { display: visible ? "" : "none" };

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

  const increaseLikes = (blogId) => {
    const updatedLikes = likes + 1;
    setLikes(updatedLikes);
    const modifiedBlog = { ...blog, likes: updatedLikes };
    modifyBlog(blogId, modifiedBlog);
  };

  return (
    <div style={blogStyle}>
      {blog.title} {blog.author}
      <button onClick={visibilityHandler}>{visible ? "hide" : "view"}</button>
      <br></br>
      <div style={showWhenVisible}>
        {blog.url}
        <br></br>
        {likes}
        <button onClick={() => increaseLikes(blog.id)}>like</button>
        <br></br>
        {blog.user.name}
      </div>
    </div>
  );
};

export default Blog;
