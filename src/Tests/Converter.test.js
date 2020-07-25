import React from 'react';
import { render } from '@testing-library/react';
import { Converter } from '../Components/Converter';

describe('Converter component', () => {

  test("rendered correctly", () => {

    const { container } = render(<Converter />);

    expect(container).toBeTruthy()

  })

});