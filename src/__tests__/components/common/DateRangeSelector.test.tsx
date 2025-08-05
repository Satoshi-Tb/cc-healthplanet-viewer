import { render, screen, fireEvent } from "@testing-library/react";
import { DateRangeSelector } from "@/components/common/DateRangeSelector";

describe("DateRangeSelector コンポーネント", () => {
  const mockOnRangeChange = jest.fn();

  beforeEach(() => {
    mockOnRangeChange.mockClear();
  });

  it("すべてのトグルボタンが表示される", () => {
    render(
      <DateRangeSelector
        selectedRange="month"
        onRangeChange={mockOnRangeChange}
      />
    );

    expect(screen.getByText("週次")).toBeInTheDocument();
    expect(screen.getByText("月次")).toBeInTheDocument();
    expect(screen.getByText("３ヵ月")).toBeInTheDocument();
  });

  it("選択された範囲がアクティブ状態で表示される", () => {
    render(
      <DateRangeSelector
        selectedRange="week"
        onRangeChange={mockOnRangeChange}
      />
    );

    const weekButton = screen.getByText("週次");
    expect(weekButton).toHaveAttribute("aria-pressed", "true");
  });

  it("異なる範囲が選択されたときonRangeChangeが呼ばれる", () => {
    render(
      <DateRangeSelector
        selectedRange="month"
        onRangeChange={mockOnRangeChange}
      />
    );

    fireEvent.click(screen.getByText("週次"));
    expect(mockOnRangeChange).toHaveBeenCalledWith("week");
  });

  it("同じ範囲がクリックされてもonRangeChangeは呼ばれない", () => {
    render(
      <DateRangeSelector
        selectedRange="month"
        onRangeChange={mockOnRangeChange}
      />
    );

    fireEvent.click(screen.getByText("月次"));
    expect(mockOnRangeChange).not.toHaveBeenCalled();
  });

  it("正しいタイトルが表示される", () => {
    render(
      <DateRangeSelector
        selectedRange="month"
        onRangeChange={mockOnRangeChange}
      />
    );

    expect(screen.getByText("表示期間")).toBeInTheDocument();
  });
});
