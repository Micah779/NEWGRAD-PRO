export type PrepTopic = {
  slug: string;
  title: string;
  summary: string;
  content: string;
};

export type PrepCardSeed = {
  slug: string;
  topicSlug: string;
  topic: string;
  front: string;
  back: string;
};

export const PREP_TOPICS: PrepTopic[] = [
  {
    slug: "arrays-hashing",
    title: "Arrays, Strings & Hashing",
    summary: "One-pass scans, counters, grouping, and membership checks.",
    content: `## Core instinct
If the input is an array or string, ask: one pass, two pointers, sliding window, hash map, or sort?

## Hash maps and sets
Use when you need membership, frequency, grouping, or "last seen."

## Python toolbox
- \`Counter\` for frequencies; \`most_common(k)\` for top-k counts
- \`defaultdict(list/set/int)\` for grouping — but remember: \`d[key].append(x)\` creates missing keys; \`d.get(key)\` does NOT

## High-yield problems
Two Sum, Group Anagrams, Top K Frequent Elements, Longest Consecutive Sequence`,
  },
  {
    slug: "sorting-intervals",
    title: "Sorting & Intervals",
    summary: "Sort-and-scan, overlap checks, and interval minimalism.",
    content: `## Interval minimalism
Solve the output asked for — don't merge unless the prompt requires merged intervals.

## Overlap check template
1. Sort by start time
2. Scan once
3. If current start < previous end → overlap / conflict

## Python sorting
Python's sort is stable; \`key=\` is called once per record — great for intervals and multi-key sorts.

## High-yield problems
Meeting Rooms, Merge Intervals, Insert Interval, Non-overlapping Intervals`,
  },
  {
    slug: "sliding-window",
    title: "Sliding Window & Two Pointers",
    summary: "Contiguous segments with a clear invariant.",
    content: `## Mental model
A sliding window is a state machine: what makes the window valid?

## Fixed vs variable
- **Fixed size k:** anagrams, moving averages — one in, one out
- **Variable size:** expand right until valid, shrink left while still valid (or until valid again)

## Questions to ask
1. What makes the current window valid?
2. What improves only when I move right?
3. What improves only when I move left?

## High-yield problems
Longest Substring Without Repeating, Minimum Window Substring, Max Consecutive Ones III`,
  },
  {
    slug: "stacks-lists",
    title: "Stacks & Linked Lists",
    summary: "LIFO nesting, monotonic stacks, and pointer discipline.",
    content: `## Stack reactions
- Nested / LIFO → stack
- Next greater / previous smaller → monotonic stack
- Undo / reversal → stack

## Linked lists
Use dummy nodes and local pointer variables. Comfort with merge, add numbers, copy with random pointer.

## High-yield problems
Valid Parentheses, Daily Temperatures, Min Stack, LRU Cache internals, Merge Two Sorted Lists`,
  },
  {
    slug: "binary-search",
    title: "Binary Search & Bisect",
    summary: "Ordered data, insertion points, and history lookups.",
    content: `## Dict vs bisect
- Exact lookup by key → dictionary
- Latest value before time t → sorted list + bisect
- \`insort\` is O(n) insertion — not a free ordered structure

## Bisect patterns
- \`bisect_left\` / \`bisect_right\` return insertion points, not equality
- "Rightmost ≤ x" and "leftmost ≥ x" are the bread-and-butter patterns

## High-yield problems
Time Based Key-Value Store, Search Insert Position, Find First/Last Position, Weighted Job Scheduling setup`,
  },
  {
    slug: "recursion-backtracking",
    title: "Recursion & Backtracking",
    summary: "Choose, explore, unchoose — with a crisp function meaning.",
    content: `## Recursive function meaning
Every DFS should answer one smaller question: \`dfs(r, c, i)\` = "can I finish from (r,c) at index i?"

## Backtracking template
1. State — what is chosen
2. Choices — what can be chosen next
3. Base case — when done
4. Undo — restore state before next branch

## Word Search pattern
Mark visited → recurse 4 directions → unmark on return.

## High-yield problems
Word Search, Combination Sum, Permutations, Subsets, N-Queens`,
  },
  {
    slug: "trees",
    title: "Trees",
    summary: "Top-down context vs bottom-up aggregation.",
    content: `## Direction choice
- **Top-down:** parent passes path, depth, prefix to children
- **Bottom-up:** parent needs computed info from subtrees (height, validity, longest path)

## Traversals
- Preorder: work before children
- Postorder: need children first
- Inorder: BST ordering intuition

## High-yield problems
Max Depth, Diameter, LCA, Validate BST, Path Sum, Count Good Nodes`,
  },
  {
    slug: "tries",
    title: "Tries",
    summary: "Prefix-aware search for strings and path components.",
    content: `## Deep intuition
A trie stores all prefixes explicitly — prefix search is natural and cheap.

## Node model
Each node = a prefix. Edges = next character. Terminal flag = full word ends here.

## Variants
- **Add and Search Word:** \`.\` wildcard → try every child
- **Word Search II:** walk board + trie together; prune dead branches early

## High-yield problems
Implement Trie, Add and Search Words, Word Search II, Design Add and Search Words`,
  },
  {
    slug: "heaps-queues",
    title: "Heaps & Queues",
    summary: "Next-best active item and FIFO processing.",
    content: `## Heap mental model
Not a sorted list — guarantees access to the best current candidate by one ordering.

## Three heap patterns
1. **Earliest finish** — Meeting Rooms II (reuse rooms)
2. **Fixed-size top k** — Kth Largest Element
3. **Best-first frontier** — Dijkstra

## Deque vs list
Use \`deque\` for BFS and rolling windows — \`list.pop(0)\` is O(n).

## Python tips
Priority queue tie-break with \`(priority, count, task)\`. Lazy deletion for stale heap entries.

## High-yield problems
Meeting Rooms II, Task Scheduler, Find Median from Data Stream, Kth Largest`,
  },
  {
    slug: "graphs",
    title: "Graphs & Scheduling",
    summary: "Representation first, then BFS, topo sort, union-find, Dijkstra.",
    content: `## Representation
- Unweighted adjacency list
- Weighted: \`graph[u] = [(v, w), ...]\`
- Dependencies: indegree + adjacency

## Family split
- Same-cost edges → BFS
- Reachability / components → DFS or BFS
- Prerequisites → topological sort (Kahn's)
- Nonnegative weights → Dijkstra
- Dynamic connectivity → union-find

## High-yield problems
Course Schedule, Number of Islands, Rotting Oranges, Cheapest Flights Within K Stops, Parallel Courses III`,
  },
  {
    slug: "dynamic-programming",
    title: "Dynamic Programming",
    summary: "Organized recursion — state definition is the hard part.",
    content: `## Five questions
1. What is the state?
2. What are the choices?
3. What is the transition?
4. What are base cases?
5. What repeats?

## Memoization first
Start top-down with \`@lru_cache(None)\` — arguments must be hashable (indices, tuples, bitmasks, not mutable lists).

## DP families for you
- 1D decision (take/skip)
- Cut/string DP (Word Break, Decode Ways)
- Weighted interval scheduling (sort + bisect + memo)
- DAG longest path (topo order)
- Counting DP (sum transitions, not max/or)

## When NOT to force DP
Unweighted graph? BFS. Acyclic scheduling? Topo. Clear greedy? Greedy. Small choice space? Backtracking.`,
  },
  {
    slug: "design",
    title: "Design Problems",
    summary: "Compose simple structures — don't hunt for magic classes.",
    content: `## Design question split
"What operations must be fast, and what structure supports each?"

## Compositions
- **TimeMap:** dict of key → ordered (timestamp, value) history + bisect
- **LRU:** dict + recency order (OrderedDict or hash + doubly linked list)
- **Snapshot Array:** per-index version history + bisect on snap_id
- **Hit Counter / Browser History:** deque or array + pointer
- **File system:** nested dict / trie nodes per path component

## High-yield problems
LRU Cache, TimeMap, Snapshot Array, Hit Counter, Encode and Decode Strings`,
  },
  {
    slug: "python-toolbox",
    title: "Python Toolbox",
    summary: "Standard-library tools that map directly to OA patterns.",
    content: `## Own these imports
\`\`\`python
import heapq
from collections import deque, defaultdict, Counter, OrderedDict
from bisect import bisect_left, bisect_right
from functools import lru_cache, cache
\`\`\`

## Gotchas
- \`defaultdict\` only auto-creates on \`__getitem__\`, not \`.get()\`
- \`heapq\` is min-heap; negate for max-heap
- \`lru_cache\` needs hashable args
- \`insort\` insertion is O(n)

## Interview calm
Most OA code is recombination of these tools — not new algorithms.`,
  },
  {
    slug: "clean-code-execution",
    title: "Clean Code & Calm Execution",
    summary: "Recognition → explanation → implementation without panic.",
    content: `## Three competence levels
1. **Recognize** — name the family in 1–2 minutes
2. **Explain** — state, invariant, data structure clearly
3. **Implement** — reasonable Python with edge cases

## Five things before coding
1. Input and output
2. Problem family
3. State or invariant
4. One edge case
5. Rough complexity

## Daily habit (from your prep plan)
- One spoken walkthrough
- One clean re-solve
- One timed block
- Distributed practice beats cramming

## Anchor explanations
- **Word Search:** DFS from each start, mark/unmark visited, track character index
- **Meeting overlap:** sort by start, return false when start < previous end

> Most problems are not asking for brilliance — they ask whether you can choose the right abstraction early and write Python without losing the thread.`,
  },
];

function card(
  topicSlug: string,
  topic: string,
  id: string,
  front: string,
  back: string,
): PrepCardSeed {
  return { slug: `${topicSlug}-${id}`, topicSlug, topic, front, back };
}

const topicTitle = (slug: string) =>
  PREP_TOPICS.find((topic) => topic.slug === slug)?.title ?? slug;

export const PREP_CARDS: PrepCardSeed[] = [
  // Arrays & hashing
  card("arrays-hashing", topicTitle("arrays-hashing"), "membership", "Problem: 'Have I seen this before?' or 'find complement'", "Hash set or dict — O(1) expected lookup. Example: Two Sum stores value → index."),
  card("arrays-hashing", topicTitle("arrays-hashing"), "frequency", "Problem: 'How many times does each value appear?' or 'top k frequent'", "Counter from collections, or dict manual count. Top K: Counter.most_common(k) or heap of size k."),
  card("arrays-hashing", topicTitle("arrays-hashing"), "grouping", "Problem: 'Group items by key' (anagrams, accounts)", "defaultdict(list) — loop and append. Remember: d[key].append works; d.get(key) does not auto-create."),
  card("arrays-hashing", topicTitle("arrays-hashing"), "defaultdict-gotcha", "Does defaultdict create a missing key on .get()?", "No. Only __getitem__ (d[key]) calls default_factory. Silent bugs in graph building come from mixing .get() and []."),
  card("arrays-hashing", topicTitle("arrays-hashing"), "one-pass", "When is a single left-to-right pass enough?", "When each element's answer depends only on prefix state you can update incrementally (running sum, last index map, current streak)."),

  // Sorting & intervals
  card("sorting-intervals", topicTitle("sorting-intervals"), "overlap", "Can attend all meetings / any overlap?", "Sort by start. Scan: if start[i] < end[i-1] → false. Do NOT merge unless output requires merged intervals."),
  card("sorting-intervals", topicTitle("sorting-intervals"), "merge", "Merge overlapping intervals", "Sort by start. Keep current merged interval; if overlap, extend end; else push and start new."),
  card("sorting-intervals", topicTitle("sorting-intervals"), "rooms", "Minimum meeting rooms needed", "Sort by start. Min-heap of end times. If earliest end ≤ next start, reuse room (heapreplace); else push new end. Answer = heap size."),
  card("sorting-intervals", topicTitle("sorting-intervals"), "minimalism", "Interval problem only asks true/false — what mistake to avoid?", "Don't merge intervals or build room schedules when a single linear scan after sorting suffices."),
  card("sorting-intervals", topicTitle("sorting-intervals"), "stable-sort", "Why is Python's stable sort useful for intervals?", "Equal starts keep input order; key= lets you sort by start then end in one pass."),

  // Sliding window
  card("sliding-window", topicTitle("sliding-window"), "recognize", "Prompt mentions substring, subarray, 'at most k', longest valid segment", "Think sliding window with an invariant on the current segment."),
  card("sliding-window", topicTitle("sliding-window"), "fixed", "Fixed window size k (anagrams in string)", "Expand to k, then slide: add right char, remove left char, update counts."),
  card("sliding-window", topicTitle("sliding-window"), "variable", "Variable window — maximize while valid", "Expand right until valid. While valid, record answer and shrink left. Invariant = what makes window valid."),
  card("sliding-window", topicTitle("sliding-window"), "two-pointers", "Sorted array — pair with given sum / remove duplicates", "Two pointers from ends or same direction depending on monotonic structure."),
  card("sliding-window", topicTitle("sliding-window"), "invariant", "Before coding a window, what three questions do you ask?", "What makes window valid? What improves moving right? What improves moving left?"),

  // Stacks & lists
  card("stacks-lists", topicTitle("stacks-lists"), "stack-when", "Nested structure, parentheses, undo, nearest greater", "Reach for a stack. Monotonic stack when comparing to next/previous element."),
  card("stacks-lists", topicTitle("stacks-lists"), "monotonic", "Daily Temperatures / next greater element", "Monotonic decreasing stack of indices. Pop while current is greater than stack top."),
  card("stacks-lists", topicTitle("stacks-lists"), "dummy-node", "Linked list insertion/deletion pain reducer", "Dummy node before head + local curr pointer. Avoids special-casing empty head."),
  card("stacks-lists", topicTitle("stacks-lists"), "lru-structure", "LRU Cache underlying model", "Hash map for O(1) key lookup + doubly linked list or OrderedDict for recency order."),
  card("stacks-lists", topicTitle("stacks-lists"), "min-stack", "Min Stack design", "Two stacks or stack of (value, current_min) pairs."),

  // Binary search
  card("binary-search", topicTitle("binary-search"), "when", "Binary search vs hash map?", "Hash for exact key lookup. Bisect on sorted history for range queries: latest ≤ t, first ≥ x."),
  card("binary-search", topicTitle("binary-search"), "bisect-left", "bisect_left(arr, x) returns?", "Insertion point to the left of any existing equal x — 'leftmost ≥ x' style positioning."),
  card("binary-search", topicTitle("binary-search"), "timemap", "TimeMap get(key, timestamp) approach", "Per key: append (time, value) sorted by time. get uses bisect_right for latest time ≤ query."),
  card("binary-search", topicTitle("binary-search"), "insort-cost", "Why not use insort for everything?", "insort insertion into Python list is O(n). Fine for build-once query-many; bad for heavy interleaved inserts."),
  card("binary-search", topicTitle("binary-search"), "job-sched", "Weighted job scheduling needs bisect for what?", "After sorting by start, bisect_left on starts to find first job compatible after current job ends."),

  // Recursion & backtracking
  card("recursion-backtracking", topicTitle("recursion-backtracking"), "meaning", "Recursive DFS feels fuzzy — fix?", "Give the function one crisp meaning: dfs(state) answers one smaller subproblem."),
  card("recursion-backtracking", topicTitle("recursion-backtracking"), "template", "Backtracking four steps", "State, choices, base case, undo. If undo is fuzzy, code will wander."),
  card("recursion-backtracking", topicTitle("recursion-backtracking"), "word-search", "Word Search visited handling", "Mark cell (in-place # or set), recurse 4 dirs, unmark on return. Or pass visited set copy (slower)."),
  card("recursion-backtracking", topicTitle("recursion-backtracking"), "subsets", "Subsets vs Permutations vs Combination Sum difference", "Subsets: include/skip each index. Perms: used set, all positions. Combo sum: start index, reuse or not based on problem."),
  card("recursion-backtracking", topicTitle("recursion-backtracking"), "recursion-limit", "Very deep recursion in Python?", "sys.setrecursionlimit exists but risky. Prefer iterative DFS/BFS for very deep graphs."),

  // Trees
  card("trees", topicTitle("trees"), "top-down", "When is tree recursion top-down?", "Parent passes context down: current path, depth, running sum, prefix."),
  card("trees", topicTitle("trees"), "bottom-up", "When is tree recursion bottom-up?", "Parent needs aggregated child info: height, subtree sum, longest path, is-valid BST."),
  card("trees", topicTitle("trees"), "diameter", "Tree diameter pattern", "Postorder: for each node, best path through node = left_depth + right_depth. Track global max."),
  card("trees", topicTitle("trees"), "bst-search", "Validate BST", "Pass min/max bounds down, or inorder traversal checking strictly increasing."),
  card("trees", topicTitle("trees"), "question", "Unsure top-down vs bottom-up — one question?", "Does this node's answer depend on info from below, or pass info from above?"),

  // Tries
  card("tries", topicTitle("tries"), "what", "What is a trie really?", "Explicit prefix tree — each node is a prefix; edges are next chars; terminal flag marks full words."),
  card("tries", topicTitle("tries"), "insert", "Trie insert pattern", "Walk/create children dict per char; set is_word at end."),
  card("tries", topicTitle("tries"), "wildcard", "Add and Search Word with '.'", "On '.', recurse to every child at that level."),
  card("tries", topicTitle("tries"), "ws2", "Word Search II optimization", "Build trie from words; DFS board while walking trie; prune when no child for char."),
  card("tries", topicTitle("tries"), "vs-hash", "Trie vs hash set for dictionary lookup", "Hash: O(1) exact word. Trie: O(L) but enables prefix queries and shared-prefix pruning."),

  // Heaps & queues
  card("heaps-queues", topicTitle("heaps-queues"), "when-heap", "When to use a heap?", "Repeatedly need next smallest/largest among dynamic active items."),
  card("heaps-queues", topicTitle("heaps-queues"), "meeting-rooms", "Meeting Rooms II heap logic", "Sort starts. Min-heap of end times. Reuse room if min_end ≤ start; else new room. len(heap) = rooms."),
  card("heaps-queues", topicTitle("heaps-queues"), "top-k", "Kth largest / top k frequent with heap", "Size-k min-heap: if new item beats heap top, replace. Or Counter + heap for frequencies."),
  card("heaps-queues", topicTitle("heaps-queues"), "deque", "BFS / rotting oranges — queue structure?", "collections.deque — never list.pop(0) for BFS."),
  card("heaps-queues", topicTitle("heaps-queues"), "tie-break", "heapq equal priorities break — fix?", "Store (priority, count, task) so count tie-breaks; avoids comparing incomparable tasks."),

  // Graphs
  card("graphs", topicTitle("graphs"), "bfs", "Unweighted shortest path in graph", "BFS from source — first time you reach node is shortest in unweighted graph."),
  card("graphs", topicTitle("graphs"), "topo", "Course Schedule / prerequisites", "Kahn's: build indegree, queue zeros, process, decrement neighbors. Cycle if order length < n."),
  card("graphs", topicTitle("graphs"), "union-find", "When union-find?", "Dynamic connectivity, redundant connection, accounts merge, same component after unions."),
  card("graphs", topicTitle("graphs"), "dijkstra", "Dijkstra lazy deletion pattern", "Skip stale pops: if d != dist[u], continue. Relax neighbors with improved distance."),
  card("graphs", topicTitle("graphs"), "dag-dp", "Parallel Courses III intuition", "DAG longest path / critical path scheduling — topo order + max completion time per node."),

  // DP
  card("dynamic-programming", topicTitle("dynamic-programming"), "state", "First DP task — not the formula", "Define what dp(i) or dp(i,j) means in plain English."),
  card("dynamic-programming", topicTitle("dynamic-programming"), "memo", "Python memoization default", "@lru_cache(None) or @cache — hashable arguments only (indices, tuples, not lists)."),
  card("dynamic-programming", topicTitle("dynamic-programming"), "house-robber", "House Robber recurrence", "dp(i) = max(take nums[i] + dp(i+2), skip dp(i+1))."),
  card("dynamic-programming", topicTitle("dynamic-programming"), "word-break", "Word Break family state", "dp(i) = can segment s[i:]. Try all valid dictionary matches from i."),
  card("dynamic-programming", topicTitle("dynamic-programming"), "not-dp", "Signs it's NOT DP", "Unweighted shortest path → BFS. DAG order → topo. Greedy local rule exists. Small choices → backtrack."),

  // Design
  card("design", topicTitle("design"), "compose", "Design problem panic reducer", "List required operations and pick structure per operation — compose dict + deque + heap + bisect."),
  card("design", topicTitle("design"), "lru", "LRU with OrderedDict", "get/put: move_to_end. Evict: popitem(last=False) when over capacity."),
  card("design", topicTitle("design"), "timemap", "TimeMap operations", "set: append (time, val) to key's list. get: bisect_right on times for latest ≤ query."),
  card("design", topicTitle("design"), "snapshot", "Snapshot Array idea", "Per index store [(snap_id, val), ...] only when changed; get = bisect on snap history."),
  card("design", topicTitle("design"), "encode-decode", "Encode and Decode Strings", "Length-prefix encoding: 'len#string' repeated — avoids delimiter ambiguity."),

  // Python toolbox
  card("python-toolbox", topicTitle("python-toolbox"), "imports", "Five collections imports for OA", "heapq, deque, defaultdict, Counter, OrderedDict (+ bisect, lru_cache)."),
  card("python-toolbox", topicTitle("python-toolbox"), "max-heap", "Max heap in Python?", "heapq is min-heap — negate values or use (-priority, item)."),
  card("python-toolbox", topicTitle("python-toolbox"), "cache-args", "lru_cache fails with list argument — why?", "Cache key must be hashable; use tuple(indices) or separate parameters."),
  card("python-toolbox", topicTitle("python-toolbox"), "heapify", "heapify vs repeated heappush", "heapify is O(n) to build initial heap — faster than n pushes for bulk build."),
  card("python-toolbox", topicTitle("python-toolbox"), "counter", "Counter.most_common(k) use case", "Top k frequent elements directly — or feed into heap for streaming."),

  // Clean code & execution
  card("clean-code-execution", topicTitle("clean-code-execution"), "three-levels", "Recognize, Explain, Implement — what does each mean?", "Recognize: name family in 1-2 min. Explain: state/invariant clearly. Implement: code without wandering."),
  card("clean-code-execution", topicTitle("clean-code-execution"), "five-things", "Five things to say before coding", "I/O, family, state/invariant, one edge case, rough complexity."),
  card("clean-code-execution", topicTitle("clean-code-execution"), "word-search-talk", "Spoken Word Search plan (30 sec)", "Try each cell as start; DFS with index; mark visited; 4 directions; unmark on backtrack."),
  card("clean-code-execution", topicTitle("clean-code-execution"), "overlap-talk", "Spoken meeting overlap plan", "Sort by start; scan once; if start < prev end return false."),
  card("clean-code-execution", topicTitle("clean-code-execution"), "daily-habit", "Effective daily prep structure", "One spoken solution, one clean re-solve, one timed block — distributed practice beats cramming."),
  card("clean-code-execution", topicTitle("clean-code-execution"), "tiktok-vs-snowflake", "TikTok vs Snowflake prep emphasis", "TikTok: breadth + fast pattern retrieval. Snowflake: deeper design, graphs, tries, scheduling, interval/heap modeling."),
  card("clean-code-execution", topicTitle("clean-code-execution"), "overlap-set", "High-yield overlap problems for both tracks", "Word Search, LRU, Course Schedule, Meeting Rooms II, Encode/Decode Strings, Top K, Task Scheduler, Rotting Oranges, Job Scheduling."),
];

export function getPrepTopic(slug: string) {
  return PREP_TOPICS.find((topic) => topic.slug === slug) ?? null;
}
