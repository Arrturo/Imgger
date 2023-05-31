import React from 'react';
import { render, screen } from '@testing-library/react';
import CategoryItem from '../components/CategoryItem';
import { BrowserRouter as Router } from 'react-router-dom';

test('render category name', () => {
    const name = 'Python';
    render(
        <Router>
            <CategoryItem name={name} />
        </Router>
    );
    const title = screen.getByText(name);
    expect(title).toBeInTheDocument();
});

test('render a link to home page', () => {
    const name = 'Python';
    render(
        <Router>
            <CategoryItem id={name} />
        </Router>
    );
    const link = screen.getByRole('link');
    expect(link.getAttribute('href')).toBe('/category/Python');
});
