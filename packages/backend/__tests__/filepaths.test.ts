const unixPath = "/my/path/here/awesome.jpg";
const windowsPath = "\\my\\path\\here\\awesome.jpg";

test("should convert unix path to windows path", () => {
    const converted = unixPath.replace(new RegExp("\/", "g"), "\\");
    expect(converted).toBe(windowsPath);
});

test("should convert windows path to unix path", () => {
    const converted = windowsPath.replace(new RegExp("\\\\", "g"), "\/");
    expect(converted).toBe(unixPath);
});

test("should not replace path", () => {
    const converted = unixPath.replace(new RegExp("\\\\", "g"), "/");
    expect(converted).toBe(unixPath);
});

test("should replace path", () => {
    const converted = windowsPath.replace(new RegExp("\\\\", "g"), "/");
    expect(converted).toBe(unixPath);
    expect(converted).not.toBe(windowsPath);
});
