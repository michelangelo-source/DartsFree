import { act, fireEvent, render } from "@testing-library/react-native";
import { RandomThrowsGame } from "../RandomThrowsGame";

jest.mock("expo-audio", () => ({
  useAudioPlayer: jest.fn(() => ({
    play: jest.fn(),
    seekTo: jest.fn(),
  })),
}));

describe("RandomThrowsGame", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders current target correctly", async () => {
    const { getByText } = await render(
      <RandomThrowsGame currentTarget="S-20" totalThrows={3} onNext={jest.fn()} onFinish={jest.fn()} />,
    );
    expect(getByText("S-20")).toBeTruthy();
    expect(getByText("0/0 (0%)")).toBeTruthy();
    expect(getByText("3 left")).toBeTruthy();
  });

  it("updates stats and calls onNext when HIT is clicked", async () => {
    const onNext = jest.fn();
    const { getByText, findByText } = await render(
      <RandomThrowsGame currentTarget="S-20" totalThrows={3} onNext={onNext} onFinish={jest.fn()} />,
    );
    const hitButton = getByText("HIT");

    fireEvent.press(hitButton);

    expect(await findByText("1/1 (100%)")).toBeTruthy();
    expect(await findByText("2 left")).toBeTruthy();
    expect(onNext).toHaveBeenCalled();
  });

  it("updates stats and calls onNext when MISS is clicked", async () => {
    const onNext = jest.fn();
    const { getByText, findByText } = await render(
      <RandomThrowsGame currentTarget="S-20" totalThrows={3} onNext={onNext} onFinish={jest.fn()} />,
    );
    const missButton = getByText("MISS");

    fireEvent.press(missButton);

    expect(await findByText("0/1 (0%)")).toBeTruthy();
    expect(await findByText("2 left")).toBeTruthy();
    expect(onNext).toHaveBeenCalled();
  });

  it("calls onFinish when total throws reached via HIT", async () => {
    const onFinish = jest.fn();
    const { getByText } = await render(
      <RandomThrowsGame currentTarget="S-20" totalThrows={1} onNext={jest.fn()} onFinish={onFinish} />,
    );
    const hitButton = getByText("HIT");

    await act(async () => {
      fireEvent.press(hitButton);
    });

    expect(onFinish).toHaveBeenCalledWith(1, 1);
  });

  it("calls onFinish when total throws reached via MISS", async () => {
    const onFinish = jest.fn();
    const { getByText } = await render(
      <RandomThrowsGame currentTarget="S-20" totalThrows={2} onNext={jest.fn()} onFinish={onFinish} />,
    );
    const missButton = getByText("MISS");

    await act(async () => {
      fireEvent.press(missButton);
    });
    expect(onFinish).not.toHaveBeenCalled();

    await act(async () => {
      fireEvent.press(missButton);
    });
    expect(onFinish).toHaveBeenCalledWith(0, 2);
  });
});
