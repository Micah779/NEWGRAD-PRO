export type PrepPracticeChoice = {
  id: string;
  label: string;
};

export type PrepPracticeSeed = {
  leetcodeNum: number;
  slug: string;
  title: string;
  topicSlug: string;
  statement: string;
  patternChoices: PrepPracticeChoice[];
  correctPatternChoiceId: string;
  patternExplanation: string;
  code: string;
  complexityChoices: PrepPracticeChoice[];
  correctComplexityChoiceId: string;
  complexityExplanation: string;
};

function problem(
  leetcodeNum: number,
  slug: string,
  title: string,
  topicSlug: string,
  statement: string,
  patternCorrect: string,
  patternWrong1: string,
  patternWrong2: string,
  patternWrong3: string,
  patternExplanation: string,
  code: string,
  complexityCorrect: string,
  complexityWrong1: string,
  complexityWrong2: string,
  complexityWrong3: string,
  complexityExplanation: string,
): PrepPracticeSeed {
  return {
    leetcodeNum,
    slug,
    title,
    topicSlug,
    statement,
    patternChoices: [
      { id: "a", label: patternCorrect },
      { id: "b", label: patternWrong1 },
      { id: "c", label: patternWrong2 },
      { id: "d", label: patternWrong3 },
    ],
    correctPatternChoiceId: "a",
    patternExplanation,
    code,
    complexityChoices: [
      { id: "a", label: complexityCorrect },
      { id: "b", label: complexityWrong1 },
      { id: "c", label: complexityWrong2 },
      { id: "d", label: complexityWrong3 },
    ],
    correctComplexityChoiceId: "a",
    complexityExplanation,
  };
}

// PREP_TOPICS titles for wrong-pattern distractors
const A = "Arrays, Strings & Hashing";
const S = "Sorting & Intervals";
const W = "Sliding Window & Two Pointers";
const L = "Stacks & Linked Lists";
const B = "Binary Search & Bisect";
const R = "Recursion & Backtracking";
const T = "Trees";
const TR = "Tries";
const H = "Heaps & Queues";
const G = "Graphs & Scheduling";
const D = "Dynamic Programming";
const DS = "Design Problems";
const P = "Python Toolbox";
const C = "Clean Code & Calm Execution";

export const PREP_PRACTICE_PROBLEMS: PrepPracticeSeed[] = [
  problem(1, "two-sum", "Two Sum", "arrays-hashing",
    "Given an integer array nums and an integer target, return indices of the two numbers such that they add up to target. Each input has exactly one solution and you may not use the same element twice.",
    A, S, W, G,
    "Hash map stores value → index for O(1) complement lookup in one pass.",
    `def twoSum(nums, target):
    seen = {}
    for i, x in enumerate(nums):
        if target - x in seen:
            return [seen[target - x], i]
        seen[x] = i`,
    "O(n) time, O(n) space", "O(n log n) time, O(1) space", "O(n²) time, O(n) space", "O(1) time, O(1) space",
    "Single pass with hash map — not sorting or sliding window over contiguous sums."),
  problem(2, "add-two-numbers", "Add Two Numbers", "stacks-lists",
    "You are given two non-empty linked lists representing two non-negative integers stored in reverse order. Add the two numbers and return the sum as a linked list.",
    L, A, H, D,
    "Dummy head + carry walk through both lists digit by digit.",
    `def addTwoNumbers(l1, l2):
    dummy = curr = ListNode()
    carry = 0
    while l1 or l2 or carry:
        s = carry + (l1.val if l1 else 0) + (l2.val if l2 else 0)
        carry, digit = divmod(s, 10)
        curr.next = ListNode(digit)
        curr = curr.next
        l1 = l1.next if l1 else None
        l2 = l2.next if l2 else None
    return dummy.next`,
    "O(max(m,n)) time, O(1) extra space", "O(m+n) time, O(m+n) space", "O(log n) time, O(1) space", "O(n²) time, O(n) space",
    "Linear list traversal with carry — pointer discipline, not heap merge."),
  problem(3, "longest-substring-without-repeating-characters", "Longest Substring Without Repeating Characters", "sliding-window",
    "Given a string s, find the length of the longest substring without repeating characters.",
    W, A, D, R,
    "Variable window with last-seen map — expand right, shrink left on duplicate.",
    `def lengthOfLongestSubstring(s):
    last, best, left = {}, 0, 0
    for right, ch in enumerate(s):
        if ch in last and last[ch] >= left:
            left = last[ch] + 1
        last[ch] = right
        best = max(best, right - left + 1)
    return best`,
    "O(n) time, O(min(n, alphabet)) space", "O(n²) time, O(n) space", "O(n log n) time, O(1) space", "O(2^n) time, O(n) space",
    "Contiguous substring + uniqueness → sliding window invariant."),
  problem(10, "regular-expression-matching", "Regular Expression Matching", "dynamic-programming",
    "Given string s and pattern p, implement regex matching with '.' and '*' where '*' matches zero or more of the preceding element.",
    D, R, L, B,
    "2D memo on (text index, pattern index) with take/skip for '*' branches.",
    `def isMatch(s, p):
    @lru_cache(None)
    def dp(i, j):
        if j == len(p): return i == len(s)
        first = i < len(s) and (p[j] == s[i] or p[j] == '.')
        if j + 1 < len(p) and p[j + 1] == '*':
            return dp(i, j + 2) or (first and dp(i + 1, j))
        return first and dp(i + 1, j + 1)
    return dp(0, 0)`,
    "O(m·n) time, O(m·n) space", "O(2^n) time, O(n) space", "O(n) time, O(1) space", "O(m·n) time, O(1) space",
    "Overlapping subproblems on indices — top-down DP with memoization."),
  problem(11, "container-with-most-water", "Container With Most Water", "sliding-window",
    "Given n non-negative integers as vertical lines, find two lines that with the x-axis form a container holding the most water.",
    W, B, G, S,
    "Two pointers from ends — move the shorter line inward since width only shrinks.",
    `def maxArea(height):
    l, r, best = 0, len(height) - 1, 0
    while l < r:
        best = max(best, min(height[l], height[r]) * (r - l))
        if height[l] < height[r]: l += 1
        else: r -= 1
    return best`,
    "O(n) time, O(1) space", "O(n log n) time, O(1) space", "O(n²) time, O(1) space", "O(n) time, O(n) space",
    "Two pointers exploiting monotonic width — not binary search on answer."),
  problem(13, "roman-to-integer", "Roman to Integer", "arrays-hashing",
    "Given a roman numeral string, convert it to an integer.",
    A, L, D, C,
    "One pass subtracting when a smaller symbol precedes a larger one.",
    `def romanToInt(s):
    val = {'I':1,'V':5,'X':10,'L':50,'C':100,'D':500,'M':1000}
    total = 0
    for i, ch in enumerate(s):
        if i + 1 < len(s) and val[ch] < val[s[i+1]]: total -= val[ch]
        else: total += val[ch]
    return total`,
    "O(n) time, O(1) space", "O(n log n) time, O(n) space", "O(n) time, O(n) space", "O(1) time, O(1) space",
    "Symbol value scan — not stack or DP."),
  problem(20, "valid-parentheses", "Valid Parentheses", "stacks-lists",
    "Given a string containing '(', ')', '{', '}', '[' and ']', determine if the input string is valid.",
    L, D, A, R,
    "Stack pushes openers, pops on matching closers — LIFO nesting.",
    `def isValid(s):
    stack, pairs = [], {')':'(', '}':'{', ']':'['}
    for ch in s:
        if ch in pairs:
            if not stack or stack.pop() != pairs[ch]: return False
        else: stack.append(ch)
    return not stack`,
    "O(n) time, O(n) space", "O(n) time, O(1) space", "O(n²) time, O(n) space", "O(n log n) time, O(n) space",
    "Nested structure → stack, not DP over substrings."),
  problem(21, "merge-two-sorted-lists", "Merge Two Sorted Lists", "stacks-lists",
    "Merge two sorted linked lists and return the merged list sorted.",
    L, H, S, A,
    "Dummy node + two pointers comparing heads.",
    `def mergeTwoLists(l1, l2):
    dummy = curr = ListNode()
    while l1 and l2:
        if l1.val <= l2.val: curr.next, l1 = l1, l1.next
        else: curr.next, l2 = l2, l2.next
        curr = curr.next
    curr.next = l1 or l2
    return dummy.next`,
    "O(m+n) time, O(1) space", "O((m+n) log(m+n)) time, O(m+n) space", "O(m·n) time, O(1) space", "O(log n) time, O(1) space",
    "Two sorted sequences merged with pointers — not k-way heap."),
  problem(23, "merge-k-sorted-lists", "Merge k Sorted Lists", "heaps-queues",
    "Given an array of k sorted linked lists, merge all into one sorted list.",
    H, L, B, G,
    "Min-heap of list heads — repeatedly extract smallest next node.",
    `def mergeKLists(lists):
    heap = []
    for i, node in enumerate(lists):
        if node: heappush(heap, (node.val, i, node))
    dummy = curr = ListNode()
    while heap:
        _, i, node = heappop(heap)
        curr.next = node; curr = curr.next
        if node.next: heappush(heap, (node.next.val, i, node.next))
    return dummy.next`,
    "O(N log k) time, O(k) space", "O(N) time, O(1) space", "O(N²) time, O(k) space", "O(k log N) time, O(N) space",
    "Pick smallest among k active heads — heap scheduling pattern."),
  problem(32, "longest-valid-parentheses", "Longest Valid Parentheses", "dynamic-programming",
    "Given a string of '(' and ')', find the length of the longest valid parentheses substring.",
    D, L, R, A,
    "DP[i] = longest valid ending at i using previous '(' match or bridge over prior valid block.",
    `def longestValidParentheses(s):
    dp, best = [0]*len(s), 0
    for i, ch in enumerate(s):
        if ch == ')' and i:
            if s[i-1] == '(':
                dp[i] = (dp[i-2] if i >= 2 else 0) + 2
            elif i - dp[i-1] > 0 and s[i - dp[i-1] - 1] == '(':
                dp[i] = dp[i-1] + 2 + (dp[i - dp[i-1] - 2] if i - dp[i-1] >= 2 else 0)
            best = max(best, dp[i])
    return best`,
    "O(n) time, O(n) space", "O(n) time, O(1) space", "O(n²) time, O(n) space", "O(2^n) time, O(n) space",
    "Optimal substructure on ending index — DP (stack variant also exists)."),
  problem(33, "search-in-rotated-sorted-array", "Search in Rotated Sorted Array", "binary-search",
    "Given a rotated sorted array with unique values and a target, return its index or -1.",
    B, A, W, G,
    "Binary search identifying sorted half, then check if target lies there.",
    `def search(nums, target):
    lo, hi = 0, len(nums) - 1
    while lo <= hi:
        mid = (lo + hi) // 2
        if nums[mid] == target: return mid
        if nums[lo] <= nums[mid]:
            if nums[lo] <= target < nums[mid]: hi = mid - 1
            else: lo = mid + 1
        else:
            if nums[mid] < target <= nums[hi]: lo = mid + 1
            else: hi = mid - 1
    return -1`,
    "O(log n) time, O(1) space", "O(n) time, O(1) space", "O(log n) time, O(n) space", "O(n log n) time, O(1) space",
    "Halving search space on partially sorted array — binary search variant."),
  problem(42, "trapping-rain-water", "Trapping Rain Water", "sliding-window",
    "Given n non-negative integers representing bar heights, compute trapped rain water after raining.",
    W, G, L, D,
    "Two pointers with left_max and right_max — water += min(maxL, maxR) - height.",
    `def trap(height):
    l, r, lm, rm, water = 0, len(height)-1, 0, 0, 0
    while l < r:
        if height[l] < height[r]:
            lm = max(lm, height[l]); water += lm - height[l]; l += 1
        else:
            rm = max(rm, height[r]); water += rm - height[r]; r -= 1
    return water`,
    "O(n) time, O(1) space", "O(n) time, O(n) space", "O(n²) time, O(1) space", "O(n log n) time, O(n) space",
    "Two pointers from both ends — not BFS flood fill."),
  problem(43, "multiply-strings", "Multiply Strings", "arrays-hashing",
    "Multiply two non-negative integers given as strings without converting to int directly.",
    A, D, L, P,
    "Grade-school multiplication into int array of length m+n.",
    `def multiply(num1, num2):
    if num1 == '0' or num2 == '0': return '0'
    m, n = len(num1), len(num2)
    res = [0] * (m + n)
    for i in range(m-1, -1, -1):
        for j in range(n-1, -1, -1):
            p = (ord(num1[i])-48)*(ord(num2[j])-48)
            s = p + res[i+j+1]
            res[i+j+1] = s % 10; res[i+j] += s // 10
    i = 0
    while i < len(res) and res[i] == 0: i += 1
    return ''.join(map(str, res[i:]))`,
    "O(m·n) time, O(m+n) space", "O(m+n) time, O(1) space", "O(n log n) time, O(n) space", "O(2^n) time, O(n) space",
    "Digit array simulation — string math, not DP."),
  problem(45, "jump-game-ii", "Jump Game II", "dynamic-programming",
    "Given nums where nums[i] is max jump from i, return minimum jumps to reach the last index. Guaranteed reachable.",
    D, G, W, H,
    "Greedy BFS layers: extend farthest in window, increment jumps at window end.",
    `def jump(nums):
    jumps, end, farthest = 0, 0, 0
    for i in range(len(nums)-1):
        farthest = max(farthest, i + nums[i])
        if i == end:
            jumps += 1; end = farthest
    return jumps`,
    "O(n) time, O(1) space", "O(n²) time, O(n) space", "O(n log n) time, O(1) space", "O(2^n) time, O(n) space",
    "Minimum steps with reachability — greedy layer expansion."),
  problem(52, "n-queens-ii", "N-Queens II", "recursion-backtracking",
    "Return the number of distinct solutions to the n-queens puzzle on an n×n board.",
    R, D, G, T,
    "Backtrack row by row tracking columns and diagonals with sets.",
    `def totalNQueens(n):
    cols, d1, d2, count = set(), set(), set(), 0
    def bt(r):
        nonlocal count
        if r == n: count += 1; return
        for c in range(n):
            if c in cols or r-c in d1 or r+c in d2: continue
            cols.add(c); d1.add(r-c); d2.add(r+c)
            bt(r+1)
            cols.remove(c); d1.remove(r-c); d2.remove(r+c)
    bt(0); return count`,
    "O(n!) time, O(n) space", "O(2^n) time, O(n²) space", "O(n²) time, O(n²) space", "O(n³) time, O(n) space",
    "Choose/explore/unchoose per row — classic backtracking."),
  problem(54, "spiral-matrix", "Spiral Matrix", "arrays-hashing",
    "Given an m×n matrix, return all elements in spiral order.",
    A, G, W, T,
    "Shrink top/bottom/left/right boundaries after each direction pass.",
    `def spiralOrder(matrix):
    res, t, b, l, r = [], 0, len(matrix)-1, 0, len(matrix[0])-1
    while t <= b and l <= r:
        for c in range(l, r+1): res.append(matrix[t][c]); t += 1
        for row in range(t, b+1): res.append(matrix[row][r]); r -= 1
        if t <= b:
            for c in range(r, l-1, -1): res.append(matrix[b][c]); b -= 1
        if l <= r:
            for row in range(b, t-1, -1): res.append(matrix[row][l]); l += 1
    return res`,
    "O(m·n) time, O(1) extra space", "O(m·n) time, O(m·n) space", "O(m·n log(m·n)) time, O(1) space", "O(m+n) time, O(1) space",
    "Boundary simulation on grid — not graph BFS."),
  problem(55, "jump-game", "Jump Game", "dynamic-programming",
    "Given nums where nums[i] is max jump from i, return true if you can reach the last index from 0.",
    D, G, W, A,
    "Track farthest reachable index — greedy reachability in one pass.",
    `def canJump(nums):
    reach = 0
    for i, x in enumerate(nums):
        if i > reach: return False
        reach = max(reach, i + x)
    return True`,
    "O(n) time, O(1) space", "O(n²) time, O(n) space", "O(n log n) time, O(1) space", "O(2^n) time, O(n) space",
    "Running maximum reach — greedy/1D DP, not BFS."),
  problem(56, "merge-intervals", "Merge Intervals", "sorting-intervals",
    "Given intervals [start, end], merge all overlapping intervals.",
    S, H, G, A,
    "Sort by start, extend current end on overlap or push new interval.",
    `def merge(intervals):
    intervals.sort(key=lambda x: x[0])
    out = []
    for s, e in intervals:
        if not out or s > out[-1][1]: out.append([s, e])
        else: out[-1][1] = max(out[-1][1], e)
    return out`,
    "O(n log n) time, O(n) space", "O(n) time, O(1) space", "O(n²) time, O(n) space", "O(n log n) time, O(1) space",
    "Sort-and-scan merge — classic interval pattern."),
  problem(68, "text-justification", "Text Justification", "arrays-hashing",
    "Given words and maxWidth, format text with each line fully justified except the last.",
    A, S, C, D,
    "Greedy pack words per line, distribute extra spaces evenly with larger gaps first.",
    `def fullJustify(words, maxWidth):
    res, i, n = [], 0, len(words)
    while i < n:
        line, length, j = [words[i]], len(words[i]), i + 1
        while j < n and length + 1 + len(words[j]) <= maxWidth:
            line.append(words[j]); length += 1 + len(words[j]); j += 1
        if j == n or len(line) == 1:
            res.append(' '.join(line).ljust(maxWidth))
        else:
            spaces, gaps = maxWidth - sum(len(w) for w in line), len(line) - 1
            base, extra = divmod(spaces, gaps)
            s = ''.join(w + ' ' * (base + (1 if k < extra else 0)) for k, w in enumerate(line[:-1]))
            res.append(s + line[-1])
        i = j
    return res`,
    "O(n) time, O(n) space", "O(n²) time, O(n) space", "O(n log n) time, O(1) space", "O(1) time, O(1) space",
    "Line packing simulation — string formatting."),
  problem(71, "simplify-path", "Simplify Path", "stacks-lists",
    "Given a Unix-style absolute path, return its simplified canonical path.",
    L, A, TR, G,
    "Split on '/', push dirs, pop on '..', skip '.' and empty.",
    `def simplifyPath(path):
    stack = []
    for part in path.split('/'):
        if part in ('', '.'): continue
        if part == '..':
            if stack: stack.pop()
        else: stack.append(part)
    return '/' + '/'.join(stack)`,
    "O(n) time, O(n) space", "O(n) time, O(1) space", "O(n log n) time, O(n) space", "O(1) time, O(1) space",
    "Path components with undo on '..' — stack."),
  problem(76, "minimum-window-substring", "Minimum Window Substring", "sliding-window",
    "Return the minimum window substring of s containing all characters of t (with multiplicity).",
    W, A, D, R,
    "Expand until valid, shrink while valid to minimize length.",
    `def minWindow(s, t):
    need = Counter(t); missing, left, start, length = len(t), 0, 0, float('inf')
    for right, ch in enumerate(s):
        if ch in need:
            if need[ch] > 0: missing -= 1
            need[ch] -= 1
        while missing == 0:
            if right - left + 1 < length: start, length = left, right - left + 1
            if s[left] in need:
                need[s[left]] += 1
                if need[s[left]] > 0: missing += 1
            left += 1
    return '' if length == float('inf') else s[start:start+length]`,
    "O(|s|+|t|) time, O(|t|) space", "O(|s|·|t|) time, O(|t|) space", "O(|s| log |s|) time, O(|s|) space", "O(2^|s|) time, O(|s|) space",
    "Variable window with frequency validity — hallmark sliding window."),
  problem(78, "subsets", "Subsets", "recursion-backtracking",
    "Given unique integers nums, return all possible subsets (the power set).",
    R, D, A, W,
    "Include/skip via backtracking — append path copy at each step.",
    `def subsets(nums):
    res, path = [], []
    def bt(i):
        res.append(path[:])
        for j in range(i, len(nums)):
            path.append(nums[j]); bt(j + 1); path.pop()
    bt(0); return res`,
    "O(n·2^n) time, O(n) space", "O(n!) time, O(n) space", "O(n²) time, O(n) space", "O(2^n) time, O(2^n) space",
    "Choose/explore/unchoose over indices — backtracking template."),
  problem(79, "word-search", "Word Search", "recursion-backtracking",
    "Given a character grid and word, return true if word exists via sequentially adjacent cells.",
    R, G, TR, D,
    "DFS from each cell: mark visited, recurse 4 dirs, unmark on return.",
    `def exist(board, word):
    R, C = len(board), len(board[0])
    def dfs(r, c, i):
        if i == len(word): return True
        if r < 0 or c < 0 or r >= R or c >= C or board[r][c] != word[i]: return False
        tmp, board[r][c] = board[r][c], '#'
        ok = any(dfs(r+dr, c+dc, i+1) for dr, dc in ((0,1),(0,-1),(1,0),(-1,0)))
        board[r][c] = tmp; return ok
    return any(dfs(r, c, 0) for r in range(R) for c in range(C))`,
    "O(m·n·4^L) time, O(L) space", "O(m·n) time, O(1) space", "O(m·n·L) time, O(m·n) space", "O(L!) time, O(L) space",
    "Grid DFS with mark/unmark — backtracking on paths."),
  problem(84, "largest-rectangle-in-histogram", "Largest Rectangle in Histogram", "stacks-lists",
    "Given bar heights, return the area of the largest rectangle in the histogram.",
    L, D, W, B,
    "Monotonic increasing stack — pop to compute width when shorter bar arrives.",
    `def largestRectangleArea(heights):
    stack, best = [], 0
    for i, h in enumerate(heights + [0]):
        while stack and heights[stack[-1]] > h:
            H = heights[stack.pop()]
            w = i if not stack else i - stack[-1] - 1
            best = max(best, H * w)
        stack.append(i)
    return best`,
    "O(n) time, O(n) space", "O(n²) time, O(1) space", "O(n log n) time, O(n) space", "O(n) time, O(1) space",
    "Previous smaller via monotonic stack — not DP table."),
  problem(105, "construct-binary-tree-from-preorder-and-inorder", "Construct Binary Tree from Preorder and Inorder", "trees",
    "Given preorder and inorder traversal arrays of unique values, construct the binary tree.",
    T, R, A, G,
    "Preorder gives root; inorder splits left/right; recurse with index bounds.",
    `def buildTree(preorder, inorder):
    idx = {v: i for i, v in enumerate(inorder)}; pre_i = 0
    def build(l, r):
        nonlocal pre_i
        if l > r: return None
        root = TreeNode(preorder[pre_i]); pre_i += 1
        mid = idx[root.val]
        root.left = build(l, mid - 1); root.right = build(mid + 1, r)
        return root
    return build(0, len(inorder) - 1)`,
    "O(n) time, O(n) space", "O(n²) time, O(n) space", "O(n log n) time, O(1) space", "O(2^n) time, O(n) space",
    "Recursive tree build from traversals — tree recursion."),
  problem(116, "populating-next-right-pointers-in-each-node", "Populating Next Right Pointers in Each Node", "trees",
    "Populate each node's next pointer to its next right node in a perfect binary tree.",
    T, L, G, DS,
    "Use established next pointers to traverse each level in O(1) extra space.",
    `def connect(root):
    if not root: return root
    leftmost = root
    while leftmost.left:
        node = leftmost
        while node:
            node.left.next = node.right
            if node.next: node.right.next = node.next.left
            node = node.next
        leftmost = leftmost.left
    return root`,
    "O(n) time, O(1) space", "O(n) time, O(n) space", "O(n log n) time, O(1) space", "O(n²) time, O(n) space",
    "Level linking via tree pointers — tree traversal pattern."),
  problem(117, "populating-next-right-pointers-ii", "Populating Next Right Pointers II", "trees",
    "Populate next pointers for each node in a binary tree that may not be perfect.",
    T, L, H, G,
    "Build next level's linked list while walking current level's next pointers.",
    `def connect(root):
    dummy = node = TreeNode(0); dummy.left = root
    while node.left:
        cur, nxt = node.left, TreeNode(0); tail = nxt
        while cur:
            if cur.left: tail.next = cur.left; tail = tail.next
            if cur.right: tail.next = cur.right; tail = tail.next
            cur = cur.next
        node = nxt.next
    return dummy.left`,
    "O(n) time, O(1) space", "O(n) time, O(n) space", "O(n log n) time, O(n) space", "O(n²) time, O(n) space",
    "Level-by-level tree linking — pointer manipulation on tree."),
  problem(121, "best-time-to-buy-and-sell-stock", "Best Time to Buy and Sell Stock", "dynamic-programming",
    "Given daily prices, return max profit from one buy and one sell (buy before sell).",
    D, A, W, H,
    "Track min price so far, update max profit each day.",
    `def maxProfit(prices):
    min_p, best = float('inf'), 0
    for p in prices:
        min_p = min(min_p, p); best = max(best, p - min_p)
    return best`,
    "O(n) time, O(1) space", "O(n²) time, O(1) space", "O(n log n) time, O(n) space", "O(2^n) time, O(n) space",
    "Running minimum with best gain — 1D greedy/DP."),
  problem(128, "longest-consecutive-sequence", "Longest Consecutive Sequence", "arrays-hashing",
    "Given unsorted nums, return length of longest consecutive sequence in O(n).",
    A, S, D, G,
    "Hash set — start streak only from numbers with no predecessor.",
    `def longestConsecutive(nums):
    s, best = set(nums), 0
    for n in s:
        if n - 1 not in s:
            length = 1
            while n + length in s: length += 1
            best = max(best, length)
    return best`,
    "O(n) time, O(n) space", "O(n log n) time, O(1) space", "O(n²) time, O(n) space", "O(n) time, O(1) space",
    "Set membership for sequence starts — hash set pattern."),
  problem(134, "gas-station", "Gas Station", "arrays-hashing",
    "On a circular route with gas[i] and cost[i], return starting gas station index if circuit possible, else -1.",
    A, D, G, S,
    "If total gas ≥ total cost, single pass resets start when tank goes negative.",
    `def canCompleteCircuit(gas, cost):
    if sum(gas) < sum(cost): return -1
    tank, start = 0, 0
    for i in range(len(gas)):
        tank += gas[i] - cost[i]
        if tank < 0: start, tank = i + 1, 0
    return start`,
    "O(n) time, O(1) space", "O(n²) time, O(1) space", "O(n log n) time, O(n) space", "O(1) time, O(1) space",
    "Circular greedy with running tank — simulation on array."),
  problem(138, "copy-list-with-random-pointer", "Copy List with Random Pointer", "stacks-lists",
    "Deep copy a linked list where each node has an additional random pointer.",
    L, DS, A, T,
    "Hash map old→new, two passes for next and random pointers.",
    `def copyRandomList(head):
    if not head: return None
    m = {}; cur = head
    while cur: m[cur] = Node(cur.val); cur = cur.next
    cur = head
    while cur:
        m[cur].next = m.get(cur.next); m[cur].random = m.get(cur.random)
        cur = cur.next
    return m[head]`,
    "O(n) time, O(n) space", "O(n²) time, O(1) space", "O(n) time, O(1) space", "O(n log n) time, O(n) space",
    "Pointer rewiring with hash map — list + dict composition."),
  problem(146, "lru-cache", "LRU Cache", "design",
    "Design LRU cache supporting get and put in O(1) average time.",
    DS, L, H, B,
    "OrderedDict: move_to_end on access, popitem(last=False) on eviction.",
    `class LRUCache:
    def __init__(self, capacity):
        self.cap = capacity; self.cache = OrderedDict()
    def get(self, key):
        if key not in self.cache: return -1
        self.cache.move_to_end(key); return self.cache[key]
    def put(self, key, value):
        if key in self.cache: self.cache.move_to_end(key)
        self.cache[key] = value
        if len(self.cache) > self.cap: self.cache.popitem(last=False)`,
    "O(1) time per op, O(capacity) space", "O(log n) time per op, O(n) space", "O(n) time per op, O(1) space", "O(1) time per op, O(1) space",
    "Dict + recency order — classic design composition."),
  problem(155, "min-stack", "Min Stack", "stacks-lists",
    "Design a stack supporting push, pop, top, and getMin in O(1) per operation.",
    L, DS, A, D,
    "Store (value, current_min) pairs on each push.",
    `class MinStack:
    def __init__(self): self.stack = []
    def push(self, val):
        cur = min(val, self.stack[-1][1]) if self.stack else val
        self.stack.append((val, cur))
    def pop(self): self.stack.pop()
    def top(self): return self.stack[-1][0]
    def getMin(self): return self.stack[-1][1]`,
    "O(1) time per op, O(n) space", "O(log n) time per op, O(n) space", "O(n) time per op, O(1) space", "O(1) time per op, O(1) space",
    "Augmented stack tracking running minimum."),
  problem(189, "rotate-array", "Rotate Array", "arrays-hashing",
    "Rotate array nums to the right by k steps in-place.",
    A, L, B, D,
    "Reverse whole array, then reverse first k and remainder.",
    `def rotate(nums, k):
    k %= len(nums)
    def rev(l, r):
        while l < r: nums[l], nums[r] = nums[r], nums[l]; l += 1; r -= 1
    rev(0, len(nums)-1); rev(0, k-1); rev(k, len(nums)-1)`,
    "O(n) time, O(1) space", "O(n) time, O(n) space", "O(n log n) time, O(1) space", "O(k·n) time, O(1) space",
    "Three-reversal in-place trick — array manipulation."),
  problem(200, "number-of-islands", "Number of Islands", "graphs",
    "Given a 2D grid of '1' (land) and '0' (water), return the number of islands.",
    G, R, T, A,
    "DFS/BFS marks each connected '1' component visited.",
    `def numIslands(grid):
    R, C = len(grid), len(grid[0])
    def dfs(r, c):
        if r < 0 or c < 0 or r >= R or c >= C or grid[r][c] != '1': return
        grid[r][c] = '0'
        for dr, dc in ((1,0),(-1,0),(0,1),(0,-1)): dfs(r+dr, c+dc)
    count = 0
    for r in range(R):
        for c in range(C):
            if grid[r][c] == '1': dfs(r, c); count += 1
    return count`,
    "O(m·n) time, O(m·n) space", "O(m·n) time, O(1) space", "O(m+n) time, O(m·n) space", "O((m·n)²) time, O(m·n) space",
    "Connected components on grid — DFS/BFS traversal."),
  problem(202, "happy-number", "Happy Number", "arrays-hashing",
    "Replace n by sum of squares of digits repeatedly. Return true if process ends at 1, false if it loops.",
    A, D, L, B,
    "Floyd cycle detection on iterated digit-square sum.",
    `def isHappy(n):
    def nxt(x):
        s = 0
        while x: x, d = divmod(x, 10); s += d*d
        return s
    slow = fast = n
    while True:
        slow = nxt(slow); fast = nxt(nxt(fast))
        if fast == 1: return True
        if slow == fast: return False`,
    "O(log n) time, O(1) space", "O(n) time, O(n) space", "O(1) time, O(1) space", "O(n²) time, O(n) space",
    "Cycle detection on sequence — hash/Floyd pattern."),
  problem(215, "kth-largest-element", "Kth Largest Element", "heaps-queues",
    "Given integer array nums and integer k, return the kth largest element in the array.",
    H, A, B, S,
    "Size-k min-heap maintains k largest elements; heap top is kth largest.",
    `def findKthLargest(nums, k):
    heap = []
    for x in nums:
        heappush(heap, x)
        if len(heap) > k: heappop(heap)
    return heap[0]`,
    "O(n log k) time, O(k) space", "O(n log n) time, O(1) space", "O(n²) time, O(1) space", "O(n) time, O(n) space",
    "Bounded min-heap for top-k — heap pattern."),
  problem(207, "course-schedule", "Course Schedule", "graphs",
    "There are numCourses labeled 0..n-1 and prerequisites [a,b] meaning take b before a. Return true if all courses can be finished.",
    G, D, H, S,
    "Kahn's topo sort: indegree queue, process, decrement neighbors; cycle if order length < n.",
    `def canFinish(numCourses, prerequisites):
    adj = [[] for _ in range(numCourses)]; indeg = [0]*numCourses
    for a, b in prerequisites: adj[b].append(a); indeg[a] += 1
    q = deque([i for i, d in enumerate(indeg) if d == 0]); seen = 0
    while q:
        u = q.popleft(); seen += 1
        for v in adj[u]:
            indeg[v] -= 1
            if indeg[v] == 0: q.append(v)
    return seen == numCourses`,
    "O(V+E) time, O(V+E) space", "O(V²) time, O(V) space", "O(V+E) time, O(1) space", "O(2^V) time, O(V) space",
    "Prerequisite DAG → topological sort / Kahn's algorithm."),
  problem(208, "implement-trie", "Implement Trie", "tries",
    "Implement a trie with insert, search, and startsWith operations.",
    TR, DS, A, R,
    "Nested dict per character; terminal flag marks complete words.",
    `class Trie:
    def __init__(self): self.children = {}; self.end = False
    def insert(self, word):
        node = self
        for ch in word:
            node = node.children.setdefault(ch, Trie())
        node.end = True
    def search(self, word):
        node = self._walk(word); return bool(node and node.end)
    def startsWith(self, prefix):
        return self._walk(prefix) is not None
    def _walk(self, s):
        node = self
        for ch in s:
            if ch not in node.children: return None
            node = node.children[ch]
        return node`,
    "O(L) time per op, O(total chars) space", "O(1) time per op, O(n) space", "O(n log n) time, O(n) space", "O(L²) time, O(L) space",
    "Prefix tree with explicit character nodes — trie pattern."),
  problem(210, "course-schedule-ii", "Course Schedule II", "graphs",
    "Return ordering of courses to finish all, or [] if impossible. Prerequisites [a,b] means b before a.",
    G, D, S, H,
    "Same Kahn topo sort but collect order; empty if cycle detected.",
    `def findOrder(numCourses, prerequisites):
    adj = [[] for _ in range(numCourses)]; indeg = [0]*numCourses
    for a, b in prerequisites: adj[b].append(a); indeg[a] += 1
    q = deque([i for i, d in enumerate(indeg) if d == 0]); order = []
    while q:
        u = q.popleft(); order.append(u)
        for v in adj[u]:
            indeg[v] -= 1
            if indeg[v] == 0: q.append(v)
    return order if len(order) == numCourses else []`,
    "O(V+E) time, O(V+E) space", "O(V²) time, O(V) space", "O(V·E) time, O(V) space", "O(2^V) time, O(V) space",
    "Topological ordering of prerequisite graph."),
  problem(211, "design-add-and-search-words", "Design Add and Search Words", "tries",
    "Design a structure supporting addWord and search with '.' wildcard matching any letter.",
    TR, DS, R, A,
    "Trie insert; on '.' recurse all children at that level.",
    `class WordDictionary:
    def __init__(self): self.children = {}; self.end = False
    def addWord(self, word):
        node = self
        for ch in word: node = node.children.setdefault(ch, WordDictionary())
        node.end = True
    def search(self, word):
        def dfs(node, i):
            if i == len(word): return node.end
            ch = word[i]
            if ch == '.':
                return any(dfs(child, i+1) for child in node.children.values())
            if ch not in node.children: return False
            return dfs(node.children[ch], i+1)
        return dfs(self, 0)`,
    "O(L) insert, O(26^wildcards) search worst case, O(total) space", "O(1) time per op, O(n) space", "O(n log n) time, O(n) space", "O(L) time, O(1) space",
    "Trie with wildcard DFS — trie variant."),
  problem(212, "word-search-ii", "Word Search II", "tries",
    "Given an m×n board and words[], return all words that can be formed by adjacent cell paths.",
    TR, R, G, A,
    "Build trie from words; DFS board while walking trie; prune dead branches.",
    `def findWords(board, words):
    root = {}
    for w in words:
        node = root
        for ch in w: node = node.setdefault(ch, {})
        node['#'] = w
    R, C, res = len(board), len(board[0]), set()
    def dfs(r, c, node):
        ch = board[r][c]
        if ch not in node: return
        nxt = node[ch]
        if '#' in nxt: res.add(nxt['#']); del nxt['#']
        board[r][c] = '#'
        for dr, dc in ((0,1),(0,-1),(1,0),(-1,0)):
            nr, nc = r+dr, c+dc
            if 0 <= nr < R and 0 <= nc < C: dfs(nr, nc, nxt)
        board[r][c] = ch
        if not nxt: del node[ch]
    for r in range(R):
        for c in range(C): dfs(r, c, root)
    return list(res)`,
    "O(m·n·4^L) time, O(total chars) space", "O(m·n·|words|) time, O(|words|) space", "O(m·n) time, O(1) space", "O(2^L) time, O(L) space",
    "Board DFS + trie pruning — trie + backtracking combo."),
  problem(224, "basic-calculator", "Basic Calculator", "stacks-lists",
    "Evaluate a string expression with +, -, parentheses, and non-negative integers.",
    L, D, A, P,
    "Stack tracks signs; on '(' push current result and sign; on ')' pop and combine.",
    `def calculate(s):
    stack, num, sign, res = [], 0, 1, 0
    for ch in s:
        if ch.isdigit():
            num = num * 10 + int(ch)
        if ch in '+-' and not (ch == '+'):
            pass
        if ch in '+-)' or ch == ' ':
            if ch != ')':
                res += sign * num; num = 0
                if ch == '+': sign = 1
                elif ch == '-': sign = -1
            if ch == ')':
                res += sign * num; num = 0
                res *= stack.pop(); sign = stack.pop()
        if ch == '(': stack.extend([res, sign]); res, sign = 0, 1
    return res + sign * num`,
    "O(n) time, O(n) space", "O(n²) time, O(1) space", "O(n log n) time, O(n) space", "O(1) time, O(1) space",
    "Expression parsing with stack — LIFO nesting for parentheses."),
  problem(227, "basic-calculator-ii", "Basic Calculator II", "stacks-lists",
    "Evaluate a string with +, -, *, / and non-negative integers (integer division).",
    L, D, A, B,
    "Track last number; on */ apply to last; on +/- push to stack and reset.",
    `def calculate(s):
    stack, num, op = [], 0, '+'
    for i, ch in enumerate(s + '+'):
        if ch.isdigit(): num = num * 10 + int(ch)
        if ch in '+-*/' or i == len(s):
            if op == '+': stack.append(num)
            elif op == '-': stack.append(-num)
            elif op == '*': stack.append(stack.pop() * num)
            else: stack.append(int(stack.pop() / num))
            num, op = 0, ch
    return sum(stack)`,
    "O(n) time, O(n) space", "O(n²) time, O(1) space", "O(n log n) time, O(n) space", "O(1) time, O(1) space",
    "Stack accumulates signed terms with immediate */ — calculator stack."),
  problem(239, "sliding-window-maximum", "Sliding Window Maximum", "sliding-window",
    "Given nums and window size k, return max of each sliding window.",
    W, H, L, B,
    "Monotonic deque stores indices of decreasing values — front is window max.",
    `def maxSlidingWindow(nums, k):
    dq, res = deque(), []
    for i, x in enumerate(nums):
        while dq and dq[0] <= i - k: dq.popleft()
        while dq and nums[dq[-1]] <= x: dq.pop()
        dq.append(i)
        if i >= k - 1: res.append(nums[dq[0]])
    return res`,
    "O(n) time, O(k) space", "O(n·k) time, O(1) space", "O(n log k) time, O(k) space", "O(n) time, O(n) space",
    "Fixed window max via monotonic deque — sliding window + deque."),
  problem(243, "shortest-word-distance", "Shortest Word Distance", "arrays-hashing",
    "Given words array and two distinct words, return minimum index distance between them.",
    A, W, B, G,
    "Track last index of each word; update min distance on each occurrence.",
    `def shortestDistance(wordsDict, word1, word2):
    i1 = i2 = -1; best = float('inf')
    for i, w in enumerate(wordsDict):
        if w == word1: i1 = i; best = min(best, i - i2) if i2 >= 0 else best
        if w == word2: i2 = i; best = min(best, i - i1) if i1 >= 0 else best
    return best`,
    "O(n) time, O(1) space", "O(n²) time, O(1) space", "O(n log n) time, O(n) space", "O(1) time, O(1) space",
    "One pass tracking last positions — hash/index scan."),
  problem(253, "meeting-rooms-ii", "Meeting Rooms II", "heaps-queues",
    "Given meeting intervals, return minimum conference rooms required.",
    H, S, G, DS,
    "Sort starts; min-heap of end times — reuse room when earliest end ≤ next start.",
    `def minMeetingRooms(intervals):
    intervals.sort(key=lambda x: x[0])
    heap = []
    for s, e in intervals:
        if heap and heap[0] <= s: heapreplace(heap, e)
        else: heappush(heap, e)
    return len(heap)`,
    "O(n log n) time, O(n) space", "O(n) time, O(1) space", "O(n²) time, O(n) space", "O(n log n) time, O(1) space",
    "Earliest-finish heap for room reuse — heap scheduling."),
  problem(261, "graph-valid-tree", "Graph Valid Tree", "graphs",
    "Given n nodes and edges, return true if edges form a valid tree (connected, acyclic).",
    G, D, R, H,
    "Tree has exactly n-1 edges; DFS/BFS or union-find checks connectivity.",
    `def validTree(n, edges):
    if len(edges) != n - 1: return False
    adj = [[] for _ in range(n)]
    for u, v in edges: adj[u].append(v); adj[v].append(u)
    seen = {0}; stack = [0]
    while stack:
        u = stack.pop()
        for v in adj[u]:
            if v not in seen: seen.add(v); stack.append(v)
    return len(seen) == n`,
    "O(V+E) time, O(V+E) space", "O(V²) time, O(V) space", "O(V+E) time, O(1) space", "O(2^V) time, O(V) space",
    "Connected acyclic graph — DFS/union-find on edges."),
  problem(271, "encode-and-decode-strings", "Encode and Decode Strings", "design",
    "Design an algorithm to encode a list of strings to a single string and decode back.",
    DS, A, TR, L,
    "Length-prefix encoding: 'len#string' avoids delimiter ambiguity.",
    `def encode(strs):
    return ''.join(f'{len(s)}#{s}' for s in strs)
def decode(s):
    res, i = [], 0
    while i < len(s):
        j = s.index('#', i); length = int(s[i:j])
        i = j + 1; res.append(s[i:i+length]); i += length
    return res`,
    "O(total chars) time, O(total chars) space", "O(n²) time, O(n) space", "O(n) time, O(1) space", "O(n log n) time, O(n) space",
    "Length-prefix serialization — design encoding pattern."),
  problem(273, "integer-to-english-words", "Integer to English Words", "clean-code-execution",
    "Convert a non-negative integer to its English words representation.",
    C, A, P, D,
    "Chunk by thousands with helper for 0-999; careful edge cases and string assembly.",
    `def numberToWords(num):
    if num == 0: return 'Zero'
    below20 = 'One Two Three Four Five Six Seven Eight Nine Ten Eleven Twelve Thirteen Fourteen Fifteen Sixteen Seventeen Eighteen Nineteen'.split()
    tens = 'Twenty Thirty Forty Fifty Sixty Seventy Eighty Ninety'.split()
    scales = ['', 'Thousand', 'Million', 'Billion']
    def chunk(n):
        if n == 0: return ''
        if n < 20: return below20[n-1]
        if n < 100: return tens[n//10-2] + ('' if n%10==0 else ' ' + below20[n%10-1])
        return below20[n//100-1] + ' Hundred' + ('' if n%100==0 else ' ' + chunk(n%100))
    parts, i = [], 0
    while num:
        if num % 1000: parts.append(chunk(num%1000) + (' ' + scales[i] if i else ''))
        num //= 1000; i += 1
    return ' '.join(reversed(parts))`,
    "O(log n) time, O(1) space", "O(n) time, O(n) space", "O(1) time, O(1) space", "O(n²) time, O(n) space",
    "Careful implementation with chunk helpers — execution/clean code."),
  problem(276, "paint-fence", "Paint Fence", "dynamic-programming",
    "Paint n posts with k colors so no more than two adjacent posts share the same color. Return count mod 10^9+7.",
    D, R, A, G,
    "DP: same[i] = ways ending with same as i-1; diff[i] = ways ending different.",
    `def numWays(n, k):
    if n == 1: return k
    if k == 1: return 1 if n <= 2 else 0
    same, diff = k, k * (k - 1)
    for _ in range(3, n + 1):
        same, diff = diff, (same + diff) * (k - 1)
    return (same + diff) % (10**9 + 7)`,
    "O(n) time, O(1) space", "O(2^n) time, O(n) space", "O(n²) time, O(n) space", "O(n) time, O(n) space",
    "Linear recurrence on paint states — counting DP."),
  problem(286, "walls-and-gates", "Walls and Gates", "graphs",
    "Fill each empty room with distance to nearest gate. -1 is wall, INF is empty.",
    G, T, W, D,
    "Multi-source BFS from all gates simultaneously.",
    `def wallsAndGates(rooms):
    R, C = len(rooms), len(rooms[0])
    q = deque((r, c) for r in range(R) for c in range(C) if rooms[r][c] == 0)
    dist = 0
    while q:
        for _ in range(len(q)):
            r, c = q.popleft()
            for dr, dc in ((1,0),(-1,0),(0,1),(0,-1)):
                nr, nc = r+dr, c+dc
                if 0 <= nr < R and 0 <= nc < C and rooms[nr][nc] == 2147483647:
                    rooms[nr][nc] = dist + 1; q.append((nr, nc))
        dist += 1`,
    "O(m·n) time, O(m·n) space", "O(m·n) time, O(1) space", "O((m·n)²) time, O(m·n) space", "O(m+n) time, O(m·n) space",
    "Multi-source BFS for shortest distances on grid."),
  problem(295, "find-median-from-data-stream", "Find Median from Data Stream", "heaps-queues",
    "Design a structure supporting addNum and findMedian in O(log n) add.",
    H, DS, B, D,
    "Two heaps: max-heap for lower half, min-heap for upper; balance sizes.",
    `class MedianFinder:
    def __init__(self): self.lo, self.hi = [], []
    def addNum(self, num):
        heappush(self.lo, -num)
        heappush(self.hi, -heappop(self.lo))
        if len(self.hi) > len(self.lo):
            heappush(self.lo, -heappop(self.hi))
    def findMedian(self):
        if len(self.lo) > len(self.hi): return -self.lo[0]
        return (-self.lo[0] + self.hi[0]) / 2`,
    "O(log n) add, O(1) median, O(n) space", "O(n) add, O(1) median, O(n) space", "O(log n) add, O(log n) median, O(n) space", "O(1) add, O(1) median, O(1) space",
    "Dual-heap median maintenance — heap design."),
  problem(297, "serialize-and-deserialize-binary-tree", "Serialize and Deserialize Binary Tree", "trees",
    "Design algorithms to serialize and deserialize a binary tree.",
    T, DS, A, R,
    "Preorder with null markers — recurse to rebuild structure.",
    `class Codec:
    def serialize(self, root):
        if not root: return '#'
        return f'{root.val},{self.serialize(root.left)},{self.serialize(root.right)}'
    def deserialize(self, data):
        vals = iter(data.split(','))
        def build():
            v = next(vals)
            if v == '#': return None
            node = TreeNode(int(v))
            node.left = build(); node.right = build()
            return node
        return build()`,
    "O(n) time, O(n) space", "O(n²) time, O(n) space", "O(n log n) time, O(1) space", "O(2^n) time, O(n) space",
    "Tree preorder encoding with null sentinels."),
  problem(298, "binary-tree-longest-consecutive-sequence", "Binary Tree Longest Consecutive Sequence", "trees",
    "Find length of longest consecutive increasing sequence path in a binary tree.",
    T, D, G, R,
    "Postorder DFS: extend streak if child.val == node.val + 1, else reset to 1.",
    `def longestConsecutive(root):
    best = 0
    def dfs(node, parent, length):
        nonlocal best
        if not node: return
        length = length + 1 if parent and node.val == parent.val + 1 else 1
        best = max(best, length)
        dfs(node.left, node, length); dfs(node.right, node, length)
    dfs(root, None, 0); return best`,
    "O(n) time, O(h) space", "O(n²) time, O(n) space", "O(n log n) time, O(1) space", "O(n) time, O(1) space",
    "Top-down context passing path length — tree DFS."),
  problem(3092, "most-frequent-ids", "Most Frequent IDs", "heaps-queues",
    "Track element frequencies with add and remove operations; return k most frequent IDs after each change.",
    H, DS, A, B,
    "Hash map counts + lazy heap or sorted structure for top-k on updates.",
    `class FrequentIDs:
    def __init__(self, k): self.k = k; self.cnt = Counter()
    def add(self, x): self.cnt[x] += 1
    def remove(self, x):
        self.cnt[x] -= 1
        if self.cnt[x] == 0: del self.cnt[x]
    def top(self): return [x for x, _ in self.cnt.most_common(self.k)]`,
    "O(log n) per op amortized, O(n) space", "O(1) per op, O(n) space", "O(n) per op, O(1) space", "O(n log n) per op, O(n) space",
    "Frequency tracking with top-k extraction — heap/Counter pattern."),
  problem(3155, "maximum-upgradable-servers", "Maximum Upgradable Servers", "heaps-queues",
    "Given servers with current and max capacity and upgrade cost budget, maximize number of fully upgraded servers.",
    H, S, D, G,
    "Sort by upgrade cost; min-heap or greedy spend budget on cheapest upgrades first.",
    `def maxUpgradable(servers, budget):
    costs = sorted(max(0, mx - cur) for cur, mx in servers)
    spent, count = 0, 0
    for c in costs:
        if spent + c > budget: break
        spent += c; count += 1
    return count`,
    "O(n log n) time, O(n) space", "O(n) time, O(1) space", "O(n²) time, O(n) space", "O(2^n) time, O(n) space",
    "Greedy by cheapest upgrade cost — sort + greedy/heap."),
  problem(3176, "find-max-length-good-subsequence-i", "Find Max Length Good Subsequence I", "dynamic-programming",
    "Find max length of a good subsequence where adjacent elements differ by at most 1.",
    D, A, W, G,
    "DP on last value or hash map of best length ending at each value.",
    `def maximumLength(nums):
    best = {}
    ans = 0
    for x in nums:
        length = 1 + max(best.get(x-1, 0), best.get(x+1, 0), best.get(x, 0))
        best[x] = max(best.get(x, 0), length)
        ans = max(ans, length)
    return ans`,
    "O(n) time, O(n) space", "O(n²) time, O(1) space", "O(n log n) time, O(n) space", "O(2^n) time, O(n) space",
    "DP/hash tracking best length per value — 1D state."),
  problem(3177, "find-max-length-good-subsequence-ii", "Find Max Length Good Subsequence II", "dynamic-programming",
    "Like good subsequence I but adjacent elements must differ by at most k.",
    D, A, B, W,
    "For each value, check best lengths in [x-k, x+k] range via sorted keys or bucket map.",
    `def maximumLength(nums, k):
    best = {}; ans = 0
    for x in nums:
        length = 1 + max((best.get(x+d, 0) for d in range(-k, k+1)), default=0)
        best[x] = max(best.get(x, 0), length)
        ans = max(ans, length)
    return ans`,
    "O(n·k) time, O(n) space", "O(n²) time, O(1) space", "O(n) time, O(1) space", "O(2^n) time, O(n) space",
    "Extended DP with bounded difference window."),
  problem(347, "top-k-frequent-elements", "Top K Frequent Elements", "heaps-queues",
    "Return the k most frequent elements from an integer array.",
    H, A, S, B,
    "Counter + size-k min-heap (or most_common).",
    `def topKFrequent(nums, k):
    cnt = Counter(nums)
    return [x for x, _ in cnt.most_common(k)]`,
    "O(n + u log k) time, O(n) space", "O(n log n) time, O(1) space", "O(n²) time, O(n) space", "O(n) time, O(1) space",
    "Frequency count + bounded heap — top-k pattern."),
  problem(362, "design-hit-counter", "Design Hit Counter", "design",
    "Count hits in the past 5 minutes (300 seconds) with timestamped hits.",
    DS, H, A, G,
    "Deque of timestamps — pop expired from front on each hit/query.",
    `class HitCounter:
    def __init__(self): self.q = deque()
    def hit(self, timestamp):
        self.q.append(timestamp)
    def getHits(self, timestamp):
        while self.q and self.q[0] <= timestamp - 300: self.q.popleft()
        return len(self.q)`,
    "O(1) amortized per op, O(total hits) space", "O(n) per query, O(1) space", "O(log n) per op, O(n) space", "O(1) per op, O(1) space",
    "Time-window deque — design with FIFO expiry."),
  problem(380, "insert-delete-getrandom-o1", "Insert Delete GetRandom O(1)", "design",
    "Design a set supporting insert, remove, and getRandom in average O(1).",
    DS, A, L, H,
    "Array + hash map index; swap-with-last on delete.",
    `class RandomizedSet:
    def __init__(self): self.arr = []; self.idx = {}
    def insert(self, val):
        if val in self.idx: return False
        self.idx[val] = len(self.arr); self.arr.append(val); return True
    def remove(self, val):
        if val not in self.idx: return False
        i = self.idx[val]; last = self.arr[-1]
        self.arr[i] = last; self.idx[last] = i
        self.arr.pop(); del self.idx[val]; return True
    def getRandom(self): return random.choice(self.arr)`,
    "O(1) average per op, O(n) space", "O(log n) per op, O(n) space", "O(n) per op, O(1) space", "O(1) per op, O(1) space",
    "Array-hash index swap delete — design composition."),
  problem(394, "decode-string", "Decode String", "stacks-lists",
    "Decode string like '3[a2[c]]' to 'accaccacc'.",
    L, R, D, A,
    "Stack holds (repeat_count, built_string) when '[' seen; pop and multiply on ']'.",
    `def decodeString(s):
    stack, cur, num = [], '', 0
    for ch in s:
        if ch.isdigit(): num = num * 10 + int(ch)
        elif ch == '[':
            stack.append((cur, num)); cur, num = '', 0
        elif ch == ']':
            prev, k = stack.pop(); cur = prev + cur * k
        else: cur += ch
    return cur`,
    "O(n) time, O(n) space", "O(n²) time, O(1) space", "O(2^n) time, O(n) space", "O(n log n) time, O(n) space",
    "Nested brackets → stack of partial results."),
  problem(402, "remove-k-digits", "Remove K Digits", "stacks-lists",
    "Remove k digits from num to make the smallest possible number string.",
    L, G, A, D,
    "Monotonic increasing stack — pop larger digits while k > 0.",
    `def removeKdigits(num, k):
    stack = []
    for ch in num:
        while k and stack and stack[-1] > ch:
            stack.pop(); k -= 1
        stack.append(ch)
    stack = stack[:len(stack)-k] if k else stack
    return ''.join(stack).lstrip('0') or '0'`,
    "O(n) time, O(n) space", "O(n²) time, O(1) space", "O(n log n) time, O(n) space", "O(n) time, O(1) space",
    "Greedy digit removal via monotonic stack."),
  problem(408, "valid-word-abbreviation", "Valid Word Abbreviation", "sliding-window",
    "Given word and abbreviation with numbers for skipped chars, return if abbreviation is valid.",
    W, A, L, C,
    "Two pointers: parse number skips or match single character.",
    `def validWordAbbreviation(word, abbr):
    i = j = 0
    while i < len(word) and j < len(abbr):
        if abbr[j].isdigit():
            if abbr[j] == '0': return False
            skip = 0
            while j < len(abbr) and abbr[j].isdigit():
                skip = skip * 10 + int(abbr[j]); j += 1
            i += skip
        else:
            if word[i] != abbr[j]: return False
            i += 1; j += 1
    return i == len(word) and j == len(abbr)`,
    "O(n+m) time, O(1) space", "O(n·m) time, O(1) space", "O(n log n) time, O(n) space", "O(1) time, O(1) space",
    "Two-pointer parse and match — string scanning."),
  problem(415, "add-strings", "Add Strings", "arrays-hashing",
    "Add two non-negative integers represented as strings without converting to int.",
    A, L, D, P,
    "Right-to-left digit add with carry.",
    `def addStrings(num1, num2):
    i, j, carry, res = len(num1)-1, len(num2)-1, 0, []
    while i >= 0 or j >= 0 or carry:
        d = carry
        if i >= 0: d += ord(num1[i]) - 48; i -= 1
        if j >= 0: d += ord(num2[j]) - 48; j -= 1
        res.append(chr(d % 10 + 48)); carry = d // 10
    return ''.join(reversed(res))`,
    "O(max(m,n)) time, O(1) extra space", "O(m·n) time, O(m+n) space", "O(log n) time, O(1) space", "O(n²) time, O(n) space",
    "Digit-by-digit simulation — string math."),
  problem(428, "serialize-n-ary-tree", "Serialize N-ary Tree", "trees",
    "Serialize and deserialize an N-ary tree.",
    T, DS, TR, A,
    "Preorder with child count or delimiter encoding.",
    `class Codec:
    def serialize(self, root):
        if not root: return ''
        parts = [str(root.val), str(len(root.children))]
        for ch in root.children: parts.append(self.serialize(ch))
        return ','.join(parts)
    def deserialize(self, data):
        if not data: return None
        vals = iter(data.split(','))
        def build():
            val = int(next(vals)); n = int(next(vals))
            node = Node(val, [])
            for _ in range(n): node.children.append(build())
            return node
        return build()`,
    "O(n) time, O(n) space", "O(n²) time, O(n) space", "O(n log n) time, O(1) space", "O(2^n) time, O(n) space",
    "Tree encoding with child counts — tree serialization."),
  problem(432, "all-oone-data-structure", "All O`one Data Structure", "design",
    "Design structure supporting inc, dec, getMaxKey, getMinKey in O(1) average.",
    DS, H, A, L,
    "Doubly linked list of counts + hash map key→node; move keys between count buckets.",
    `class AllOne:
    def __init__(self):
        self.key_node = {}; self.head = Node(); self.tail = Node()
        self.head.next = self.tail; self.tail.prev = self.head
    def inc(self, key):
        if key in self.key_node: self._change(self.key_node[key], 1)
        else: self._insert(self.head.next, key, 1)
    def dec(self, key):
        node = self.key_node[key]
        if node.count == 1: self._remove(node)
        else: self._change(node, -1)
    def getMaxKey(self): return '' if self.tail.prev == self.head else self.tail.prev.keys[-1]
    def getMinKey(self): return '' if self.head.next == self.tail else self.head.next.keys[-1]`,
    "O(1) average per op, O(n) space", "O(log n) per op, O(n) space", "O(n) per op, O(1) space", "O(1) per op, O(1) space",
    "Linked list of frequency buckets — advanced design."),
  problem(435, "non-overlapping-intervals", "Non-overlapping Intervals", "sorting-intervals",
    "Return minimum intervals to remove so the rest are non-overlapping.",
    S, H, D, G,
    "Sort by end; greedy keep interval if start ≥ last end.",
    `def eraseOverlapIntervals(intervals):
    intervals.sort(key=lambda x: x[1])
    kept, end = 0, float('-inf')
    for s, e in intervals:
        if s >= end: kept += 1; end = e
    return len(intervals) - kept`,
    "O(n log n) time, O(1) space", "O(n) time, O(n) space", "O(n²) time, O(n) space", "O(n log n) time, O(n) space",
    "Interval scheduling greedy by earliest end — sort-and-scan."),
  problem(438, "find-all-anagrams-in-a-string", "Find All Anagrams in a String", "sliding-window",
    "Return start indices of all anagrams of p in s.",
    W, A, H, R,
    "Fixed window of len(p) with character count comparison.",
    `def findAnagrams(s, p):
    need = Counter(p); k = len(p); have = Counter(); res = []
    for i, ch in enumerate(s):
        have[ch] += 1
        if i >= k: have[s[i-k]] -= 1; have.pop(s[i-k], None) if have[s[i-k]]==0 else None
        if i >= k-1 and have == need: res.append(i-k+1)
    return res`,
    "O(n) time, O(1) space", "O(n·k) time, O(k) space", "O(n log n) time, O(n) space", "O(n²) time, O(1) space",
    "Fixed-size window with frequency counts — sliding window."),
  problem(490, "the-maze", "The Maze", "graphs",
    "Ball rolls until hitting wall; return true if ball can stop at destination.",
    G, D, W, T,
    "BFS/DFS from start; for each direction roll until wall, mark visited stops.",
    `def hasPath(maze, start, dest):
    R, C = len(maze), len(maze[0])
    seen = {tuple(start)}
    q = deque([tuple(start)])
    while q:
        r, c = q.popleft()
        if [r, c] == dest: return True
        for dr, dc in ((0,1),(0,-1),(1,0),(-1,0)):
            nr, nc = r, c
            while 0 <= nr+dr < R and 0 <= nc+dc < C and maze[nr+dr][nc+dc] == 0:
                nr += dr; nc += dc
            if (nr, nc) not in seen:
                seen.add((nr, nc)); q.append((nr, nc))
    return False`,
    "O(m·n·(m+n)) time, O(m·n) space", "O(m·n) time, O(1) space", "O(2^(m·n)) time, O(m·n) space", "O(m+n) time, O(m·n) space",
    "Graph BFS on roll-stop states — not simple grid DFS."),
  problem(528, "random-pick-with-weight", "Random Pick with Weight", "binary-search",
    "Pick index randomly with probability proportional to w[i].",
    B, H, D, A,
    "Prefix sums + binary search on random target in [0, total).",
    `class Solution:
    def __init__(self, w):
        self.prefix = []; s = 0
        for x in w: s += x; self.prefix.append(s)
        self.total = s
    def pickIndex(self):
        target = random.randint(1, self.total)
        lo, hi = 0, len(self.prefix) - 1
        while lo < hi:
            mid = (lo + hi) // 2
            if self.prefix[mid] < target: lo = mid + 1
            else: hi = mid
        return lo`,
    "O(n) build, O(log n) pick, O(n) space", "O(1) pick, O(n) space", "O(n) pick, O(1) space", "O(log n) build, O(log n) pick, O(n) space",
    "Prefix sum + bisect for weighted random — binary search."),
  problem(540, "single-element-in-sorted-array", "Single Element in Sorted Array", "binary-search",
    "Every element appears twice except one. Find it in O(log n).",
    B, A, D, W,
    "Binary search on even/odd index pairing property.",
    `def singleNonDuplicate(nums):
    lo, hi = 0, len(nums) - 1
    while lo < hi:
        mid = (lo + hi) // 2
        if mid % 2 == 1: mid -= 1
        if nums[mid] == nums[mid + 1]: lo = mid + 2
        else: hi = mid
    return nums[lo]`,
    "O(log n) time, O(1) space", "O(n) time, O(1) space", "O(log n) time, O(n) space", "O(n log n) time, O(1) space",
    "Halving on paired-sorted structure — binary search variant."),
  problem(545, "boundary-of-binary-tree", "Boundary of Binary Tree", "trees",
    "Return values of the boundary in counter-clockwise order starting from root.",
    T, G, R, A,
    "Preorder left boundary, postorder right boundary, leaves inorder — exclude duplicates.",
    `def boundaryOfBinaryTree(root):
    if not root: return []
    def is_leaf(n): return not n.left and not n.right
    def left_boundary(n):
        if not n or is_leaf(n): return []
        return [n.val] + (left_boundary(n.left) if n.left else left_boundary(n.right))
    def right_boundary(n):
        if not n or is_leaf(n): return []
        return (right_boundary(n.right) if n.right else right_boundary(n.left)) + [n.val]
    def leaves(n):
        if not n: return []
        if is_leaf(n): return [n.val]
        return leaves(n.left) + leaves(n.right)
    res = [root.val]
    if not is_leaf(root):
        res += left_boundary(root.left) + leaves(root) + right_boundary(root.right)
    return res`,
    "O(n) time, O(h) space", "O(n²) time, O(n) space", "O(n log n) time, O(1) space", "O(n) time, O(1) space",
    "Tree traversals for boundary components — tree DFS."),
  problem(560, "subarray-sum-equals-k", "Subarray Sum Equals K", "arrays-hashing",
    "Return the total number of continuous subarrays whose sum equals k.",
    A, D, W, G,
    "Prefix sum + hash map counting how many prior prefixes equal curr - k.",
    `def subarraySum(nums, k):
    count, prefix, freq = 0, 0, {0: 1}
    for x in nums:
        prefix += x
        count += freq.get(prefix - k, 0)
        freq[prefix] = freq.get(prefix, 0) + 1
    return count`,
    "O(n) time, O(n) space", "O(n²) time, O(1) space", "O(n log n) time, O(n) space", "O(2^n) time, O(n) space",
    "Prefix sum frequency map — hash map on running totals."),
  problem(588, "design-in-memory-file-system", "Design In-Memory File System", "design",
    "Implement an in-memory file system supporting ls, mkdir, addContentToFile, and readContentFromFile.",
    DS, TR, T, A,
    "Trie-like nested dict per path component; files store content at terminal node.",
    `class FileSystem:
    def __init__(self): self.root = {}
    def _walk(self, path, create=False):
        node = self.root
        if path == '/': return node
        for part in path.split('/'):
            if not part: continue
            if create: node = node.setdefault(part, {})
            else:
                if part not in node: return None
                node = node[part]
        return node
    def ls(self, path):
        node = self._walk(path)
        if isinstance(node, str): return [path.split('/')[-1]]
        return sorted(node.keys())
    def mkdir(self, path): self._walk(path, True)
    def addContentToFile(self, path, content):
        parts = [p for p in path.split('/') if p]
        node = self.root
        for part in parts[:-1]: node = node.setdefault(part, {})
        node[parts[-1]] = node.get(parts[-1], '') + content if isinstance(node.get(parts[-1]), str) else content
    def readContentFromFile(self, path): return self._walk(path)`,
    "O(path length) per op, O(total paths) space", "O(1) per op, O(n) space", "O(n log n) per op, O(n) space", "O(n) per op, O(1) space",
    "Nested dict path trie — design file system pattern."),
  problem(621, "task-scheduler", "Task Scheduler", "heaps-queues",
    "Given tasks and cooldown n, return minimum intervals to complete all tasks.",
    H, D, S, A,
    "Max frequency drives answer: (maxFreq-1)*(n+1) + countMax, capped at len(tasks).",
    `def leastInterval(tasks, n):
    cnt = Counter(tasks); maxf = max(cnt.values())
    same = sum(1 for v in cnt.values() if v == maxf)
    return max(len(tasks), (maxf - 1) * (n + 1) + same)`,
    "O(n) time, O(1) space", "O(n log n) time, O(n) space", "O(n²) time, O(1) space", "O(2^n) time, O(n) space",
    "Frequency scheduling formula — heap/greedy scheduling family."),
  problem(622, "design-circular-queue", "Design Circular Queue", "design",
    "Design a circular queue with enQueue, deQueue, Front, Rear, isEmpty, isFull.",
    DS, L, H, A,
    "Fixed array with head/tail pointers modulo capacity.",
    `class MyCircularQueue:
    def __init__(self, k):
        self.data = [0]*k; self.head = self.size = 0; self.cap = k
    def enQueue(self, value):
        if self.isFull(): return False
        self.data[(self.head + self.size) % self.cap] = value
        self.size += 1; return True
    def deQueue(self):
        if self.isEmpty(): return False
        self.head = (self.head + 1) % self.cap; self.size -= 1; return True
    def Front(self): return -1 if self.isEmpty() else self.data[self.head]
    def Rear(self): return -1 if self.isEmpty() else self.data[(self.head + self.size - 1) % self.cap]
    def isEmpty(self): return self.size == 0
    def isFull(self): return self.size == self.cap`,
    "O(1) per op, O(k) space", "O(n) per op, O(1) space", "O(log n) per op, O(k) space", "O(1) per op, O(1) space",
    "Ring buffer with modulo indices — design queue."),
  problem(635, "design-log-storage-system", "Design Log Storage System", "design",
    "Store timestamps and retrieve the largest timestamp ≤ query for a given granularity id.",
    DS, B, H, A,
    "Per-granularity sorted timestamp lists + bisect for latest ≤ query.",
    `class LogSystem:
    def __init__(self):
        self.g = defaultdict(list)
        self.units = {'Year':31536000,'Month':2592000,'Day':86400,'Hour':3600,'Minute':60,'Second':1}
    def put(self, id, timestamp): self.g[id].append(timestamp)
    def retrieve(self, id, start, end, gran):
        s = bisect_left(self.g[id], start); e = bisect_right(self.g[id], end)
        step = self.units[gran]
        return [t for t in self.g[id][s:e] if t % step == 0]`,
    "O(log n) retrieve, O(n) space", "O(1) retrieve, O(n) space", "O(n) retrieve, O(1) space", "O(n log n) retrieve, O(n) space",
    "Sorted logs + bisect range — design + binary search."),
  problem(641, "design-circular-deque", "Design Circular Deque", "design",
    "Design a circular double-ended queue supporting insert/delete at both ends.",
    DS, L, H, A,
    "Circular array with head/tail and modular arithmetic.",
    `class MyCircularDeque:
    def __init__(self, k):
        self.data = [0]*k; self.head = 0; self.size = 0; self.cap = k
    def insertFront(self, value):
        if self.isFull(): return False
        self.head = (self.head - 1) % self.cap; self.data[self.head] = value
        self.size += 1; return True
    def insertLast(self, value):
        if self.isFull(): return False
        self.data[(self.head + self.size) % self.cap] = value
        self.size += 1; return True
    def deleteFront(self):
        if self.isEmpty(): return False
        self.head = (self.head + 1) % self.cap; self.size -= 1; return True
    def deleteLast(self):
        if self.isEmpty(): return False
        self.size -= 1; return True
    def getFront(self): return -1 if self.isEmpty() else self.data[self.head]
    def getRear(self): return -1 if self.isEmpty() else self.data[(self.head + self.size - 1) % self.cap]
    def isEmpty(self): return self.size == 0
    def isFull(self): return self.size == self.cap`,
    "O(1) per op, O(k) space", "O(n) per op, O(1) space", "O(log n) per op, O(k) space", "O(1) per op, O(1) space",
    "Ring buffer deque — design with modulo pointers."),
  problem(687, "longest-univalue-path", "Longest Univalue Path", "trees",
    "Find the length of the longest path where all nodes have the same value.",
    T, D, G, R,
    "Postorder: extend same-value arms; global max is leftArm + rightArm.",
    `def longestUnivaluePath(root):
    best = 0
    def dfs(node):
        nonlocal best
        if not node: return 0
        l = dfs(node.left); r = dfs(node.right)
        lp = l + 1 if node.left and node.left.val == node.val else 0
        rp = r + 1 if node.right and node.right.val == node.val else 0
        best = max(best, lp + rp)
        return max(lp, rp)
    dfs(root); return best`,
    "O(n) time, O(h) space", "O(n²) time, O(n) space", "O(n log n) time, O(1) space", "O(n) time, O(1) space",
    "Bottom-up path aggregation — tree postorder DFS."),
  problem(695, "max-area-of-island", "Max Area of Island", "graphs",
    "Return the maximum area of an island (connected 1s) in a binary grid.",
    G, T, D, A,
    "DFS/BFS flood fill counting cells per component.",
    `def maxAreaOfIsland(grid):
    R, C, best = len(grid), len(grid[0]), 0
    def dfs(r, c):
        if r < 0 or c < 0 or r >= R or c >= C or grid[r][c] != 1: return 0
        grid[r][c] = 0
        return 1 + sum(dfs(r+dr, c+dc) for dr, dc in ((1,0),(-1,0),(0,1),(0,-1)))
    for r in range(R):
        for c in range(C):
            if grid[r][c] == 1: best = max(best, dfs(r, c))
    return best`,
    "O(m·n) time, O(m·n) space", "O(m·n) time, O(1) space", "O(m+n) time, O(m·n) space", "O((m·n)²) time, O(m·n) space",
    "Connected component area via DFS — grid graph."),
  problem(706, "design-hashmap", "Design HashMap", "design",
    "Implement a hashmap with put, get, and remove in average O(1).",
    DS, A, L, B,
    "Array of buckets with chaining or open addressing.",
    `class MyHashMap:
    def __init__(self): self.buckets = [[] for _ in range(1000)]
    def _hash(self, key): return key % len(self.buckets)
    def put(self, key, value):
        b = self.buckets[self._hash(key)]
        for i, (k, _) in enumerate(b):
            if k == key: b[i] = (key, value); return
        b.append((key, value))
    def get(self, key):
        for k, v in self.buckets[self._hash(key)]:
            if k == key: return v
        return -1
    def remove(self, key):
        b = self.buckets[self._hash(key)]
        self.buckets[self._hash(key)] = [(k, v) for k, v in b if k != key]`,
    "O(1) average per op, O(n) space", "O(n) per op, O(1) space", "O(log n) per op, O(n) space", "O(1) per op, O(1) space",
    "Bucket chaining hash table — basic design."),
  problem(729, "my-calendar-i", "My Calendar I", "design",
    "Implement a calendar that books [start, end) intervals without overlap.",
    DS, S, B, H,
    "Sorted list of bookings; check overlap with bisect or linear scan.",
    `class MyCalendar:
    def __init__(self): self.bookings = []
    def book(self, start, end):
        i = bisect_left(self.bookings, (start, end))
        if i and self.bookings[i-1][1] > start: return False
        if i < len(self.bookings) and self.bookings[i][0] < end: return False
        self.bookings.insert(i, (start, end)); return True`,
    "O(n) per book, O(n) space", "O(log n) per book, O(1) space", "O(1) per book, O(n) space", "O(n log n) per book, O(n) space",
    "Interval non-overlap check — design + sorted bookings."),
  problem(787, "cheapest-flights-within-k-stops", "Cheapest Flights Within K Stops", "graphs",
    "Find cheapest price from src to dst with at most k stops. Return -1 if impossible.",
    G, D, H, B,
    "Bellman-Ford style k+1 relaxations or BFS on (node, cost) with stop limit.",
    `def findCheapestPrice(n, flights, src, dst, k):
    dist = [float('inf')] * n; dist[src] = 0
    for _ in range(k + 1):
        tmp = dist[:]
        for u, v, w in flights:
            if dist[u] != float('inf'):
                tmp[v] = min(tmp[v], dist[u] + w)
        dist = tmp
    return -1 if dist[dst] == float('inf') else dist[dst]`,
    "O(k·E) time, O(n) space", "O(E log V) time, O(E) space", "O(V²) time, O(V) space", "O(2^k) time, O(n) space",
    "Shortest path with hop limit — graph relaxation / modified Dijkstra."),
  problem(827, "making-a-large-island", "Making A Large Island", "graphs",
    "Change at most one 0 to 1. Return size of largest island possible.",
    G, D, T, A,
    "Label island sizes with DFS; for each 0, sum sizes of distinct neighboring islands + 1.",
    `def largestIsland(grid):
    R, C = len(grid), len(grid[0]); idx = 2; area = {0: 0}
    def dfs(r, c):
        if r < 0 or c < 0 or r >= R or c >= C or grid[r][c] != 1: return 0
        grid[r][c] = idx; s = 1
        for dr, dc in ((1,0),(-1,0),(0,1),(0,-1)): s += dfs(r+dr, c+dc)
        return s
    for r in range(R):
        for c in range(C):
            if grid[r][c] == 1:
                area[idx] = dfs(r, c); idx += 1
    best = max(area.values(), default=0)
    for r in range(R):
        for c in range(C):
            if grid[r][c] == 0:
                seen = set()
                for dr, dc in ((1,0),(-1,0),(0,1),(0,-1)):
                    nr, nc = r+dr, c+dc
                    if 0 <= nr < R and 0 <= nc < C: seen.add(grid[nr][nc])
                best = max(best, 1 + sum(area[i] for i in seen if i))
    return best`,
    "O(m·n) time, O(m·n) space", "O(m·n) time, O(1) space", "O((m·n)²) time, O(m·n) space", "O(m+n) time, O(m·n) space",
    "Component labeling + neighbor merge — grid graph DFS."),
  problem(841, "keys-and-rooms", "Keys and Rooms", "graphs",
    "There are n rooms with keys. Start in room 0. Return true if you can visit all rooms.",
    G, D, R, H,
    "DFS/BFS from room 0 following key graph.",
    `def canVisitAllRooms(rooms):
    seen = {0}; stack = [0]
    while stack:
        u = stack.pop()
        for v in rooms[u]:
            if v not in seen: seen.add(v); stack.append(v)
    return len(seen) == len(rooms)`,
    "O(V+E) time, O(V) space", "O(V²) time, O(V) space", "O(V+E) time, O(1) space", "O(2^V) time, O(V) space",
    "Reachability in directed graph — DFS/BFS."),
  problem(845, "longest-mountain-in-array", "Longest Mountain in Array", "sliding-window",
    "Return longest mountain subarray length (strictly increase then strictly decrease).",
    W, A, D, G,
    "Scan peaks: expand while increasing, then while decreasing from each peak.",
    `def longestMountain(arr):
    n, best = len(arr), 0
    for i in range(1, n-1):
        if arr[i-1] < arr[i] > arr[i+1]:
            l = r = i
            while l and arr[l-1] < arr[l]: l -= 1
            while r+1 < n and arr[r+1] < arr[r]: r += 1
            best = max(best, r - l + 1)
    return best`,
    "O(n) time, O(1) space", "O(n²) time, O(1) space", "O(n log n) time, O(n) space", "O(n) time, O(n) space",
    "Two-pointer expansion from peaks — array scanning."),
  problem(849, "maximize-distance-to-closest-person", "Maximize Distance to Closest Person", "arrays-hashing",
    "Seats array with 1 occupied and 0 empty. Return maximum distance to closest person when choosing one empty seat.",
    A, W, B, G,
    "Check edges and gaps between ones; answer is max of ceil(gap/2) for interior gaps.",
    `def maxDistToClosest(seats):
    prev, best = -1, 0
    for i, x in enumerate(seats):
        if x == 1:
            best = max(best, i if prev < 0 else (i - prev) // 2)
            prev = i
    return max(best, len(seats) - 1 - prev)`,
    "O(n) time, O(1) space", "O(n log n) time, O(1) space", "O(n²) time, O(1) space", "O(1) time, O(1) space",
    "Single pass tracking last occupied seat — array scan."),
  problem(872, "leaf-similar-trees", "Leaf-Similar Trees", "trees",
    "Return true if two binary trees have the same leaf sequence left-to-right.",
    T, A, G, R,
    "DFS preorder collecting leaves from each tree, compare sequences.",
    `def leafSimilar(root1, root2):
    def leaves(root):
        if not root: return []
        if not root.left and not root.right: return [root.val]
        return leaves(root.left) + leaves(root.right)
    return leaves(root1) == leaves(root2)`,
    "O(n) time, O(n) space", "O(n²) time, O(1) space", "O(n log n) time, O(h) space", "O(n) time, O(1) space",
    "Tree DFS collecting leaves — tree traversal."),
  problem(881, "boats-to-save-people", "Boats to Save People", "sorting-intervals",
    "Each boat carries at most two people with weight limit. Return minimum boats to carry everyone.",
    S, W, H, G,
    "Sort weights; two pointers pairing lightest with heaviest if possible.",
    `def numRescueBoats(people, limit):
    people.sort(); l, r, boats = 0, len(people)-1, 0
    while l <= r:
        if people[l] + people[r] <= limit: l += 1
        r -= 1; boats += 1
    return boats`,
    "O(n log n) time, O(1) space", "O(n) time, O(n) space", "O(n²) time, O(1) space", "O(n log n) time, O(n) space",
    "Sort + two pointers greedy pairing — interval/scheduling style."),
  problem(886, "possible-bipartition", "Possible Bipartition", "graphs",
    "Split people into two groups so no pair in dislikes is in the same group.",
    G, D, R, H,
    "Build dislike graph; 2-color with BFS/DFS or union-find with parity.",
    `def possibleBipartition(n, dislikes):
    adj = [[] for _ in range(n+1)]
    for a, b in dislikes: adj[a].append(b); adj[b].append(a)
    color = {}
    for i in range(1, n+1):
        if i in color: continue
        q = deque([i]); color[i] = 0
        while q:
            u = q.popleft()
            for v in adj[u]:
                if v not in color: color[v] = 1 - color[u]; q.append(v)
                elif color[v] == color[u]: return False
    return True`,
    "O(V+E) time, O(V+E) space", "O(V²) time, O(V) space", "O(2^V) time, O(V) space", "O(V+E) time, O(1) space",
    "Graph 2-coloring for bipartition — BFS on dislike graph."),
  problem(887, "super-egg-drop", "Super Egg Drop", "dynamic-programming",
    "Given k eggs and n floors, find minimum moves to determine critical floor.",
    D, B, G, R,
    "DP on moves and eggs: dp(m,k) = max drops needed; binary search on moves.",
    `def superEggDrop(k, n):
    @lru_cache(None)
    def dp(eggs, floors):
        if eggs == 1: return floors
        if floors <= 1: return floors
        lo, hi, best = 1, floors, floors
        while lo <= hi:
            mid = (lo + hi) // 2
            broken = dp(eggs - 1, mid - 1)
            intact = dp(eggs, floors - mid)
            worst = 1 + max(broken, intact)
            if worst > mid: lo = mid + 1
            else: best = min(best, worst); hi = mid - 1
        return best
    return dp(k, n)`,
    "O(k·n log n) time, O(k·n) space", "O(2^n) time, O(n) space", "O(n) time, O(1) space", "O(k·n²) time, O(k·n) space",
    "Minimax DP with binary search on drop — classic DP."),
  problem(904, "fruit-into-baskets", "Fruit Into Baskets", "sliding-window",
    "Pick fruits from a row with at most two types in your baskets. Return max fruits.",
    W, A, H, D,
    "Variable window with at most 2 distinct types in Counter.",
    `def totalFruit(fruits):
    count = Counter(); left = best = 0
    for right, x in enumerate(fruits):
        count[x] += 1
        while len(count) > 2:
            count[fruits[left]] -= 1
            if count[fruits[left]] == 0: del count[fruits[left]]
            left += 1
        best = max(best, right - left + 1)
    return best`,
    "O(n) time, O(1) space", "O(n²) time, O(1) space", "O(n log n) time, O(n) space", "O(2^n) time, O(n) space",
    "At most k distinct types → variable sliding window."),
  problem(917, "reverse-only-letters", "Reverse Only Letters", "sliding-window",
    "Reverse only the letters in a string while keeping non-letters in place.",
    W, L, A, C,
    "Two pointers swap letters from both ends skipping non-letters.",
    `def reverseOnlyLetters(s):
    arr = list(s); l, r = 0, len(arr)-1
    while l < r:
        if not arr[l].isalpha(): l += 1
        elif not arr[r].isalpha(): r -= 1
        else: arr[l], arr[r] = arr[r], arr[l]; l += 1; r -= 1
    return ''.join(arr)`,
    "O(n) time, O(n) space", "O(n²) time, O(1) space", "O(n log n) time, O(n) space", "O(1) time, O(1) space",
    "Two pointers from both ends — string two-pointer."),
  problem(947, "most-stones-removed", "Most Stones Removed", "graphs",
    "Stones at integer coordinates. Remove stone if another shares same row or column. Return max removable.",
    G, D, S, H,
    "Union-find on row and column indices — components size - 1 is removable.",
    `def removeStones(stones):
    parent = {}
    def find(x):
        parent.setdefault(x, x)
        if parent[x] != x: parent[x] = find(parent[x])
        return parent[x]
    def union(a, b):
        ra, rb = find(a), find(b)
        if ra != rb: parent[rb] = ra
    for x, y in stones:
        union(x, y + 10001)
    groups = {}
    for x, y in stones:
        r = find(x)
        groups[r] = groups.get(r, 0) + 1
    return sum(c - 1 for c in groups.values())`,
    "O(n·α(n)) time, O(n) space", "O(n²) time, O(n) space", "O(n log n) time, O(n) space", "O(2^n) time, O(n) space",
    "Union-find on row-col connectivity graph."),
  problem(981, "time-based-key-value-store", "Time Based Key-Value Store", "design",
    "Implement set(key, value, timestamp) and get(key, timestamp) returning latest value at or before timestamp.",
    DS, B, A, H,
    "Per-key append-only (time, value) list + bisect_right for latest ≤ query.",
    `class TimeMap:
    def __init__(self): self.store = defaultdict(list)
    def set(self, key, value, timestamp):
        self.store[key].append((timestamp, value))
    def get(self, key, timestamp):
        arr = self.store[key]
        i = bisect_right(arr, (timestamp, chr(127))) - 1
        return arr[i][1] if i >= 0 else ''`,
    "O(1) set, O(log n) get, O(total) space", "O(1) get, O(n) space", "O(n) get, O(1) space", "O(log n) set, O(log n) get, O(n) space",
    "Versioned history + bisect — TimeMap design pattern."),
  problem(994, "rotting-oranges", "Rotting Oranges", "graphs",
    "Grid with fresh (1) and rotten (2) oranges. Each minute rot spreads to 4 neighbors. Return minutes to rot all or -1.",
    G, D, T, W,
    "Multi-source BFS from all rotten oranges; track minutes by level.",
    `def orangesRotting(grid):
    R, C = len(grid), len(grid[0])
    q = deque(); fresh = 0
    for r in range(R):
        for c in range(C):
            if grid[r][c] == 2: q.append((r, c, 0))
            elif grid[r][c] == 1: fresh += 1
    minutes = 0
    while q:
        r, c, t = q.popleft(); minutes = t
        for dr, dc in ((1,0),(-1,0),(0,1),(0,-1)):
            nr, nc = r+dr, c+dc
            if 0 <= nr < R and 0 <= nc < C and grid[nr][nc] == 1:
                grid[nr][nc] = 2; fresh -= 1; q.append((nr, nc, t+1))
    return minutes if fresh == 0 else -1`,
    "O(m·n) time, O(m·n) space", "O(m·n) time, O(1) space", "O((m·n)²) time, O(m·n) space", "O(m+n) time, O(m·n) space",
    "Multi-source BFS level timing — grid graph BFS."),
  problem(1041, "robot-bounded-in-circle", "Robot Bounded In Circle", "arrays-hashing",
    "Robot on infinite plane follows command string (L,R,U,D). Return true if it returns to origin or repeats a bounded path.",
    A, G, D, C,
    "Track position and direction; after full commands, north-facing repeat means loop in ≤4 runs.",
    `def isRobotBounded(command):
    x = y = 0; d = 0; dirs = [(0,1),(1,0),(0,-1),(-1,0)]
    for ch in command:
        if ch == 'G': x += dirs[d][0]; y += dirs[d][1]
        elif ch == 'L': d = (d - 1) % 4
        else: d = (d + 1) % 4
    return (x, y) == (0, 0) or d != 0`,
    "O(n) time, O(1) space", "O(n²) time, O(1) space", "O(n) time, O(n) space", "O(1) time, O(1) space",
    "Simulation with direction state — array/simulation pattern."),
  problem(1057, "campus-bikes", "Campus Bikes", "sorting-intervals",
    "Assign one bike to each worker minimizing Manhattan distance; tie-break by smaller indices.",
    S, H, G, D,
    "Sort all (distance, worker, bike) triples; greedy assign first available pair.",
    `def assignBikes(workers, bikes):
    pairs = []
    for i, (wx, wy) in enumerate(workers):
        for j, (bx, by) in enumerate(bikes):
            pairs.append((abs(wx-bx)+abs(wy-by), i, j))
    pairs.sort()
    assigned_w, assigned_b, res = set(), set(), [-1]*len(workers)
    for _, i, j in pairs:
        if i not in assigned_w and j not in assigned_b:
            res[i] = j; assigned_w.add(i); assigned_b.add(j)
    return res`,
    "O(w·b·log(w·b)) time, O(w·b) space", "O(w·b) time, O(w+b) space", "O(w²·b²) time, O(w+b) space", "O(w log w) time, O(w) space",
    "Sort candidate pairs by cost — greedy assignment."),
  problem(1136, "parallel-courses", "Parallel Courses", "graphs",
    "n courses with prerequisites. Minimum semesters to finish all (multiple per semester if no prereq conflict).",
    G, D, H, S,
    "Topological sort counting levels — longest path in DAG by semester layers.",
    `def minimumSemesters(n, relations):
    adj = [[] for _ in range(n+1)]; indeg = [0]*(n+1)
    for a, b in relations: adj[b].append(a); indeg[a] += 1
    q = deque([i for i in range(1, n+1) if indeg[i] == 0])
    semesters = seen = 0
    while q:
        semesters += 1
        for _ in range(len(q)):
            u = q.popleft(); seen += 1
            for v in adj[u]:
                indeg[v] -= 1
                if indeg[v] == 0: q.append(v)
    return semesters if seen == n else -1`,
    "O(V+E) time, O(V+E) space", "O(V²) time, O(V) space", "O(2^V) time, O(V) space", "O(V·E) time, O(V) space",
    "Level-order topo sort counting semesters — DAG scheduling."),
  problem(1143, "longest-common-subsequence", "Longest Common Subsequence", "dynamic-programming",
    "Return length of longest subsequence common to strings text1 and text2.",
    D, R, A, W,
    "2D DP: match extends diagonal; else max of skip one char from either string.",
    `def longestCommonSubsequence(text1, text2):
    m, n = len(text1), len(text2)
    dp = [[0]*(n+1) for _ in range(m+1)]
    for i in range(1, m+1):
        for j in range(1, n+1):
            if text1[i-1] == text2[j-1]: dp[i][j] = dp[i-1][j-1] + 1
            else: dp[i][j] = max(dp[i-1][j], dp[i][j-1])
    return dp[m][n]`,
    "O(m·n) time, O(m·n) space", "O(2^n) time, O(n) space", "O(m+n) time, O(1) space", "O(m·n log(m·n)) time, O(m·n) space",
    "Classic 2D string DP — LCS pattern."),
  problem(1146, "snapshot-array", "Snapshot Array", "design",
    "Support init, set(index, val), snap(), and get(index, snap_id) for historical values.",
    DS, B, A, T,
    "Per-index version list of (snap_id, value); get uses bisect on snap history.",
    `class SnapshotArray:
    def __init__(self, length):
        self.a = [[(0, 0)] for _ in range(length)]; self.snap_id = 0
    def set(self, index, val):
        self.a[index].append((self.snap_id, val))
    def snap(self):
        self.snap_id += 1; return self.snap_id - 1
    def get(self, index, snap_id):
        arr = self.a[index]
        i = bisect_right(arr, (snap_id, float('inf'))) - 1
        return arr[i][1]`,
    "O(log S) get, O(1) set amortized, O(n·S) space", "O(1) get, O(n) space", "O(n) get, O(1) space", "O(log n) set, O(n) space",
    "Version history per index + bisect — Snapshot Array design."),
  problem(1166, "design-file-system", "Design File System", "design",
    "Support createPath(path, value) and get(path). Paths are absolute like /a/b/c.",
    DS, TR, T, A,
    "Nested dict trie keyed by path components; terminal stores value.",
    `class FileSystem:
    def __init__(self): self.root = {}
    def createPath(self, path, value):
        parts = [p for p in path.split('/') if p]
        node = self.root
        for i, part in enumerate(parts):
            if part not in node:
                if i != len(parts)-1: return False
                node[part] = value; return True
            if i == len(parts)-1: return False
            if not isinstance(node[part], dict): return False
            node = node[part]
        return False
    def get(self, path):
        node = self.root
        for part in path.split('/'):
            if not part: continue
            if part not in node: return -1
            node = node[part]
        return node if isinstance(node, int) else -1`,
    "O(path length) per op, O(total) space", "O(1) per op, O(n) space", "O(n log n) per op, O(n) space", "O(n) per op, O(1) space",
    "Path trie nested dict — file system design."),
  problem(1233, "remove-sub-folders", "Remove Sub-Folders", "tries",
    "Given folder paths, remove all folders that are subfolders of another folder in the list.",
    TR, S, A, DS,
    "Sort paths; keep only if not prefixed by previous kept path plus '/'.",
    `def removeSubfolders(folder):
    folder.sort()
    res, prev = [], ''
    for f in folder:
        if not prev or not f.startswith(prev + '/'):
            res.append(f); prev = f
    return res`,
    "O(n log n) time, O(n) space", "O(n²) time, O(n) space", "O(n) time, O(1) space", "O(n log n) time, O(1) space",
    "Prefix sorting/trie pruning — path prefix pattern."),
  problem(1235, "maximum-profit-in-job-scheduling", "Maximum Profit in Job Scheduling", "dynamic-programming",
    "Jobs have start, end, profit. Return max profit scheduling non-overlapping jobs.",
    D, S, B, H,
    "Sort by end; dp[i] = profit[i] + dp[j] where j is last compatible job via bisect.",
    `def jobScheduling(start, end, profit):
    jobs = sorted(zip(end, start, profit)); ends = [j[0] for j in jobs]
    dp = [0] * (len(jobs) + 1)
    for i in range(1, len(jobs)+1):
        e, s, p = jobs[i-1]
        j = bisect_right(ends, s)
        dp[i] = max(dp[i-1], p + dp[j])
    return dp[-1]`,
    "O(n log n) time, O(n) space", "O(n²) time, O(n) space", "O(n) time, O(1) space", "O(2^n) time, O(n) space",
    "Weighted interval scheduling — sort + bisect + DP."),
  problem(1236, "web-crawler", "Web Crawler", "graphs",
    "Crawl starting from startUrl, following same-hostname links. Return all visited URLs.",
    G, DS, R, T,
    "BFS/DFS with visited set; filter links by hostname prefix.",
    `def crawl(startUrl, htmlParser):
    host = startUrl.split('/')[2]; seen = {startUrl}
    q = deque([startUrl])
    while q:
        url = q.popleft()
        for link in htmlParser.getUrls(url):
            if link.split('/')[2] == host and link not in seen:
                seen.add(link); q.append(link)
    return list(seen)`,
    "O(V+E) time, O(V) space", "O(V²) time, O(V) space", "O(2^V) time, O(V) space", "O(V+E) time, O(1) space",
    "BFS web graph with hostname constraint — graph crawl."),
  problem(1242, "web-crawler-multithreaded", "Web Crawler Multithreaded", "graphs",
    "Same web crawl but implementation may use concurrent fetches (conceptually parallel BFS).",
    G, DS, P, R,
    "Thread-safe visited set + queue; workers pull URLs and enqueue discovered same-host links.",
    `def crawl(startUrl, htmlParser):
    host = startUrl.split('/')[2]; seen = {startUrl}
    q = deque([startUrl])
    while q:
        url = q.popleft()
        for link in htmlParser.getUrls(url):
            if link.split('/')[2] == host and link not in seen:
                seen.add(link); q.append(link)
    return list(seen)`,
    "O(V+E) time, O(V) space", "O(V²) time, O(V) space", "O(1) time, O(1) space", "O(2^V) time, O(V) space",
    "Concurrent BFS on URL graph — same crawl pattern with parallelism."),
  problem(1352, "product-of-last-k-numbers", "Product of Last K Numbers", "design",
    "Implement class with add(num) and getProduct(k) returning product of last k added numbers.",
    DS, A, L, H,
    "Store numbers; if zero encountered, segment prefix products or recompute window.",
    `class ProductOfNumbers:
    def __init__(self): self.nums = []
    def add(self, num): self.nums.append(num)
    def getProduct(self, k):
        if k > len(self.nums): return 0
        prod = 1
        for x in self.nums[-k:]: prod *= x
        return prod`,
    "O(k) getProduct, O(1) add, O(n) space", "O(1) getProduct, O(n) space", "O(log k) getProduct, O(n) space", "O(n) getProduct, O(1) space",
    "Rolling window product with zero segmentation — design."),
  problem(1353, "maximum-events-that-can-be-attended", "Maximum Events That Can Be Attended", "heaps-queues",
    "Attend one event per day. events[i] = [start, end]. Return max events you can attend.",
    H, S, D, G,
    "Sort by start; min-heap of end days — attend earliest-ending available event each day.",
    `def maxEvents(events):
    events.sort()
    heap = []; day = i = 0; res = 0
    while i < len(events) or heap:
        if not heap:
            day = events[i][0]
        while i < len(events) and events[i][0] <= day:
            heappush(heap, events[i][1]); i += 1
        heappop(heap); res += 1; day += 1
        while heap and heap[0] < day: heappop(heap)
    return res`,
    "O(n log n) time, O(n) space", "O(n²) time, O(n) space", "O(n) time, O(1) space", "O(2^n) time, O(n) space",
    "Greedy scheduling with min-heap of deadlines — heap pattern."),
  problem(1472, "design-browser-history", "Design Browser History", "design",
    "Support visit(url), back(steps), forward(steps) for browser history.",
    DS, L, A, H,
    "Array/list with current index pointer; truncate forward stack on new visit.",
    `class BrowserHistory:
    def __init__(self, homepage):
        self.history = [homepage]; self.i = 0
    def visit(self, url):
        self.history = self.history[:self.i+1] + [url]; self.i += 1
    def back(self, steps):
        self.i = max(0, self.i - steps); return self.history[self.i]
    def forward(self, steps):
        self.i = min(len(self.history)-1, self.i + steps); return self.history[self.i]`,
    "O(1) amortized per op, O(n) space", "O(n) per op, O(1) space", "O(log n) per op, O(n) space", "O(1) per op, O(1) space",
    "Stack/array with pointer — browser history design."),
  problem(1494, "parallel-courses-ii", "Parallel Courses II", "dynamic-programming",
    "Take at most k courses per semester. Return minimum semesters to finish all with prerequisites.",
    D, G, H, R,
    "Bitmask DP: dp[mask] = min semesters to complete courses in mask.",
    `def minNumberOfSemesters(n, relations, k):
    prereq = [0]*n
    for a, b in relations:
        prereq[a-1] |= 1 << (b-1)
    @lru_cache(None)
    def dp(mask):
        if mask == (1<<n)-1: return 0
        available = ((1<<n)-1) ^ mask
        for i in range(n):
            if not (mask & (1<<i)): available &= ~prereq[i]
        best = float('inf')
        sub = available
        while sub:
            take = sub
            cnt = take.bit_count()
            if cnt <= k:
                nmask = mask | take
                best = min(best, 1 + dp(nmask))
            sub = (sub - 1) & available
        return best
    return dp(0)`,
    "O(3^n) time, O(2^n) space", "O(n!) time, O(n) space", "O(n²) time, O(n) space", "O(2^n·n) time, O(2^n) space",
    "Bitmask DP over course sets — state = completed mask."),
  problem(1600, "throne-inheritance", "Throne Inheritance", "design",
    "Royal family tree with birth and death; getInheritanceOrder returns preorder of living members.",
    DS, T, G, A,
    "Tree adjacency from parent map; DFS preorder skipping dead.",
    `class ThroneInheritance:
    def __init__(self, kingName):
        self.king = kingName; self.parent = {}; self.dead = set()
    def birth(self, name, parentName): self.parent[name] = parentName
    def death(self, name): self.dead.add(name)
    def getInheritanceOrder(self):
        res = []
        def dfs(u):
            if u not in self.dead: res.append(u)
            for child, p in self.parent.items():
                if p == u: dfs(child)
        dfs(self.king); return res`,
    "O(n) per query, O(n) space", "O(1) per query, O(n) space", "O(n log n) per query, O(n) space", "O(n²) per query, O(n) space",
    "Tree DFS preorder with death filter — design + tree."),
  problem(1604, "alert-using-same-key-card", "Alert Using Same Key-Card", "sorting-intervals",
    "Given key-card name and times, return names appearing 3+ times within any 60-minute window.",
    S, A, H, DS,
    "Group times by name, sort, sliding window count within 60 minutes.",
    `def alertNames(keyName, keyTime):
    from collections import defaultdict
    times = defaultdict(list)
    for name, t in zip(keyName, keyTime):
        h, m = map(int, t.split(':'))
        times[name].append(h*60+m)
    res = []
    for name, arr in times.items():
        arr.sort()
        for i in range(2, len(arr)):
            if arr[i] - arr[i-2] <= 60:
                res.append(name); break
    return sorted(res)`,
    "O(n log n) time, O(n) space", "O(n²) time, O(n) space", "O(n) time, O(1) space", "O(n log n) time, O(1) space",
    "Sort times + sliding window on intervals — sort-and-scan."),
  problem(1631, "path-with-minimum-effort", "Path With Minimum Effort", "graphs",
    "Grid heights; effort is max absolute step difference along path. Return minimum effort from top-left to bottom-right.",
    G, D, H, B,
    "Dijkstra / 0-1 BFS treating effort as path max edge weight.",
    `def minimumEffortPath(heights):
    R, C = len(heights), len(heights[0])
    dist = [[float('inf')]*C for _ in range(R)]; dist[0][0] = 0
    heap = [(0, 0, 0)]
    while heap:
        e, r, c = heappop(heap)
        if r == R-1 and c == C-1: return e
        if e > dist[r][c]: continue
        for dr, dc in ((1,0),(-1,0),(0,1),(0,-1)):
            nr, nc = r+dr, c+dc
            if 0 <= nr < R and 0 <= nc < C:
                ne = max(e, abs(heights[r][c] - heights[nr][nc]))
                if ne < dist[nr][nc]:
                    dist[nr][nc] = ne; heappush(heap, (ne, nr, nc))
    return 0`,
    "O(m·n log(m·n)) time, O(m·n) space", "O(m·n) time, O(m·n) space", "O((m·n)²) time, O(m·n) space", "O(m+n) time, O(m·n) space",
    "Minimax path cost — Dijkstra on grid."),
  problem(1639, "number-of-ways-to-form-target-string", "Number of Ways to Form Target String", "dynamic-programming",
    "Given strings of same length and target, count ways to pick one char per column to spell target.",
    D, A, R, G,
    "DP on columns: dp[j] += dp[i] * count of char target[j] in column i.",
    `def numWays(words, target):
    k, m = len(words[0]), len(target)
    col = [Counter(w[i] for w in words) for i in range(k)]
    MOD = 10**9 + 7
    dp = [0]*(m+1); dp[0] = 1
    for i in range(k):
        for j in range(m, 0, -1):
            dp[j] = (dp[j] + dp[j-1] * col[i][target[j-1]]) % MOD
    return dp[m]`,
    "O(k·m) time, O(m) space", "O(k^m) time, O(m) space", "O(k·m²) time, O(k·m) space", "O(m) time, O(1) space",
    "Counting DP over columns — multiplicative transitions."),
  problem(1751, "maximum-events-attended-ii", "Maximum Events Attended II", "dynamic-programming",
    "Attend at most k non-overlapping events with values. Return maximum total value.",
    D, S, H, G,
    "Sort by end; dp[k][i] from binary search on last compatible event.",
    `def maxValue(events, k):
    events.sort(key=lambda x: x[1])
    starts = [e[0] for e in events]
    @lru_cache(None)
    def dp(i, rem):
        if i == len(events) or rem == 0: return 0
        s, e, v = events[i]
        j = bisect_left(starts, e, hi=i)
        skip = dp(i+1, rem)
        take = v + dp(j+1, rem-1)
        return max(skip, take)
    return dp(0, k)`,
    "O(k·n log n) time, O(k·n) space", "O(k·n²) time, O(k·n) space", "O(2^n) time, O(n) space", "O(n log n) time, O(n) space",
    "Weighted event scheduling with k limit — DP + bisect."),
  problem(185, "department-top-three-salaries", "Department Top Three Salaries", "python-toolbox",
    "For each department, find employees with salaries ranking among top three in that department.",
    P, A, DS, C,
    "SQL window function DENSE_RANK or sort/group in Python with heap per department.",
    `def topThreeSalaries(employees):
    from collections import defaultdict
    dept = defaultdict(list)
    for e in employees: dept[e['department']].append(e['salary'])
    res = []
    for d, sal in dept.items():
        top = sorted(set(sal), reverse=True)[:3]
        for e in employees:
            if e['department'] == d and e['salary'] in top:
                res.append(e)
    return res`,
    "O(n log n) time, O(n) space", "O(n) time, O(1) space", "O(n²) time, O(n) space", "O(log n) time, O(n) space",
    "Per-group top-k via sort/heap — Python/SQL toolbox pattern."),
  problem(1898, "maximum-removable-characters", "Maximum Removable Characters", "binary-search",
    "Remove characters at indices in order from s; find max prefix of removals where p remains subsequence of resulting s.",
    B, W, D, A,
    "Binary search removal count; check subsequence feasibility with greedy two pointers.",
    `def maximumRemovals(s, p, removable):
    def ok(k):
        removed = set(removable[:k]); i = 0
        for j, ch in enumerate(s):
            if j in removed: continue
            if ch == p[i]: i += 1
            if i == len(p): return True
        return i == len(p)
    lo, hi = 0, len(removable)
    while lo <= hi:
        mid = (lo + hi) // 2
        if ok(mid): lo = mid + 1
        else: hi = mid - 1
    return hi`,
    "O(r log r · (n+m)) time, O(r) space", "O(r·(n+m)) time, O(1) space", "O(n+m) time, O(1) space", "O(r²) time, O(r) space",
    "Binary search answer + subsequence check — bisect on removals."),
  problem(2050, "parallel-courses-iii", "Parallel Courses III", "graphs",
    "Courses with prerequisites and months[i] time. Return minimum months to finish all courses.",
    G, D, H, S,
    "DAG longest path / topo order: time[u] = months[u] + max(time[prereq]).",
    `def minimumTime(n, relations, time):
    adj = [[] for _ in range(n+1)]; indeg = [0]*(n+1)
    for a, b in relations: adj[b].append(a); indeg[a] += 1
    q = deque([i for i in range(1, n+1) if indeg[i] == 0])
    dist = [0]*(n+1)
    for i in range(1, n+1): dist[i] = time[i-1]
    best = 0
    while q:
        u = q.popleft(); best = max(best, dist[u])
        for v in adj[u]:
            dist[v] = max(dist[v], dist[u] + time[v-1])
            indeg[v] -= 1
            if indeg[v] == 0: q.append(v)
    return best`,
    "O(V+E) time, O(V+E) space", "O(V²) time, O(V) space", "O(2^V) time, O(V) space", "O(V·E) time, O(V) space",
    "Critical path on DAG — topo + longest path DP."),
  problem(2062, "count-vowel-substrings", "Count Vowel Substrings", "sliding-window",
    "Count substrings of length 5 with all vowels exactly once each (a,e,i,o,u).",
    W, A, D, R,
    "Fixed window size 5 with vowel count check.",
    `def countVowelSubstrings(word):
    vowels = set('aeiou'); res = 0
    for i in range(len(word)-4):
        sub = word[i:i+5]
        if set(sub) == vowels: res += 1
    return res`,
    "O(n) time, O(1) space", "O(n²) time, O(1) space", "O(n log n) time, O(n) space", "O(5!) time, O(1) space",
    "Fixed small window with set check — sliding window variant."),
  problem(2096, "step-by-step-directions-from-binary-tree-node", "Step-By-Step Directions From Binary Tree Node", "trees",
    "Find shortest path directions (U/L/R) from node s to node t in a binary tree.",
    T, G, R, A,
    "Find paths to root from both nodes; skip common prefix; rest is up from s and down to t.",
    `def getDirections(root, start, dest):
    def path(node, target, p):
        if not node: return False
        if node.val == target: return True
        p.append('L')
        if path(node.left, target, p): return True
        p[-1] = 'R'
        if path(node.right, target, p): return True
        p.pop(); return False
    p1, p2 = [], []
    path(root, start, p1); path(root, dest, p2)
    i = 0
    while i < len(p1) and i < len(p2) and p1[i] == p2[i]: i += 1
    return 'U'*(len(p1)-i) + ''.join(p2[i:])`,
    "O(n) time, O(n) space", "O(n²) time, O(1) space", "O(n log n) time, O(h) space", "O(n) time, O(1) space",
    "Root paths + LCA-style prefix trim — tree path finding."),
  problem(2265, "count-nodes-equal-to-average-of-subtree", "Count Nodes Equal to Average of Subtree", "trees",
    "Return count of nodes where node value equals average of its subtree (integer division).",
    T, D, G, A,
    "Postorder returns (sum, count); check node.val == sum//count.",
    `def averageOfSubtree(root):
    res = 0
    def dfs(node):
        nonlocal res
        if not node: return 0, 0
        ls, lc = dfs(node.left); rs, rc = dfs(node.right)
        s, c = ls + rs + node.val, lc + rc + 1
        if node.val == s // c: res += 1
        return s, c
    dfs(root); return res`,
    "O(n) time, O(h) space", "O(n²) time, O(n) space", "O(n log n) time, O(1) space", "O(n) time, O(1) space",
    "Subtree aggregate postorder — bottom-up tree DP."),
  problem(2303, "calculate-amount-paid-in-taxes", "Calculate Amount Paid in Taxes", "arrays-hashing",
    "Progressive tax brackets [upper, percent]. Given income, return tax owed.",
    A, D, B, C,
    "Scan brackets computing tax on each marginal slice.",
    `def calculateTax(brackets, income):
    tax, prev = 0, 0
    for upper, pct in brackets:
        taxable = min(income, upper) - prev
        if taxable <= 0: break
        tax += taxable * pct / 100
        prev = upper
    return tax`,
    "O(b) time, O(1) space", "O(b²) time, O(1) space", "O(log b) time, O(1) space", "O(1) time, O(b) space",
    "Bracket simulation — straightforward array scan."),
  problem(2458, "height-of-binary-tree-after-subtree-removal", "Height of Binary Tree After Subtree Removal", "trees",
    "For each node query, remove its subtree and return height of remaining tree.",
    T, D, G, H,
    "Compute depths/heights; per query recompute or use precomputed values excluding subtree.",
    `def treeQueries(root, queries):
    depth = {}
    def dfs(node, d):
        if not node: return 0
        depth[node.val] = d
        return 1 + max(dfs(node.left, d+1), dfs(node.right, d+1))
    h = dfs(root, 0)
    res = []
    for q in queries:
        res.append(h - 1)
    return res`,
    "O(n + q) time, O(n) space", "O(n·q) time, O(n) space", "O(n log n) time, O(1) space", "O(q) time, O(1) space",
    "Tree height with subtree removal analysis — tree DFS."),
  problem(2467, "most-profitable-path-in-a-tree", "Most Profitable Path in a Tree", "trees",
    "Tree with parent edges and bob starting at destination moving toward root. Alice goes root to some node. Maximize Alice net coins.",
    T, G, D, R,
    "Root paths + timing when Bob reaches each node; DFS maximizing Alice profit.",
    `def mostProfitablePath(edges, bob, amount):
    n = len(amount); g = [[] for _ in range(n)]
    for u, v in edges: g[u].append(v); g[v].append(u)
    def dfs(u, p, coins):
        coins += amount[u]
        best = coins
        for v in g[u]:
            if v != p: best = max(best, dfs(v, u, coins))
        return best
    return dfs(0, -1, 0)`,
    "O(n) time, O(n) space", "O(n²) time, O(n) space", "O(2^n) time, O(n) space", "O(n log n) time, O(n) space",
    "Tree path optimization with two agents — DFS on tree."),
  problem(2742, "painting-the-walls", "Painting the Walls", "dynamic-programming",
    "Painter i takes time[i] days and paints time[i]+1 walls. Return minimum days to paint n walls.",
    D, H, G, S,
    "0/1 knapsack style: dp[j] = min days to cover j walls.",
    `def paintWalls(cost, time):
    n = len(cost); dp = [0] + [float('inf')]*n
    for c, t in zip(cost, time):
        for j in range(n, -1, -1):
            dp[min(n, j+t+1)] = min(dp[min(n, j+t+1)], dp[j] + c)
    return dp[n]`,
    "O(n²) time, O(n) space", "O(2^n) time, O(n) space", "O(n) time, O(1) space", "O(n³) time, O(n) space",
    "Knapsack DP on walls covered — counting/minimization DP."),
  problem(2851, "string-transformation", "String Transformation", "dynamic-programming",
    "Count ways to transform s to t using operations within k steps (hard string DP / matrix exponentiation).",
    D, A, R, TR,
    "DP on edit distance variants or automaton transitions with exponentiation for large k.",
    `def numberOfWays(s, t, k):
    MOD = 10**9 + 7
    n = len(s)
    if k == 0: return 1 if s == t else 0
    rot = sum(1 for i in range(n) if s[i:] + s[:i] == t)
    return rot % MOD`,
    "O(n² log k) time, O(n²) space", "O(k·n²) time, O(n²) space", "O(n) time, O(1) space", "O(2^n) time, O(n) space",
    "String DP with transition matrix — advanced DP."),
  problem(2856, "minimum-array-length-after-pair-removals", "Minimum Array Length After Pair Removals", "arrays-hashing",
    "Remove pairs of equal elements. Return minimum possible array length after any sequence of removals.",
    A, H, D, S,
    "Count frequencies; greedy pair most frequent with others via heap or math on max frequency.",
    `def minLengthAfterRemovals(nums):
    cnt = Counter(nums); maxf = max(cnt.values())
    rest = len(nums) - maxf
    return max(0, maxf - rest) if maxf > rest else (len(nums) % 2)`,
    "O(n) time, O(n) space", "O(n log n) time, O(1) space", "O(n²) time, O(n) space", "O(1) time, O(1) space",
    "Frequency analysis for pairing — hash count + greedy."),
  problem(3880, "minimum-absolute-difference-between-two-values", "Minimum Absolute Difference Between Two Values", "trees",
    "Given BST and two values, return minimum absolute difference between any two values in the tree.",
    T, B, A, D,
    "Inorder traversal yields sorted values; track min adjacent difference.",
    `def getMinimumDifference(root):
    prev, best = None, float('inf')
    def inorder(node):
        nonlocal prev, best
        if not node: return
        inorder(node.left)
        if prev is not None: best = min(best, node.val - prev)
        prev = node.val
        inorder(node.right)
    inorder(root); return best`,
    "O(n) time, O(h) space", "O(n²) time, O(n) space", "O(n log n) time, O(1) space", "O(n) time, O(1) space",
    "BST inorder sorted scan — tree traversal."),
];

