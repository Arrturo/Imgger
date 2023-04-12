import React from 'react';
import { render, screen } from '@testing-library/react';
import Message from '../Message';

test('renders message component with correct text', () => {
  const messageText = 'Example message';
  const { getByText } = render(<Message variant="success">{messageText}</Message>);
  const messageElement = getByText(messageText);
  expect(messageElement).toBeInTheDocument();
});