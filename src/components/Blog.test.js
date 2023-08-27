import React from "react";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Blog from "./Blog";

test("renders content", () => {
  const blog = {
    title: "Component test with react-testing-library",
    author: "Dawid",
    user: { username: "Dawid" },
    url: "https://google.com",
    likes: 120,
  };

  render(<Blog blog={blog} user={{ username: "Dawid" }} />);

  const title = screen.queryByText(
    /Component test with react-testing-library/i
  );
  const author = screen.queryByText(/Dawid/i);
  const url = screen.queryByText("https://google.com");
  const likes = screen.queryByText(120);
  expect(title).toBeVisible();
  expect(author).toBeVisible();
  expect(url).not.toBeVisible();
  expect(likes).not.toBeVisible();
});

test("clicking the button view makes url and likes visible", async () => {
  const blog = {
    title: "Component test with react-testing-library",
    author: "Dawid",
    user: { username: "Dawid" },
    url: "https://google.com",
    likes: 120,
  };

  render(<Blog blog={blog} user={{ username: "Dawid" }} />);

  const user = userEvent.setup();
  const button = screen.getByText("view");
  await user.click(button);

  const url = screen.getByText("https://google.com");
  const likes = screen.getByText(120);
  expect(url).toBeVisible();
  expect(likes).toBeVisible();
});

test("clicking the like button twice calls event handler twice as well", async () => {
  const blog = {
    title: "Component test with react-testing-library",
    author: "Dawid",
    user: { username: "Dawid" },
    url: "https://google.com",
    likes: 120,
  };

  const mockHandler = jest.fn();

  render(
    <Blog blog={blog} user={{ username: "Dawid" }} modifyBlog={mockHandler} />
  );

  const user = userEvent.setup();
  const viewButton = screen.getByText("view");
  await user.click(viewButton);

  const likeButton = screen.getByText("like");
  await user.click(likeButton);
  await user.click(likeButton);

  expect(mockHandler.mock.calls).toHaveLength(2);
});
