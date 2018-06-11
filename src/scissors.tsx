import * as React from 'react'

import * as ReactCrop from 'react-image-crop'
import { ScissorsState, Point } from './scissors-state'

interface Props {
  scissors: ScissorsState
  onChange: (scissors: ScissorsState) => void
  keepSelection?: boolean
  disabled?: boolean
}

export class Scissors extends React.Component<Props> {
  private imageContainer: HTMLDivElement | null = null
  private focusPoint: HTMLDivElement | null = null
  private lastDragPosition: Point | null = null

  private onCropChange = (crop: ReactCrop.Crop) => {
    try {
      this.props.onChange(this.props.scissors.updateRelativeCrop(crop))
    } catch (err) {
      // invalid crop
    }
  }

  private onImageLoaded = (image: HTMLImageElement) => {
    this.props.onChange(
      this.props.scissors.setImage({
        height: image.naturalHeight,
        width: image.naturalWidth,
      }),
    )
  }

  getFocusPointStyle() {
    const relativeFocus = this.props.scissors.getRelativeFocus()
    if (relativeFocus) {
      return {
        left: `${relativeFocus.x}%`,
        top: `${relativeFocus.y}%`,
        display: 'block',
      }
    }
    return { display: 'none' }
  }

  onFocalDragStart = (e: MouseEvent) => {
    this.lastDragPosition = { x: e.clientX, y: e.clientY }
    document.addEventListener('mousemove', this.onFocalDrag)
    document.addEventListener('mouseup', this.onFocalDragEnd)
  }

  onFocalDrag = (e: MouseEvent) => {
    if (this.props.scissors.focus && this.imageContainer) {
      const scale = this.props.scissors.getScale({
        width: this.imageContainer.clientWidth,
        height: this.imageContainer.clientHeight,
      })
      if (scale) {
        try {
          const { x, y } = this.lastDragPosition!
          this.props.onChange(
            this.props.scissors.setFocus({
              x: this.props.scissors.focus.x + (e.clientX - x) * scale.x,
              y: this.props.scissors.focus.y + (e.clientY - y) * scale.y,
            }),
          )
          // only update the last drag position if the state accepted it
          this.lastDragPosition = { x: e.clientX, y: e.clientY }
        } catch (err) {
          // invalid focus
        }
      }
    }
  }

  onFocalDragEnd = (e: MouseEvent) => {
    this.lastDragPosition = null
    document.removeEventListener('mousemove', this.onFocalDrag)
    document.removeEventListener('mouseup', this.onFocalDragEnd)
  }

  componentDidMount() {
    this.focusPoint!.addEventListener('mousedown', this.onFocalDragStart)
  }

  public render() {
    return (
      <div className="bt-scissors">
        <div
          ref={el => {
            this.imageContainer = el
          }}
          style={{ position: 'relative' }}
        >
          <div
            className="bt-scissors__focal-point"
            style={this.getFocusPointStyle()}
            ref={el => {
              this.focusPoint = el
            }}
          />
          <ReactCrop
            src={this.props.scissors.imageUrl}
            onImageLoaded={this.onImageLoaded}
            crop={this.props.scissors.getRelativeCrop()!}
            onChange={this.onCropChange}
            keepSelection={this.props.keepSelection}
            disabled={this.props.disabled}
          />
        </div>
      </div>
    )
  }
}
