import { render } from "@testing-library/react-native";
import { BustBar } from "../BustBar";

describe("BustBar Component", () => {
  it('renders "BUST" text correctly', async () => {
    const { getByText } = await render(<BustBar />);

    expect(getByText("BUST")).toBeTruthy();
  });

  it("calculates correct width based on screen dimensions", async () => {
    const { getByText } = await render(<BustBar />);

    const textElement = getByText("BUST");
    const viewContainer = textElement.parent!;

    expect(viewContainer.props.style).toEqual(
      expect.arrayContaining([expect.objectContaining({ width: 730 })]),
    );
  });

  it("matches snapshot", async () => {
    const { toJSON } = await render(<BustBar />);

    expect(toJSON()).toMatchSnapshot();
  });
});
