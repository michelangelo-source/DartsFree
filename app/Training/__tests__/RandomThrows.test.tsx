import { useRandomStore } from "@/store/Training/RandomThrowsStore";
import { render } from "@testing-library/react-native";
import React from "react";
import { Text } from "react-native";
import RandomThrows from "../RandomThrows";

const MockFinishedTrainingModal: React.FC<any> = () => (
  <Text testID="finished-modal-mock">FinishedTrainingModal</Text>
);

const MockRandomThrowsGame: React.FC<any> = () => (
  <Text testID="game-mock">RandomThrowsGame</Text>
);

const MockRandomThrowsSetup: React.FC<any> = () => (
  <Text testID="setup-mock">RandomThrowsSetup</Text>
);

jest.mock("@/components/Modals/FinishedTrainingModal", () => ({
  FinishedTrainingModal: (props: any) => MockFinishedTrainingModal(props),
}));

jest.mock("@/components/Training/RandomThrows/RandomThrowsGame", () => ({
  RandomThrowsGame: (props: any) => MockRandomThrowsGame(props),
}));

jest.mock("@/components/Training/RandomThrows/RandomThrowsSetup", () => ({
  RandomThrowsSetup: (props: any) => MockRandomThrowsSetup(props),
}));

jest.mock("@/store/Training/RandomThrowsStore", () => ({
  useRandomStore: jest.fn(),
}));

describe("RandomThrows Screen", () => {
  beforeEach(() => {
    (useRandomStore as unknown as jest.Mock).mockReturnValue({
      playing: false,
      targets: [],
      result: null,
      start: jest.fn(),
      finish: jest.fn(),
      reset: jest.fn(),
      gameId: 0,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders SetupScreen and Modal initially", async () => {
    const { getByTestId, queryByTestId } = await render(<RandomThrows />);

    expect(getByTestId("setup-mock")).toBeTruthy();
    expect(getByTestId("finished-modal-mock")).toBeTruthy();
    expect(queryByTestId("game-mock")).toBeNull(); // Not playing yet
  });

  it("renders GameScreen when playing and targets are set", async () => {
    (useRandomStore as unknown as jest.Mock).mockReturnValue({
      playing: true,
      targets: ["S-20"],
      result: null,
      start: jest.fn(),
      finish: jest.fn(),
      reset: jest.fn(),
      gameId: 1,
    });

    const { getByTestId, queryByTestId } = await render(<RandomThrows />);

    expect(getByTestId("game-mock")).toBeTruthy();
    expect(getByTestId("finished-modal-mock")).toBeTruthy();
    expect(queryByTestId("setup-mock")).toBeNull();
  });
});
