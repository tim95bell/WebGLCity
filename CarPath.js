/*  CarMove
represents a movement that the car is required to make.
***ATTRIBUTES***
axis : char
until : number
by : number
*/
function CarMove(axis, until, by){
    this.axis = axis;
    this.until = until;
    this.by = by;
}
/*  CarTurn
represents a turn that the car is required to make
***ATTRIBUTES***
until : number
by : number
*/
function CarTurn(until, by){
    this.until = until;
    this.by = by;
}
/*  CarPath
handles the movement and rotation of the car around a building,
as well as the changing of the cars color.
***ATTRIBUTES***
red : vec3
green : vec3
blue : vec3
colorBlend : vec3
colorBlendLoc
startTime : Date
index : number
car : Car
initialRot : number
actions : [] of CarMove || CarTurn
*/
function CarPath(pathLength, car, gl, program){
    this.red = vec3(0.8, 0.2, 0.2);
    this.green = vec3(0.2, 0.8, 0.2);
    this.blue = vec3(0.2, 0.2, 0.8);
    this.colorBlend = vec3();
    this.colorBlendLoc = gl.getUniformLocation(program, "colorBlend");
    this.startTime = new Date();   

    this.index = 0;
    this.car = car;
    let pos = vec3(this.car.x, 0, this.car.z);
    let moveAmt = 0.5;
    let rotAmt = 0.5;
    this.initialRot = this.car.yRot;
    this.actions = [
        new CarMove('z', pos[2] + pathLength, moveAmt),
        new CarTurn(car.yRot + 90, rotAmt),
        new CarMove('x', pos[0] + pathLength, moveAmt),
        new CarTurn(car.yRot + 180, rotAmt),
        new CarMove('z', pos[2], -moveAmt),
        new CarTurn(car.yRot+270, rotAmt),
        new CarMove('x', pos[0], -moveAmt),
        new CarTurn(car.yRot + 360, rotAmt)
    ];
}

CarPath.prototype.update = function(gl){
    // change color
    let now = new Date().getTime();
    let elapsed = (now - this.startTime.getTime())/1000;
    let val = elapsed % 9;
    if(val < 3){
        this.colorBlend = mix(this.red, this.green, val/3);
    } else if(val < 6){
        this.colorBlend = mix(this.green, this.blue, (val-3)/3);
    } else if(val < 9){
        this.colorBlend = mix(this.blue, this.red, (val-6)/3);
    }
    gl.uniform3fv(this.colorBlendLoc, flatten(this.colorBlend));

    // follow path
    let cur = this.actions[this.index];
    if(cur instanceof CarMove){
        if(cur.axis === 'x'){
            let x = this.car.x + cur.by;
            if( (cur.by > 0 && x >= cur.until) || (cur.by < 0 && x <= cur.until) ){
                x = cur.until;
                this.incrementIndex();
            }
            this.car.setLocation(x, this.car.y, this.car.z);
        } else if(cur.axis === 'z'){
            let z = this.car.z + cur.by;
            if( (cur.by > 0 && z >= cur.until) || (cur.by < 0 && z <= cur.until) ){
                z = cur.until;
                this.incrementIndex();
            }
            this.car.setLocation(this.car.x, this.car.y, z);
        }
    } else if(cur instanceof CarTurn){
        let rot = this.car.yRot + cur.by;
        if(rot >= cur.until){
            rot = cur.until;
            this.car.setYRotation(rot);
            this.incrementIndex();
        } else{
            this.car.setYRotation(rot);
        }
    }
}

CarPath.prototype.incrementIndex = function(){
    ++this.index;
    if(this.index > this.actions.length-1){
        this.index = 0;
        this.car.setYRotation(this.initialRot);
    }
}