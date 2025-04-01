class MindMap {
  constructor() {
    this.canvas = document.getElementById('mindmap-canvas');
    this.ctx = this.canvas.getContext('2d');
    this.nodes = [];
    this.connections = [];
    this.selectedNode = null;
    this.dragging = false;
    this.currentColor = '#6A11CB';
    this.scale = 1;
    this.offsetX = 0;
    this.offsetY = 0;

    this.initCanvas();
    this.setupEventListeners();
    this.setupUI();
  }

  initCanvas() {
    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());
  }

  resizeCanvas() {
    const container = document.getElementById('canvas-container');
    this.canvas.width = container.clientWidth;
    this.canvas.height = container.clientHeight;
    this.render();
  }

  setupEventListeners() {
    // Mouse/Touch events
    this.canvas.addEventListener('mousedown', this.handleStart.bind(this));
    this.canvas.addEventListener('mousemove', this.handleMove.bind(this));
    this.canvas.addEventListener('mouseup', this.handleEnd.bind(this));
    this.canvas.addEventListener('touchstart', this.handleStart.bind(this), { passive: false });
    this.canvas.addEventListener('touchmove', this.handleMove.bind(this), { passive: false });
    this.canvas.addEventListener('touchend', this.handleEnd.bind(this));

    // Prevent scrolling on touch devices
    document.addEventListener('touchmove', (e) => {
      if (this.dragging) e.preventDefault();
    }, { passive: false });
  }

  setupUI() {
    // Zoom controls
    document.getElementById('zoom-in').addEventListener('click', () => {
      this.scale *= 1.2;
      this.render();
    });

    document.getElementById('zoom-out').addEventListener('click', () => {
      this.scale /= 1.2;
      this.render();
    });

    document.getElementById('zoom-reset').addEventListener('click', () => {
      this.scale = 1;
      this.offsetX = 0;
      this.offsetY = 0;
      this.render();
    });

    // Add node button
    document.getElementById('add-node').addEventListener('click', () => {
      const newNode = {
        id: Date.now(),
        x: this.canvas.width / 2 - this.offsetX,
        y: this.canvas.height / 2 - this.offsetY,
        text: 'New Idea',
        color: this.currentColor,
        width: 120,
        height: 60
      };
      this.nodes.push(newNode);
      this.render();
    });

    // Delete button
    document.getElementById('delete-btn').addEventListener('click', () => {
      if (this.selectedNode) {
        this.nodes = this.nodes.filter(node => node.id !== this.selectedNode.id);
        this.connections = this.connections.filter(conn => 
          conn.from !== this.selectedNode.id && conn.to !== this.selectedNode.id
        );
        this.selectedNode = null;
        this.render();
      }
    });

    // Color picker
    document.querySelectorAll('.color-picker div').forEach(el => {
      el.addEventListener('click', () => {
        this.currentColor = el.dataset.color;
        if (this.selectedNode) {
          this.selectedNode.color = this.currentColor;
          this.render();
        }
      });
    });

    // Export button
    document.getElementById('export-btn').addEventListener('click', () => {
      const link = document.createElement('a');
      link.download = 'mindmap.png';
      link.href = this.canvas.toDataURL('image/png');
      link.click();
    });

    // Theme toggle
    document.getElementById('theme-toggle').addEventListener('click', () => {
      document.body.classList.toggle('dark');
      this.render();
    });
  }

  handleStart(e) {
    e.preventDefault();
    const pos = this.getEventPosition(e);
    const node = this.findNodeAt(pos.x, pos.y);

    if (node) {
      this.selectedNode = node;
      this.dragging = true;
    } else {
      // Start panning
      this.panStart = { x: pos.x, y: pos.y };
    }
  }

  handleMove(e) {
    e.preventDefault();
    if (!this.dragging) return;

    const pos = this.getEventPosition(e);
    this.selectedNode.x = pos.x - this.selectedNode.width / 2;
    this.selectedNode.y = pos.y - this.selectedNode.height / 2;
    this.render();
  }

  handleEnd() {
    this.dragging = false;
  }

  getEventPosition(e) {
    let clientX, clientY;
    if (e.type.includes('touch')) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    const rect = this.canvas.getBoundingClientRect();
    return {
      x: (clientX - rect.left) / this.scale - this.offsetX,
      y: (clientY - rect.top) / this.scale - this.offsetY
    };
  }

  findNodeAt(x, y) {
    return this.nodes.find(node => 
      x >= node.x && x <= node.x + node.width &&
      y >= node.y && y <= node.y + node.height
    );
  }

  render() {
    this.ctx.save();
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.translate(this.offsetX, this.offsetY);
    this.ctx.scale(this.scale, this.scale);
    
    // Draw connections first
    this.connections.forEach(conn => {
      const fromNode = this.nodes.find(n => n.id === conn.from);
      const toNode = this.nodes.find(n => n.id === conn.to);
      if (fromNode && toNode) {
        this.drawConnection(fromNode, toNode);
      }
    });

    // Draw nodes
    this.nodes.forEach(node => {
      this.drawNode(node);
    });
  }

  drawNode(node) {
    // Node background
    this.ctx.fillStyle = node.color;
    this.ctx.strokeStyle = node === this.selectedNode ? '#ffffff' : '#000000';
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.ctx.roundRect(node.x, node.y, node.width, node.height, 8);
    this.ctx.fill();
    this.ctx.stroke();

    // Node text
    this.ctx.fillStyle = '#ffffff';
    this.ctx.font = '14px Poppins';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText(
      node.text,
      node.x + node.width / 2,
      node.y + node.height / 2
    );
  }

  drawConnection(fromNode, toNode) {
    this.ctx.save();
    this.ctx.strokeStyle = '#555555';
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.ctx.moveTo(
      fromNode.x + fromNode.width / 2,
      fromNode.y + fromNode.height / 2
    );
    this.ctx.lineTo(
      toNode.x + toNode.width / 2,
      toNode.y + toNode.height / 2
    );
    this.ctx.stroke();
    this.ctx.restore();
  }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new MindMap();
});