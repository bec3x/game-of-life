import React, { Component } from 'react'

export default class Cell extends Component {
    render() {
        const {x, y, CELL_SIZE} = this.props;

        return (
            <div
                className='cell'
                style={{left: `${CELL_SIZE * x + 1}px`, top: `${CELL_SIZE * y + 1}px`, width: `${CELL_SIZE - 1}px`, height: `${CELL_SIZE - 1}px`}}
            >                
            </div>
        )
    }
}

