<script setup lang="ts">
import { ref, onMounted, watch, nextTick } from 'vue'
import CollapsibleHeader from './CollapsibleHeader.vue'
import * as d3 from 'd3'

interface Transaction {
  hash: string
  from: string
  to: string
  value: string
  timestamp: string
  blockNumber: number
  method: string | null
  status: string
  fee: {
    value: string
  }
}

interface Node extends d3.SimulationNodeDatum {
  id: string
  x?: number
  y?: number
  fx?: number | null
  fy?: number | null
}

interface Link extends d3.SimulationLinkDatum<Node> {
  source: Node
  target: Node
  value: number
}

const props = defineProps<{
  transactions: Transaction[]
}>()

const isExpanded = ref(false)
const graphContainer = ref<HTMLElement | null>(null)

const toggleExpand = async () => {
  isExpanded.value = !isExpanded.value
  if (isExpanded.value) {
    await nextTick()
    drawGraph()
  }
}

const drawGraph = () => {
  if (!graphContainer.value || !props.transactions.length) {
    console.log('Container or transactions not ready:', {
      container: graphContainer.value,
      transactionsLength: props.transactions.length
    })
    return
  }

  console.log('Drawing graph with transactions:', props.transactions.length)

  // Clear previous graph
  d3.select(graphContainer.value).selectAll('*').remove()

  // Create nodes and links
  const nodes = new Set<string>()
  const links: { source: string; target: string; value: number }[] = []

  props.transactions.forEach(tx => {
    nodes.add(tx.from)
    nodes.add(tx.to)
    links.push({
      source: tx.from,
      target: tx.to,
      value: parseFloat(tx.value) || 0
    })
  })

  const nodeArray: Node[] = Array.from(nodes).map(id => ({ id }))
  const nodeMap = new Map(nodeArray.map(node => [node.id, node]))
  const typedLinks: Link[] = links.map(link => ({
    source: nodeMap.get(link.source)!,
    target: nodeMap.get(link.target)!,
    value: link.value
  }))

  console.log('Created nodes and links:', {
    nodes: nodeArray.length,
    links: typedLinks.length
  })

  // Create the force simulation
  const simulation = d3.forceSimulation<Node>(nodeArray)
    .force('link', d3.forceLink<Node, Link>(typedLinks).id(d => d.id).distance(100))
    .force('charge', d3.forceManyBody().strength(-300))
    .force('center', d3.forceCenter(
      graphContainer.value.clientWidth / 2,
      graphContainer.value.clientHeight / 2
    ))

  // Create SVG
  const svg = d3.select(graphContainer.value)
    .append('svg')
    .attr('width', graphContainer.value.clientWidth)
    .attr('height', graphContainer.value.clientHeight)
    .attr('viewBox', [0, 0, graphContainer.value.clientWidth, graphContainer.value.clientHeight])
    .attr('style', 'max-width: 100%; height: auto;')

  // Create links
  const link = svg.append('g')
    .selectAll<SVGLineElement, Link>('line')
    .data(typedLinks)
    .join('line')
    .attr('stroke', '#999')
    .attr('stroke-opacity', 0.6)
    .attr('stroke-width', d => Math.sqrt(d.value) / 1000)

  // Create nodes
  const node = svg.append('g')
    .selectAll<SVGCircleElement, Node>('circle')
    .data(nodeArray)
    .join('circle')
    .attr('r', 5)
    .attr('fill', '#69b3a2')
    .call(drag(simulation))

  // Add labels
  const label = svg.append('g')
    .selectAll<SVGTextElement, Node>('text')
    .data(nodeArray)
    .join('text')
    .text(d => d.id.slice(0, 6) + '...')
    .attr('font-size', 10)
    .attr('dx', 12)
    .attr('dy', 4)

  // Update positions on each tick
  simulation.on('tick', () => {
    link
      .attr('x1', d => d.source.x || 0)
      .attr('y1', d => d.source.y || 0)
      .attr('x2', d => d.target.x || 0)
      .attr('y2', d => d.target.y || 0)

    node
      .attr('cx', d => d.x || 0)
      .attr('cy', d => d.y || 0)

    label
      .attr('x', d => d.x || 0)
      .attr('y', d => d.y || 0)
  })

  // Drag behavior
  function drag(simulation: d3.Simulation<Node, undefined>) {
    function dragstarted(event: d3.D3DragEvent<SVGCircleElement, Node, Node>) {
      if (!event.active) simulation.alphaTarget(0.3).restart()
      event.subject.fx = event.subject.x
      event.subject.fy = event.subject.y
    }

    function dragged(event: d3.D3DragEvent<SVGCircleElement, Node, Node>) {
      event.subject.fx = event.x
      event.subject.fy = event.y
    }

    function dragended(event: d3.D3DragEvent<SVGCircleElement, Node, Node>) {
      if (!event.active) simulation.alphaTarget(0)
      event.subject.fx = null
      event.subject.fy = null
    }

    return d3.drag<SVGCircleElement, Node>()
      .on('start', dragstarted)
      .on('drag', dragged)
      .on('end', dragended)
  }
}

// Watch for changes in transactions and redraw
watch(() => props.transactions, async () => {
  if (isExpanded.value) {
    await nextTick()
    drawGraph()
  }
}, { deep: true })

onMounted(async () => {
  if (isExpanded.value) {
    await nextTick()
    drawGraph()
  }
})
</script>

<template>
  <div class="w-full max-w-2xl">
    <div class="bg-white shadow-lg rounded-lg border border-gray-100 overflow-hidden">
      <CollapsibleHeader
        title="Transaction Graph"
        :is-expanded="isExpanded"
        @toggle="toggleExpand"
      />

      <div v-if="isExpanded" class="p-6 border-t border-gray-100">
        <div ref="graphContainer" class="h-[500px] w-full bg-gray-50 rounded-lg">
          <div v-if="!transactions.length" class="h-full flex items-center justify-center">
            <p class="text-gray-500">No transactions to display</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template> 