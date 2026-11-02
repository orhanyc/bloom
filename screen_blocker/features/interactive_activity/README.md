# Interactive Activity List

Owner: Unassigned

Branch: `interactive_activity`

Status: Shared activity storage and default activities are implemented. The popup interface for adding, editing, and deleting activities is still pending.

`storage.ts` reads the `activities` key from Chrome local storage. Each activity has `id`, `name`, `minutes`, and `points`. An optional `icon` can be `read`, `walk`, `stretch`, or `study`; other activities use a sprout icon.

Read, Walk, Stretch, and Study are used when no activity list has been saved. A saved empty list stays empty. The screen blocker reads this same list and responds to changes while open.
