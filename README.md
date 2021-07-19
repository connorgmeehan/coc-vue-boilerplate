# Eyejack WebAr Custom

> This project is for building custom webar projects for clients.  It references `eyejack-webar-core` as a submodule.  `eyejack-webar-core` stores logic for starting 8th wall + provides some basic, versatile components.

## Guidelines / How to use this repo
1) The core code is kept in the `master` branch.  Any custom client work should be made in a branch off `master` with the prefix `client/` i.e. `client/brisbane-water` (this puts the branch in a subfolder).
2) If you write something for a client that will be useful to have in master you should:
    1) Checkout `master`.
    2) Cherrypick the commit from the `client/xxx` branch.

## Previous jobs example code / features

### `client/disney-mech-strike` -> Disney Mech Strike
- 
- Simple WebAr experience, introduction modal, post-artwork view modal.

## Directory Structure

```
./src/core - Root of the "core" submodule
./src/core/core - Contains hidden processes and app state (8thwall tracking, what image targets are active etc).
./src/core/core/8thwall - Stores code relating to 8th wall
./src/core/core/8thwall/qr - Contains a QR scanning library used by qrSwitchingXR8Module
./src/core/core/8thwall/modules - Contains custom modules used by 8thwall (custom ThreeJS module, our eyejack webar module + a module that can switch between content types based on qrCodes)
./src/core/core/stores - Contains Vue3 reactive stores containing app state
./src/core/core/three-components - Contains custom three components
  index.ts - Root of three scene, can switch between content types (Video, 3d, 3d + worldtracking)
./src/core/core/shaders - Shaders used by three-components

./src/core/coreui - Contains all generic components shared between projects
./src/core/coreui/compositions - If we need to make re-usable vue3 compositions they can go here
./src/core/coreui/styles - Default shared styles between projects, right now just a reset.scss and some helper functions (includemedia.scss)
./src/core/coreui/components - Generic components shared between projects
./src/core/coreui/components/icons - Icons shared between projects
./src/core/coreui/assets
./src/three
./src/styles
./src/components
./src/components/ui
./src/components/layout
./src/public
./src/assets
```

## Commands

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```
