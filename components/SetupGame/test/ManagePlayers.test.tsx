import { act, fireEvent, render } from "@testing-library/react-native";
import React from "react";
import { Text, TouchableOpacity } from "react-native";
import Toast from "react-native-toast-message";
import { ManagePlayers } from "../ManagePlayers";

const MockCirclePlus: React.FC<any> = () => (
  <Text testID="circle-plus-icon">CirclePlus</Text>
);

const MockPlayerTab: React.FC<any> = ({ player, handleDeletePlayer }) => (
  <TouchableOpacity
    testID={`delete-player-${player.name}`}
    onPress={() => handleDeletePlayer(player.name)}
  >
    <Text>{player.name}</Text>
  </TouchableOpacity>
);

jest.mock("lucide-react-native", () => ({
  CirclePlus: (props: any) => MockCirclePlus(props),
}));

jest.mock("react-native-toast-message", () => ({
  __esModule: true,
  default: { show: jest.fn() },
}));

jest.mock("@/components/CasualGame/PlayerTab", () => ({
  PlayerTab: (props: any) => MockPlayerTab(props),
}));

describe("ManagePlayers Component", () => {
  const mockAddPlayer = jest.fn();
  const mockDeletePlayer = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders correctly", async () => {
    const { getByPlaceholderText } = await render(
      <ManagePlayers
        players={[]}
        addPlayer={mockAddPlayer}
        deletePlayer={mockDeletePlayer}
      />,
    );
    expect(getByPlaceholderText("Insert player")).toBeTruthy();
  });

  it("does not add a player if the input is empty", async () => {
    const { getByTestId } = await render(
      <ManagePlayers
        players={[]}
        addPlayer={mockAddPlayer}
        deletePlayer={mockDeletePlayer}
      />,
    );

    const addButton = getByTestId("circle-plus-icon");

    await act(async () => {
      fireEvent.press(addButton);
    });

    expect(mockAddPlayer).not.toHaveBeenCalled();
  });

  it("adds a new player correctly via add button", async () => {
    const { getByPlaceholderText, getByTestId } = await render(
      <ManagePlayers
        players={[]}
        addPlayer={mockAddPlayer}
        deletePlayer={mockDeletePlayer}
      />,
    );

    const input = getByPlaceholderText("Insert player");
    const addButton = getByTestId("circle-plus-icon");

    await act(async () => {
      fireEvent.changeText(input, "Alice");
    });

    await act(async () => {
      fireEvent.press(addButton);
    });

    expect(mockAddPlayer).toHaveBeenCalledTimes(1);
    expect(mockAddPlayer).toHaveBeenCalledWith({
      name: "Alice",
      score: 0,
      wins: 0,
      dartsThrown: 0,
      history: [],
    });
  });

  it("adds a new player correctly via keyboard submit", async () => {
    const { getByPlaceholderText } = await render(
      <ManagePlayers
        players={[]}
        addPlayer={mockAddPlayer}
        deletePlayer={mockDeletePlayer}
      />,
    );

    const input = getByPlaceholderText("Insert player");

    await act(async () => {
      fireEvent.changeText(input, "Charlie");
    });

    await act(async () => {
      fireEvent(input, "submitEditing");
    });

    expect(mockAddPlayer).toHaveBeenCalledTimes(1);
    expect(mockAddPlayer).toHaveBeenCalledWith(
      expect.objectContaining({ name: "Charlie" }),
    );
  });

  it("shows an error toast if adding a duplicate player", async () => {
    const players = [
      { name: "Bob", score: 0, wins: 0, dartsThrown: 0, history: [] },
    ];

    const { getByPlaceholderText, getByTestId } = await render(
      <ManagePlayers
        players={players}
        addPlayer={mockAddPlayer}
        deletePlayer={mockDeletePlayer}
      />,
    );

    const input = getByPlaceholderText("Insert player");
    const addButton = getByTestId("circle-plus-icon");

    await act(async () => {
      fireEvent.changeText(input, "Bob");
    });

    await act(async () => {
      fireEvent.press(addButton);
    });

    expect(mockAddPlayer).not.toHaveBeenCalled();
    expect(Toast.show).toHaveBeenCalledWith(
      expect.objectContaining({ type: "error", text1: "User already exists" }),
    );
  });

  it("calls deletePlayer when triggered from PlayerTab", async () => {
    const players = [
      { name: "Bob", score: 0, wins: 0, dartsThrown: 0, history: [] },
    ];

    const { getByTestId } = await render(
      <ManagePlayers
        players={players}
        addPlayer={mockAddPlayer}
        deletePlayer={mockDeletePlayer}
      />,
    );

    const deleteButton = getByTestId("delete-player-Bob");

    await act(async () => {
      fireEvent.press(deleteButton);
    });

    expect(mockDeletePlayer).toHaveBeenCalledTimes(1);
    expect(mockDeletePlayer).toHaveBeenCalledWith("Bob");
  });
});
