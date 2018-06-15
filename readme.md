![Scissors by Better Things Digital](https://raw.githubusercontent.com/betterthingsdigital/art/master/scissors/github-header.png)

## Dependencies

You need to install `react` and `immutable` yourself.

## Demo

Here's a little demo of what the component can do: https://scissors.netlify.com/

## Example

```js
import { Scissors, ScissorsState } from '@betterthings/scissors'

class App extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      scissorsState: new ScissorsState({ imageUrl: '/path/to/img.jpg' }),
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
