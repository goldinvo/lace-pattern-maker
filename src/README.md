# Rough Documentation

Fabric.js integration with React is somewhat limited. I work around this by keeping fabRef and fabStateRef to the fabric instance and fabric state respectively.

Any state that needs to be shared with React UI components has a corresponding useState call. Any updates to state **must** update both React state and Fabric canvas state.

## State members
[Fabric member] (=> React member):
- `` => `curPos`
- `mode` => `mode` 'select' | 'pan' | 'draw'