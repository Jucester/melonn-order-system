import React from "react";
import { shallow } from "enzyme";
import Header from "./Header";


describe("Header", () => {

  it("renders App component without crashing", () => {
    shallow(<Header />);
  });

  it("renders Header without crashing", () => {
    const wrapper = shallow(<Header />);
    const header = <h1> Melonn - Order Management System </h1>;

    expect(wrapper.contains(header)).toEqual(true);
  });
  
})