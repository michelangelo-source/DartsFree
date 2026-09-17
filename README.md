# DartsFree

A simple app to count points in darts. Nothing fancy — just a handy tool for keeping score when you're playing with friends. Android only for now.

---

## Features

### Casual Games

Classic X01 darts with full scoring support:

- **Configurable targets** — 301, 501, 701, or any custom value
- **Checkout modes** — Single out, Double out, or Master (Triple) out
- **Multiplayer** — 2+ players with turn tracking
- **Legs system** — configurable legs-to-win
- **Full score input** — Singles, Doubles, Triples (1–20), Bull 25, Bullseye 50, Miss, and the classic "Bed & Breakfast" 26 (1 + 5 + 20)
- **Bust detection** — automatically reverts the visit when a player goes bust
- **Win detection** — validates the last dart matches the required checkout multiplier
- **Undo** — undo individual throws, even across player turns
- **Live stats** — remaining score, 3-dart average, darts thrown, and legs won per player

### Tournament Mode

Single-elimination bracket tournaments:

- **Auto-generated brackets** — randomised seeding with bye support for non-power-of-2 player counts
- **Per-round configurable legs** — e.g. Best of 1 in early rounds, Best of 3 in the final
- **Visual bracket display** — see the full bracket with connecting lines
- **Winner propagation** — winners automatically advance to the next match

### Training Modes

#### Around The Clock

- Aim for numbers 1 → 20 in order
- Track your hit rate and percentage
- Finishes when all 20 numbers are completed

#### Random Throws

- **Configurable target pool** — toggle Singles, Doubles, and Triples
- **Adjustable throw count** (default: 20)
- Randomly generated target list using Fisher-Yates shuffle
- Score tracking with hit percentage

### Sound Effects

| Sound    | Trigger                          |
| -------- | -------------------------------- |
| Score    | Single dart scored               |
| Score 3× | Classic 26 (all 3 darts at once) |
| Miss     | Dart misses the target           |
| Bust     | Player goes bust                 |

---

## Tech Stack

| Layer            | Technology                                                                                                                      |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| Framework        | [React Native](https://reactnative.dev/) 0.86 + [Expo](https://expo.dev/) SDK 57                                                |
| Language         | TypeScript 6.0                                                                                                                  |
| Routing          | [expo-router](https://docs.expo.dev/router/introduction/) (file-based, typed routes)                                            |
| State Management | [Zustand](https://zustand.docs.pmnd.rs/) 5.0                                                                                    |
| Animations       | react-native-reanimated 4.5                                                                                                     |
| Audio            | expo-audio                                                                                                                      |
| Icons            | [lucide-react-native](https://lucide.dev/) + custom SVGs (via react-native-svg-transformer)                                     |
| Testing          | [Jest](https://jestjs.io/) 29.7 + [@testing-library/react-native](https://callstack.github.io/react-native-testing-library/) 14 |
| Linting          | ESLint (Expo config)                                                                                                            |

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v24.14.1 (see `.nvmrc`)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- Android Studio (for native builds)

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/DartsFree.git
cd DartsFree

# Use the correct Node version
nvm install
nvm use

# Install dependencies
npm install
```

### Running the App

```bash
# Start the Expo dev server
npm start

# Run on Android
npm run android
```

---

## Testing

```bash
# Run the full test suite
npm test
```

The project uses **Jest** with **@testing-library/react-native**. Tests cover hooks, stores, components, and screen-level integration.

---

## CI/CD

Two GitHub Actions workflows are configured:

### On Commit (non-main branches)

- Lint (ESLint)
- Type Check (TypeScript `tsc --noEmit`)
- Tests (Jest)

### PR to Develop

- Security Audit (`npm audit`)
- Lint
- Type Check
- Tests
- Expo Build Verification (`expo export --platform android`)

---

## License

This project is licensed under the [GNU General Public License v3.0](./LICENSE).
