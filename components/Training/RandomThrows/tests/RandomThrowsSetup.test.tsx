import { useRandomStore } from "@/store/Training/RandomThrowsStore";
import { DEFAULT_SETTINGS } from "@/store/Training/constans";
import { fireEvent, render } from "@testing-library/react-native";
import React from "react";
import { Text } from "react-native";
import { RandomThrowsSetup } from "../RandomThrowsSetup";

const MockMinus: React.FC<any> = ({ color, ...rest }) => (
  <Text testID="minus-mock" {...rest}>
    Minus
  </Text>
);
const MockPlus: React.FC<any> = ({ color, ...rest }) => (
  <Text testID="plus-mock" {...rest}>
    Plus
  </Text>
);

jest.mock("lucide-react-native", () => ({
  Minus: (props: any) => MockMinus(props),
  Plus: (props: any) => MockPlus(props),
}));

const MockCheckbox: React.FC<any> = ({
  value,
  onValueChange,
  color,
  ...rest
}) => (
  <Text testID={`checkbox-mock`} {...rest}>
    Checkbox
  </Text>
);

jest.mock("expo-checkbox", () => ({
  Checkbox: (props: any) => MockCheckbox(props),
}));

jest.mock("@/store/Training/RandomThrowsStore", () => ({
  useRandomStore: jest.fn(),
}));

describe("RandomThrowsSetup", () => {
  let mockUpdateSettings: jest.Mock;

  beforeEach(() => {
    mockUpdateSettings = jest.fn();
    (useRandomStore as unknown as jest.Mock).mockReturnValue({
      settings: DEFAULT_SETTINGS,
      updateSettings: mockUpdateSettings,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders all checkboxes and input", async () => {
    const { getByText, getByDisplayValue } = await render(
      <RandomThrowsSetup onStart={jest.fn()} />,
    );
    expect(getByText("Singles")).toBeTruthy();
    expect(getByText("Doubles")).toBeTruthy();
    expect(getByText("Triples")).toBeTruthy();
    expect(
      getByDisplayValue(DEFAULT_SETTINGS.totalThrows.toString()),
    ).toBeTruthy();
  });

  it("disables start button if totalThrows is 0", async () => {
    (useRandomStore as unknown as jest.Mock).mockReturnValue({
      settings: { ...DEFAULT_SETTINGS, totalThrows: 0 },
      updateSettings: mockUpdateSettings,
    });

    const onStart = jest.fn();
    const { getByText } = await render(<RandomThrowsSetup onStart={onStart} />);
    const startButton = getByText("Start");

    fireEvent.press(startButton);
    expect(onStart).not.toHaveBeenCalled();
  });

  it("disables start button if no checkboxes are selected", async () => {
    (useRandomStore as unknown as jest.Mock).mockReturnValue({
      settings: {
        singles: false,
        doubles: false,
        triples: false,
        totalThrows: 20,
      },
      updateSettings: mockUpdateSettings,
    });

    const onStart = jest.fn();
    const { getByText } = await render(<RandomThrowsSetup onStart={onStart} />);
    const startButton = getByText("Start");

    fireEvent.press(startButton);
    expect(onStart).not.toHaveBeenCalled();
  });

  it("calls onStart when start button is pressed and valid", async () => {
    const onStart = jest.fn();
    const { getByText } = await render(<RandomThrowsSetup onStart={onStart} />);
    const startButton = getByText("Start");

    fireEvent.press(startButton);
    expect(onStart).toHaveBeenCalled();
  });

  it("updates settings when input text changes", async () => {
    const { getByDisplayValue } = await render(
      <RandomThrowsSetup onStart={jest.fn()} />,
    );
    const input = getByDisplayValue(DEFAULT_SETTINGS.totalThrows.toString());

    fireEvent.changeText(input, "30");

    expect(mockUpdateSettings).toHaveBeenCalledWith({
      ...DEFAULT_SETTINGS,
      totalThrows: 30,
    });
  });
});
