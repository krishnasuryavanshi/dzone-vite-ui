import { NoData } from '@/components/shared';
import { render, screen } from '@testing-library/react';

describe('NoData Component', () => {
  it('Shoud render title, subtitle and refresh button', () => {
    const handleRefresh = jest.fn();
    render(<NoData handleRefresh={handleRefresh} />);
    const title = screen.getByText('No Data Available');
    const subTitle = screen.getByText('There is currently no data available.');
    const refreshButton = screen.getByText('Refresh');

    expect(title).toBeInTheDocument();
    expect(subTitle).toBeInTheDocument();
    expect(refreshButton).toBeInTheDocument();
  });
});
