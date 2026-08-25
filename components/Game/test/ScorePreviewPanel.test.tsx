import { render } from "@testing-library/react-native";
import { ScorePreviewPanel } from "../ScorePreviewPanel";

describe("ScorePreviewPanel Component", () => {
  it("displays a numeric score correctly", async () => {
    const { getByText } = await render(<ScorePreviewPanel score={20} />);

    expect(getByText(/20/)).toBeTruthy();
  });

  it("displays 'MISS' correctly when the dart misses", async () => {
    const { getByText } = await render(<ScorePreviewPanel score="MISS" />);

    expect(getByText(/MISS/)).toBeTruthy();
  });

  it("displays a dash '-' when the score is null", async () => {
    const { getByText } = await render(<ScorePreviewPanel score={null} />);

    expect(getByText(/-/)).toBeTruthy();
  });
});
