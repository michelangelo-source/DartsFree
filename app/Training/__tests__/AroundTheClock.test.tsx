import { act, fireEvent, render } from "@testing-library/react-native";
import AroundTheClock from "../AroundTheClock";

jest.mock("expo-router", () => ({
  router: {
    navigate: jest.fn(),
  },
}));

describe("AroundTheClock Screen", () => {
  it("renders the title", async () => {
    const { getByText } = await render(<AroundTheClock />);
    expect(getByText("Around The Clock")).toBeTruthy();
  });

  it("renders the 'Aim for:' label", async () => {
    const { getByText } = await render(<AroundTheClock />);
    expect(getByText("Aim for:")).toBeTruthy();
  });

  it("shows 1 as the initial target number", async () => {
    const { getByText } = await render(<AroundTheClock />);
    expect(getByText("1")).toBeTruthy();
  });

  it("shows initial score as 0/0 (0%)", async () => {
    const { getByText } = await render(<AroundTheClock />);
    expect(getByText(/0\/0/)).toBeTruthy();
    expect(getByText(/0%/)).toBeTruthy();
  });

  it("renders HIT and MISS buttons", async () => {
    const { getByText } = await render(<AroundTheClock />);
    expect(getByText("HIT")).toBeTruthy();
    expect(getByText("MISS")).toBeTruthy();
  });

  it("increments target number and total on HIT press", async () => {
    const { getByText } = await render(<AroundTheClock />);

    await act(() => {
      fireEvent.press(getByText("HIT"));
    });

    expect(getByText("2")).toBeTruthy();
    expect(getByText(/1\/1/)).toBeTruthy();
    expect(getByText(/100%/)).toBeTruthy();
  });

  it("increments only total on MISS press", async () => {
    const { getByText } = await render(<AroundTheClock />);

    await act(() => {
      fireEvent.press(getByText("MISS"));
    });

    expect(getByText("1")).toBeTruthy();
    expect(getByText(/0\/1/)).toBeTruthy();
    expect(getByText(/0%/)).toBeTruthy();
  });

  it("calculates percentage correctly after mixed hits and misses", async () => {
    const { getByText } = await render(<AroundTheClock />);

    await act(() => {
      fireEvent.press(getByText("HIT"));
    });
    await act(() => {
      fireEvent.press(getByText("MISS"));
    });
    await act(() => {
      fireEvent.press(getByText("HIT"));
    });

    expect(getByText("3")).toBeTruthy();
    expect(getByText(/2\/3/)).toBeTruthy();
    expect(getByText(/67%/)).toBeTruthy();
  });

  it("caps target number at 20", async () => {
    const { getByText } = await render(<AroundTheClock />);

    for (let i = 0; i < 19; i++) {
      await act(() => {
        fireEvent.press(getByText("HIT"));
      });
    }

    expect(getByText("20")).toBeTruthy();
  });

  it("shows the finished modal after hitting 20", async () => {
    const { getByText, getAllByText } = await render(<AroundTheClock />);

    for (let i = 0; i < 20; i++) {
      await act(() => {
        fireEvent.press(getByText("HIT"));
      });
    }

    expect(getByText("Result:")).toBeTruthy();
    expect(getAllByText(/20\/20/).length).toBeGreaterThanOrEqual(1);
    expect(getByText("Exit")).toBeTruthy();
    expect(getByText("Reset")).toBeTruthy();
  });

  it("resets state when Reset is pressed in the modal", async () => {
    const { getByText } = await render(<AroundTheClock />);

    for (let i = 0; i < 20; i++) {
      await act(() => {
        fireEvent.press(getByText("HIT"));
      });
    }

    await act(() => {
      fireEvent.press(getByText("Reset"));
    });

    expect(getByText("1")).toBeTruthy();
    expect(getByText(/0\/0/)).toBeTruthy();
  });
});
