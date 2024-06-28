# Rough Documentation

Fabric.js integration with React is somewhat limited. I work around this by keeping a fabRef reference to the fabric and storing its state in fabRef.current.state (to avoid name conflicts).

Any state that needs to be shared with React UI components has a corresponding useState call. Any updates to state **must** update both React state and Fabric canvas state.

## State members
[Fabric member] (=> React member):
- `(None)` => `curPos`
- `(None)` => `isSelection`  (access selection using getActiveObjects)
- `clipboard` => `clipboard`
- `mode` => `mode` 'select' | 'pan' | 'draw'
- `defaultCursor`*  update synchronously w/ `mode` *library state
- `skipTargetFind`* sync with mode
- `selection`*    sync with mode
- `isDragging`
- `lastPosX`
- `lastPosY`
- `snap` => `snap`
