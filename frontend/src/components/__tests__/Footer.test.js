import React from 'react';
import { render, screen } from '@testing-library/react';
import Footer from '../Footer';

test(' it render copyright', () => {
  render(<Footer />);
  const textElement = screen.getByText(/copyright/i);
  expect(textElement).toBeInTheDocument();
});

test('it render GitHub link', () => {
  render(<Footer />);
  const linkElement = screen.getByRole('link', { name: "" });
  expect(linkElement).toBeInTheDocument();
  expect(linkElement).toHaveAttribute('href', 'https://github.com/Arrturo/PySquad');
});
