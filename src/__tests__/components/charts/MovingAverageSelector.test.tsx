import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MovingAverageSelector } from "../../../components/charts/MovingAverageSelector";
import { MovingAverageDays } from "@/lib/moving-average";

describe("MovingAverageSelector", () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  it("should render all moving average options", () => {
    render(<MovingAverageSelector selectedDays={[]} onChange={mockOnChange} />);

    expect(screen.getByText("移動平均線")).toBeInTheDocument();
    expect(screen.getByText("5日移動平均")).toBeInTheDocument();
    expect(screen.getByText("15日移動平均")).toBeInTheDocument();
    expect(screen.getByText("30日移動平均")).toBeInTheDocument();
  });

  it("should show selected checkboxes as checked", () => {
    const selectedDays: MovingAverageDays[] = [5, 30];

    render(
      <MovingAverageSelector
        selectedDays={selectedDays}
        onChange={mockOnChange}
      />
    );

    const checkbox5 = screen.getByRole("checkbox", {
      name: "5日移動平均",
    });
    const checkbox15 = screen.getByRole("checkbox", {
      name: "15日移動平均",
    });
    const checkbox30 = screen.getByRole("checkbox", {
      name: "30日移動平均",
    });

    expect(checkbox5).toBeChecked();
    expect(checkbox15).not.toBeChecked();
    expect(checkbox30).toBeChecked();
  });

  it("should call onChange when checkbox is clicked", () => {
    render(<MovingAverageSelector selectedDays={[]} onChange={mockOnChange} />);

    const checkbox5 = screen.getByRole("checkbox", {
      name: "5日移動平均",
    });
    fireEvent.click(checkbox5);

    expect(mockOnChange).toHaveBeenCalledWith([5]);
  });

  it("should add days when checking unselected checkbox", () => {
    const selectedDays: MovingAverageDays[] = [5];

    render(
      <MovingAverageSelector
        selectedDays={selectedDays}
        onChange={mockOnChange}
      />
    );

    const checkbox15 = screen.getByRole("checkbox", {
      name: "15日移動平均",
    });
    fireEvent.click(checkbox15);

    expect(mockOnChange).toHaveBeenCalledWith([5, 15]);
  });

  it("should remove days when unchecking selected checkbox", () => {
    const selectedDays: MovingAverageDays[] = [5, 15, 30];

    render(
      <MovingAverageSelector
        selectedDays={selectedDays}
        onChange={mockOnChange}
      />
    );

    const checkbox15 = screen.getByRole("checkbox", {
      name: "15日移動平均",
    });
    fireEvent.click(checkbox15);

    expect(mockOnChange).toHaveBeenCalledWith([5, 30]);
  });

  it("should render with custom testId", () => {
    const testId = "custom-moving-average-selector";

    render(
      <MovingAverageSelector
        selectedDays={[]}
        onChange={mockOnChange}
        testId={testId}
      />
    );

    expect(screen.getByTestId(testId)).toBeInTheDocument();
    expect(screen.getByTestId(`${testId}-5`)).toBeInTheDocument();
    expect(screen.getByTestId(`${testId}-15`)).toBeInTheDocument();
    expect(screen.getByTestId(`${testId}-30`)).toBeInTheDocument();
  });
});
