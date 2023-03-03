# RedEye Hierarchical Graph

The RedEye Graph has three main functional parts:

- The `HierarchicalGraphData` store - responsible for parsing the hierarchical graph data, storing state, and issuing state change events
- The multiple `GraphRenderer` - responsible for d3 force-directed simulations and layout
- The `GraphHandler` - responsible for managing the relationships between the HierarchicalGraphData store and all the GraphRenderers

## GraphHandler

The `GraphHandler` manages relationships between the `HierarchicalGraphData` store and all the `GraphRenderers`. It also handles global d3 based events like pan, zoom, drag, and text occlusion.

Events update state in the following order:

1. d3 events (click, hover, drag) occur in the GraphHierarchical renderers, wired to methods of the GraphHandler.
2. The GraphHandler calls update methods on the HierarchicalGraphData store.
3. HierarchicalGraphData store updates the relevant data, and fires an on{Data}Change event to the GraphHandler
4. The GraphHandler calls update methods on the GraphHierarchical renderers to update the relevant visual aspects

This circular flow provides consistent data and visual updates (steps 3 & 4) when HierarchicalGraphData update methods are called from outside the GraphHandler (instead of step 2). S

## HierarchicalGraphData Store

The Hierarchial GraphData class is responsible for parsing unstructured data in to the correct format, and for maintaining interaction state state via methods and events

### Parsing

The `hierarchicalGraphDataParser` combines a parent-child hierarchical tree graph data structure with an unstructured node-link graph.

> **TODO:** this is a super confusing explanation. This needs to be combined with the Terms section, cross linked with the code, and some diagrams would probably be helpful.

GraphData is supplied to the initial parser that will produce serializable js object. This Serializable object can optionally contain the predefined x,y coordinates of each node to restore an pre-existing layout. The resulting serializable data is then passed to a stratify method that replaces string id references with pointers to their respective js objects.

The parsing groups nodes based on their given 'parent' id. This parsing also creates a third intermediary level that further groups nodes within each parent based on their 'signature.' A signature is a property given to a node based on how it shares links to other nodes on the parent level, ie how it connects to a cousin node: through its parent to its uncle to its uncle's child, the cousin. This grouping can significant simplify the simulation computation required to layout the nodes by drawing all grouped child nodes as a single unit.

The resulting data is a combination of two trees. Each tree having four levels: root > super > group > sub

- a node-link-tree - with each tree-node containing child nodes links between those child noes. This data is used to power each nested d3 node-link simulation layout.
- a link-tree - where each tree-node is a link containing the sub simulation's child links.

These two trees are blended together where

- each link in the node-link-tree is a node in the link-tree
- each the source-node and target-node of each link in the link-tree are nodes in the node-link-tree

There is an additional base-link data item representing the original link between to nodes before parsing occurred. These base links contain references to two leaf nodes of the link-tree representing the lowest level of the subdivided link. The ancestors of these two leaves will contain the full visual link between any two nodes in the hierarchical graph.

### Terms

- Hierarchical Prefixes
  - Root - A single node that is the root of the tree hierarchy
  - Super - The top level of hierarchy representing nodes that contain sets of child *sub*nodes. These are machines,computers,hosts,servers,etc...
  - Group - The middle level of the hierarchy representing 'groups' of *sub*nodes. This level is generated during data parsing to group *sub*nodes a common 'link signature.' Read more about signatures [HERE].
  - Sub - The bottom level of the hierarchy.
- BaseLink - the original link between 2 nodes before parsing in the data structure. this is not directly visualized, but contains references to all ParentLinks and SiblingLinks at all levels of the graph that represent that BaseLink
- BaseNode - an original Node - same as a SubNode
- KeyNode - a node meant to be visualized. ie not a ParentLinkNode
- SiblingLink - a link between 2 KeyNodes that share a parent
- ParentLink - a link between a KeyNode and a ParentLinkNode
- ParentLinkNode - a node representing a SiblingLink between a parent node and an uncle node. This node type's x,y coordinates are determined by the layout of the parent simulation's related SiblingLink

### Updating state

The responsibility for updating the `HierarchicalGraphData` state is shared between the `HierarchicalGraphData` and the `GraphRenderer` simulations.

- `HierarchicalGraphData` is responsible for updating Interaction and Time states
  - Interaction state - Preview, Selected - which are analogous to hover and click respectively
  - Time state - Past, Present, Future - which are analogous to a beacon being dead, active, or future respectively
- `GraphRenderer`s are responsible for updating the layout properties from d3's `SimulationNodeDatum` and `SimulationLinkDatum`: x, y, vx, vy, fx, fy, and r.

## GraphRenderers

`HierarchicalGraphRenderer`s use d3 force directed simulations to render a node link diagram of their data and also to create a nested set of child `HierarchicalGraphRenderer`s where appropriate.

### Types

There are 3 GraphRenderers that extend an 'abstract' `HierarchicalGraphRenderer` base class. They follow the same hierarchical structure as the HierarchicalGraphData:

- `SuperGraphRenderer` - renders the master graph. Nodes are 'expandable,' and hide/show their contents on interaction.
- `GroupGraphRenderer` - responsible for visually grouping the SubNodes. These nodes are not intractable, and only exist to improve layout and render performance.
- `SubGraphRenderer` - These node's have a much more forgiving force layout, typically ending up in an evenly dispersed cloud. Dragging one of these nodes actually moves its parent `GroupGraphRenderer` node.
- (The `GraphHandler` manages the Root data node)

### Simulation

The graph layout is computed using d3 force directed simulations. The forces applied are different for each GraphRenderer type, but the alpha related settings are kept in sync for all GraphRenderers via the `HierarchicalGraphRenderer` base class. There are also methods for managing the starting and stopping the simulation: `reheat`, `cool`, and `freeze`.

### Performance

Chunking the simulations into a hierarchical tree reduces the number of objects in each simulation. Simulations perform a many-to-many comparison for each `tick` at O(n!), so the fewer the objects, the better the performance. While the simulation performance is still a major consideration, they only calculate the x,y coordinates and run relatively quickly. The svg DOM update cycle is much slower. DOM update performance is improved here by removing non-visible elements from the DOM tree. See the `hideLayout`/`showLayout` rendering methods below.

### Rendering

Typically referred to as `Draw{Method}` in the code, these methods control the layout and styling of svg via d3's declarative selection chains.

There are several types of DrawMethods responsible for different types of rendering updates:

- `drawLayout` - updates the x,y layout when any simulation updates occur
- `drawInteraction` state - updates the interaction classes (preview and selection) based on the current data state
- `drawTime` state - updates the time classes (past, present, future) based on the current data state
- `hideLayout` / `showLayout` - Removes the graph from the DOM tree to improve performance and visualization legibility

Each Draw methods also has an option to recursively draw updates to all its children, typically referred to as `{drawMethod}AllChildren`.

## Other

### Text Occlusion

- The `textOcclusion` utility manages hiding text for all rendered text in all `GraphRenderer`s after each layout. It is managed by the `GraphHandler`

## CSS

There is no exported default style.css sheet. The one in this project is for testing purposes only. a js object of css classNames is exported instead as `RedEyeGraphClassNames`.
