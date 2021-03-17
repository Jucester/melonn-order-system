import React from "react";
import { shallow } from "enzyme";
import App from "./App";

/*
test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
}); */

describe("App", () => {

  it("renders App component without crashing", () => {
    shallow(<App />);
  });
/*
  it("renders App Header without crashing", () => {
    const wrapper = shallow(<App />);
    const header = (<header className="barra">
                        <div className="contenedor">
                            <h1> Melonn - Order Management System </h1>
                        </div>
                    </header>);
    expect(wrapper.contains(header)).toEqual(true);
  });*/
  
})