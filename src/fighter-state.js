
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
      this._action = this._parent.animations['Spin'].action;

      this._action.reset();  
      this._action.loop();
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
      return 'TurnLeftStationary';
    }
  
    Enter(prevState) {
      this._action = this._parent._parent.animations['TurnLeftStationary'].action;
      if (prevState) {
        const prevAction = this._parent._parent.animations[prevState.Name].action;
  
        this._action.enabled = true;
  
        if (prevState.Name == 'TurnRightStationary' || prevState.Name == 'RudderStationary') {
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
          this._parent.SetState('TurnLeftStationary');
          return;
        }
    
        if (input.axis1Side < 0) {
          this._parent.SetState('TurnRightStationary');
          return;
        }
        this._parent.SetState('RudderStationary');
    }
  };

  class UpState extends State {
    constructor(parent) {
      super(parent);
  
      this._action = null;
  
    }
  
    get Name() {
      return 'TurnUpStationary';
    }
  
    Enter(prevState) {
      this._action = this._parent._parent.animations['TurnUpStationary'].action;
      if (prevState) {
        const prevAction = this._parent._parent.animations[prevState.Name].action;
  
        this._action.enabled = true;
  
        if (prevState.Name == 'TurnDownStationary' || prevState.Name == 'Stationary') {
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
          this._parent.SetState('TurnDownStationary');
          return;
        }
    
        if (input.axis1Forward < 0) {
          this._parent.SetState('TurnUpStationary');
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
      return 'TurnDownStationary';
    }
  
    Enter(prevState) {
      this._action = this._parent._parent.animations['TurnDownStationary'].action;
      if (prevState) {
        const prevAction = this._parent._parent.animations[prevState.Name].action;
  
        this._action.enabled = true;
  
        if (prevState.Name == 'TurnUpStationary' || prevState.Name == 'Stationary') {
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
        this._parent.SetState('TurnDownStationary');
        return;
      }
  
      if (input.axis1Forward < 0) {
        this._parent.SetState('TurnUpStationary');
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
      return 'TurnRightStationary';
    }
  
    Enter(prevState) {
      this._action = this._parent._parent.animations['TurnRightStationary'].action;
      if (prevState) {
        const prevAction = this._parent._parent.animations[prevState.Name].action;
  
        this._action.enabled = true;
  
        if (prevState.Name == 'TurnLeftStationary' || prevState.Name == 'RudderStationary') {
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
          this._parent.SetState('TurnLeftStationary');
          return;
        }
    
        if (input.axis1Side < 0) {
          this._parent.SetState('TurnRightStationary');
          return;
        }
        this._parent.SetState('RudderStationary');
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
      this._action =this._parent._parent.animations['Stationary'].action;
      if (prevState) {
        const prevAction = this._parent._parent.animations[prevState.Name].action;
  
        this._action.enabled = true;
  
        if (prevState.Name == 'TurnUpStationary' || prevState.Name == 'TurnDownStationary') {
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
          this._parent.SetState('TurnDownStationary');
          return;
        }
    
        if (input.axis1Forward < 0) {
          this._parent.SetState('TurnUpStationary');
          return;
        }
        this._parent.SetState('Stationary');
    }
  };
  class RudderStationaryState extends State {
    constructor(parent) {
      super(parent);
    }
  
    get Name() {
      return 'RudderStationary';
    }
  
    Enter(prevState) {
      this._action = this._parent._parent.animations['RudderStationary'].action;
      if (prevState) {
        const prevAction = this._parent._parent.animations[prevState.Name].action;
  
        this._action.enabled = true;
  
        if (prevState.Name == 'TurnRightStationary' || prevState.Name == 'TurnLeftStationary') {
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
    
        if (input._keys.left) {
          this._parent.SetState('TurnLeftStationary');
          return;
        }
    
        if (input._keys.right) {
          this._parent.SetState('TurnRightStationary');
          return;
        }
        this._parent.SetState('RudderStationary');
    }
  };

  return {
    RightState: RightState,
    LeftState: LeftState,
    UpState: UpState,
    DownState: DownState,
    PropState: PropState,
    StationaryState: StationaryState,
    RudderStationaryState: RudderStationaryState
  };

})();