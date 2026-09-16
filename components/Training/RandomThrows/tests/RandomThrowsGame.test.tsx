import { act, fireEvent, render } from "@testing-library/react-native";
import { RandomThrowsGame } from "../RandomThrowsGame";

describe("RandomThrowsGame", () => {
  const mockTargets = ["S-20", "D-20", "T-20"];

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders first target correctly", async () => {
    const { getByText } = await render(
      <RandomThrowsGame targets={mockTargets} onFinish={jest.fn()} />,
    );
    expect(getByText("S-20")).toBeTruthy();
    expect(getByText("0/0 (0%)")).toBeTruthy();
    expect(getByText("3 left")).toBeTruthy();
  });

  it("updates stats and target when HIT is clicked", async () => {
    const { getByText, findByText } = await render(
      <RandomThrowsGame targets={mockTargets} onFinish={jest.fn()} />,
    );
    const hitButton = getByText("HIT");

    fireEvent.press(hitButton);

    expect(await findByText("D-20")).toBeTruthy();
    expect(await findByText("1/1 (100%)")).toBeTruthy();
    expect(await findByText("2 left")).toBeTruthy();
  });

  it("updates stats but keeps same target when MISS is clicked", async () => {
    const { getByText, findByText } = await render(
      <RandomThrowsGame targets={mockTargets} onFinish={jest.fn()} />,
    );
    const missButton = getByText("MISS");

    fireEvent.press(missButton);

    expect(await findByText("S-20")).toBeTruthy();
    expect(await findByText("0/1 (0%)")).toBeTruthy();
    expect(await findByText("2 left")).toBeTruthy();
  });

  it("calls onFinish when total throws reached via HIT", async () => {
    const onFinish = jest.fn();
    const { getByText } = await render(
      <RandomThrowsGame targets={["S-20"]} onFinish={onFinish} />,
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
      <RandomThrowsGame targets={["S-20", "D-20"]} onFinish={onFinish} />,
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
