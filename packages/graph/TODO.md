# GRAPH TASKS

- –––––––––––––––––––––––––––––––––––

- CLIENT
  - editing host/beacon/server name calls graphHandler.updateNodeName()
  - patterned bg for lifecycle rather than only grayscale?
  - 'timeless' / 'all time' mode to not show any time states

- LAYOUT
  - layout bugs 
    - GroupNodes on top of each other, provide more room
    - space out subNodes in a group node more, they are very tight at high zoom scale
  - test layout and interaction with users
  - dragging pins nodes
  - persist pinned layout
  - methods for auto-layout
  - method to always expand hosts
  
- TIME STATE
  - preview nodes when they change in the time state
  - Maybe: preview all active? or just expand superNodes when there are active nodes?

- LAYOUT: SERVER RENDERING
  - with no group or sub nodes
    - host acts as node when interacted with...
    - possibly as its own ServerGraphRenderer
  - as a different shape?
  - rename isServer to isSingle or something agnostic

- CUSTOMIZE VISUAL
  - need UX mockups for this 
    - should visuals be attached to comments or to graph entities?
  - icons for text labels 
  - colors for nodes? outlines possibly? additional bonus circle within to style

- ALTERNATE LAYOUTS
  - time based simulation layout - for presentation mode
    - option to prioritize nodes based on presentation mode focus...
    - swarm plot
  - filter out nodes that 
  - TRY: combine team servers into a single parent node?
    - give it special rendering and layout - possibly outside all other layout?

- UPDATE DATA
  - update with new dataset that has overlap with the old
    - test method to remove remove a host, beacon, whatever by ids
  - method to remove a host, beacon, whatever by id?

- LINK INTERACTION
  - preview and selection
  - labels

- zoomToSelection - zoomToFit better
- graphData.SelectShortestPath()
- is dotGrid practical? what could an alternate, non-css approach be? possibly use d3 scales?
- improve Readme.md
- try a GIANT dataset
- childSelected class?
- rename `time` to `lifeCycle`?
- quadtree textOcclusion - if performance is bad


- FILTER NODES
  - Filter out nodes that are less connected
  - Or intensify nodes based on graph analytics like:
  	* in degree 
  	* out degree
  	* betweenness 
  	* centrality
