export const vendorOnboardingStyles = `
:root {
  color-scheme: light;
}
*, *::before, *::after {
  box-sizing: border-box;
}
body {
  margin: 0;
  font-family: 'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  background-color: #f8fafc;
  color: #0f172a;
}
main {
  background-color: #f8fafc;
}
img {
  display: block;
  max-width: 100%;
}
button {
  font: inherit;
}
.hidden {
  display: none !important;
}
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  border: 0;
}
.min-h-screen {
  min-height: 100vh;
}
.bg-white {
  background-color: #ffffff;
}
.bg-gray-100 {
  background-color: #f3f4f6;
}
.bg-gray-200 {
  background-color: #e5e7eb;
}
.bg-blue-50 {
  background-color: #eff6ff;
}
.bg-blue-100 {
  background-color: #dbeafe;
}
.bg-blue-600 {
  background-color: #2563eb;
}
.bg-amber-100 {
  background-color: #fef3c7;
}
.text-white {
  color: #ffffff;
}
.text-gray-500 {
  color: #6b7280;
}
.text-gray-600 {
  color: #4b5563;
}
.text-gray-700 {
  color: #374151;
}
.text-gray-900 {
  color: #111827;
}
.text-blue-600 {
  color: #2563eb;
}
.text-blue-700 {
  color: #1d4ed8;
}
.text-amber-700 {
  color: #b45309;
}
.text-rose-500 {
  color: #f43f5e;
}
.font-medium {
  font-weight: 500;
}
.font-semibold {
  font-weight: 600;
}
.font-bold {
  font-weight: 700;
}
.text-xs {
  font-size: 0.75rem;
  line-height: 1rem;
}
.text-sm {
  font-size: 0.875rem;
  line-height: 1.25rem;
}
.text-base {
  font-size: 1rem;
  line-height: 1.5rem;
}
.text-lg {
  font-size: 1.125rem;
  line-height: 1.75rem;
}
.text-xl {
  font-size: 1.25rem;
  line-height: 1.75rem;
}
.text-3xl {
  font-size: 1.875rem;
  line-height: 2.25rem;
}
.tracking-wider {
  letter-spacing: 0.1em;
}
.text-center {
  text-align: center;
}
.text-left {
  text-align: left;
}
.flex {
  display: flex;
}
.inline-flex {
  display: inline-flex;
}
.grid {
  display: grid;
}
.flex-col {
  flex-direction: column;
}
.flex-1 {
  flex: 1 1 0%;
}
.flex-wrap {
  flex-wrap: wrap;
}
.items-center {
  align-items: center;
}
.items-start {
  align-items: flex-start;
}
.justify-between {
  justify-content: space-between;
}
.justify-center {
  justify-content: center;
}
.gap-2 {
  gap: 0.5rem;
}
.gap-3 {
  gap: 0.75rem;
}
.gap-4 {
  gap: 1rem;
}
.gap-5 {
  gap: 1.25rem;
}
.h-1 {
  height: 0.25rem;
}
.grid-cols-1 {
  grid-template-columns: repeat(1, minmax(0, 1fr));
}
.space-y-2 > :not([hidden]) ~ :not([hidden]) {
  margin-top: 0.5rem;
}
.space-y-6 > :not([hidden]) ~ :not([hidden]) {
  margin-top: 1.5rem;
}
.mx-auto {
  margin-left: auto;
  margin-right: auto;
}
.my-6 {
  margin-top: 1.5rem;
  margin-bottom: 1.5rem;
}
.mt-8 {
  margin-top: 2rem;
}
.mt-4 {
  margin-top: 1rem;
}
.mt-2 {
  margin-top: 0.5rem;
}
.mt-1 {
  margin-top: 0.25rem;
}
.ml-2 {
  margin-left: 0.5rem;
}
.mr-2 {
  margin-right: 0.5rem;
}
.p-3 {
  padding: 0.75rem;
}
.p-6 {
  padding: 1.5rem;
}
.px-3 {
  padding-left: 0.75rem;
  padding-right: 0.75rem;
}
.px-4 {
  padding-left: 1rem;
  padding-right: 1rem;
}
.px-5 {
  padding-left: 1.25rem;
  padding-right: 1.25rem;
}
.px-6 {
  padding-left: 1.5rem;
  padding-right: 1.5rem;
}
.py-1 {
  padding-top: 0.25rem;
  padding-bottom: 0.25rem;
}
.py-2 {
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
}
.py-3 {
  padding-top: 0.75rem;
  padding-bottom: 0.75rem;
}
.py-6 {
  padding-top: 1.5rem;
  padding-bottom: 1.5rem;
}
.py-8 {
  padding-top: 2rem;
  padding-bottom: 2rem;
}
.py-10 {
  padding-top: 2.5rem;
  padding-bottom: 2.5rem;
}
.pb-12 {
  padding-bottom: 3rem;
}
.pb-24 {
  padding-bottom: 6rem;
}
.pt-6 {
  padding-top: 1.5rem;
}
.rounded-xl {
  border-radius: 0.75rem;
}
.rounded-2xl {
  border-radius: 1rem;
}
.rounded-full {
  border-radius: 9999px;
}
.border {
  border-width: 1px;
  border-style: solid;
  border-color: #e5e7eb;
}
.border-2 {
  border-width: 2px;
  border-style: solid;
}
.border-b {
  border-bottom-width: 1px;
  border-bottom-style: solid;
  border-bottom-color: #e5e7eb;
}
.border-gray-100 {
  border-color: #f3f4f6;
}
.border-gray-200 {
  border-color: #e5e7eb;
}
.border-gray-300 {
  border-color: #d1d5db;
}
.border-blue-200 {
  border-color: #bfdbfe;
}
.border-blue-400 {
  border-color: #60a5fa;
}
.border-dashed {
  border-style: dashed;
}
.shadow-sm {
  box-shadow: 0 1px 2px rgb(15 23 42 / 0.12);
}
.transition {
  transition: all 0.2s ease;
}
.transition-all {
  transition: all 0.2s ease;
}
.cursor-pointer {
  cursor: pointer;
}
.w-full {
  width: 100%;
}
.w-auto {
  width: auto;
}
.w-12 {
  width: 3rem;
}
.w-8 {
  width: 2rem;
}
.w-6 {
  width: 1.5rem;
}
.w-5 {
  width: 1.25rem;
}
.w-4 {
  width: 1rem;
}
.h-12 {
  height: 3rem;
}
.h-10 {
  height: 2.5rem;
}
.h-8 {
  height: 2rem;
}
.h-6 {
  height: 1.5rem;
}
.h-5 {
  height: 1.25rem;
}
.h-4 {
  height: 1rem;
}
.inline-flex svg,
.flex svg {
  flex-shrink: 0;
}
.focus\:border-blue-600:focus {
  border-color: #2563eb;
}
.focus\:ring-0:focus {
  box-shadow: none;
  outline: none;
}
.hover\:bg-blue-700:hover {
  background-color: #1d4ed8;
}
.hover\:text-blue-600:hover {
  color: #2563eb;
}
.hover\:border-blue-400:hover {
  border-color: #60a5fa;
}
.uppercase {
  text-transform: uppercase;
}
.max-w-3xl {
  max-width: 48rem;
}
.max-w-xl {
  max-width: 36rem;
}
.h-5.w-5 {
  height: 1.25rem;
  width: 1.25rem;
}
@media (min-width: 640px) {
  .sm\:flex-row {
    flex-direction: row;
  }
  .sm\:grid-cols-2 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
@media (min-width: 768px) {
  .md\:flex-row {
    flex-direction: row;
  }
  .md\:items-center {
    align-items: center;
  }
  .md\:gap-3 {
    gap: 0.75rem;
  }
  .md\:gap-4 {
    gap: 1rem;
  }
  .md\:p-8 {
    padding: 2rem;
  }
  .md\:p-10 {
    padding: 2.5rem;
  }
  .md\:py-4 {
    padding-top: 1rem;
    padding-bottom: 1rem;
  }
  .md\:pt-10 {
    padding-top: 2.5rem;
  }
  .md\:space-y-8 > :not([hidden]) ~ :not([hidden]) {
    margin-top: 2rem;
  }
  .md\:text-sm {
    font-size: 0.875rem;
    line-height: 1.25rem;
  }
  .md\:text-base {
    font-size: 1rem;
    line-height: 1.5rem;
  }
  .md\:text-lg {
    font-size: 1.125rem;
    line-height: 1.75rem;
  }
  .md\:text-xl {
    font-size: 1.25rem;
    line-height: 1.75rem;
  }
  .md\:text-4xl {
    font-size: 2.25rem;
    line-height: 2.5rem;
  }
}
`;