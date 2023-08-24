import { useState } from "react";

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("");

  const addBlog = (event) => {
    event.preventDefault();

    createBlog({
      author: author,
      title: title,
      url: url,
    });

    setTitle("");
    setAuthor("");
    setUrl("");
  };

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={addBlog}>
        <div>
          title:
          <input
            type="text"
            value={title}
            name="Title"
            onChange={(event) => setTitle(event.target.value)}
          ></input>
        </div>
        <div>
          author:
          <input
            type="text"
            value={author}
            name="Author"
            onChange={(event) => setAuthor(event.target.value)}
          ></input>
        </div>
        <div>
          url:
          <input
            type="text"
            value={url}
            name="url"
            onChange={(event) => setUrl(event.target.value)}
          ></input>
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  );
};

export default BlogForm;
