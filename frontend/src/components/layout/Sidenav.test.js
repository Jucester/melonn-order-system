import React from "react";
import { shallow, mount } from "enzyme";
import Sidenav from "./Sidenav";
import Orders from "../orders/Orders";
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { Route } from 'react-router-dom';

jest.mock('../orders/Orders');

describe("Sidenav", () => {

  it("renders Sidenav component without crashing", () => {
    shallow(<Sidenav />);
  });

  it("should render orders list when user clicks the ('/') route", () => {
    /*
    const component = mount(<MemoryRouter initialentries="{['/']}">
                                <Sidenav />
                            </MemoryRouter>
     );
    expect(component.find(Orders)).toHaveLength(1);*/

    Orders.mockImplementation(() => <div> Orders list </div> )

    render(
        <MemoryRouter initialEntries={['/']}>
          <Orders />
        </MemoryRouter>
    );

    expect(screen.getByText("Orders list")).toBeInTheDocument();

  });
  
  
})