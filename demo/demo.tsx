import * as React from 'react'
import * as ReactDOM from 'react-dom'

import { Scissors, ScissorsState } from '../src'

interface AppProps {}

interface AppState {
  rotate: number
  scissors: ScissorsState
}

const aspectRatios = [
  { label: 'free', value: 0 },
  { label: '16:9', value: 16 / 9 },
  { label: '3:2', value: 3 / 2 },
  { label: 'square', value: 1 },
]

class App extends React.Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props)

    const rotate = 0
    this.state = {
      rotate,
      scissors: ScissorsState.from({
        imageUrl: this.getImageUrl(rotate),
      }),
    }
  }

  public getImageUrl = (rotate: number) => {
    return `img/img-${rotate}.jpg`
  }

  onRotate = (degrees: number) => {
    const rotate = (360 + this.state.rotate + degrees) % 360
    this.setState((state: AppState) => ({
      rotate,
      scissors: state.scissors.setImageUrl(this.getImageUrl(rotate)),
    }))
  }

  onEnableFocusPoint = () => {
    this.setState((state: AppState) => ({
      scissors: state.scissors.setFocus(state.scissors.getCropCenter()),
    }))
  }

  onDisableFocusPoint = () => {
    this.setState((state: AppState) => ({
      scissors: state.scissors.setFocus(null),
    }))
  }

  onScissorsChange = (scissors: ScissorsState) => {
    this.setState({ scissors })
  }

  onAspectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const aspect = parseFloat(e.target.value)
    this.setState(state => ({
      scissors: state.scissors.setAspect(aspect),
    }))
  }

  public render() {
    return (
      <div>
        <button onClick={() => this.onRotate(-90)}>Rotate Left</button>
        <button onClick={() => this.onRotate(90)}>Rotate Right</button>
        <select
          onChange={this.onAspectChange}
          value={this.state.scissors.aspect}
        >
          {aspectRatios.map(({ label, value }) => (
            <option key={label} value={value}>
              {label}
            </option>
          ))}
        </select>
        <button onClick={this.onEnableFocusPoint}>Enable Focal Point</button>
        <button onClick={this.onDisableFocusPoint}>Disable Focal Point</button>
        <Scissors
          scissors={this.state.scissors}
          onChange={this.onScissorsChange}
        />
      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('root'))
