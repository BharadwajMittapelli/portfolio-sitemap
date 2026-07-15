// ==========================================================================
// PORTFOLIO SITEMAP APPLICATION LOGIC (app.js)
// ==========================================================================

// Mock Code files for the Gateway Console
const MOCK_FILES = {
  "crednpay/locking.py": `
<span class="code-comment"># crednpay/locking.py</span>
<span class="code-keyword">import</span> psycopg2
<span class="code-keyword">from</span> db <span class="code-keyword">import</span> get_connection_pool

<span class="code-keyword">def</span> <span class="code-function">process_payment_webhook</span>(account_id, txn_id, amount):
    pool = get_connection_pool()
    conn = pool.getconn()
    <span class="code-keyword">try</span>:
        <span class="code-keyword">with</span> conn.cursor() <span class="code-keyword">as</span> cursor:
            <span class="code-comment"># Row-level lock blocks concurrent webhooks for this account</span>
            cursor.execute(
                <span class="code-string">"SELECT balance, status FROM accounts WHERE id = %s FOR UPDATE"</span>,
                (account_id,)
            )
            account = cursor.fetchone()
            
            <span class="code-comment"># Avoid double-spend / replay attacks</span>
            cursor.execute(<span class="code-string">"SELECT status FROM transactions WHERE id = %s"</span>, (txn_id,))
            exists = cursor.fetchone()
            <span class="code-keyword">if</span> exists <span class="code-keyword">and</span> exists[<span class="code-number">0</span>] == <span class="code-string">'PROCESSED'</span>:
                <span class="code-keyword">return</span> <span class="code-keyword">False</span>
                
            new_balance = account[<span class="code-number">0</span>] + amount
            cursor.execute(
                <span class="code-string">"UPDATE accounts SET balance = %s WHERE id = %s"</span>,
                (new_balance, account_id)
            )
            cursor.execute(
                <span class="code-string">"INSERT INTO transactions (id, status) VALUES (%s, 'PROCESSED')"</span>,
                (txn_id,)
            )
            conn.commit() <span class="code-comment"># Lock is released here</span>
            <span class="code-keyword">return</span> <span class="code-keyword">True</span>
    <span class="code-keyword">finally</span>:
        pool.putconn(conn)
`,
  "codecheck/sandbox.go": `
<span class="code-comment">// codecheck/sandbox.go</span>
<span class="code-keyword">package</span> main

<span class="code-keyword">import</span> (
	<span class="code-string">"context"</span>
	<span class="code-string">"github.com/firecracker-microvm/firecracker-go-sdk"</span>
)

<span class="code-comment">// StartIsolatedJail spins up a microVM with hard CPU/Memory limits</span>
<span class="code-keyword">func</span> <span class="code-function">StartIsolatedJail</span>(ctx context.Context, jailID <span class="code-keyword">string</span>) (*firecracker.Machine, error) {
	cfg := firecracker.Config{
		SocketPath:      <span class="code-string">"/var/run/firecracker.sock"</span>,
		KernelImagePath: <span class="code-string">"/opt/kernels/vmlinux.bin"</span>,
		Drives: []firecracker.BlockDevice{{
			PathOnHost: <span class="code-string">"/opt/jail/rootfs.ext4"</span>,
			IsReadOnly: <span class="code-keyword">true</span>,
		}},
		<span class="code-comment">// Strict limits for deterministic, sandboxed evaluation</span>
		Limits: firecracker.Limits{
			CPUShares: <span class="code-number">1024</span>,
			Memory:    <span class="code-number">256</span>, <span class="code-comment">// 256MB boundary</span>
		},
	}
	<span class="code-keyword">return</span> firecracker.StartVMM(ctx, cfg)
}
`,
  "ecommerce/instagram_stream.js": `
<span class="code-comment">// ecommerce/instagram_stream.js</span>
<span class="code-keyword">const</span> { RateLimiter } = <span class="code-function">require</span>(<span class="code-string">'limiter'</span>);

<span class="code-comment">// Token bucket rate limiter: max 200 requests/hour</span>
<span class="code-keyword">const</span> apiLimiter = <span class="code-keyword">new</span> <span class="code-function">RateLimiter</span>({ 
  tokensPerInterval: <span class="code-number">200</span>, 
  interval: <span class="code-string">"hour"</span> 
});

<span class="code-keyword">async</span> <span class="code-keyword">function</span> <span class="code-function">processWebhookEvent</span>(event) {
  <span class="code-comment">// Rate-limiting avoidance logic</span>
  <span class="code-keyword">await</span> apiLimiter.<span class="code-function">removeTokens</span>(<span class="code-number">1</span>);
  
  <span class="code-keyword">if</span> (event.type === <span class="code-string">'comment'</span>) {
    <span class="code-keyword">const</span> details = <span class="code-keyword">await</span> <span class="code-function">fetch</span>(<span class="code-string">\`https://graph.instagram.com/v19.0/\${event.comment_id}\`</span>);
    <span class="code-keyword">const</span> commentData = <span class="code-keyword">await</span> details.<span class="code-function">json</span>();
    <span class="code-keyword">await</span> <span class="code-function">orchestrateStateSync</span>(commentData);
  }
}
`,
  "system_schematic.json": `
{
  <span class="code-string">"sitemap"</span>: {
    <span class="code-string">"version"</span>: <span class="code-string">"1.0"</span>,
    <span class="code-string">"routes"</span>: {
      <span class="code-string">"/"</span>: {
        <span class="code-string">"name"</span>: <span class="code-string">"Landing Node"</span>,
        <span class="code-string">"throughput_capacity"</span>: <span class="code-string">"10,000 req/sec"</span>,
        <span class="code-string">"latency_p99"</span>: <span class="code-string">"45ms"</span>
      },
      <span class="code-string">"/systems"</span>: {
        <span class="code-string">"name"</span>: <span class="code-string">"Proof Engine / Case Studies"</span>,
        <span class="code-string">"pipelines"</span>: [<span class="code-string">"CrednPay"</span>, <span class="code-string">"CodeCheck"</span>, <span class="code-string">"ECommerce"</span>]
      },
      <span class="code-string">"/runtime"</span>: {
        <span class="code-string">"name"</span>: <span class="code-string">"Engineering Matrix"</span>,
        <span class="code-string">"validations"</span>: [<span class="code-string">"Salesforce Agentforce"</span>, <span class="code-string">"IARE CSE"</span>]
      }
    }
  }
}
`
};

// Application Views Content Injections
const VIEWS = {
  home: `
    <div class="landing-grid view-fade-in">
      <div class="claim-container">
        <div class="system-badge">
          <i class="lucide-cpu"></i> SYSTEMS & PIPELINE ARCHITECTURE
        </div>
        <h1 class="claim-title">
          Engineering High-Throughput <span class="highlight-grad">Backend Contracts</span> & Agentic Boundaries.
        </h1>
        <p class="claim-desc">
          I build resilient asynchronous systems, isolated cloud execution sandboxes, and autonomous AI agents designed to handle strict production parameters. This sitemap acts as a live interactive proof of engineering concepts.
        </p>
        <div class="cta-group">
          <button class="cyber-btn primary" id="open-scheduler-btn">
            <span class="btn-text"><i class="lucide-calendar"></i> SCHEDULE SYSTEM REVIEW</span>
          </button>
          <a href="#/systems" class="cyber-btn accent">
            <span class="btn-text">EXPLORE CASES</span>
          </a>
        </div>
      </div>
      
      <!-- Interactive Gateway Directory Console -->
      <div class="gateway-console glass-panel">
        <div class="console-header terminal-header">
          <div class="terminal-buttons">
            <span class="term-btn red"></span>
            <span class="term-btn yellow"></span>
            <span class="term-btn green"></span>
          </div>
          <div class="terminal-title">GATEWAY_CONSOLE // REPO_BROWSER</div>
        </div>
        <div class="console-tabs">
          <button class="console-tab active" data-tab="explorer">
            <i class="lucide-folder-tree"></i> FILE EXPLORER
          </button>
          <button class="console-tab" data-tab="sitemap">
            <i class="lucide-network"></i> SITEMAP.JSON
          </button>
        </div>
        <div class="console-content" id="console-dynamic-content">
          <!-- File Explorer Content (Default) -->
          <ul class="file-tree" id="explorer-tree">
            <li class="tree-item folder" data-path="crednpay">
              <i class="lucide-folder"></i> crednpay/
            </li>
            <li class="tree-item file" data-file="crednpay/locking.py">
              <i class="lucide-file-code"></i> locking.py
            </li>
            <li class="tree-item folder" data-path="codecheck">
              <i class="lucide-folder"></i> codecheck/
            </li>
            <li class="tree-item file" data-file="codecheck/sandbox.go">
              <i class="lucide-file-code"></i> sandbox.go
            </li>
            <li class="tree-item folder" data-path="ecommerce">
              <i class="lucide-folder"></i> ecommerce/
            </li>
            <li class="tree-item file" data-file="ecommerce/instagram_stream.js">
              <i class="lucide-file-code"></i> instagram_stream.js
            </li>
          </ul>
        </div>
      </div>
    </div>
  `,
  
  systems: `
    <div class="systems-layout view-fade-in">
      <!-- Systems Sidebar -->
      <aside class="systems-sidebar">
        <button class="sys-sidebar-btn active" data-sys="crednpay">
          <span class="sys-btn-meta">SYS_A // ASYNC_LEDGER</span>
          <span class="sys-btn-title">CrednPay Pipeline</span>
          <span class="sys-btn-subtitle">PostgreSQL Row Locks</span>
        </button>
        <button class="sys-sidebar-btn" data-sys="codecheck">
          <span class="sys-btn-meta">SYS_B // ISOLATION_VMM</span>
          <span class="sys-btn-title">CodeCheck Sandbox</span>
          <span class="sys-btn-subtitle">Firecracker & Go Jail</span>
        </button>
        <button class="sys-sidebar-btn" data-sys="ecommerce">
          <span class="sys-btn-meta">SYS_C // API_INGEST</span>
          <span class="sys-btn-title">E-Commerce Webhooks</span>
          <span class="sys-btn-subtitle">Instagram Graph Concurrency</span>
        </button>
      </aside>
      
      <!-- Systems Content (Whitepaper styling) -->
      <article class="case-study-paper glass-panel" id="case-study-viewport">
        <!-- Injected case study loads here -->
      </article>
    </div>
  `,
  
  runtime: `
    <div class="runtime-grid view-fade-in">
      <div class="runtime-section">
        <div class="section-hdr">
          <i class="lucide-shield-check"></i>
          <span>ENTERPRISE VALIDATIONS</span>
        </div>
        
        <!-- Salesforce Card -->
        <div class="agentforce-card glass-panel">
          <div class="agentforce-title">VERIFIED CERTIFICATION</div>
          <h2 class="agentforce-name">Salesforce Agentforce Specialist</h2>
          <p class="agentforce-desc">
            Proven competency in designing autonomous, agentic boundaries, integrating Salesforce API hooks, maintaining session continuity, and securing zero-trust prompt grounding.
          </p>
          
          <!-- Boundary Visualizer -->
          <div class="boundary-visualizer">
            <div class="boundary-header">
              <span class="pulse-dot"></span>
              <span>AGENT_BOUNDARY_SPEC (JSON)</span>
            </div>
            <pre class="boundary-schema">{
  "agent_id": "agentforce-specialist-01",
  "boundaries": {
    "action_scope": ["LeadSync", "SystemDiagnostics"],
    "data_masking": true,
    "max_hops": 5,
    "guardrails": {
      "pii_block": true,
      "unauthorized_db_write": "HALT_EXECUTION"
    }
  }
}</pre>
          </div>
        </div>
        
        <div class="section-hdr">
          <i class="lucide-graduation-cap"></i>
          <span>ACADEMIC BASE</span>
        </div>
        
        <!-- Timeline academic -->
        <div class="timeline">
          <div class="timeline-item">
            <span class="timeline-dot active"></span>
            <div class="timeline-header">
              <span class="timeline-title">B.Tech in Computer Science and Engineering</span>
              <span class="timeline-date">2022 - 2026</span>
            </div>
            <div class="timeline-subtitle">Institute of Aeronautical Engineering (IARE)</div>
            <p class="timeline-body">
              Specialized in Distributed Systems and Algorithms. Researched network latency optimization and transaction isolation levels in multi-tenant cloud environments.
            </p>
          </div>
          <div class="timeline-item">
            <span class="timeline-dot"></span>
            <div class="timeline-header">
              <span class="timeline-title">Research Publication - Distributed Webhook Ingestion</span>
              <span class="timeline-date">2025</span>
            </div>
            <div class="timeline-subtitle">Academic Project (IARE Lab)</div>
            <p class="timeline-body">
              Designed a prototype token-bucket rate limiter that improved webhook processing reliability across unstable external connections.
            </p>
          </div>
        </div>
      </div>
      
      <!-- Right: Infrastructure Stack Table -->
      <div class="runtime-section">
        <div class="section-hdr">
          <i class="lucide-server"></i>
          <span>INFRASTRUCTURE STACK</span>
        </div>
        <p class="text-muted" style="font-size: 0.9rem;">
          Production-level command and architecture configuration across languages, runtimes, and datastores.
        </p>
        
        <div class="infra-table-wrapper">
          <table class="infra-table">
            <thead>
              <tr>
                <th>LAYER</th>
                <th>TECHNOLOGY</th>
                <th>PROFICIENCY PARAMETERS</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Languages</strong></td>
                <td>
                  <span class="stack-tag">Python</span>
                  <span class="stack-tag">Go</span>
                  <span class="stack-tag">TypeScript</span>
                </td>
                <td>Concurrency primitives (Goroutines, asyncio), strict typing, script optimizations.</td>
              </tr>
              <tr>
                <td><strong>Runtimes</strong></td>
                <td>
                  <span class="stack-tag">FastAPI</span>
                  <span class="stack-tag">Node.js</span>
                  <span class="stack-tag">Bun</span>
                </td>
                <td>Uvicorn configuration, async loop scheduling, event-driven webservers.</td>
              </tr>
              <tr>
                <td><strong>Datastores</strong></td>
                <td>
                  <span class="stack-tag">PostgreSQL</span>
                  <span class="stack-tag">Redis</span>
                </td>
                <td>B-Tree indexing strategies, EXPLAIN ANALYZE tuning, write-ahead locks, caching.</td>
              </tr>
              <tr>
                <td><strong>Containers</strong></td>
                <td>
                  <span class="stack-tag">Docker</span>
                  <span class="stack-tag">Kubernetes</span>
                </td>
                <td>Multi-stage builds, rootless container security, memory isolation configurations.</td>
              </tr>
              <tr>
                <td><strong>Vector search</strong></td>
                <td>
                  <span class="stack-tag">pgvector</span>
                  <span class="stack-tag">ChromaDB</span>
                </td>
                <td>HNSW index generation, cosine similarity queries for agent memory retrieval.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
};

// Case Study Data for the Systems View
const CASE_STUDIES = {
  crednpay: `
    <div class="paper-header">
      <div class="paper-meta-row">
        <span class="paper-meta-item"><i class="lucide-hash"></i> SYSTEM_A</span>
        <span class="paper-meta-item"><i class="lucide-database"></i> POSTGRES_LOCKS</span>
        <span class="paper-meta-item"><i class="lucide-activity"></i> LATENCY: 32MS</span>
      </div>
      <h2 class="paper-title">CrednPay: Race-Condition Isolation in Asynchronous Webhooks</h2>
      <p class="paper-subtitle">An architecture whitepaper explaining transaction lock mechanisms in high-throughput ledger pipelines.</p>
    </div>
    
    <div class="paper-abstract">
      <strong>Abstract:</strong> Financial webhook notification brokers emit parallel event updates for identical accounts. Without locking, interleaved read-modify-write sequences result in balance anomalies (double-spend/balance overwrite). This system implements row-level locking via PostgreSQL SELECT FOR UPDATE to isolate accounts during mutations.
    </div>
    
    <div class="paper-section">
      <h3 class="paper-section-title">1. The Problem Space</h3>
      <p>
        In high-frequency payments, CrednPay processes parallel transaction webhook streams. Standard SQL queries execute concurrently, meaning two requests can read a wallet balance of $100 simultaneously. If transaction A updates it by +$10 and transaction B updates it by -$50, whichever database transaction commits last overwrites the other, leading to a corrupted balance state (e.g., balance becomes $50 instead of $60).
      </p>
    </div>
    
    <div class="paper-section">
      <h3 class="paper-section-title">2. Lock Isolation Strategy</h3>
      <p>
        Rather than locks on the application layer (which fail across horizontally scaled container pods), we delegate isolation directly to the ACID engine via row-level locks. By modifying our retrieval query to append <code>FOR UPDATE</code>, the PostgreSQL transaction locks that specific record row. Any concurrent transaction attempting to read that row <code>FOR UPDATE</code> is forced to block until the initial transaction commits or rolls back.
      </p>
      
      <div class="engineering-alert">
        <div class="alert-title"><i class="lucide-alert-octagon"></i> PERFORMANCE NOTE: LOCK LIFETIME LIMITS</div>
        <div class="alert-body">
          To prevent thread pool exhaustion, we enforce strict network timeouts (2s) on database connections, ensuring a locked transaction never holds resources indefinitely due to network drops.
        </div>
      </div>
    </div>
    
    <div class="paper-section">
      <h3 class="paper-section-title">3. Interactive PostgreSQL Lock Simulator</h3>
      <p>Observe the simulation of two concurrent requests hitting the ledger. Click the run button to see how SELECT FOR UPDATE halts the second transaction until the first commits.</p>
      
      <div class="schematic-box">
        <div class="lock-simulator">
          <div class="sim-controls">
            <button class="cyber-btn accent" id="run-lock-sim">
              <i class="lucide-play"></i> EXECUTE CONCURRENT WEBHOOKS
            </button>
          </div>
          <div class="sim-viz-container">
            <div class="sim-lane" id="sim-tx1">
              <div class="lane-header">
                <span>Webhook Tx 1 (+ $50)</span>
                <span class="transaction-status status-idle" id="tx1-status">IDLE</span>
              </div>
              <div class="sim-terminal" id="tx1-term">> Initialized...</div>
            </div>
            <div class="sim-lane" id="sim-tx2">
              <div class="lane-header">
                <span>Webhook Tx 2 (- $20)</span>
                <span class="transaction-status status-idle" id="tx2-status">IDLE</span>
              </div>
              <div class="sim-terminal" id="tx2-term">> Initialized...</div>
            </div>
          </div>
        </div>
        <span class="schematic-caption">Fig 1.1: Live simulation of ledger transaction queue and locking mechanisms</span>
      </div>
    </div>
  `,
  
  codecheck: `
    <div class="paper-header">
      <div class="paper-meta-row">
        <span class="paper-meta-item"><i class="lucide-hash"></i> SYSTEM_B</span>
        <span class="paper-meta-item"><i class="lucide-shield"></i> JAILER_VMM</span>
        <span class="paper-meta-item"><i class="lucide-gauge"></i> BOOT: <5MS</span>
      </div>
      <h2 class="paper-title">CodeCheck: Isolated Cloud Code Security Sandbox</h2>
      <p class="paper-subtitle">Memory isolation benchmarks and sandbox execution boundaries using microVM structures.</p>
    </div>
    
    <div class="paper-abstract">
      <strong>Abstract:</strong> Executing unverified user-submitted code requires absolute security isolation. Standard container systems are vulnerable to kernel exploit escapes. CodeCheck implements isolated, hypervisor-level security sandboxes using Firecracker MicroVMs, enabling lightweight kernel execution jail configurations within milliseconds.
    </div>
    
    <div class="paper-section">
      <h3 class="paper-section-title">1. Isolation Architecture</h3>
      <p>
        CodeCheck uses a dual-layer isolation approach. The outer boundary is a minimal Go daemon running inside a rootless container. The inner boundary is a Firecracker MicroVM initialized with an read-only root filesystem. The guest kernel is compiled with only essential modules, disabling networking and IPC access.
      </p>
    </div>
    
    <div class="paper-section">
      <h3 class="paper-section-title">2. Sandbox Security Benchmarks</h3>
      <p>
        Our benchmarks measure performance degradation under resource constraints. The isolation layer restricts memory limits (typically 256MB) and throttles CPU cycles. By analyzing CPU instruction paths, CodeCheck prevents denial-of-service loops and memory leaks in the executor sandbox.
      </p>
    </div>
    
    <div class="paper-section">
      <h3 class="paper-section-title">3. Interactive Sandbox Benchmark Simulator</h3>
      <p>Initialize a secure jail VM and launch a test user execution to observe memory and CPU allocation profiles under isolation constraints.</p>
      
      <div class="schematic-box">
        <div class="sandbox-sim">
          <div class="sim-controls">
            <button class="cyber-btn accent" id="run-sandbox-sim">
              <i class="lucide-shield-alert"></i> LAUNCH SANDBOX EXECUTOR
            </button>
          </div>
          
          <div class="bench-card-grid">
            <div class="glass-panel" style="padding: 1rem;">
              <div class="bench-label">
                <span>SANDBOX ID:</span>
                <span class="text-green" id="sandbox-id">READY</span>
              </div>
              <div class="bench-label" style="margin-top:0.5rem;">
                <span>VMM STATE:</span>
                <span id="sandbox-state" class="text-muted">STANDBY</span>
              </div>
            </div>
            
            <div class="glass-panel" style="padding: 1rem;">
              <div class="bench-bar-container">
                <div class="bench-label"><span>CPU Allocation</span> <span id="cpu-val">0%</span></div>
                <div class="bench-bar-track"><div class="bench-bar-fill" id="cpu-bar"></div></div>
              </div>
              <div class="bench-bar-container" style="margin-top:0.75rem;">
                <div class="bench-label"><span>Memory Boundary</span> <span id="mem-val">0MB / 256MB</span></div>
                <div class="bench-bar-track"><div class="bench-bar-fill" id="mem-bar"></div></div>
              </div>
            </div>
          </div>
          
          <div class="sim-terminal" id="sandbox-term">> SECURE EXECUTIVE VMM DAEMON READY.</div>
        </div>
        <span class="schematic-caption">Fig 2.1: Virtual Machine Manager sandbox resource tracker</span>
      </div>
    </div>
  `,
  
  ecommerce: `
    <div class="paper-header">
      <div class="paper-meta-row">
        <span class="paper-meta-item"><i class="lucide-hash"></i> SYSTEM_C</span>
        <span class="paper-meta-item"><i class="lucide-git-pull-request"></i> INSTAGRAM_API</span>
        <span class="paper-meta-item"><i class="lucide-activity"></i> CONCURRENCY: 1500/S</span>
      </div>
      <h2 class="paper-title">E-Commerce Webhooks: Processing High-Concurrency Graph Events</h2>
      <p class="paper-subtitle">Avoiding API rate limits using sliding-window token bucket queue schedulers.</p>
    </div>
    
    <div class="paper-abstract">
      <strong>Abstract:</strong> Social commerce integrations encounter sudden event spikes when high-follower accounts post promotional items. Ingesting thousands of concurrent mentions within seconds risks IP bans and API limit exhaustion. This system leverages Instagram Graph Webhooks, dynamic token bucket queues, and distributed state machines to safely process events.
    </div>
    
    <div class="paper-section">
      <h3 class="paper-section-title">1. Instagram API Boundaries</h3>
      <p>
        The Instagram Graph API enforces a hard request threshold. Spiking requests result in <code>429 Too Many Requests</code> errors. Our architecture splits ingestion from processing: webhook payloads are immediately acknowledged (status 200) and pushed to a fast Redis stream, separating external traffic spikes from API calls.
      </p>
    </div>
    
    <div class="paper-section">
      <h3 class="paper-section-title">2. Queue Scheduling Logic</h3>
      <p>
        A background scheduler polls the Redis stream, applying a token-bucket rate limiting algorithm. Before making any outbound requests to fetch comments, it checks the rate-limiting context. This guarantees that traffic is smoothed, preventing spikes and maintaining steady throughput without losing event updates.
      </p>
    </div>
    
    <div class="paper-section">
      <h3 class="paper-section-title">3. Webhook Stream Ingestion Simulator</h3>
      <p>Trigger a mock webhook event spike to see how the system immediately schedules notifications, and schedules api calls without exceeding the API rate limit.</p>
      
      <div class="schematic-box">
        <div class="stream-sim">
          <div class="sim-controls" style="margin-bottom:1rem;">
            <button class="cyber-btn accent" id="run-stream-sim">
              <i class="lucide-activity"></i> EMIT EVENT SPIKE (30 EVENTS)
            </button>
          </div>
          
          <div class="bench-label">
            <span>WEBHOOK INGESTION STREAM</span>
            <span>QUEUE STATUS: <span id="queue-count" class="text-green">EMPTY</span></span>
          </div>
          <div class="webhook-stream-container" id="stream-logs">
            <div class="terminal-line text-muted">> Ingestion broker active, awaiting event emissions...</div>
          </div>
        </div>
        <span class="schematic-caption">Fig 3.1: Live event ingestion stream visualizer</span>
      </div>
    </div>
  `
};

// Global state variables
let activeRoute = "home";
let activeSystem = "crednpay";

// ==========================================================================
// CLIENT-SIDE ROUTER
// ==========================================================================

function navigate() {
  const hash = window.location.hash || "#/";
  let route = "home";
  
  if (hash === "#/systems") {
    route = "systems";
  } else if (hash === "#/runtime") {
    route = "runtime";
  }
  
  activeRoute = route;
  renderView();
}

function renderView() {
  const container = document.getElementById("view-container");
  if (!container) return;
  
  // Inject view HTML
  container.innerHTML = VIEWS[activeRoute];
  
  // Highlight active navbar links
  document.querySelectorAll(".nav-item").forEach(item => {
    if (item.getAttribute("data-route") === activeRoute) {
      item.classList.add("active");
    } else {
      item.classList.remove("active");
    }
  });
  
  // Initialize view specific listeners
  if (activeRoute === "home") {
    initHomeListeners();
  } else if (activeRoute === "systems") {
    initSystemsListeners();
  } else if (activeRoute === "runtime") {
    initRuntimeListeners();
  }
}

// ==========================================================================
// HOME VIEW INTERACTIVITY
// ==========================================================================

function initHomeListeners() {
  // Modal scheduler triggers
  const openBtn = document.getElementById("open-scheduler-btn");
  if (openBtn) {
    openBtn.addEventListener("click", () => {
      toggleModal(true);
    });
  }

  // Repository Explorer File click interaction
  const fileItems = document.querySelectorAll(".tree-item.file");
  fileItems.forEach(item => {
    item.addEventListener("click", (e) => {
      const fileName = item.getAttribute("data-file");
      openMockFile(fileName, item);
    });
  });

  // Repository Explorer Console Tabs
  const consoleTabs = document.querySelectorAll(".console-tab");
  consoleTabs.forEach(tab => {
    tab.addEventListener("click", () => {
      consoleTabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      
      const tabType = tab.getAttribute("data-tab");
      const dynamicBox = document.getElementById("console-dynamic-content");
      if (!dynamicBox) return;
      
      if (tabType === "explorer") {
        dynamicBox.innerHTML = `
          <ul class="file-tree" id="explorer-tree">
            <li class="tree-item folder" data-path="crednpay"><i class="lucide-folder"></i> crednpay/</li>
            <li class="tree-item file" data-file="crednpay/locking.py"><i class="lucide-file-code"></i> locking.py</li>
            <li class="tree-item folder" data-path="codecheck"><i class="lucide-folder"></i> codecheck/</li>
            <li class="tree-item file" data-file="codecheck/sandbox.go"><i class="lucide-file-code"></i> sandbox.go</li>
            <li class="tree-item folder" data-path="ecommerce"><i class="lucide-folder"></i> ecommerce/</li>
            <li class="tree-item file" data-file="ecommerce/instagram_stream.js"><i class="lucide-file-code"></i> instagram_stream.js</li>
          </ul>
        `;
        // Re-attach listeners to new files
        initHomeListeners();
      } else if (tabType === "sitemap") {
        dynamicBox.innerHTML = `
          <pre class="code-view-container"><code>${MOCK_FILES["system_schematic.json"]}</code></pre>
        `;
      }
    });
  });
}

function openMockFile(fileName, clickedElement) {
  const dynamicBox = document.getElementById("console-dynamic-content");
  if (!dynamicBox) return;
  
  // Build a back-button file preview header
  dynamicBox.innerHTML = `
    <div style="margin-bottom: 0.5rem; display:flex; justify-content:space-between; align-items:center;">
      <span style="font-family:var(--font-mono); font-size:0.75rem; color:var(--secondary);"><i class="lucide-file-text"></i> ${fileName}</span>
      <button class="cyber-btn secondary" id="console-back-btn" style="padding: 0.2rem 0.5rem; font-size: 0.65rem; border-radius:3px;">
        <i class="lucide-arrow-left"></i> BACK
      </button>
    </div>
    <pre class="code-view-container" style="max-height: 280px; overflow-y:auto; border-top: 1px solid var(--border-color); padding-top:0.5rem;"><code>${MOCK_FILES[fileName]}</code></pre>
  `;

  document.getElementById("console-back-btn").addEventListener("click", () => {
    // Return to default file list
    const sitemapTab = document.querySelector('[data-tab="explorer"]');
    if (sitemapTab) sitemapTab.click();
  });
}

// ==========================================================================
// SYSTEMS VIEW INTERACTIVITY & SIMULATORS
// ==========================================================================

function initSystemsListeners() {
  const sysTabs = document.querySelectorAll(".sys-sidebar-btn");
  const caseViewport = document.getElementById("case-study-viewport");
  
  if (!caseViewport) return;
  
  // Render default/active case study
  caseViewport.innerHTML = CASE_STUDIES[activeSystem];
  initActiveSimulator();
  
  sysTabs.forEach(tab => {
    // Mark the correct tab active visually on reload
    if (tab.getAttribute("data-sys") === activeSystem) {
      tab.classList.add("active");
    } else {
      tab.classList.remove("active");
    }
    
    tab.addEventListener("click", () => {
      sysTabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      
      activeSystem = tab.getAttribute("data-sys");
      caseViewport.innerHTML = CASE_STUDIES[activeSystem];
      initActiveSimulator();
    });
  });
}

function initActiveSimulator() {
  if (activeSystem === "crednpay") {
    const runBtn = document.getElementById("run-lock-sim");
    if (runBtn) {
      runBtn.addEventListener("click", executeLockSimulation);
    }
  } else if (activeSystem === "codecheck") {
    const runBtn = document.getElementById("run-sandbox-sim");
    if (runBtn) {
      runBtn.addEventListener("click", executeSandboxSimulation);
    }
  } else if (activeSystem === "ecommerce") {
    const runBtn = document.getElementById("run-stream-sim");
    if (runBtn) {
      runBtn.addEventListener("click", executeWebhookStreamSimulation);
    }
  }
}

// SIMULATOR A: TRANSACTION LOCKS
function executeLockSimulation() {
  const runBtn = document.getElementById("run-lock-sim");
  runBtn.disabled = true;
  runBtn.style.opacity = 0.5;

  const t1Status = document.getElementById("tx1-status");
  const t2Status = document.getElementById("tx2-status");
  const t1Term = document.getElementById("tx1-term");
  const t2Term = document.getElementById("tx2-term");

  t1Status.className = "transaction-status status-running";
  t1Status.innerText = "RUNNING";
  t1Term.innerHTML = `> BEGIN TRANSACTION;<br>> SELECT FOR UPDATE row_id: 101;`;

  // Transaction 2 begins immediately after but is blocked
  setTimeout(() => {
    t2Status.className = "transaction-status status-locked";
    t2Status.innerText = "BLOCKED (LOCK QUEUE)";
    t2Term.innerHTML = `> BEGIN TRANSACTION;<br>> SELECT FOR UPDATE row_id: 101;<br><span style="color:var(--yellow)">* WAITING FOR ROW ACCESS LOCK...</span>`;
  }, 600);

  // Transaction 1 updates and commits
  setTimeout(() => {
    t1Term.innerHTML += `<br>> UPDATE accounts SET balance = balance + 50 WHERE id = 101;<br>> COMMIT;`;
    t1Status.className = "transaction-status status-complete";
    t1Status.innerText = "COMMITTED";
  }, 2200);

  // Transaction 2 immediately gains lock and executes
  setTimeout(() => {
    t2Status.className = "transaction-status status-running";
    t2Status.innerText = "RUNNING";
    t2Term.innerHTML += `<br><span style="color:var(--green)">* LOCK ACQUIRED (Tx1 committed)</span><br>> UPDATE accounts SET balance = balance - 20 WHERE id = 101;<br>> COMMIT;`;
  }, 2800);

  // Transaction 2 commits
  setTimeout(() => {
    t2Status.className = "transaction-status status-complete";
    t2Status.innerText = "COMMITTED";
    
    // Enable button again
    runBtn.disabled = false;
    runBtn.style.opacity = 1;
  }, 4200);
}

// SIMULATOR B: FIRECRACKER SECURE SANDBOX
function executeSandboxSimulation() {
  const runBtn = document.getElementById("run-sandbox-sim");
  runBtn.disabled = true;
  runBtn.style.opacity = 0.5;

  const sbId = document.getElementById("sandbox-id");
  const sbState = document.getElementById("sandbox-state");
  const sbTerm = document.getElementById("sandbox-term");
  const cpuBar = document.getElementById("cpu-bar");
  const memBar = document.getElementById("mem-bar");
  const cpuVal = document.getElementById("cpu-val");
  const memVal = document.getElementById("mem-val");

  sbId.innerText = "JAIL-VM-4820";
  sbState.innerText = "INITIALIZING";
  sbState.className = "text-green";
  sbTerm.innerHTML = `> INITIALIZING VMM DAEMON...<br>> MOUNTING ROOTFS (READ ONLY)...<br>> guest_kernel booting...`;

  // VM Boot complete
  setTimeout(() => {
    sbState.innerText = "RUNNING (SECURE)";
    sbTerm.innerHTML += `<br><span style="color:var(--green)">* VMM INITIALIZED IN 3.42ms</span><br>> Spawning compiler container...<br>> Executing user code...`;
    cpuBar.style.width = "40%";
    cpuVal.innerText = "40%";
    memBar.style.width = "30%";
    memVal.innerText = "76MB / 256MB";
  }, 1200);

  // User program hits infinite memory consumption loops (simulating mitigation)
  setTimeout(() => {
    sbTerm.innerHTML += `<br><span style="color:var(--yellow)">! WARNING: High memory growth detected. Enforcing limits...</span>`;
    cpuBar.style.width = "95%";
    cpuVal.innerText = "95%";
    cpuBar.classList.add("warning");
    memBar.style.width = "85%";
    memVal.innerText = "218MB / 256MB";
    memBar.classList.add("warning");
  }, 2800);

  // VM Jail limits halt code execution before OOM
  setTimeout(() => {
    sbState.innerText = "HALTED (LIMIT EXCEEDED)";
    sbState.className = "text-muted"
    sbTerm.innerHTML += `<br><span style="color:var(--red)">* SHIELD TRIGGERED: Hard limits reached. MicroVM isolated.</span><br>> Process killed safely. Zero host leaks.`;
    cpuBar.style.width = "0%";
    cpuVal.innerText = "0%";
    cpuBar.classList.remove("warning");
    memBar.style.width = "0%";
    memVal.innerText = "0MB / 256MB";
    memBar.classList.remove("warning");
    
    // Enable button again
    runBtn.disabled = false;
    runBtn.style.opacity = 1;
  }, 4800);
}

// SIMULATOR C: WEBHOOK STREAM
function executeWebhookStreamSimulation() {
  const runBtn = document.getElementById("run-stream-sim");
  runBtn.disabled = true;
  runBtn.style.opacity = 0.5;

  const streamLogs = document.getElementById("stream-logs");
  const qCount = document.getElementById("queue-count");
  
  streamLogs.innerHTML = ``;
  let activeWebhooks = 0;
  
  const eventTypes = ['post', 'comment', 'mention'];
  const eventNames = {
    post: 'IG_MEDIA_PUBLISHED',
    comment: 'IG_COMMENT_RECEIVED',
    mention: 'IG_USER_MENTIONED'
  };

  let emitted = 0;
  
  // Start pushing webhooks concurrently
  const interval = setInterval(() => {
    if (emitted >= 30) {
      clearInterval(interval);
      setTimeout(() => {
        runBtn.disabled = false;
        runBtn.style.opacity = 1;
      }, 3000);
      return;
    }
    
    emitted++;
    activeWebhooks++;
    
    const evType = eventTypes[Math.floor(Math.random() * eventTypes.length)];
    const evName = eventNames[evType];
    const txnId = Math.floor(100000 + Math.random() * 900000);
    
    qCount.innerText = activeWebhooks;
    qCount.className = "text-green";
    
    const bubble = document.createElement("div");
    bubble.className = "webhook-bubble";
    bubble.innerHTML = `
      <span><span class="bubble-tag ${evType}">${evName}</span> ID: ${txnId}</span>
      <span class="text-muted">${new Date().toLocaleTimeString()}</span>
    `;
    streamLogs.prepend(bubble);
    
    // Processed with variable latency simulating the queue bucket
    setTimeout(() => {
      activeWebhooks--;
      qCount.innerText = activeWebhooks === 0 ? "EMPTY" : activeWebhooks;
      
      const doneLog = document.createElement("div");
      doneLog.className = "terminal-line";
      doneLog.style.fontSize = "0.7rem";
      doneLog.style.color = "var(--text-muted)";
      doneLog.innerHTML = `* Sync check finished for Ingestion ID ${txnId}. Rate limits avoided.`;
      streamLogs.prepend(doneLog);
    }, 1000 + Math.random() * 1500);
    
  }, 100);
}

// ==========================================================================
// RUNTIME VIEW INTERACTIVITY
// ==========================================================================

function initRuntimeListeners() {
  // Can add specific interactivity here if needed
}

// ==========================================================================
// SCHEDULER MODAL (ACTION NODE) LOGIC
// ==========================================================================

function toggleModal(show) {
  const modal = document.getElementById("scheduler-modal");
  if (!modal) return;
  
  if (show) {
    modal.classList.remove("hidden");
    // Default the date picker to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateInput = document.getElementById("sched-date");
    if (dateInput) {
      dateInput.min = tomorrow.toISOString().split("T")[0];
      dateInput.value = tomorrow.toISOString().split("T")[0];
    }
  } else {
    modal.classList.add("hidden");
    // Reset state when closing
    document.getElementById("scheduler-form").classList.remove("hidden");
    document.getElementById("scheduler-success").classList.add("hidden");
  }
}

// Document load configurations
document.addEventListener("DOMContentLoaded", () => {
  // Router initial navigation
  navigate();
  window.addEventListener("hashchange", navigate);
  
  // Attach modal close events
  const closeBtn = document.getElementById("close-modal-btn");
  if (closeBtn) {
    closeBtn.addEventListener("click", () => toggleModal(false));
  }
  
  const successCloseBtn = document.getElementById("success-close-btn");
  if (successCloseBtn) {
    successCloseBtn.addEventListener("click", () => toggleModal(false));
  }
  
  const modalOverlay = document.getElementById("scheduler-modal");
  if (modalOverlay) {
    modalOverlay.addEventListener("click", (e) => {
      // Close modal if user clicks the dark overlay, but not the card itself
      if (e.target === modalOverlay) {
        toggleModal(false);
      }
    });
  }
  
  // Form submission handler
  const form = document.getElementById("scheduler-form");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      
      const name = document.getElementById("sched-name").value;
      const email = document.getElementById("sched-email").value;
      const date = document.getElementById("sched-date").value;
      const time = document.getElementById("sched-time").value;
      const topic = document.getElementById("sched-topic").value;
      
      // Hide form, show success state
      form.classList.add("hidden");
      const successDiv = document.getElementById("scheduler-success");
      successDiv.classList.remove("hidden");
      
      // Populate receipt parameters
      document.getElementById("receipt-ref").innerText = "SYS-" + Math.floor(1000 + Math.random() * 9000) + "-X";
      document.getElementById("receipt-email").innerText = email.toUpperCase();
      document.getElementById("receipt-time").innerText = `${date} @ ${time} EST`;
    });
  }
  
  // Global modal opening handler delegator for dynically injected content
  document.addEventListener("click", (e) => {
    const target = e.target.closest("#open-scheduler-btn");
    if (target) {
      toggleModal(true);
    }
  });
});
