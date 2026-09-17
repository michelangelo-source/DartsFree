import { act, fireEvent, render, waitFor } from "@testing-library/react-native";
import { router, useNavigation } from "expo-router";
import { ExitGameModal } from "../ExitGameModal";

jest.mock("expo-router", () => ({
  router: {
    canGoBack: jest.fn(),
    back: jest.fn(),
    navigate: jest.fn(),
  },
  useNavigation: jest.fn(),
}));

describe("ExitGameModal Component", () => {
  let mockAddListener: jest.Mock;
  let mockDispatch: jest.Mock;

  beforeEach(() => {
    mockAddListener = jest.fn();
    mockDispatch = jest.fn();

    (useNavigation as jest.Mock).mockReturnValue({
      addListener: mockAddListener,
      dispatch: mockDispatch,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("subscribes to beforeRemove event on mount", async () => {
    await render(<ExitGameModal />);
    expect(mockAddListener).toHaveBeenCalledWith(
      "beforeRemove",
      expect.any(Function),
    );
  });

  it("shows the modal when beforeRemove event is triggered", async () => {
    const { getByText } = await render(<ExitGameModal />);

    expect(mockAddListener).toHaveBeenCalled();

    const beforeRemoveCallback = mockAddListener.mock.calls.find(
      (call) => call[0] === "beforeRemove",
    )[1];

    const mockEvent = {
      preventDefault: jest.fn(),
      data: {
        action: { type: "GO_BACK" },
      },
    };

    await act(async () => {
      beforeRemoveCallback(mockEvent);
    });

    expect(mockEvent.preventDefault).toHaveBeenCalled();
    expect(getByText("Are you sure?")).toBeTruthy();
    expect(getByText("Cancel")).toBeTruthy();
    expect(getByText("Exit")).toBeTruthy();
  });

  it("hides the modal when Cancel is pressed", async () => {
    const { getByText, queryByText } = await render(<ExitGameModal />);

    expect(mockAddListener).toHaveBeenCalled();

    const beforeRemoveCallback = mockAddListener.mock.calls.find(
      (call) => call[0] === "beforeRemove",
    )[1];

    const mockEvent = {
      preventDefault: jest.fn(),
      data: {
        action: { type: "GO_BACK" },
      },
    };

    await act(async () => {
      beforeRemoveCallback(mockEvent);
    });

    expect(getByText("Are you sure?")).toBeTruthy();

    const cancelBtn = getByText("Cancel");
    fireEvent.press(cancelBtn);

    await waitFor(() => {
      expect(queryByText("Are you sure?")).toBeNull();
    });
  });

  it("dispatches the saved action when Exit is pressed and action exists", async () => {
    const { getByText } = await render(<ExitGameModal />);

    expect(mockAddListener).toHaveBeenCalled();

    const beforeRemoveCallback = mockAddListener.mock.calls.find(
      (call) => call[0] === "beforeRemove",
    )[1];

    const mockEvent = {
      preventDefault: jest.fn(),
      data: {
        action: { type: "GO_BACK" },
      },
    };

    await act(async () => {
      beforeRemoveCallback(mockEvent);
    });

    expect(getByText("Exit")).toBeTruthy();
    const exitBtn = getByText("Exit");
    fireEvent.press(exitBtn);

    expect(mockDispatch).toHaveBeenCalledWith({ type: "GO_BACK" });
  });

  it("uses router.back if no exit action and can go back", async () => {
    const { getByText } = await render(<ExitGameModal />);

    expect(mockAddListener).toHaveBeenCalled();

    const beforeRemoveCallback = mockAddListener.mock.calls.find(
      (call) => call[0] === "beforeRemove",
    )[1];

    const mockEvent = {
      preventDefault: jest.fn(),
      data: {},
    };

    (router.canGoBack as jest.Mock).mockReturnValue(true);

    await act(async () => {
      beforeRemoveCallback(mockEvent);
    });

    expect(getByText("Exit")).toBeTruthy();
    const exitBtn = getByText("Exit");
    fireEvent.press(exitBtn);

    expect(mockDispatch).not.toHaveBeenCalled();
    expect(router.back).toHaveBeenCalled();
  });

  it("uses router.navigate to / if no exit action and cannot go back", async () => {
    const { getByText } = await render(<ExitGameModal />);

    expect(mockAddListener).toHaveBeenCalled();

    const beforeRemoveCallback = mockAddListener.mock.calls.find(
      (call) => call[0] === "beforeRemove",
    )[1];

    const mockEvent = {
      preventDefault: jest.fn(),
      data: {},
    };

    (router.canGoBack as jest.Mock).mockReturnValue(false);

    await act(async () => {
      beforeRemoveCallback(mockEvent);
    });

    expect(getByText("Exit")).toBeTruthy();
    const exitBtn = getByText("Exit");
    fireEvent.press(exitBtn);

    expect(mockDispatch).not.toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith("/");
  });

  it("does not prevent default if shouldExit is true", async () => {
    const { getByText } = await render(<ExitGameModal />);

    expect(mockAddListener).toHaveBeenCalled();

    const beforeRemoveCallback = mockAddListener.mock.calls.find(
      (call) => call[0] === "beforeRemove",
    )[1];

    const mockEvent1 = {
      preventDefault: jest.fn(),
      data: {
        action: { type: "GO_BACK" },
      },
    };

    await act(async () => {
      beforeRemoveCallback(mockEvent1);
    });

    expect(getByText("Exit")).toBeTruthy();
    const exitBtn = getByText("Exit");
    await act(async () => {
      fireEvent.press(exitBtn);
    });

    const mockEvent2 = {
      preventDefault: jest.fn(),
      data: {
        action: { type: "GO_BACK" },
      },
    };

    await act(async () => {
      beforeRemoveCallback(mockEvent2);
    });

    expect(mockEvent2.preventDefault).not.toHaveBeenCalled();
  });
});
