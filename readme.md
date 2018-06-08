![Scissors by Better Things Digital](./images/scissors-header@2x.png)

## Dependencies

You need to install `react` and `immutable` yourself.

## Example

```js
import { Scissors, ScissorsState } from '@betterthings/scissors'

class App extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      scissorsState: ScissorsState.from({ imageUrl: '/path/to/img.jpg' }),
    }

    this.onScissorsChange = this.onScissorsChange.bind(this)
  }

  onScissorsChange(scissorsState) {
    this.setState({ scissorsState })
  }

  render() {
    return (
      <Scissors
        scissors={this.state.scissorsState}
        onChange={this.onScissorsChange}
      />
    )
  }
}
```
