import type {
  CommandContext,
  MiddlewareDefinition,
  MiddlewarePhase,
} from "./types.js";

export function defineMiddleware(
  def: MiddlewareDefinition,
): MiddlewareDefinition {
  return def;
}

export function runMiddleware(
  middlewares: MiddlewareDefinition[],
  phase: MiddlewarePhase,
  ctx: CommandContext,
): void {
  for (const mw of middlewares) {
    if (mw.phase === phase) {
      mw.run(ctx);
    }
  }
}
