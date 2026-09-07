import { fireEvent, render } from "@testing-library/react-native";
import { RadioGroup, RadioOption } from "../RadioGroup";

describe("RadioGroup Component", () => {
  const mockOnSelect = jest.fn();

  const options: RadioOption[] = [
    { label: "Option 1", value: 1 },
    { label: "Option 2", value: 2 },
  ];

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders all options correctly", async () => {
    const { getByText } = await render(
      <RadioGroup options={options} selectedValue={1} onSelect={mockOnSelect} />
    );

    expect(getByText("Option 1")).toBeTruthy();
    expect(getByText("Option 2")).toBeTruthy();
  });

  it("calls onSelect with the correct value when an option is pressed", async () => {
    const { getByText } = await render(
      <RadioGroup options={options} selectedValue={1} onSelect={mockOnSelect} />
    );

    fireEvent.press(getByText("Option 2"));

    expect(mockOnSelect).toHaveBeenCalledTimes(1);
    expect(mockOnSelect).toHaveBeenCalledWith(2);
  });
});
