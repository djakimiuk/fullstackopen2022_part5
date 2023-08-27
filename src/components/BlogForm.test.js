import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import BlogForm from "./BlogForm";
import userEvent from "@testing-library/user-event";

test("Blog form calls the event handler with the right details when a new blog is created", async () => {
  const createBlog = jest.fn();
  const user = userEvent.setup();

  const { container } = render(<BlogForm createBlog={createBlog} />);

  const titleInput = container.querySelector("#title-input");
  const authorInput = container.querySelector("#author-input");
  const urlInput = container.querySelector("#url-input");
  const createButton = screen.getByText("create");

  await user.type(titleInput, "Test Title");
  await user.type(authorInput, "Test Author");
  await user.type(urlInput, "Test Url");
  await user.click(createButton);

  expect(createBlog.mock.calls).toHaveLength(1);
  expect(createBlog.mock.calls[0][0].title).toBe("Test Title");
  expect(createBlog.mock.calls[0][0].author).toBe("Test Author");
  expect(createBlog.mock.calls[0][0].url).toBe("Test Url");
});
