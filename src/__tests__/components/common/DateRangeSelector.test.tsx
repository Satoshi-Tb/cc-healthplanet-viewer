import { render, screen, fireEvent } from '@testing-library/react';
import { DateRangeSelector } from '@/components/common/DateRangeSelector';

describe('DateRangeSelector', () => {
  const mockOnRangeChange = jest.fn();

  beforeEach(() => {
    mockOnRangeChange.mockClear();
  });

  it('renders all toggle buttons', () => {
    render(
      <DateRangeSelector
        selectedRange="month"
        onRangeChange={mockOnRangeChange}
      />
    );

    expect(screen.getByText('週次')).toBeInTheDocument();
    expect(screen.getByText('月次')).toBeInTheDocument();
    expect(screen.getByText('年次')).toBeInTheDocument();
  });

  it('shows selected range as active', () => {
    render(
      <DateRangeSelector
        selectedRange="week"
        onRangeChange={mockOnRangeChange}
      />
    );

    const weekButton = screen.getByText('週次');
    expect(weekButton).toHaveAttribute('aria-pressed', 'true');
  });

  it('calls onRangeChange when a different range is selected', () => {
    render(
      <DateRangeSelector
        selectedRange="month"
        onRangeChange={mockOnRangeChange}
      />
    );

    fireEvent.click(screen.getByText('週次'));
    expect(mockOnRangeChange).toHaveBeenCalledWith('week');
  });

  it('does not call onRangeChange when the same range is clicked', () => {
    render(
      <DateRangeSelector
        selectedRange="month"
        onRangeChange={mockOnRangeChange}
      />
    );

    fireEvent.click(screen.getByText('月次'));
    expect(mockOnRangeChange).not.toHaveBeenCalled();
  });

  it('displays the correct title', () => {
    render(
      <DateRangeSelector
        selectedRange="month"
        onRangeChange={mockOnRangeChange}
      />
    );

    expect(screen.getByText('表示期間')).toBeInTheDocument();
  });
});