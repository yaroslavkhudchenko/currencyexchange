import React from 'react';
import { render } from '@testing-library/react';
import { App } from './../Components/App';

describe('App component', () => {

  test("rendered correctly", () => {

    const { container } = render(<App />);

    expect(container).toBeTruthy()

  })
  
});
