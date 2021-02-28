export class Color {

  rgb: string
  hex: string

  red: number
  green: number
  blue: number

  constructor(rgb: string) {
    const rgbArr: string[] = rgb.split(',')
    this.red = parseInt(rgbArr[0].substring(4))
    this.green = parseInt(rgbArr[1])
    this.blue = parseInt(rgbArr[2].substring(0, rgbArr[2].length - 1))
    this.rgb = rgb
    this.hex = '#' + this.componentToHex(this.red) + this.componentToHex(this.green) + this.componentToHex(this.blue)
  }

  private componentToHex(c: number): string {
    const hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
  }
}