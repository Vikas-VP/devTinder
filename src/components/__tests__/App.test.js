import { render, screen } from "@testing-library/react";
import { sum } from "../sum";
//import LoginPage from "../Login";

test("renders learn react link", () => {
  // render(<LoginPage />);
  // const linkElement = screen.getByText(/Login/i);
  expect(sum(1, 2)).toBe(3);
});
