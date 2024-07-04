# Rough Documentation
based on: https://stackoverflow.com/questions/37565041/how-can-i-use-fabric-js-with-react

The main canvas is an uncontrolled canvas. It is the source of truth regarding
any state it may interact with. Any changes to canvas state should follow by
firing the 'saveState', which pushes a copy of the current state onto 
stateView, which is what children components interact with.


