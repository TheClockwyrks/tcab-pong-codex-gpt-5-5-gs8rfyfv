# Carom

Carom is a top-down browser paddle duel built on the Simple 2D engine. Two
paddles face off across a dark field, a bright ball ricochets between them, and
fixed center obstacles turn clean returns into bank-shot puzzles.

The signature mechanic is spin. Moving a paddle as it strikes the ball bends the
ball's later flight, so rallies are about timing, angles, and using the obstacles
as much as simply blocking the shot.

## Install

```sh
npm ci
```

## Development

```sh
npm run dev
```

Vite serves the game locally with hot reload.

## Production Build

```sh
npm run build
```

The static site is written to `dist/`, with `dist/index.html` as the entry point.

## Controls

- Left paddle: `W` and `S`
- Right paddle in Versus: `ArrowUp` and `ArrowDown`
- Solo mode: either paddle key set controls the human player
- Confirm: `Enter` or `Space`
- Pause: `P` or `Escape`
- Back: `Escape`
- Mute: `M`
