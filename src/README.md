# Rough Documentation

Fabric.js integration with React is somewhat limited. I work around this by keeping a fabRef reference to the fabric and storing its state in fabRef.current.state (to avoid name conflicts).

Any state that needs to be shared with React UI components has a corresponding useState call. Any updates to state **must** update both React state and Fabric canvas state.

## State members
[Fabric member] (=> React member):
- `` => `curPos`
- `mode` => `mode` 'select' | 'pan' | 'draw'