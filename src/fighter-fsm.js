
import {finite_state_machine} from './finite-state-machine.js'
import {player_state} from './fighter-state.js'
  
export const fsm = (() => {
    class PropFSM extends finite_state_machine.FiniteStateMachine {
    constructor() {
      super();
      this._Init();
    }
  
    _Init() {
      this._AddState('Spin', player_state.spin);
    }
  };
  class FinFSM extends finite_state_machine.FiniteStateMachine {
    constructor() {
      super();
      this._Init();
    }
  
    _Init() {
      this._AddState('Up', player_state.UpState);
      this._AddState('Down', player_state.DownState);
      this._AddState('Stationary', player_state.StationaryState);
      }
  };
  
  class RudderFSM extends finite_state_machine.FiniteStateMachine {
    constructor(proxy) {
      super();
      this._proxy = proxy;
      this._Init();
    }
  
    _Init() {
      this._AddState('Right', player_state.RightState);
      this._AddState('Left', player_state.LeftState);
      this._AddState('Rudder', player_state.RudderState);
    }
  };
  
  
  return {
    PropFSM: PropFSM,
    RudderFSM: RudderFSM,
    FinFSM: FinFSM,
  };
})();