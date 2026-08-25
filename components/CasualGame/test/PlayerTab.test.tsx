import { fireEvent, render } from "@testing-library/react-native";
import { Text } from "react-native";
import { PlayerTab } from "../PlayerTab";

const mockXIcon = () => <Text testID="delete-icon">X</Text>;

jest.mock("lucide-react-native", () => ({
  X: () => mockXIcon(),
}));

describe("PlayerTab Component", () => {
  const mockHandleDeletePlayer = jest.fn();

  const mockPlayer = {
    name: "Charlie",
    wins: 0,
    score: 0,
    dartsThrown: 0,
    history: [],
  };

  const defaultProps = {
    player: mockPlayer,
    handleDeletePlayer: mockHandleDeletePlayer,
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders the player's name correctly", async () => {
    const { getByText } = await render(<PlayerTab {...defaultProps} />);

    expect(getByText("Charlie")).toBeTruthy();
  });

  it("calls handleDeletePlayer with the correct name when the delete button is pressed", async () => {
    const { getByTestId } = await render(<PlayerTab {...defaultProps} />);

    const deleteButton = getByTestId("delete-icon");
    fireEvent.press(deleteButton);

    expect(mockHandleDeletePlayer).toHaveBeenCalledTimes(1);
    expect(mockHandleDeletePlayer).toHaveBeenCalledWith("Charlie");
  });
});
