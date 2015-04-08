import {FocusTrap, HotKeys, HotKeyMapMixin} from 'react-hotkeys';
import React from 'react';
import rand from 'lodash/number/random';

const DEFAULT_NODE_SIZE = 100;
const SIZE_INCREMENT = 5;
const POS_INCREMENT = 5;

const keyMap = {
  'delete': ['del', 'backspace'],
  'expand': 'alt+up',
  'contract': 'alt+down',
  'konami': 'up up down down left right left right b a enter'
};

const App = React.createClass({

  mixins: [HotKeyMapMixin(keyMap)],

  onKonami() {
    this.setState({konamiTime: true});
  },

  render() {
    const handlers = {
      'konami': this.onKonami
    };

    return (
      <div className="app">
        <div className="tips">
          <ul>
            <li>Select a node and move it with your arrow keys!</li>
            <li>Delete a node with `delete` or `backspace`</li>
            <li>How about the konami code? `up up down down left right left right b a enter` (currently shows a break in impl. where if part of a long sequence is handled by a short sequence. Ie `up` in the konami sequence then hotkeys break.)</li>
          </ul>
        </div>
        <HotKeys handlers={handlers} className={'viewport ' + (this.state && this.state.konamiTime ? 'konamiTime' : '')}>
          {Array.apply(null, new Array(10)).map((e, i) => <Node key={i} />)}
        </HotKeys>
      </div>
    );
  }

});

const Node = React.createClass({

  getInitialState() {
    return {
      pos: [
        rand(0, window.innerWidth - DEFAULT_NODE_SIZE),
        rand(0, window.innerHeight - DEFAULT_NODE_SIZE)
      ],
      size: DEFAULT_NODE_SIZE,
      deleted: false
    }
  },

  move(x = 0, y = 0) {
    this.setState(({pos}) => ({pos: [pos[0] + (x * POS_INCREMENT), pos[1] + (y * POS_INCREMENT)]}));
  },

  resize(expansion = 0) {
    this.setState((state) => ({size: state.size + (expansion * SIZE_INCREMENT)}));
  },

  requestDelete() {
    this.setState({deleted: true});
  },

  render() {
    const handlers = {
      'up': this.move.bind(this, 0, -1),
      'down': this.move.bind(this, 0, 1),
      'left': this.move.bind(this, -1, 0),
      'right': this.move.bind(this, 1, 0),
      'delete': this.requestDelete,
      'expand': this.resize.bind(this, 1),
      'contract': this.resize.bind(this, -1)
    };

    const {size, pos, deleted} = this.state;
    const [x, y] = pos;

    const style = {
      width: size,
      height: size,
      left: x,
      top: y,
      opacity: deleted ? 0.2 : 1
    };

    return (
      <HotKeys handlers={handlers} className="node" style={style}>
        Node
      </HotKeys>
    );
  }

});

export function render(renderTo) {
  React.render(<App />, renderTo);
}

export function cleanup(cleanFrom) {
  React.unmountComponentAtNode(cleanFrom);
}