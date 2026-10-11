import { createCanvas } from "@napi-rs/canvas";
import { ConstantClock, createEngine } from "@clockwyrks/simple-2d";
import { describe, expect, test } from "vitest";
import {
  BALL_R,
  FIELD_CX,
  FIELD_CY,
  FIELD_H,
  FIELD_W,
  HOLD_TIME,
  P1_X1,
  PADDLE_MAX_CY,
  PADDLE_MIN_CY,
  SERVE_SPEED,
  SPEED_MULT,
  WIN_SCORE,
} from "./constants";
import { game } from "./game";
import type { CaromDebugApi, CaromState } from "./game";

function makeEngine(stepMs = 16) {
  const target = new EventTarget();
  const canvas = createCanvas(FIELD_W, FIELD_H);
  const engine = createEngine<CaromState, CaromDebugApi>({
    canvas: canvas as unknown as HTMLCanvasElement,
    width: FIELD_W,
    height: FIELD_H,
    game,
    background: "#070914",
    clock: new ConstantClock(stepMs),
    surface: {
      cssWidth: () => FIELD_W,
      cssHeight: () => FIELD_H,
      dpr: () => 1,
      events: () => target,
    },
  });
  return engine;
}

describe("Carom simulation", () => {
  test("initializes the title state and debug snapshot", async () => {
    const engine = makeEngine();
    await engine.initialize();

    const snapshot = engine.debug.snapshot(engine.state);

    expect(snapshot.version).toBe(1);
    expect(snapshot.screen).toBe("title");
    expect(snapshot.mode).toBe("solo");
    expect(snapshot.ball?.x).toBe(FIELD_CX);
    expect(snapshot.ball?.y).toBe(FIELD_CY);
    expect(snapshot.ball?.speed).toBe(0);
    expect(snapshot.obstacles).toHaveLength(2);
    expect(engine.debug.menuItemRect(engine.state, 0)).toMatchObject({
      w: 360,
      h: 54,
    });
  });

  test("serves from countdown after the hold expires", async () => {
    const engine = makeEngine(250);
    await engine.initialize();
    engine.apply((state) => engine.debug.setScreen(state, "countdown"));
    engine.apply((state) => engine.debug.setBallServeSign(state, 1));

    await engine.advance(4);

    const ball = engine.debug.snapshot(engine.state).ball;
    expect(engine.state.screen).toBe("playing");
    expect(ball?.held).toBe(false);
    expect(ball?.holdTimer).toBe(0);
    expect(ball?.speed).toBeCloseTo(SERVE_SPEED, 5);
    expect(ball?.vx).toBeLessThan(0);
    expect(ball?.vy).toBeGreaterThan(0);
    expect(ball?.trail).toHaveLength(0);
  });

  test("driven paddles clamp and feed spin into paddle hits", async () => {
    const engine = makeEngine(16);
    await engine.initialize();
    engine.apply((state) => engine.debug.setScreen(state, "playing"));
    engine.apply((state) => engine.debug.setPaddleDriven(state, "left", true));
    engine.apply((state) => engine.debug.setPaddleVy(state, "left", 2000));
    engine.apply((state) =>
      engine.debug.setPaddleCy(state, "left", PADDLE_MAX_CY - 2),
    );
    await engine.advance(1);
    expect(engine.state.paddles.left.cy).toBe(PADDLE_MAX_CY);
    expect(engine.state.paddles.left.vy).toBeCloseTo(125);

    engine.apply((state) => engine.debug.setPaddleCy(state, "left", FIELD_CY));
    engine.apply((state) => engine.debug.setPaddleVy(state, "left", -600));
    engine.apply((state) => engine.debug.setBallHeld(state, false));
    engine.apply((state) =>
      engine.debug.setBallPosition(state, P1_X1 + BALL_R + 2, FIELD_CY),
    );
    engine.apply((state) => engine.debug.setBallVelocity(state, -520, 0));
    engine.apply((state) => engine.debug.setBallSpin(state, 0));
    await engine.advance(1);

    const ball = engine.debug.snapshot(engine.state).ball;
    expect(ball?.vx).toBeGreaterThan(0);
    expect(ball?.speed).toBeCloseTo(520 * SPEED_MULT, 1);
    expect(ball?.spin).toBeLessThan(0);
  });

  test("scores points and ends a match by the win rule", async () => {
    const engine = makeEngine(16);
    await engine.initialize();
    engine.apply((state) => engine.debug.setScreen(state, "playing"));
    engine.apply((state) => engine.debug.setScore(state, WIN_SCORE - 1, 0));
    engine.apply((state) => engine.debug.setBallHeld(state, false));
    engine.apply((state) =>
      engine.debug.setBallPosition(state, FIELD_W + BALL_R + 1, FIELD_CY),
    );
    engine.apply((state) => engine.debug.setBallVelocity(state, 200, 0));

    await engine.advance(1);

    expect(engine.state.screen).toBe("matchover");
    expect(engine.state.winner).toBe("left");
    expect(engine.state.score.p1).toBe(WIN_SCORE);
  });

  test("debug world controls remove and restore entities", async () => {
    const engine = makeEngine();
    await engine.initialize();

    engine.apply((state) => engine.debug.clearWorld(state));
    expect(engine.state.ball).toBeNull();
    expect(engine.state.obstacles).toHaveLength(0);
    expect(() =>
      engine.apply((state) => engine.debug.setBallVelocity(state, 1, 2)),
    ).toThrow(/no ball/);

    engine.apply((state) => engine.debug.spawnBall(state));
    engine.apply((state) => engine.debug.spawnObstacle(state, 1));
    expect(engine.state.ball?.holdTimer).toBe(HOLD_TIME);
    expect(engine.state.obstacles).toEqual([{ index: 1, cx: 790, cy: 500 }]);

    engine.apply((state) =>
      engine.debug.setPaddleCy(state, "right", PADDLE_MIN_CY),
    );
    engine.apply((state) => engine.debug.reset(state));
    expect(engine.state.screen).toBe("title");
    expect(engine.state.paddles.right.cy).toBe(FIELD_CY);
  });
});
