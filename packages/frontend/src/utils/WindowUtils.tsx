/**
 * Uses the browser's alert system to request user input
 * The default value is what is placed in the input field
 * If the value is not changed or the prompt is closed without confirming, the function returns undefined
 * @param defaultValue The default value of the prompt (and the one to fallback to)
 */
export const showEditPrompt = (defaultValue: string, trim = true, stripSpecialChars = false) => {
  let newValue = window.prompt("Enter the new value or preess cancel/esc to exit.", defaultValue);
  if (newValue === null || newValue.toLowerCase() === defaultValue.toLowerCase()) return undefined;
  const confirmed = window.confirm(`Are you sure you would like to make the following changes?\n\n${defaultValue} => ${newValue}`);
  if (!confirmed) return undefined;
  if (trim) newValue = newValue.trim();
  if (stripSpecialChars) newValue = newValue.replace(/[^a-zA-Z0-9]/g, "");
  return newValue;
};
