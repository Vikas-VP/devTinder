// import { render, screen } from "@testing-library/react";
// import LoginPage from "../Login";
// import "@testing-library/jest-dom";
// import axios from "axios";

// jest.mock("axios");

// test("render login page", () => {
//   render(<LoginPage />);
//   const loginPage = screen.getElementByTagName("h2");
//   expect(loginPage).toBeInTheDocument();
// });

import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import store from "../../store/configureStore";
import { BrowserRouter } from "react-router";
import LoginPage from "../Login";

describe("LoginPage", () => {
  it("should render the login form and display 'Login' text", () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <LoginPage />
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByText("Login")).toBeInTheDocument();
  });
});
