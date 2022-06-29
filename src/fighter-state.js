
export const player_state = (() => {
// ._parent._parent is code smell.
  class State {
    constructor(parent) {
      this._parent = parent;
    }
  
    Enter() {}
    Exit() {}
    Update() {}
  };

  class PropState extends State {
    constructor(parent) {
      super(parent);
  
      this._action = null;
    }
  
    get Name() {
      return 'propeller';
    }
  
    Enter(prevState) {
      this._action = this._parent._parent._animations['Spin'];
      this._action.loop = THREE.LoopRepeat;
      this._action.play();
      
    }
  
    Exit() {
    }
  
    Update(_) {
    }
  };
  
  class LeftState extends State {
    constructor(parent) {
      super(parent);
  
      this._action = null;
    }
  
    get Name() {
      return 'Left';
    }
  
    Enter(prevState) {
      this._action = this._parent._parent._animations['Left'];
      if (prevState) {
        const prevAction = this._parent._parent._animations[prevState.Name];
  
        this._action.enabled = true;
  
        if (prevState.Name == 'Right' || prevState.Name == 'Rudder') {
          const ratio = this._action.getClip().duration / prevAction.getClip().duration;
          this._action.time = prevAction.time * ratio;
        } else {
          this._action.time = 0.0;
          this._action.setEffectiveTimeScale(1.0);
          this._action.setEffectiveWeight(1.0);
        }
  
        this._action.crossFadeFrom(prevAction, 0.1, true);
        this._action.play();
      } else {
        this._action.play();
      }
    }
  
    Exit() {
    }
  
    Update(_, input) {
        if (!input) {
          return;
        }
    
        if (input.axis1Side > 0) {
          this._parent.SetState('Left');
          return;
        }
    
        if (input.axis1Side < 0) {
          this._parent.SetState('Right');
          return;
        }
        this._parent.SetState('Rudder');
    }
  };

  class UpState extends State {
    constructor(parent) {
      super(parent);
  
      this._action = null;
  
    }
  
    get Name() {
      return 'Up';
    }
  
    Enter(prevState) {
      this._action = this._parent._parent._animations['Up'];
      if (prevState) {
        const prevAction = this._parent._parent._animations[prevState.Name];
  
        this._action.enabled = true;
  
        if (prevState.Name == 'Down' || prevState.Name == 'Stationary') {
          const ratio = this._action.getClip().duration / prevAction.getClip().duration;
          this._action.time = prevAction.time * ratio;
        } else {
          this._action.time = 0.0;
          this._action.setEffectiveTimeScale(1.0);
          this._action.setEffectiveWeight(1.0);
        }
  
        this._action.crossFadeFrom(prevAction, 0.1, true);
        this._action.play();
      } else {
        this._action.play();
      }
    }
  
  
    Exit() {
    }
  
    Update(_, input) {
        if (!input) {
          return;
        }
    
        if (input.axis1Forward > 0) {
          this._parent.SetState('Up');
          return;
        }
    
        if (input.axis1Forward < 0) {
          this._parent.SetState('Down');
          return;
        }
        this._parent.SetState('Stationary');
    }
  };
  
  class DownState extends State {
    constructor(parent) {
      super(parent);
    }
  
    get Name() {
      return 'Down';
    }
  
    Enter(prevState) {
      this._action = this._parent._parent._animations['Down'];
      if (prevState) {
        const prevAction = this._parent._parent._animations[prevState.Name];
  
        this._action.enabled = true;
  
        if (prevState.Name == 'Up' || prevState.Name == 'Stationary') {
          const ratio = this._action.getClip().duration / prevAction.getClip().duration;
          this._action.time = prevAction.time * ratio;
        } else {
          this._action.time = 0.0;
          this._action.setEffectiveTimeScale(1.0);
          this._action.setEffectiveWeight(1.0);
        }
  
        this._action.crossFadeFrom(prevAction, 0.1, true);
        this._action.play();
      } else {
        this._action.play();
      }
    }
  
    Exit() {
    }
  
    Update(_, input) {
      if (!input) {
        return;
      }
  
      if (input.axis1Forward > 0) {
        this._parent.SetState('Up');
        return;
      }
  
      if (input.axis1Forward < 0) {
        this._parent.SetState('Down');
        return;
      }
      this._parent.SetState('Stationary');
    }
  };
  
  
  class RightState extends State {
    constructor(parent) {
      super(parent);
    }
  
    get Name() {
      return 'Right';
    }
  
    Enter(prevState) {
      this._action = this._parent._parent._animations['Right'];
      if (prevState) {
        const prevAction = this._parent._parent._animations[prevState.Name];
  
        this._action.enabled = true;
  
        if (prevState.Name == 'Left' || prevState.Name == 'Rudder') {
          const ratio = this._action.getClip().duration / prevAction.getClip().duration;
          this._action.time = prevAction.time * ratio;
        } else {
          this._action.time = 0.0;
          this._action.setEffectiveTimeScale(1.0);
          this._action.setEffectiveWeight(1.0);
        }
  
        this._action.crossFadeFrom(prevAction, 0.1, true);
        this._action.play();
      } else {
        this._action.play();
      }
    }
  
    Exit() {
    }
  
    Update(_, input) {
        if (!input) {
          return;
        }
    
        if (input.axis1Side > 0) {
          this._parent.SetState('Left');
          return;
        }
    
        if (input.axis1Side < 0) {
          this._parent.SetState('Right');
          return;
        }
        this._parent.SetState('Rudder');
    }
  };
  
  
  class StationaryState extends State {
    constructor(parent) {
      super(parent);
    }
  
    get Name() {
      return 'Stationary';
    }
  
    Enter(prevState) {
      this._action =this._parent._parent._animations['Stationary'];
      if (prevState) {
        const prevAction = this._parent._parent._animations[prevState.Name];
  
        this._action.enabled = true;
  
        if (prevState.Name == 'Up' || prevState.Name == 'Down') {
          const ratio = this._action.getClip().duration / prevAction.getClip().duration;
          this._action.time = prevAction.time * ratio;
        } else {
          this._action.time = 0.0;
          this._action.setEffectiveTimeScale(1.0);
          this._action.setEffectiveWeight(1.0);
        }
  
        this._action.crossFadeFrom(prevAction, 0.1, true);
        this._action.play();
      } else {
        this._action.play();
      }
    }
  
    Exit() {
    }
  
    Update(_, input) {
        if (!input) {
          return;
        }
    
        if (input.axis1Forward > 0) {
          this._parent.SetState('Up');
          return;
        }
    
        if (input.axis1Forward < 0) {
          this._parent.SetState('Down');
          return;
        }
        this._parent.SetState('Stationary');
    }
  };
  class RudderState extends State {
    constructor(parent) {
      super(parent);
    }
  
    get Name() {
      return 'Rudder';
    }
  
    Enter(prevState) {
      this._action = this._parent._parent._animations['Rudder'];
      if (prevState) {
        const prevAction = this._parent._parent._animations[prevState.Name];
  
        this._action.enabled = true;
  
        if (prevState.Name == 'Right' || prevState.Name == 'Left') {
          const ratio = this._action.getClip().duration / prevAction.getClip().duration;
          this._action.time = prevAction.time * ratio;
        } else {
          this._action.time = 0.0;
          this._action.setEffectiveTimeScale(1.0);
          this._action.setEffectiveWeight(1.0);
        }
  
        this._action.crossFadeFrom(prevAction, 0.1, true);
        this._action.play();
      } else {
        this._action.play();
      }
    }
  
    Exit() {
    }
  
    Update(_, input) {
        if (!input) {
          return;
        }
    
        if (input.axis1Side) {
          this._parent.SetState('Left');
          return;
        }
    
        if (input.axis1Side) {
          this._parent.SetState('Right');
          return;
        }
        this._parent.SetState('Rudder');
    }
  };

  return {
    RightState: RightState,
    LeftState: LeftState,
    UpState: UpState,
    DownState: DownState,
    PropState: PropState,
    StationaryState: StationaryState,
    RudderState: RudderState
  };

})();
