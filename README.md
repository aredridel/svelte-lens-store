
# Svelte Lens Store

A functional lens into svelte stores

## Use

### `bijectiveMapping`

```typescript
import { get, writable } from "svelte/store";

const base = writable(`{"hello":"world"}`);

const mapped = bijectiveMapping(base, JSON.parse, JSON.stringify);

get(mapped) // { hello: "world" }

mapped.set([1, 2, 3]);

get(base) // "[1,2,3]";
```

### `focusOnProperty`


```typescript
const base = writable({ hello: "world" } as { hello: any });

const mapped = focusOnProperty(base, "hello");

get(mapped) // "world";

mapped.set([1, 2, 3]);

get(base) // { hello: [1, 2, 3] }
```
