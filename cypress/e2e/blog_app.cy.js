describe("Blog app", () => {
  beforeEach(function () {
    cy.request("POST", `${Cypress.env("BACKEND")}/testing/reset`);
    const user = {
      name: "Dawid",
      username: "dawid123",
      password: "dawid123",
    };
    cy.request("POST", `${Cypress.env("BACKEND")}/users`, user);
    cy.visit("/");
  });

  it("Login form is shown", () => {
    cy.contains("login");
    cy.contains("username");
    cy.contains("password");
  });

  describe("Login", function () {
    it("succeeds with correct credentials", function () {
      cy.get("#username").type("dawid123");
      cy.get("#password").type("dawid123");
      cy.get("#login-button").click();
      cy.contains("Dawid logged in");
    });

    it("fails with wrong credentials", function () {
      cy.get("#username").type("dawid123");
      cy.get("#password").type("dawid1234");
      cy.get("#login-button").click();
      cy.get(".error")
        .should("contain", "Wrong credentials")
        .and("have.css", "color", "rgb(255, 0, 0)")
        .and("have.css", "border-style", "solid");
      cy.get("html").should("not.contain", "Dawid logged in");
    });
  });

  describe("When logged in", function () {
    beforeEach(function () {
      cy.login({ username: "dawid123", password: "dawid123" });
    });
    it("A blog can be created", function () {
      cy.contains("create new blog").click();
      cy.get("#title-input").type("Cypress test title");
      cy.get("#author-input").type("Cypress test author");
      cy.get("#url-input").type("http://cypress.io");
      cy.get("#addBlog-button").click();
      cy.contains("Cypress test title");
    });
  });

  describe.only("When a blog is created", function () {
    beforeEach(function () {
      cy.login({ username: "dawid123", password: "dawid123" });
      cy.createBlog({
        title: "Cypress test title",
        author: "Cypress test author",
        url: "http://cypress.io",
      });
    });

    it("The user can like a blog", function () {
      cy.contains("Cypress test title")
        .parent()
        .within(() => {
          cy.contains("view").click();
          cy.get(".likes").invoke("text").as("initialLikes");
          cy.wait(1000);
          cy.contains("like").click();
          cy.get(".likes").invoke("text").should("not.equal", "@initialLikes");
        });
    });

    it("The user who created a blog can delete it", function () {
      cy.contains("Cypress test title")
        .parent()
        .within(() => {
          cy.contains("view").click();
          cy.contains("remove").click();
        });
      cy.contains("Cypress test title").should("not.exist");
    });

    it.only("Only the creator can see the delete button of a blog", function () {
      cy.contains("Cypress test title")
        .parent()
        .within(() => {
          cy.contains("view").click();
          cy.get("#remove-button").should("be.visible");
        });
      cy.get("#logout-button").click();
      const user = {
        name: "Marek",
        username: "marek123",
        password: "marek123",
      };
      cy.request("POST", `${Cypress.env("BACKEND")}/users`, user);
      cy.login({ username: "marek123", password: "marek123" });
      cy.contains("Cypress test title")
        .parent()
        .within(() => {
          cy.contains("view").click();
          cy.get("#remove-button").should("not.be.visible");
        });
    });
  });
});
