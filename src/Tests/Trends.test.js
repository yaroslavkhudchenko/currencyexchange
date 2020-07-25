import React from 'react';
import { render } from '@testing-library/react';
import { Trends } from './../Components/Trends';

describe('Trends component', () => {

  test("rendered correctly", () => {

    const { container } = render(<Trends />);

    expect(container).toBeTruthy()

  })

});