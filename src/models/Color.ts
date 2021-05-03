export class Color {

  rgb: string
  rgbObj: { r: number; g: number; b: number }
  hex: string   // без '#'

  constructor(rgb: string) {
    const rgbArr: string[] = rgb.split(',')
    this.rgbObj = {
      r: parseInt(rgbArr[0].substring(4)),
      g: parseInt(rgbArr[1]),
      b: parseInt(rgbArr[2].substring(0, rgbArr[2].length - 1))
    }
    this.rgb = rgb
    this.hex = this.componentToHex(this.rgbObj.r) + this.componentToHex(this.rgbObj.g) + this.componentToHex(this.rgbObj.b)
  }

  private componentToHex(c: number): string {
    const hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
  }
}