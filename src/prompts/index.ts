import type { PromptAPI, SpinnerAPI } from "../core/types.js";
import type { Theme } from "../theme/index.js";
import { createConfirmPrompt } from "./confirm.js";
import { createMultiSelectPrompt } from "./multiselect.js";
import { createPasswordPrompt } from "./password.js";
import { createSelectPrompt } from "./select.js";
import { createSpinner } from "./spinner.js";
import { createTextPrompt } from "./text.js";

export function createPromptAPI(theme: Theme): PromptAPI {
  return {
    text: (opts) => createTextPrompt(opts, theme),
    confirm: (opts) => createConfirmPrompt(opts, theme),
    select: (opts) => createSelectPrompt(opts, theme),
    multiselect: (opts) => createMultiSelectPrompt(opts, theme),
    password: (opts) => createPasswordPrompt(opts, theme),
    spinner: (opts): SpinnerAPI => createSpinner(opts.message, theme),
  };
}

export { createConfirmPrompt } from "./confirm.js";
export { createMultiSelectPrompt } from "./multiselect.js";
export { createPasswordPrompt } from "./password.js";
export { createSelectPrompt } from "./select.js";
export { createSpinner } from "./spinner.js";
export { createTextPrompt } from "./text.js";
