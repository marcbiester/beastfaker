import React from 'react'
import {Container, Button} from 'react-bootstrap'
import Select from 'react-select'



function createBlock(holds, times) {
    const colors = {
        power: '#E15566',
        relax: '#A2F7B5',
        break: '#138AB5'

    };

    const block = {};
    let counter = 1;
    
    //Dummy entry, only color information ist necessary for "Get Ready" Phase, Text and duration are taken from Clock-Object ini
    block[0] = {
        duration: 0,
        color: colors.break,
        holdName: 'Dummy'
    }

    for(let session = 1; session <= times.sessions; session++) {
        for(let hold = 0; hold < Object.keys(holds).length; hold++){
            for(let hang = 1; hang <= times.hangs; hang++){
                block[counter] = {
                    duration: times.hangTime,
                    color: colors.power,
                    holdName: holds[hold]
                }

                block[counter + 1] = {
                    duration: times.relaxTime,
                    color: colors.relax,
                    holdName: 'Relax'
                }

                counter += 2;
                
            } // End of hang-part
            block[counter] = {
                duration: times.breakTime,
                color: colors.break,
                holdName: 'Shake It'
            };
            counter += 1;
        }//End of break Part
        block[counter] = {
            duration: times.bigBreakTime,
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
        this.ping = new Audio('./ping.mp3');
        this.state = {
            date: new Date(),
            remainingSeconds: 10,
            currentBlock:0,
            currentHold:'Get Ready',
            holds:{},
            holdOptions:[
                {value:1, label:'Sloper'},
                {value:2, label:'Jug'},
                {value:3, label:'2-Finger-Edge'},
                {value:5, label:'3-Finger-Edge'},
                {value:6, label:'4-Finger-Edge'},
            ],
            times: {sessions: 2, hangs:5, hangTime: 7, relaxTime: 3, breakTime: 150, 
                bigBreakTime: 300}
        };
        this.ff = this.ff.bind(this);
        this.rev = this.rev.bind(this);
        this.gogogo = this.gogogo.bind(this);
        this.headerTime = this.headerTime.bind(this);
        this.handleSelectedHoldsChange = this.handleSelectedHoldsChange.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
    }

    componentDidMount() {

    }
    
    gogogo() {
        if(!this.timerID){    
            if(Object.keys(this.state.holds).length > 0) {
                this.blocks = createBlock(this.state.holds, this.state.times);
                this.timerID = setInterval(() => this.tick(), 1000);
            }
        }

    }

    componentWillUnmount() {
        if(!this.timerID) {
            clearInterval(this.timerID)
        }
    }

    
    tick() {
        let secToGo = this.state.remainingSeconds - 1;
        let newBlock = 0;
        if (secToGo === 0 && this.state.currentBlock === (Object.keys(this.blocks).length -1)) {
            clearInterval(this.timerID)
            this.timerID = 0;
        }
        if (secToGo < 0 
            && this.state.currentBlock < (Object.keys(this.blocks).length - 1)) {
            newBlock = this.state.currentBlock + 1;
            this.setState({
                currentBlock: newBlock,
                currentHold: this.blocks[newBlock].holdName
            });
            secToGo = this.blocks[this.state.currentBlock].duration;
            this.ping.play();

        }
        this.setState({
            remainingSeconds: secToGo,
            currenHold: this.blocks[newBlock].holdName});


    }

    ff() {
        const newBlock = this.state.currentBlock + 1;
        if(newBlock < Object.keys(this.blocks).length) {
            this.setState({
                currentBlock: newBlock,
                remainingSeconds: this.blocks[newBlock].duration,
                currentHold: this.blocks[newBlock].holdName})
            }

    }

    rev() {
        const newBlock = this.state.currentBlock - 1;
        if(newBlock >= 0) {
            this.setState({
                currentBlock: newBlock,
                remainingSeconds: this.blocks[newBlock].duration,
                currentHold: this.blocks[newBlock].holdName
            })
        }
    }


    handleSelectedHoldsChange(event) {
        const labels = event.map(e=>e.label);
        const holds = {};
        for(let i = 0; i<labels.length; i++) {holds[i] = labels[i]};
        let newOpts = this.state.holdOptions;
        newOpts.push({value: Date.now(), label:labels.slice(-1)});
        this.setState({holds: holds, holdOptions: newOpts});
    }

    selectHolds() {
        return(
            <div>
            <Select isMulti={true} 
            options={this.state.holdOptions}
            onChange={this.handleSelectedHoldsChange} 
            onRemove={this.handleSelectedHoldsChange}
            placeholder='Please Select Holds'
            isClearable={true}
            isDisabled={this.timerID ? true : false}
            />
            </div>
            )
    }


    handleInputChange(evt) {
        let times = this.state.times;
        times[evt.target.name] = evt.target.value;
        this.setState({times:times});
        console.log(this.state.times)
    }

    inputField(label,name,value,onChange, isTime=true){
        const secLabel =  <div className="input-group-append"><span className="input-group-text">sec</span>
    </div>
        return(
        <div className="input-group mb-3">
            <div className="input-group-prepend w-50">
                <span className="input-group-text w-100">{label}</span>
            </div>
            <input 
                type="text" 
                className="form-control" 
                value={value}
                name={name}
                onChange={onChange}
                />
                {isTime ? secLabel : ''}
        </div>
        )
    }

    inputFields() {
/*         if(!times) {
            times = {sessions: 2, hangs:2, hangTime: 7, relaxTime: 3, breakTime: 150, 
            bigBreakTime: 300};
        }; */
        return(
            <div>
                {this.inputField('Sessions','sessions',this.state.times.sessions, this.handleInputChange, false)}
                {this.inputField('Hangs','hangs',this.state.times.hangs, this.handleInputChange, false)}
                {this.inputField('Hang-Time','hangTime',this.state.times.hangTime, this.handleInputChange)}
                {this.inputField('Between-Hangs-Break','relaxTime',this.state.times.relaxTime, this.handleInputChange)}
                {this.inputField('Between-Holds-Time','breakTime',this.state.times.breakTime, this.handleInputChange)}
                {this.inputField('Between-Sessions-Time','bigBreakTime',this.state.times.bigBreakTime, this.handleInputChange)}

            </div>
        )
    }

    headerTime(){

        if(this.blocks) {
            return (
                <div style = {{backgroundColor:this.blocks[this.state.currentBlock].color}}>
                    <Container className="p-3">
                        <h1 className="header"> {this.state.remainingSeconds}
                        <br /> 
                        {this.state.currentHold}
                        </h1>
                    </Container>
                </div>
            )
        }
        else {
            return(
                <div>
                <Container className="p-3">
                    <h1 className="header"> Select Holds to Start</h1>
                </Container>
                </div>
            )
        }
    }


    render() {
        return (
        <div >
            {this.headerTime()}
            <div className="btn btn-group btn-block" >
                <Button variant="primary" size="lg" onClick={this.gogogo}>Go</Button>
                <Button variant="secondary" size="lg" onClick={this.rev}>Back</Button>
                <Button variant="primary" size="lg" onClick={this.ff}>Skip</Button>
            </div>
            <br />
            <h3>Settings</h3>
            {this.selectHolds()}
            <br />
            {this.inputFields()}
        </div>
        )
    }

}

export default Clock