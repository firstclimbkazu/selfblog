import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import DarkModeToggle from "@/app/components/DarkModeToggle";

describe("DarkModeToggle", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove("dark");
  });

  it("デフォルトで「ダークモードに切り替え」ボタンを表示する", () => {
    render(<DarkModeToggle />);
    expect(
      screen.getByRole("button", { name: "ダークモードに切り替え" })
    ).toBeInTheDocument();
  });

  it("クリックするとダークモードになり localStorage に dark が保存される", async () => {
    const user = userEvent.setup();
    render(<DarkModeToggle />);
    await user.click(screen.getByRole("button"));
    expect(document.documentElement.classList.contains("dark")).toBe(true);
    expect(localStorage.getItem("theme")).toBe("dark");
  });

  it("再クリックでライトモードに戻り localStorage に light が保存される", async () => {
    const user = userEvent.setup();
    render(<DarkModeToggle />);
    await user.click(screen.getByRole("button"));
    await user.click(screen.getByRole("button"));
    expect(document.documentElement.classList.contains("dark")).toBe(false);
    expect(localStorage.getItem("theme")).toBe("light");
  });

  it("localStorage に dark が保存済みなら「ライトモードに切り替え」ボタンを表示する", () => {
    localStorage.setItem("theme", "dark");
    render(<DarkModeToggle />);
    expect(
      screen.getByRole("button", { name: "ライトモードに切り替え" })
    ).toBeInTheDocument();
  });

  it("localStorage に light が保存済みなら「ダークモードに切り替え」ボタンを表示する", () => {
    localStorage.setItem("theme", "light");
    render(<DarkModeToggle />);
    expect(
      screen.getByRole("button", { name: "ダークモードに切り替え" })
    ).toBeInTheDocument();
  });
});
