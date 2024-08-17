const originalConsoleInfo = console.info;
const originalConsoleError = console.error;

declare global {
  interface Console {
    success(...data: any[]): void;
  }
}

console.info = (...data) => {
  originalConsoleInfo("⏳ ", ...data);
};

console.error = (...data) => {
  originalConsoleError("❌ ", ...data);
};

console.success = (...data) => {
  console.log("✅ ", ...data);
};
