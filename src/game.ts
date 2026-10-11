import type {
  Game,
  InitApi,
  RenderApi,
  UpdateApi,
} from "@clockwyrks/simple-2d";
import type { DeepReadonly } from "ts-essentials";
import {
  ACTIONS,
  AI_DEADZONE,
  AI_HOME_DEADZONE,
  AI_HOME_Y,
  AI_REACT,
  AI_SPEED,
  BALL_R,
  BINDINGS,
  CAROM_DEBUG_VERSION,
  CUES,
  FIELD_CX,
  FIELD_CY,
  FIELD_H,
  FIELD_W,
  HOLD_TIME,
  MATCHOVER_ITEMS,
  MAX_BOUNCE_ANGLE,
  MAX_SUBSTEP,
  NET_X,
  OBSTACLE_CENTERS,
  OBSTACLE_H,
  OBSTACLE_HH,
  OBSTACLE_W,
  OBSTACLE_HW,
  OBSTACLES,
  P1_X0,
  P1_X1,
  P2_X0,
  P2_X1,
  PADDLE_HALF,
  PADDLE_H,
  PADDLE_MAX_CY,
  PADDLE_MIN_CY,
  PADDLE_SPEED,
  PADDLE_W,
  PAUSE_ITEMS,
  SERVE_ANGLE,
  SERVE_SPEED,
  SPEED_CAP,
  SPEED_MULT,
  SPIN_CLAMP,
  SPIN_FROM_PADDLE,
  SPIN_HALFLIFE,
  TITLE_ITEMS,
  TITLE_TEXT,
  TRAIL_TIME,
  WIN_LEAD,
  WIN_SCORE,
} from "./constants";
import type { Rect } from "./constants";

export type Screen =
  "title" | "howto" | "countdown" | "playing" | "paused" | "matchover";

export type Mode = "solo" | "versus";

export type Side = "left" | "right";

export interface PaddleState {
  readonly cy: number;
  readonly vy: number;
  readonly driven: boolean;
  readonly drivenVy: number;
}

export interface AiState {
  readonly tracking: boolean;
  readonly movement: boolean;
}

export interface TrailSample {
  readonly x: number;
  readonly y: number;
  readonly t: number;
}

export interface BallState {
  readonly x: number;
  readonly y: number;
  readonly vx: number;
  readonly vy: number;
  readonly spin: number;
  readonly held: boolean;
  readonly holdTimer: number;
  readonly serveSign: 1 | -1;
  readonly trail: readonly TrailSample[];
}

export interface ObstacleState {
  readonly index: number;
  readonly cx: number;
  readonly cy: number;
}

export interface CaromState {
  readonly screen: Screen;
  readonly mode: Mode;
  readonly menuIndex: number;
  readonly titleIndex: number;
  readonly resumeScreen: "countdown" | "playing";

  readonly score: { readonly p1: number; readonly p2: number };
  readonly winner: Side | null;

  readonly paddles: { readonly left: PaddleState; readonly right: PaddleState };
  readonly ai: AiState;

  readonly receiver: Side;
  readonly ball: BallState | null;
  readonly obstacles: readonly ObstacleState[];

  readonly simTime: number;
  readonly muted: boolean;
}

export interface MenuRect {
  readonly x: number;
  readonly y: number;
  readonly w: number;
  readonly h: number;
}

export interface CaromSnapshot extends Omit<CaromState, "ball"> {
  readonly version: number;
  readonly ball:
    | (BallState & {
        readonly speed: number;
      })
    | null;
}

export interface CaromDebugApi {
  readonly version: number;
  clearWorld(state: DeepReadonly<CaromState>): CaromState;
  spawnBall(state: DeepReadonly<CaromState>): CaromState;
  spawnObstacle(state: DeepReadonly<CaromState>, index: number): CaromState;
  reset(state: DeepReadonly<CaromState>): CaromState;
  reconcile(state: DeepReadonly<CaromState>): CaromState;
  setScreen(state: DeepReadonly<CaromState>, screen: Screen): CaromState;
  setMode(state: DeepReadonly<CaromState>, mode: Mode): CaromState;
  setMenuIndex(state: DeepReadonly<CaromState>, index: number): CaromState;
  setTitleIndex(state: DeepReadonly<CaromState>, index: number): CaromState;
  setResumeScreen(
    state: DeepReadonly<CaromState>,
    screen: "countdown" | "playing",
  ): CaromState;
  setScore(state: DeepReadonly<CaromState>, p1: number, p2: number): CaromState;
  setWinner(state: DeepReadonly<CaromState>, side: Side | null): CaromState;
  setReceiver(state: DeepReadonly<CaromState>, side: Side): CaromState;
  setPaddleCy(
    state: DeepReadonly<CaromState>,
    side: Side,
    cy: number,
  ): CaromState;
  setPaddleVy(
    state: DeepReadonly<CaromState>,
    side: Side,
    vy: number,
  ): CaromState;
  setPaddleDriven(
    state: DeepReadonly<CaromState>,
    side: Side,
    driven: boolean,
  ): CaromState;
  setBallPosition(
    state: DeepReadonly<CaromState>,
    x: number,
    y: number,
  ): CaromState;
  setBallVelocity(
    state: DeepReadonly<CaromState>,
    vx: number,
    vy: number,
  ): CaromState;
  setBallSpin(state: DeepReadonly<CaromState>, spin: number): CaromState;
  setBallHeld(state: DeepReadonly<CaromState>, held: boolean): CaromState;
  setBallHoldTimer(
    state: DeepReadonly<CaromState>,
    seconds: number,
  ): CaromState;
  setBallServeSign(state: DeepReadonly<CaromState>, sign: 1 | -1): CaromState;
  drawBallServeSign(state: DeepReadonly<CaromState>): CaromState;
  setAiTracking(state: DeepReadonly<CaromState>, enabled: boolean): CaromState;
  setAiMovement(state: DeepReadonly<CaromState>, enabled: boolean): CaromState;
  setMuted(state: DeepReadonly<CaromState>, muted: boolean): CaromState;
  snapshot(state: DeepReadonly<CaromState>): CaromSnapshot;
  menuItemRect(state: DeepReadonly<CaromState>, index: number): MenuRect | null;
}

export const BACKGROUND = "#070914";

const LEFT_COLOR = "#48f0c7";
const RIGHT_COLOR = "#ff5f86";
const BALL_COLOR = "#fff3a4";
const OBSTACLE_COLOR = "#7da8ff";
const TEXT_COLOR = "#f4f7ff";
const DIM_TEXT = "rgba(244, 247, 255, 0.62)";
const PANEL = "rgba(7, 9, 20, 0.72)";
const LINE = "rgba(244, 247, 255, 0.20)";
const HIGHLIGHT = "#ffd166";

const HOWTO_ITEMS = ["BACK"] as const;
const MENU_W = 360;
const MENU_H = 54;
const MENU_GAP = 14;
const MENU_X = FIELD_CX - MENU_W / 2;
const TITLE_MENU_Y = 375;
const HOWTO_MENU_Y = 600;
const PAUSE_MENU_Y = 315;
const MATCHOVER_MENU_Y = 420;

interface CollisionResult {
  readonly ball: BallState;
  readonly face: "left" | "right" | "top" | "bottom" | null;
}

interface StepResult {
  readonly ball: BallState;
  readonly paddleHit: boolean;
  readonly wallBounce: boolean;
  readonly obstacleBounce: boolean;
}

interface MenuFrameInput {
  readonly up: boolean;
  readonly down: boolean;
  readonly confirm: boolean;
  readonly back: boolean;
  readonly pause: boolean;
  readonly pointerIndex: number | null;
  readonly pointerConfirm: boolean;
}

const clamp = (value: number, min: number, max: number): number =>
  Math.max(min, Math.min(max, value));

const drawServeSign = (): 1 | -1 => (Math.random() < 0.5 ? -1 : 1);

function cloneBall(ball: DeepReadonly<BallState>): BallState {
  return {
    x: ball.x,
    y: ball.y,
    vx: ball.vx,
    vy: ball.vy,
    spin: ball.spin,
    held: ball.held,
    holdTimer: ball.holdTimer,
    serveSign: ball.serveSign,
    trail: ball.trail.map((sample) => ({ ...sample })),
  };
}

function clonePaddle(paddle: DeepReadonly<PaddleState>): PaddleState {
  return { ...paddle };
}

function toState(state: DeepReadonly<CaromState>): CaromState {
  return {
    screen: state.screen,
    mode: state.mode,
    menuIndex: state.menuIndex,
    titleIndex: state.titleIndex,
    resumeScreen: state.resumeScreen,
    score: { p1: state.score.p1, p2: state.score.p2 },
    winner: state.winner,
    paddles: {
      left: clonePaddle(state.paddles.left),
      right: clonePaddle(state.paddles.right),
    },
    ai: { tracking: state.ai.tracking, movement: state.ai.movement },
    receiver: state.receiver,
    ball: state.ball ? cloneBall(state.ball) : null,
    obstacles: state.obstacles.map((present) => ({ ...present })),
    simTime: state.simTime,
    muted: state.muted,
  };
}

function parkedBall(): BallState {
  return {
    x: FIELD_CX,
    y: FIELD_CY,
    vx: 0,
    vy: 0,
    spin: 0,
    held: true,
    holdTimer: HOLD_TIME,
    serveSign: drawServeSign(),
    trail: [],
  };
}

function obstacle(index: number): ObstacleState {
  const center = OBSTACLE_CENTERS[index];
  if (!center) throw new Error(`Carom: obstacle ${index} does not exist`);
  return { index, cx: center.x, cy: center.y };
}

function titleState(muted: boolean): CaromState {
  return {
    screen: "title",
    mode: "solo",
    menuIndex: 0,
    titleIndex: 0,
    resumeScreen: "playing",
    score: { p1: 0, p2: 0 },
    winner: null,
    paddles: {
      left: { cy: FIELD_CY, vy: 0, driven: false, drivenVy: 0 },
      right: { cy: FIELD_CY, vy: 0, driven: false, drivenVy: 0 },
    },
    ai: { tracking: true, movement: true },
    receiver: "left",
    ball: parkedBall(),
    obstacles: OBSTACLE_CENTERS.map((_, index) => obstacle(index)),
    simTime: 0,
    muted,
  };
}

function resetToTitle(state: DeepReadonly<CaromState>): CaromState {
  const next = titleState(state.muted);
  return { ...next, titleIndex: state.titleIndex, menuIndex: state.titleIndex };
}

function startMatch(
  state: DeepReadonly<CaromState>,
  mode: Mode = state.mode,
): CaromState {
  return {
    ...toState(state),
    screen: "countdown",
    mode,
    menuIndex: 0,
    resumeScreen: "playing",
    score: { p1: 0, p2: 0 },
    winner: null,
    receiver: "left",
    ball: parkedBall(),
    paddles: {
      left: { ...state.paddles.left, cy: FIELD_CY, vy: 0 },
      right: { ...state.paddles.right, cy: FIELD_CY, vy: 0 },
    },
  };
}

function moveMenu(index: number, count: number, input: MenuFrameInput): number {
  if (input.up) return (index - 1 + count) % count;
  if (input.down) return (index + 1) % count;
  return index;
}

function menuCount(screen: Screen): number {
  switch (screen) {
    case "title":
      return TITLE_ITEMS.length;
    case "howto":
      return HOWTO_ITEMS.length;
    case "paused":
      return PAUSE_ITEMS.length;
    case "matchover":
      return MATCHOVER_ITEMS.length;
    case "countdown":
    case "playing":
      return 0;
  }
}

function menuOriginY(screen: Screen): number {
  switch (screen) {
    case "title":
      return TITLE_MENU_Y;
    case "howto":
      return HOWTO_MENU_Y;
    case "paused":
      return PAUSE_MENU_Y;
    case "matchover":
      return MATCHOVER_MENU_Y;
    case "countdown":
    case "playing":
      return 0;
  }
}

function menuItemRectFor(
  state: DeepReadonly<CaromState>,
  index: number,
): MenuRect | null {
  const count = menuCount(state.screen);
  if (index < 0 || index >= count) return null;
  return {
    x: MENU_X,
    y: menuOriginY(state.screen) + index * (MENU_H + MENU_GAP),
    w: MENU_W,
    h: MENU_H,
  };
}

function pointInRect(x: number, y: number, rect: MenuRect): boolean {
  return (
    x >= rect.x && x <= rect.x + rect.w && y >= rect.y && y <= rect.y + rect.h
  );
}

function menuIndexAt(
  state: DeepReadonly<CaromState>,
  x: number,
  y: number,
): number | null {
  for (let index = 0; index < menuCount(state.screen); index += 1) {
    const rect = menuItemRectFor(state, index);
    if (rect && pointInRect(x, y, rect)) return index;
  }
  return null;
}

function pointerMenuInput(
  state: DeepReadonly<CaromState>,
  api: UpdateApi,
): Pick<MenuFrameInput, "pointerIndex" | "pointerConfirm"> {
  let pointerIndex = menuIndexAt(
    state,
    api.input.pointer().x,
    api.input.pointer().y,
  );
  let pointerDownIndex: number | null = null;
  let pointerUpIndex: number | null = null;
  let touchDownIndex: number | null = null;
  let touchUpIndex: number | null = null;

  for (const sample of api.input.pointerSamples()) {
    const index = menuIndexAt(state, sample.x, sample.y);
    if (index !== null) pointerIndex = index;
    if (sample.device === "touch") {
      if (sample.type === "down") touchDownIndex = index;
      if (sample.type === "up") touchUpIndex = index;
    } else if (sample.primary) {
      if (sample.type === "down") pointerDownIndex = index;
      if (sample.type === "up") pointerUpIndex = index;
    }
  }

  for (const contact of api.input.pointerContacts()) {
    const index = menuIndexAt(state, contact.x, contact.y);
    if (index !== null) pointerIndex = index;
  }

  const samePointer =
    pointerDownIndex !== null && pointerDownIndex === pointerUpIndex;
  const sameTouch = touchDownIndex !== null && touchDownIndex === touchUpIndex;
  return { pointerIndex, pointerConfirm: samePointer || sameTouch };
}

function readMenuInput(
  state: DeepReadonly<CaromState>,
  api: UpdateApi,
): MenuFrameInput {
  const up = api.input.pressed("p1-up") || api.input.pressed("p2-up");
  const down = api.input.pressed("p1-down") || api.input.pressed("p2-down");
  const confirm = api.input.pressed("confirm");
  const back = api.input.pressed("back");
  const pause = api.input.pressed("pause");
  const pointer = pointerMenuInput(state, api);
  return { up, down, confirm, back, pause, ...pointer };
}

function integratePaddle(
  paddle: DeepReadonly<PaddleState>,
  vy: number,
  dt: number,
): PaddleState {
  const cy = paddle.cy;
  const next = clamp(cy + vy * dt, PADDLE_MIN_CY, PADDLE_MAX_CY);
  const actualVy =
    next !== cy && dt > 0 ? (next - cy) / dt : next === cy ? 0 : vy;
  return { ...paddle, cy: next, vy: actualVy };
}

function paddleInput(axisUp: number, axisDown: number): number {
  return (axisDown - axisUp) * PADDLE_SPEED;
}

function aiVelocity(
  state: DeepReadonly<CaromState>,
  paddle: DeepReadonly<PaddleState>,
  dt: number,
): number {
  if (!state.ai.movement || dt <= 0) return 0;
  let target = AI_HOME_Y;
  let deadzone = AI_HOME_DEADZONE;
  if (
    state.ai.tracking &&
    state.screen === "playing" &&
    state.ball &&
    state.ball.vx > 0
  ) {
    target = state.ball.y - state.ball.vy * AI_REACT;
    deadzone = AI_DEADZONE;
  }
  const diff = target - paddle.cy;
  if (Math.abs(diff) <= deadzone) return 0;
  return Math.sign(diff) * Math.min(AI_SPEED, Math.abs(diff) / dt);
}

function advancePaddles(
  state: DeepReadonly<CaromState>,
  api: UpdateApi,
  dt: number,
): { readonly left: PaddleState; readonly right: PaddleState } {
  const soloUp = Math.max(api.input.value("p1-up"), api.input.value("p2-up"));
  const soloDown = Math.max(
    api.input.value("p1-down"),
    api.input.value("p2-down"),
  );
  const leftVy = state.paddles.left.driven
    ? state.paddles.left.drivenVy
    : state.mode === "solo"
      ? paddleInput(soloUp, soloDown)
      : paddleInput(api.input.value("p1-up"), api.input.value("p1-down"));
  const rightHumanVy = paddleInput(
    api.input.value("p2-up"),
    api.input.value("p2-down"),
  );
  const rightVy = state.paddles.right.driven
    ? state.paddles.right.drivenVy
    : state.mode === "solo"
      ? aiVelocity(state, state.paddles.right, dt)
      : rightHumanVy;

  return {
    left: integratePaddle(state.paddles.left, leftVy, dt),
    right: integratePaddle(state.paddles.right, rightVy, dt),
  };
}

function paddleRect(side: Side, cy: number): Rect {
  return {
    x0: side === "left" ? P1_X0 : P2_X0,
    x1: side === "left" ? P1_X1 : P2_X1,
    y0: cy - PADDLE_HALF,
    y1: cy + PADDLE_HALF,
  };
}

function resolveRect(ball: BallState, rect: Rect): CollisionResult {
  if (
    ball.x <= rect.x0 - BALL_R ||
    ball.x >= rect.x1 + BALL_R ||
    ball.y <= rect.y0 - BALL_R ||
    ball.y >= rect.y1 + BALL_R
  ) {
    return { ball, face: null };
  }
  const left = ball.x - (rect.x0 - BALL_R);
  const right = rect.x1 + BALL_R - ball.x;
  const top = ball.y - (rect.y0 - BALL_R);
  const bottom = rect.y1 + BALL_R - ball.y;
  let face: "left" | "right" | "top" | "bottom" = "left";
  let depth = left;
  if (right < depth) {
    face = "right";
    depth = right;
  }
  if (top < depth) {
    face = "top";
    depth = top;
  }
  if (bottom < depth) face = "bottom";

  switch (face) {
    case "left":
      return {
        ball: {
          ...ball,
          x: rect.x0 - BALL_R,
          vx: ball.vx > 0 ? -ball.vx : ball.vx,
        },
        face,
      };
    case "right":
      return {
        ball: {
          ...ball,
          x: rect.x1 + BALL_R,
          vx: ball.vx < 0 ? -ball.vx : ball.vx,
        },
        face,
      };
    case "top":
      return {
        ball: {
          ...ball,
          y: rect.y0 - BALL_R,
          vy: ball.vy > 0 ? -ball.vy : ball.vy,
        },
        face,
      };
    case "bottom":
      return {
        ball: {
          ...ball,
          y: rect.y1 + BALL_R,
          vy: ball.vy < 0 ? -ball.vy : ball.vy,
        },
        face,
      };
  }
}

function paddleBounce(
  ball: BallState,
  side: Side,
  paddle: PaddleState,
): BallState {
  const offset = clamp((ball.y - paddle.cy) / PADDLE_HALF, -1, 1);
  const theta = offset * MAX_BOUNCE_ANGLE;
  const speed = Math.min(Math.hypot(ball.vx, ball.vy) * SPEED_MULT, SPEED_CAP);
  const dir = side === "left" ? 1 : -1;
  return {
    ...ball,
    x: side === "left" ? P1_X1 + BALL_R : P2_X0 - BALL_R,
    vx: dir * speed * Math.cos(theta),
    vy: speed * Math.sin(theta),
    spin: clamp(
      ball.spin + paddle.vy * SPIN_FROM_PADDLE,
      -SPIN_CLAMP,
      SPIN_CLAMP,
    ),
  };
}

function resolvePaddle(
  ball: BallState,
  side: Side,
  paddle: PaddleState,
): {
  readonly ball: BallState;
  readonly hit: boolean;
  readonly endCap: boolean;
} {
  const result = resolveRect(ball, paddleRect(side, paddle.cy));
  if (!result.face) return { ball, hit: false, endCap: false };
  if (result.face === "left" || result.face === "right") {
    return {
      ball: paddleBounce(result.ball, side, paddle),
      hit: true,
      endCap: false,
    };
  }
  return { ball: result.ball, hit: false, endCap: true };
}

function stepBall(
  ball: BallState,
  paddles: { readonly left: PaddleState; readonly right: PaddleState },
  obstacles: readonly DeepReadonly<ObstacleState>[],
  h: number,
): StepResult {
  let next = ball;
  const speed = Math.hypot(next.vx, next.vy);
  if (speed > 0) {
    const angle = (next.spin / speed) * h;
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    next = {
      ...next,
      vx: next.vx * cos - next.vy * sin,
      vy: next.vx * sin + next.vy * cos,
    };
  }
  next = {
    ...next,
    spin: next.spin * Math.pow(0.5, h / SPIN_HALFLIFE),
    x: next.x + next.vx * h,
    y: next.y + next.vy * h,
  };

  let wallBounce = false;
  let paddleHit = false;
  let obstacleBounce = false;

  if (next.y - BALL_R < 0 && next.vy < 0) {
    next = { ...next, y: BALL_R, vy: -next.vy };
    wallBounce = true;
  } else if (next.y + BALL_R > FIELD_H && next.vy > 0) {
    next = { ...next, y: FIELD_H - BALL_R, vy: -next.vy };
    wallBounce = true;
  }

  const left = resolvePaddle(next, "left", paddles.left);
  next = left.ball;
  paddleHit = paddleHit || left.hit;
  wallBounce = wallBounce || left.endCap;

  const right = resolvePaddle(next, "right", paddles.right);
  next = right.ball;
  paddleHit = paddleHit || right.hit;
  wallBounce = wallBounce || right.endCap;

  for (const present of obstacles) {
    const rect = OBSTACLES[present.index];
    if (!rect)
      throw new Error(`Carom: obstacle ${present.index} does not exist`);
    const resolved = resolveRect(next, rect);
    next = resolved.ball;
    obstacleBounce = obstacleBounce || resolved.face !== null;
  }

  return { ball: next, paddleHit, wallBounce, obstacleBounce };
}

function serve(ball: BallState, receiver: Side): BallState {
  const dir = receiver === "left" ? -1 : 1;
  return {
    ...ball,
    held: false,
    holdTimer: 0,
    trail: [],
    vx: dir * SERVE_SPEED * Math.cos(SERVE_ANGLE),
    vy: ball.serveSign * SERVE_SPEED * Math.sin(SERVE_ANGLE),
  };
}

function appendTrail(ball: BallState, simTime: number): BallState {
  const trail = [...ball.trail, { x: ball.x, y: ball.y, t: simTime }].filter(
    (sample) => simTime - sample.t <= TRAIL_TIME,
  );
  return { ...ball, trail };
}

function winningSide(score: {
  readonly p1: number;
  readonly p2: number;
}): Side | null {
  if (score.p1 >= WIN_SCORE && score.p1 - score.p2 >= WIN_LEAD) return "left";
  if (score.p2 >= WIN_SCORE && score.p2 - score.p1 >= WIN_LEAD) return "right";
  return null;
}

function advanceBall(
  state: CaromState,
  api: UpdateApi,
  dt: number,
): CaromState {
  if (!state.ball) return state;
  let ball = state.ball;
  let screen = state.screen;

  if (screen === "countdown") {
    const holdTimer = Math.max(0, ball.holdTimer - dt);
    ball = { ...ball, x: FIELD_CX, y: FIELD_CY, holdTimer };
    if (holdTimer <= 0) {
      ball = serve(ball, state.receiver);
      screen = "playing";
      return { ...state, screen, ball };
    }
    return { ...state, screen, ball: appendTrail(ball, state.simTime) };
  }

  if (screen !== "playing" || ball.held) return { ...state, ball };

  const speed = Math.hypot(ball.vx, ball.vy);
  const steps = Math.max(1, Math.ceil((speed * dt) / MAX_SUBSTEP));
  const h = dt / steps;
  let paddleHit = false;
  let wallBounce = false;
  let obstacleBounce = false;

  for (let step = 0; step < steps; step += 1) {
    const result = stepBall(ball, state.paddles, state.obstacles, h);
    ball = result.ball;
    paddleHit = paddleHit || result.paddleHit;
    wallBounce = wallBounce || result.wallBounce;
    obstacleBounce = obstacleBounce || result.obstacleBounce;
  }

  if (paddleHit) api.audio.play(CUES.paddleHit);
  if (wallBounce) api.audio.play(CUES.wallBounce);
  if (obstacleBounce) api.audio.play(CUES.obstacleBounce);

  const p1Scored = ball.x - BALL_R > FIELD_W;
  const p2Scored = ball.x + BALL_R < 0;
  if (p1Scored || p2Scored) {
    api.audio.play(CUES.score);
    const score = {
      p1: state.score.p1 + (p1Scored ? 1 : 0),
      p2: state.score.p2 + (p2Scored ? 1 : 0),
    };
    const scorer: Side = p1Scored ? "left" : "right";
    const winner = winningSide(score);
    if (winner) {
      return {
        ...state,
        score,
        winner,
        ball,
        screen: "matchover",
        menuIndex: 0,
      };
    }
    return {
      ...state,
      score,
      receiver: scorer === "left" ? "right" : "left",
      ball: parkedBall(),
      screen: "countdown",
    };
  }

  return { ...state, ball: appendTrail(ball, state.simTime) };
}

function confirmTitle(
  state: DeepReadonly<CaromState>,
  index: number,
): CaromState {
  if (index === 0)
    return startMatch({ ...toState(state), titleIndex: index }, "solo");
  if (index === 1)
    return startMatch({ ...toState(state), titleIndex: index }, "versus");
  return {
    ...toState(state),
    titleIndex: index,
    screen: "howto",
    menuIndex: 0,
  };
}

function confirmPaused(
  state: DeepReadonly<CaromState>,
  index: number,
): CaromState {
  if (index === 0) return { ...toState(state), screen: state.resumeScreen };
  if (index === 1) return startMatch(state, state.mode);
  return resetToTitle(state);
}

function confirmMatchover(
  state: DeepReadonly<CaromState>,
  index: number,
): CaromState {
  if (index === 0) return startMatch(state, state.mode);
  return resetToTitle(state);
}

function applyScreenInput(
  state: DeepReadonly<CaromState>,
  input: MenuFrameInput,
): CaromState {
  let next = toState(state);
  switch (state.screen) {
    case "title": {
      const moved = input.up || input.down;
      const menuIndex = moveMenu(state.menuIndex, TITLE_ITEMS.length, input);
      next = { ...next, menuIndex };
      if (!moved && input.pointerIndex !== null) {
        next = { ...next, menuIndex: input.pointerIndex };
      }
      if (!moved && input.confirm) return confirmTitle(next, menuIndex);
      if (!moved && !input.confirm && input.pointerConfirm) {
        return confirmTitle(next, next.menuIndex);
      }
      return next;
    }
    case "howto":
      if (input.confirm || input.back || input.pointerConfirm)
        return resetToTitle(state);
      return input.pointerIndex !== null
        ? { ...next, menuIndex: input.pointerIndex }
        : next;
    case "countdown":
    case "playing":
      if (input.pause) {
        return {
          ...next,
          resumeScreen: state.screen,
          screen: "paused",
          menuIndex: 0,
        };
      }
      return next;
    case "paused": {
      if (input.pause || input.back)
        return { ...next, screen: state.resumeScreen };
      const moved = input.up || input.down;
      const menuIndex = moveMenu(state.menuIndex, PAUSE_ITEMS.length, input);
      next = { ...next, menuIndex };
      if (!moved && input.pointerIndex !== null) {
        next = { ...next, menuIndex: input.pointerIndex };
      }
      if (!moved && input.confirm) return confirmPaused(next, menuIndex);
      if (!moved && !input.confirm && input.pointerConfirm) {
        return confirmPaused(next, next.menuIndex);
      }
      return next;
    }
    case "matchover": {
      if (input.back) return resetToTitle(state);
      const moved = input.up || input.down;
      const menuIndex = moveMenu(
        state.menuIndex,
        MATCHOVER_ITEMS.length,
        input,
      );
      next = { ...next, menuIndex };
      if (!moved && input.pointerIndex !== null) {
        next = { ...next, menuIndex: input.pointerIndex };
      }
      if (!moved && input.confirm) return confirmMatchover(next, menuIndex);
      if (!moved && !input.confirm && input.pointerConfirm) {
        return confirmMatchover(next, next.menuIndex);
      }
      return next;
    }
  }
}

function updateState(
  state: DeepReadonly<CaromState>,
  api: UpdateApi,
  dt: number,
): CaromState {
  const input = readMenuInput(state, api);
  if (api.input.pressed("mute")) api.audio.setMuted(!api.audio.muted());
  else if (api.audio.muted() !== state.muted) api.audio.setMuted(state.muted);

  let next = applyScreenInput(state, input);
  next = { ...next, simTime: next.simTime + dt, muted: api.audio.muted() };
  if (next.screen === "countdown" || next.screen === "playing") {
    next = { ...next, paddles: advancePaddles(next, api, dt) };
    next = advanceBall(next, api, dt);
  }
  return { ...next, muted: api.audio.muted() };
}

function snapshot(state: DeepReadonly<CaromState>): CaromSnapshot {
  const base = toState(state);
  return {
    ...base,
    version: CAROM_DEBUG_VERSION,
    ball: base.ball
      ? { ...base.ball, speed: Math.hypot(base.ball.vx, base.ball.vy) }
      : null,
  };
}

function requireBall(state: DeepReadonly<CaromState>): BallState {
  if (!state.ball) throw new Error("Carom: no ball is present");
  return cloneBall(state.ball);
}

function setBall(state: DeepReadonly<CaromState>, ball: BallState): CaromState {
  return { ...toState(state), ball };
}

function withPaddle(
  state: DeepReadonly<CaromState>,
  side: Side,
  paddle: PaddleState,
): CaromState {
  const next = toState(state);
  return { ...next, paddles: { ...next.paddles, [side]: paddle } };
}

function buildDebug(): CaromDebugApi {
  return {
    version: CAROM_DEBUG_VERSION,
    clearWorld: (state) => ({ ...toState(state), ball: null, obstacles: [] }),
    spawnBall: (state) => ({ ...toState(state), ball: parkedBall() }),
    spawnObstacle: (state, index) => ({
      ...toState(state),
      obstacles: [
        ...state.obstacles.filter((present) => present.index !== index),
        obstacle(index),
      ].sort((a, b) => a.index - b.index),
    }),
    reset: (state) => ({ ...titleState(state.muted), muted: state.muted }),
    reconcile: (state) => toState(state),
    setScreen: (state, screen) => ({ ...toState(state), screen }),
    setMode: (state, mode) => ({ ...toState(state), mode }),
    setMenuIndex: (state, index) => ({ ...toState(state), menuIndex: index }),
    setTitleIndex: (state, index) => ({ ...toState(state), titleIndex: index }),
    setResumeScreen: (state, resumeScreen) => ({
      ...toState(state),
      resumeScreen,
    }),
    setScore: (state, p1, p2) => ({ ...toState(state), score: { p1, p2 } }),
    setWinner: (state, winner) => ({ ...toState(state), winner }),
    setReceiver: (state, receiver) => ({ ...toState(state), receiver }),
    setPaddleCy: (state, side, cy) =>
      withPaddle(state, side, { ...state.paddles[side], cy }),
    setPaddleVy: (state, side, drivenVy) =>
      withPaddle(state, side, { ...state.paddles[side], drivenVy }),
    setPaddleDriven: (state, side, driven) =>
      withPaddle(state, side, { ...state.paddles[side], driven }),
    setBallPosition: (state, x, y) =>
      setBall(state, { ...requireBall(state), x, y }),
    setBallVelocity: (state, vx, vy) =>
      setBall(state, { ...requireBall(state), vx, vy }),
    setBallSpin: (state, spin) =>
      setBall(state, { ...requireBall(state), spin }),
    setBallHeld: (state, held) =>
      setBall(state, { ...requireBall(state), held }),
    setBallHoldTimer: (state, holdTimer) =>
      setBall(state, { ...requireBall(state), holdTimer }),
    setBallServeSign: (state, serveSign) =>
      setBall(state, { ...requireBall(state), serveSign }),
    drawBallServeSign: (state) =>
      setBall(state, { ...requireBall(state), serveSign: drawServeSign() }),
    setAiTracking: (state, tracking) => ({
      ...toState(state),
      ai: { ...state.ai, tracking },
    }),
    setAiMovement: (state, movement) => ({
      ...toState(state),
      ai: { ...state.ai, movement },
    }),
    setMuted: (state, muted) => ({ ...toState(state), muted }),
    snapshot,
    menuItemRect: menuItemRectFor,
  };
}

function registerDiagnostics(api: InitApi<CaromState>): void {
  api.diagnostics.register("screen", (state) => state.screen);
  api.diagnostics.register("mode", (state) => state.mode);
  api.diagnostics.register(
    "score",
    (state) => `${state.score.p1}-${state.score.p2}`,
  );
  api.diagnostics.register("ball", (state) =>
    state.ball
      ? `${state.ball.x.toFixed(1)},${state.ball.y.toFixed(1)}`
      : "none",
  );
  api.diagnostics.register("velocity", (state) =>
    state.ball
      ? `${state.ball.vx.toFixed(1)},${state.ball.vy.toFixed(1)}`
      : "none",
  );
  api.diagnostics.register("speed", (state) =>
    state.ball ? Math.hypot(state.ball.vx, state.ball.vy).toFixed(1) : "none",
  );
  api.diagnostics.register("spin", (state) =>
    state.ball ? state.ball.spin.toFixed(1) : "none",
  );
  api.diagnostics.register(
    "left paddle",
    (state) =>
      `${state.paddles.left.cy.toFixed(1)} ${state.paddles.left.vy.toFixed(1)}`,
  );
  api.diagnostics.register(
    "right paddle",
    (state) =>
      `${state.paddles.right.cy.toFixed(1)} ${state.paddles.right.vy.toFixed(1)}`,
  );
}

function defineAudio(api: InitApi<CaromState>): void {
  api.audio.define(CUES.paddleHit, {
    wave: "triangle",
    freq: 420,
    freqTo: 720,
    durationMs: 70,
    gain: 0.18,
  });
  api.audio.define(CUES.wallBounce, {
    wave: "sine",
    freq: 300,
    freqTo: 210,
    durationMs: 55,
    gain: 0.13,
  });
  api.audio.define(CUES.obstacleBounce, {
    wave: "square",
    freq: 520,
    freqTo: 360,
    durationMs: 65,
    gain: 0.12,
  });
  api.audio.define(CUES.score, {
    wave: "sawtooth",
    freq: 260,
    freqTo: 880,
    durationMs: 160,
    gain: 0.16,
  });
}

function roundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
): void {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function drawPaddle(
  ctx: CanvasRenderingContext2D,
  side: Side,
  paddle: DeepReadonly<PaddleState>,
): void {
  ctx.save();
  ctx.fillStyle = side === "left" ? LEFT_COLOR : RIGHT_COLOR;
  ctx.shadowColor = ctx.fillStyle;
  ctx.shadowBlur = 20;
  roundedRect(
    ctx,
    side === "left" ? P1_X0 : P2_X0,
    paddle.cy - PADDLE_HALF,
    PADDLE_W,
    PADDLE_H,
    8,
  );
  ctx.fill();
  ctx.restore();
}

function drawBall(
  ctx: CanvasRenderingContext2D,
  ball: DeepReadonly<BallState>,
): void {
  if (ball.trail.length > 1) {
    ctx.save();
    ctx.lineWidth = BALL_R * 1.35;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    for (let index = 1; index < ball.trail.length; index += 1) {
      const age = index / (ball.trail.length - 1);
      ctx.strokeStyle = `rgba(255, 243, 164, ${0.08 + age * 0.32})`;
      ctx.beginPath();
      ctx.moveTo(ball.trail[index - 1].x, ball.trail[index - 1].y);
      ctx.lineTo(ball.trail[index].x, ball.trail[index].y);
      ctx.stroke();
    }
    ctx.restore();
  }
  ctx.save();
  ctx.fillStyle = BALL_COLOR;
  ctx.shadowColor = BALL_COLOR;
  ctx.shadowBlur = 18;
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, BALL_R, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawField(
  state: DeepReadonly<CaromState>,
  ctx: CanvasRenderingContext2D,
): void {
  ctx.fillStyle = BACKGROUND;
  ctx.fillRect(0, 0, FIELD_W, FIELD_H);
  ctx.strokeStyle = LINE;
  ctx.lineWidth = 2;
  for (let y = 28; y < FIELD_H; y += 34) {
    ctx.beginPath();
    ctx.moveTo(NET_X, y);
    ctx.lineTo(NET_X, y + 18);
    ctx.stroke();
  }

  for (const present of state.obstacles) {
    ctx.save();
    ctx.shadowColor = OBSTACLE_COLOR;
    ctx.shadowBlur = 18;
    ctx.fillStyle = OBSTACLE_COLOR;
    roundedRect(
      ctx,
      present.cx - OBSTACLE_HW,
      present.cy - OBSTACLE_HH,
      OBSTACLE_W,
      OBSTACLE_H,
      10,
    );
    ctx.fill();
    ctx.restore();
  }

  drawPaddle(ctx, "left", state.paddles.left);
  drawPaddle(ctx, "right", state.paddles.right);
  if (state.ball) drawBall(ctx, state.ball);
}

function drawHud(
  state: DeepReadonly<CaromState>,
  ctx: CanvasRenderingContext2D,
): void {
  ctx.fillStyle = TEXT_COLOR;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = "700 56px Inter, ui-sans-serif, system-ui, sans-serif";
  ctx.fillText(String(state.score.p1), FIELD_CX - 115, 64);
  ctx.fillText(String(state.score.p2), FIELD_CX + 115, 64);
  ctx.font = "600 18px Inter, ui-sans-serif, system-ui, sans-serif";
  ctx.fillStyle = DIM_TEXT;
  ctx.fillText(
    state.mode === "solo" ? "SOLO DUEL" : "VERSUS DUEL",
    FIELD_CX,
    105,
  );
  if (state.screen === "countdown" && state.ball) {
    ctx.font = "800 82px Inter, ui-sans-serif, system-ui, sans-serif";
    ctx.fillStyle = "rgba(244, 247, 255, 0.88)";
    ctx.fillText(
      Math.ceil(state.ball.holdTimer).toString(),
      FIELD_CX,
      FIELD_CY,
    );
  }
}

function drawMenu(
  state: DeepReadonly<CaromState>,
  ctx: CanvasRenderingContext2D,
  items: readonly string[],
): void {
  for (let index = 0; index < items.length; index += 1) {
    const rect = menuItemRectFor(state, index);
    if (!rect) continue;
    const active = index === state.menuIndex;
    ctx.fillStyle = active
      ? "rgba(255, 209, 102, 0.18)"
      : "rgba(244, 247, 255, 0.08)";
    ctx.strokeStyle = active ? HIGHLIGHT : LINE;
    ctx.lineWidth = active ? 3 : 1.5;
    roundedRect(ctx, rect.x, rect.y, rect.w, rect.h, 8);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = active ? HIGHLIGHT : TEXT_COLOR;
    ctx.font = "700 23px Inter, ui-sans-serif, system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(
      items[index] ?? "",
      rect.x + rect.w / 2,
      rect.y + rect.h / 2 + 1,
    );
  }
}

function drawPanel(ctx: CanvasRenderingContext2D): void {
  ctx.fillStyle = PANEL;
  roundedRect(ctx, FIELD_CX - 300, 120, 600, 490, 8);
  ctx.fill();
}

function renderState(state: DeepReadonly<CaromState>, api: RenderApi): void {
  const ctx = api.ctx;
  drawField(state, ctx);

  if (state.screen === "playing" || state.screen === "countdown") {
    drawHud(state, ctx);
    return;
  }

  if (state.screen === "title") {
    ctx.fillStyle = "rgba(7, 9, 20, 0.55)";
    ctx.fillRect(0, 0, FIELD_W, FIELD_H);
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = TEXT_COLOR;
    ctx.font = "900 110px Inter, ui-sans-serif, system-ui, sans-serif";
    ctx.fillText(TITLE_TEXT, FIELD_CX, 205);
    ctx.font = "500 22px Inter, ui-sans-serif, system-ui, sans-serif";
    ctx.fillStyle = DIM_TEXT;
    ctx.fillText("Spin the rally. Bend the bank shot.", FIELD_CX, 286);
    drawMenu(state, ctx, TITLE_ITEMS);
    return;
  }

  if (state.screen === "howto") {
    drawPanel(ctx);
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = TEXT_COLOR;
    ctx.font = "800 46px Inter, ui-sans-serif, system-ui, sans-serif";
    ctx.fillText("HOW TO PLAY", FIELD_CX, 175);
    ctx.font = "500 24px Inter, ui-sans-serif, system-ui, sans-serif";
    ctx.fillStyle = "rgba(244, 247, 255, 0.82)";
    [
      "W/S moves the left paddle. Arrows move the right paddle in Versus.",
      "In Solo, either set of keys moves you; the AI guards the far side.",
      "Strike while moving to add spin and curve the ball after contact.",
      "Use the center obstacles for banks, traps, and sharp reversals.",
      "P pauses. Esc backs out. M toggles sound.",
    ].forEach((line, index) => {
      ctx.fillText(line, FIELD_CX, 252 + index * 48);
    });
    drawMenu(state, ctx, HOWTO_ITEMS);
    return;
  }

  if (state.screen === "paused") {
    drawHud(state, ctx);
    ctx.fillStyle = "rgba(7, 9, 20, 0.62)";
    ctx.fillRect(0, 0, FIELD_W, FIELD_H);
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = TEXT_COLOR;
    ctx.font = "800 64px Inter, ui-sans-serif, system-ui, sans-serif";
    ctx.fillText("PAUSED", FIELD_CX, 210);
    drawMenu(state, ctx, PAUSE_ITEMS);
    return;
  }

  drawHud(state, ctx);
  ctx.fillStyle = "rgba(7, 9, 20, 0.66)";
  ctx.fillRect(0, 0, FIELD_W, FIELD_H);
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = TEXT_COLOR;
  ctx.font = "800 58px Inter, ui-sans-serif, system-ui, sans-serif";
  ctx.fillText(
    state.winner === "left" ? "LEFT SIDE WINS" : "RIGHT SIDE WINS",
    FIELD_CX,
    230,
  );
  ctx.font = "700 34px Inter, ui-sans-serif, system-ui, sans-serif";
  ctx.fillStyle = DIM_TEXT;
  ctx.fillText(`FINAL ${state.score.p1} - ${state.score.p2}`, FIELD_CX, 300);
  drawMenu(state, ctx, MATCHOVER_ITEMS);
}

export const game: Game<CaromState, CaromDebugApi> = {
  initialize(api: InitApi<CaromState>): [CaromState, CaromDebugApi] {
    for (const action of ACTIONS) {
      api.input.register(action, { keys: [...BINDINGS[action]] });
    }
    defineAudio(api);
    registerDiagnostics(api);
    return [titleState(false), buildDebug()];
  },

  update(
    state: DeepReadonly<CaromState>,
    api: UpdateApi,
    dt: number,
  ): CaromState {
    return updateState(state, api, dt);
  },

  render(state: DeepReadonly<CaromState>, api: RenderApi): void {
    renderState(state, api);
  },
};
