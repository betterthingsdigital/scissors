import * as Immutable from 'immutable'
import * as ReactCrop from 'react-image-crop'

export interface Value {
  imageUrl: string
  image: ImageInfo | null
  crop: CropInfo | null
  focus: Point | null
  aspect: number
}

export interface Size {
  width: number
  height: number
}

export type ImageInfo = Size

export interface CropInfo {
  x: number
  y: number
  width: number
  height: number
}

export interface Point {
  x: number
  y: number
}

const isPointInRect = (point: Point, rect: Size & Point): boolean => {
  const xInRect = point.x >= rect.x && point.x <= rect.x + rect.width
  const yInRect = point.y >= rect.y && point.y <= rect.y + rect.height
  return xInRect && yInRect
}

export class ScissorsState extends Immutable.Record({
  imageUrl: '',
  image: null,
  crop: null,
  focus: null,
  aspect: 0,
}) {
  public imageUrl!: string
  public image!: ImageInfo | null
  public crop!: CropInfo | null
  public focus!: Point | null
  public aspect!: number

  constructor(props?: Partial<Value>) {
    props ? super(props) : super()
  }

  public isValid() {
    if (this.focus && this.crop) {
      return isPointInRect(this.focus, this.crop)
    }
    return true
  }

  public setImage(image: ImageInfo) {
    let newState = this.set('image', image) as this
    if (!this.crop) {
      newState = newState.setAspect(newState.aspect)
    }
    return newState as this
  }

  public updateRelativeCrop(crop: ReactCrop.Crop) {
    if (!this.image) {
      return this
    }

    const newState = this.set('crop', {
      x: (crop.x * this.image.width) / 100,
      y: (crop.y * this.image.height) / 100,
      width: ((crop.width || 0) * this.image.width) / 100,
      height: ((crop.height || 0) * this.image.height) / 100,
    }) as this

    if (!newState.isValid()) {
      throw new Error('invalid state')
    }
    return newState
  }

  public getRelativeCrop(): ReactCrop.Crop | null {
    if (!this.image || !this.crop) {
      return null
    }
    return {
      x: (this.crop.x / this.image.width) * 100,
      y: (this.crop.y / this.image.height) * 100,
      width: (this.crop.width / this.image.width) * 100,
      height: (this.crop.height / this.image.height) * 100,
      aspect: this.aspect,
    }
  }

  public getScale(reference: { width: number; height: number }): Point | null {
    if (!this.image) {
      return null
    }

    return {
      x: this.image.width / reference.width,
      y: this.image.height / reference.height,
    }
  }

  public getCropCenter(): Point | null {
    if (!this.crop) {
      return null
    }

    return {
      x: this.crop.x + this.crop.width / 2,
      y: this.crop.y + this.crop.height / 2,
    }
  }

  public setFocus(focus: Point | null) {
    const newState = this.set('focus', focus) as this
    if (!newState.isValid()) {
      throw new Error('invalid state')
    }
    return newState
  }

  public setImageUrl(imageUrl: string) {
    return this.merge({
      imageUrl,
      image: null,
      crop: null,
      focus: null,
    }) as this
  }

  public setAspect(aspect: number) {
    let newState = this.merge({
      aspect,
      crop: null,
    }) as this

    if (newState.image) {
      if (!aspect) {
        newState = newState.set('crop', {
          x: 0,
          y: 0,
          height: newState.image.height,
          width: newState.image.width,
        }) as this
      } else {
        try {
          newState = newState.updateRelativeCrop(
            ReactCrop.makeAspectCrop(
              {
                x: 0,
                y: 0,
                width: 100,
                aspect,
              },
              newState.image.width / newState.image.height,
            ),
          )
        } catch (err) {
          // do not accept crop
        }
      }
    }

    return newState
  }
}
