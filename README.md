# vue-palette

This app allows editing palettes. Palettes are meant to be files with display parameters of the level lines and the fill color between lines.

Palette file should have extension `txt`.

Example of a palette file:
```
lines:type=GRADIENT;preset=CUSTOM
filling:type=INTERVAL;preset=CUSTOM
value lineStyle lineWidth lineColor fillColor
10 solid 2 RGB(0,0,0) RGB(255,255,255)
15 solid 8 RGB(0,0,0) RGB(255,0,0)
20 solid 2 RGB(255,0,0) RGB(0,255,0)
35 solid 2 RGB(0,255,0) RGB(0,0,255)
55 solid 2 RGB(0,0,255) RGB(0,0,0)
60 dotted 2 RGB(0,0,0) RGB(255,255,255)
75 solid 8 RGB(0,0,0) RGB(255,0,0)
85 solid 2 RGB(255,0,0) RGB(0,255,0)
100 solid 2 RGB(0,0,0) RGB(255,255,255)
```

## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn serve
```

### Compiles and minifies for production
```
yarn build
```

### Lints and fixes files
```
yarn lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
