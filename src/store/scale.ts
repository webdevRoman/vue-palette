import {State} from '@/store/State'
import {Level} from '@/models/Level'
import {LineStyles} from '@/models/LineStyles'
import {Color} from '@/models/Color'
import {Palette} from '@/models/Palette'

export interface ScaleInfo {
  scaleMin: number;
  scaleMax: number;
  scaleInterval: number;
  isScaleLines?: boolean;
  isScaleFilling?: boolean;
}

interface ScalableLevel extends Level {
  scaleValue: number;
}

export const countPerCent = (value: number, min: number, max: number): number => (value - min) / (max - min) * 100

export const countValue = (perCent: number, min: number, max: number): number => min + (max - min) * perCent / 100

export const formatLevelsToScalable = (levels: Level[]): ScalableLevel[] => {
  const scalableLevels: ScalableLevel[] = []
  levels.forEach(level => {
    scalableLevels.push({
      ...level,
      scaleValue: countPerCent(level.value, levels[0].value, levels[levels.length - 1].value) / 100
    } as ScalableLevel)
  })
  return scalableLevels
}

const findSuitableLevels = (levels: ScalableLevel[], minVal: number, maxVal: number): ScalableLevel[] => {
  const suitableLevels: ScalableLevel[] = []
  for (let i = 0; i < levels.length; i++) {
    if (levels[i].scaleValue < minVal) {
      continue
    } else if (levels[i].scaleValue > maxVal) {
      break
    }
    suitableLevels.push(levels[i])
  }
  return suitableLevels
}

const scaleLevels = (newLevels: Level[], oldLevels: Level[], scaleLines: boolean, scaleFilling: boolean): Level[] => {
  const scalableNewLevels = formatLevelsToScalable(newLevels)
  const scalableOldLevels = formatLevelsToScalable(oldLevels)
  const scaledLevels = []

  let midVal2 = scalableOldLevels[0].scaleValue + (scalableOldLevels[1].scaleValue - scalableOldLevels[0].scaleValue) / 2
  let suitableNewLevels = findSuitableLevels(scalableNewLevels, scalableOldLevels[0].scaleValue, midVal2)
  suitableNewLevels.forEach(level => {
    if (scaleLines) {
      level.lineColor = scalableOldLevels[0].lineColor
      level.lineStyle = scalableOldLevels[0].lineStyle
      level.lineWidth = scalableOldLevels[0].lineWidth
    }
    if (scaleFilling) {
      level.fillColor = scalableOldLevels[0].fillColor
    }
    scaledLevels.push(level)
  })

  for (let i = 0; i < scalableOldLevels.length - 2; i++) {
    const midVal1 = scalableOldLevels[i].scaleValue +
      (scalableOldLevels[i + 1].scaleValue - scalableOldLevels[i].scaleValue) / 2
    midVal2 = scalableOldLevels[i + 1].scaleValue +
      (scalableOldLevels[i + 2].scaleValue - scalableOldLevels[i + 1].scaleValue) / 2
    suitableNewLevels = findSuitableLevels(scalableNewLevels, midVal1, midVal2)
    suitableNewLevels.forEach(level => {
      if (scaleLines) {
        level.lineColor = scalableOldLevels[i + 1].lineColor
        level.lineStyle = scalableOldLevels[i + 1].lineStyle
        level.lineWidth = scalableOldLevels[i + 1].lineWidth
      }
      if (scaleFilling) {
        level.fillColor = scalableOldLevels[i + 1].fillColor
      }
      scaledLevels.push(level)
    })
  }

  const midVal1 = scalableOldLevels[scalableOldLevels.length - 2].scaleValue +
    (scalableOldLevels[scalableOldLevels.length - 1].scaleValue -
      scalableOldLevels[scalableOldLevels.length - 2].scaleValue) / 2
  suitableNewLevels = findSuitableLevels(scalableNewLevels, midVal1,
    scalableOldLevels[scalableOldLevels.length - 1].scaleValue)
  suitableNewLevels.forEach(level => {
    if (scaleLines) {
      level.lineColor = scalableOldLevels[scalableOldLevels.length - 1].lineColor
      level.lineStyle = scalableOldLevels[scalableOldLevels.length - 1].lineStyle
      level.lineWidth = scalableOldLevels[scalableOldLevels.length - 1].lineWidth
    }
    if (scaleFilling) {
      level.fillColor = scalableOldLevels[scalableOldLevels.length - 1].fillColor
    }
    scaledLevels.push(level)
  })

  scaledLevels.forEach(level => delete level.scaleValue)
  return scaledLevels
}

const binarySearch = (data: Level[], target: number, start: number, end: number): Level => {
  if (end < 1) {
    return data[0]
  }
  const middle = Math.floor((start + (end - start) / 2))
  if (target == data[middle].value) {
    return data[middle]
  }
  if (end - 1 === start) {
    return Math.abs(data[start].value - target) > Math.abs(data[end].value - target) ? data[end] : data[start]
  }
  if (target > data[middle].value) {
    return binarySearch(data, target, middle, end)
  }
  if (target < data[middle].value) {
    return binarySearch(data, target, start, middle)
  }
}



export default {

  state: () => ({
    showScaleDialog: false,
    scaleMin: null,
    scaleMax: null,
    scaleInterval: 25,
    isScaleLines: false,
    isScaleFilling: false
  }),

  mutations: {
    SHOW_SCALE_DIALOG(state: State) {
      state.showScaleDialog = true
    },

    HIDE_SCALE_DIALOG(state: State) {
      state.showScaleDialog = false
    },

    SET_SCALE_LIMITS(state: State, scaleInfo: ScaleInfo) {
      state.scaleMin = scaleInfo.scaleMin
      state.scaleMax = scaleInfo.scaleMax
      state.scaleInterval = scaleInfo.scaleInterval
      state.isScaleLines = scaleInfo.isScaleLines
      state.isScaleFilling = scaleInfo.isScaleFilling
    }
  },

  actions: {
    SHOW_SCALE_DIALOG({commit}) {
      commit('SHOW_SCALE_DIALOG')
    },

    HIDE_SCALE_DIALOG({commit}) {
      commit('HIDE_SCALE_DIALOG')
    },

    SET_SCALE_LIMITS({commit, getters}, payloadScaleInfo?: ScaleInfo) {
      let payloadMin, payloadMax, payloadInterval, payloadIsScaleLines, payloadIsScaleFilling
      if (payloadScaleInfo) {
        payloadMin = payloadScaleInfo.scaleMin
        payloadMax = payloadScaleInfo.scaleMax
        payloadInterval = payloadScaleInfo.scaleInterval
        payloadIsScaleLines = payloadScaleInfo.isScaleLines
        payloadIsScaleFilling = payloadScaleInfo.isScaleFilling
      } else {
        payloadMin = getters.levels[0].value
        payloadMax = getters.levels[getters.levels.length - 1].value
        payloadInterval = getters.scaleInterval
        payloadIsScaleLines = false
        payloadIsScaleFilling = false
      }
      const scaleInfo = {
        scaleMin: payloadMin - payloadMin % payloadInterval,
        scaleMax: payloadMax + payloadInterval - payloadMax % payloadInterval,
        scaleInterval: payloadInterval,
        isScaleLines: payloadIsScaleLines,
        isScaleFilling: payloadIsScaleFilling
      } as ScaleInfo
      commit('SET_SCALE_LIMITS', scaleInfo)
    },

    SCALE_LEVELS({commit, dispatch, getters}, payloadScaleInfo: ScaleInfo) {
      dispatch('SET_SCALE_LIMITS', payloadScaleInfo)

      let newLevels: Level[] = []
      const scaleMin = getters.scaleMin
      const scaleMax = getters.scaleMax
      const scaleInterval = getters.scaleInterval
      for (let i = 0; i < (scaleMax - scaleMin) / scaleInterval; i++) {
        newLevels.push({
          id: i,
          value: scaleMin + scaleInterval * i,
          lineStyle: LineStyles.SOLID,
          lineWidth: 1,
          lineColor: new Color('RGB(0,0,0)'),
          fillColor: new Color('RGB(255,255,255)')
        } as Level)
      }

      const oldLevels: Level[] = getters.levels
      if (getters.isScaleLines && getters.isScaleFilling) {
        // Масштабируем и линии, и цвета закраски
        newLevels = scaleLevels(newLevels, oldLevels, true, true)
      } else if (getters.isScaleLines) {
        // Масштабируем только линии
        newLevels = scaleLevels(newLevels, oldLevels, true, false)
        let previousOldLevel: Level = null
        oldLevels.forEach(oldLevel => {
          const suitableNewLevel = binarySearch(newLevels, oldLevel.value, 0, newLevels.length - 1)
          if (!(
            previousOldLevel &&
            Math.abs(previousOldLevel.value - suitableNewLevel.value) < Math.abs(oldLevel.value - suitableNewLevel.value)
          )) {
            suitableNewLevel.fillColor = oldLevel.fillColor
          }
          previousOldLevel = oldLevel
        })
      } else if (getters.isScaleFilling) {
        // Масштабируем только цвета закраски
        newLevels = scaleLevels(newLevels, oldLevels, false, true)
        let previousOldLevel: Level = null
        oldLevels.forEach(oldLevel => {
          const suitableNewLevel = binarySearch(newLevels, oldLevel.value, 0, newLevels.length - 1)
          if (!(
            previousOldLevel &&
            Math.abs(previousOldLevel.value - suitableNewLevel.value) < Math.abs(oldLevel.value - suitableNewLevel.value)
          )) {
            suitableNewLevel.lineColor = oldLevel.lineColor
            suitableNewLevel.lineStyle = oldLevel.lineStyle
            suitableNewLevel.lineWidth = oldLevel.lineWidth
          }
          previousOldLevel = oldLevel
        })
      }

      const newPalette: Palette = getters.palette
      newPalette.levels = newLevels
      commit('SET_PALETTE', newPalette)
      dispatch('SET_SCALE_LIMITS')
    }
  },

  getters: {
    showScaleDialog: (state: State) => state.showScaleDialog,
    scaleMin: (state: State) => state.scaleMin,
    scaleMax: (state: State) => state.scaleMax,
    scaleInterval: (state: State) => state.scaleInterval,
    isScaleLines: (state: State) => state.isScaleLines,
    isScaleFilling: (state: State) => state.isScaleFilling
  }

}