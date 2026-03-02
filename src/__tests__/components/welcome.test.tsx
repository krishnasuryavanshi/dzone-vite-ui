import { Welcome } from '@/components/shared';
import { render, screen } from '@testing-library/react';

describe('Welcome Component', () => {
  it('Shoud render welcome message', () => {
    render(<Welcome />);
    const pElement = screen.getByTestId('welcome-text');

    expect(pElement).toHaveTextContent('Welcome to the DZ One Platform');
  });
});
