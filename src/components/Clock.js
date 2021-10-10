import React from 'react'
import {Container, Button} from 'react-bootstrap'


function createBlock(holds) {
    const settings = {sessions: 2, hangs:5, hangTime: 7, relaxTime: 3, breakTime: 150, 
        bigBreakTime: 300};

    
    if(!holds) {
        holds = {
            1:'Sloper',
            2:'Leiste',
            3:'3-Finger',
            4:'2-Finger',
            5:'Leiste'
        };
    };

    const colors = {
        power: '#E15566',
        relax: '#A2F7B5',
        break: '#138AB5'

    };

    const block = {};
    let counter = 0;

    for(let session = 1; session <= settings.sessions; session++) {
        for(let hold = 1; hold <= Object.keys(holds).length; hold++){
            for(let hang = 1; hang <= settings.hangs; hang++){
                block[counter] = {
                    duration: settings.hangTime,
                    color: colors.power,
                    holdName: holds[hold]
                }

                block[counter + 1] = {
                    duration: settings.relaxTime,
                    color: colors.relax,
                    holdName: 'Relax'
                }

                counter += 2;
                
            } // End of hang-part
            block[counter] = {
                duration: settings.breakTime,
                color: colors.break,
                holdName: 'Shake It'
            };
            counter += 1;
        }//End of break Part
        block[counter] = {
            duration: settings.bigBreakTime,
            color: colors.break,
            holdName: 'Get a Drink'
        };
        counter += 1;
    }//End of Big Break Part

    return block

}

class Clock extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            date: new Date(),
            remainingSeconds: 0,
            currentBlock:0
        };
        this.holds = {
            1:'Sloper',
            2:'Leiste',
            3:'3-Finger',
            4:'2-Finger',
            5:'Leiste'
        };
        this.blocks = createBlock(this.holds);
        this.ff = this.ff.bind(this);
        this.rev = this.rev.bind(this);
    }

    componentDidMount() {
        this.timerID = setInterval(() => this.tick(), 1000);

    }

    componentWillUnmount() {
        clearInterval(this.timerID)
    }

    
    tick() {
        let secToGo = this.state.remainingSeconds - 1;
        if (secToGo < 0 && this.state.currentBlock < Object.keys(this.blocks).length) {
            this.setState({currentBlock: this.state.currentBlock + 1});
            secToGo = this.blocks[this.state.currentBlock].duration;
        }
        this.setState({remainingSeconds: secToGo})

    }

    ff() {
        this.setState({currentBlock: this.state.currentBlock 
            + 1})
        this.setState({remainingSeconds: this.blocks[this.state.currentBlock].duration})

    }

    rev() {
        if(!this.state.currentBlock) {
            this.setState({currentBlock: this.state.currentBlock 
                - 1})
        };
        this.setState({remainingSeconds: this.blocks[this.state.currentBlock].duration})
    }

    render() {
        return (
        <div style = {{backgroundColor:this.blocks[this.state.currentBlock].color}}>
            <div>
                <Container className="p-3">
                    <h1 className="header"> {this.state.remainingSeconds} seconds to go<br /> 
                    {this.blocks[this.state.currentBlock].holdName} </h1>
                </Container>
            </div>
            <div className="btn btn-group btn-block" >
                <Button variant="secondary" size="lg" onClick={this.rev}>rev</Button>
                <Button variant="primary" size="lg" onClick={this.ff}>ff</Button>
            </div>
        </div>
        )
    }

}

export default Clock