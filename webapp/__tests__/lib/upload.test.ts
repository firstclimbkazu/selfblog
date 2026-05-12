import { MAX_UPLOAD_SIZE, isFileTooLarge, extractExtension } from "@/lib/upload";

describe("MAX_UPLOAD_SIZE", () => {
  it("5MB (5 * 1024 * 1024) である", () => {
    expect(MAX_UPLOAD_SIZE).toBe(5 * 1024 * 1024);
  });
});

describe("isFileTooLarge", () => {
  it("サイズが MAX_UPLOAD_SIZE 以下なら false を返す", () => {
    expect(isFileTooLarge(MAX_UPLOAD_SIZE)).toBe(false);
    expect(isFileTooLarge(1024)).toBe(false);
    expect(isFileTooLarge(0)).toBe(false);
  });

  it("サイズが MAX_UPLOAD_SIZE を超えたら true を返す", () => {
    expect(isFileTooLarge(MAX_UPLOAD_SIZE + 1)).toBe(true);
    expect(isFileTooLarge(MAX_UPLOAD_SIZE * 2)).toBe(true);
  });
});

describe("extractExtension", () => {
  it("小文字の拡張子をそのまま返す", () => {
    expect(extractExtension("photo.jpg")).toBe("jpg");
    expect(extractExtension("image.webp")).toBe("webp");
    expect(extractExtension("file.png")).toBe("png");
  });

  it("大文字の拡張子を小文字に変換する", () => {
    expect(extractExtension("photo.JPG")).toBe("jpg");
    expect(extractExtension("IMAGE.PNG")).toBe("png");
  });

  it("複数ドットがある場合は最後の拡張子を返す", () => {
    expect(extractExtension("my.photo.final.jpg")).toBe("jpg");
  });

  it("拡張子がない場合はファイル名そのものを返す", () => {
    expect(extractExtension("noextension")).toBe("noextension");
  });
});
