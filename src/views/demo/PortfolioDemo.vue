<template>
  <main class="demo-workstation" :style="{ '--surface-image': `url(${surfaceImageUrl})` }">
    <header class="demo-header">
      <div class="demo-brand">
        <span class="demo-mark" aria-hidden="true"><i></i><i></i><i></i></span>
        <div>
          <strong>VISION GRID</strong>
          <span>工业表面视觉检测工作站</span>
        </div>
      </div>

      <nav class="demo-nav" aria-label="演示页面">
        <button
          v-for="view in views"
          :key="view.key"
          type="button"
          :class="{ active: activeView === view.key }"
          @click="activeView = view.key"
        >
          <span>{{ view.index }}</span>{{ view.label }}
        </button>
      </nav>

      <div class="demo-meta">
        <span class="demo-online"><i></i>系统在线</span>
        <span>2026.08.17&nbsp;&nbsp;14:32:08</span>
      </div>
    </header>

    <div class="demo-disclosure">
      <span>DEMO / SYNTHETIC DATA</span>
      <p>公开演示界面 · 图像与业务数据均为合成内容</p>
    </div>

    <section v-if="activeView === 'live'" class="demo-view live-view" data-testid="portfolio-demo-live">
      <div class="context-strip">
        <div v-for="item in contextItems" :key="item.label" class="context-item">
          <span>{{ item.label }}</span>
          <strong>{{ item.value }}</strong>
          <small>{{ item.note }}</small>
        </div>
      </div>

      <div class="live-grid">
        <section class="inspection-stage">
          <div class="section-heading">
            <div>
              <span>01 / LIVE INSPECTION</span>
              <h1>表面检测流</h1>
            </div>
            <div class="stream-meta"><i></i>CAM 02 · 04 · 06 / FUSED</div>
          </div>

          <div class="scan-frame">
            <img :src="surfaceImageUrl" alt="合成工业材料表面线扫图" />
            <div class="scan-shade"></div>
            <div class="scan-line" aria-hidden="true"></div>
            <button
              v-for="defect in defects"
              :key="defect.id"
              type="button"
              class="defect-box"
              :class="[{ active: selectedDefectId === defect.id }, `defect-box--${defect.id}`]"
              :aria-label="`查看${defect.type}`"
              @click="selectedDefectId = defect.id"
            >
              <span>{{ defect.code }}</span>
            </button>
            <div class="frame-corner frame-corner--tl"></div>
            <div class="frame-corner frame-corner--tr"></div>
            <div class="frame-corner frame-corner--bl"></div>
            <div class="frame-corner frame-corner--br"></div>
            <div class="frame-footer">
              <span>FRAME 0001842</span>
              <span>LINE RATE 24.8 kHz</span>
              <span>END-TO-END 86 ms</span>
            </div>
          </div>

          <div class="coverage-track">
            <div class="coverage-copy"><span>当前工件覆盖</span><strong>8.42 / 12.00 m</strong></div>
            <div class="coverage-line">
              <i class="coverage-progress"></i>
              <button
                v-for="defect in defects"
                :key="`marker-${defect.id}`"
                type="button"
                class="coverage-marker"
                :class="{ active: selectedDefectId === defect.id }"
                :style="{ left: `${defect.positionPercent}%` }"
                @click="selectedDefectId = defect.id"
              ><span>{{ defect.code }}</span></button>
            </div>
            <div class="coverage-scale"><span>0 m</span><span>3</span><span>6</span><span>9</span><span>12 m</span></div>
          </div>
        </section>

        <aside class="evidence-panel">
          <div class="section-heading section-heading--compact">
            <div>
              <span>02 / EVIDENCE</span>
              <h2>异常证据</h2>
            </div>
            <span class="severity-tag">{{ selectedDefect.severity }}</span>
          </div>
          <div class="evidence-image" :class="`evidence-image--${selectedDefect.id}`">
            <img :src="surfaceImageUrl" alt="选中的合成缺陷局部图" />
            <i></i>
            <span>{{ selectedDefect.code }}</span>
          </div>
          <div class="evidence-title">
            <div><span>候选类型</span><strong>{{ selectedDefect.type }}</strong></div>
            <b>{{ selectedDefect.confidence }}</b>
          </div>
          <dl class="evidence-metrics">
            <div><dt>位置</dt><dd>{{ selectedDefect.position }}</dd></div>
            <div><dt>尺寸</dt><dd>{{ selectedDefect.size }}</dd></div>
            <div><dt>来源</dt><dd>{{ selectedDefect.camera }}</dd></div>
            <div><dt>处置</dt><dd>等待人工复核</dd></div>
          </dl>
          <div class="decision-trail">
            <p>判断链路</p>
            <div v-for="(step, index) in selectedDefect.steps" :key="step">
              <span>0{{ index + 1 }}</span><strong>{{ step }}</strong><i></i>
            </div>
          </div>
        </aside>
      </div>

      <div class="live-footer-grid">
        <section class="camera-ribbon">
          <div class="footer-heading"><span>六视角覆盖</span><small>6 / 6 CONNECTED</small></div>
          <div class="camera-list">
            <button
              v-for="camera in cameras"
              :key="camera.no"
              type="button"
              :class="{ active: camera.no === selectedDefect.cameraNo }"
              @click="selectCameraDefect(camera.no)"
            >
              <span class="camera-preview" :style="{ backgroundPosition: camera.position }"><i></i></span>
              <strong>CAM {{ camera.no }}</strong>
              <small>{{ camera.latency }} ms</small>
            </button>
          </div>
        </section>

        <section class="runtime-panel">
          <div class="footer-heading"><span>运行指标</span><small>ROLLING 60 S</small></div>
          <div class="runtime-list">
            <div v-for="metric in runtimeMetrics" :key="metric.label">
              <span>{{ metric.label }}</span><strong>{{ metric.value }}</strong><small>{{ metric.unit }}</small>
            </div>
          </div>
        </section>
      </div>
    </section>

    <section v-else-if="activeView === 'trace'" class="demo-view trace-view" data-testid="portfolio-demo-trace">
      <div class="trace-heading page-heading">
        <div><span>02 / TRACEABILITY</span><h1>检测历史与证据回溯</h1></div>
        <p>从工件记录进入图像证据，保留模型判断、人工复核与版本信息。</p>
      </div>

      <div class="trace-filter">
        <div><span>时间范围</span><strong>2026.08.17&nbsp;&nbsp;08:00 — 16:00</strong></div>
        <div><span>风险等级</span><strong>全部等级</strong></div>
        <div><span>复核状态</span><strong>待复核 + 已确认</strong></div>
        <button type="button">筛选记录 <span>18</span></button>
      </div>

      <div class="trace-grid">
        <section class="record-list">
          <div class="record-table-head"><span>工件 / 批次</span><span>检测时间</span><span>异常</span><span>状态</span></div>
          <button
            v-for="record in historyRecords"
            :key="record.id"
            type="button"
            :class="{ active: selectedRecordId === record.id }"
            @click="selectedRecordId = record.id"
          >
            <span><strong>{{ record.id }}</strong><small>{{ record.batch }}</small></span>
            <span>{{ record.time }}</span>
            <span><b>{{ record.defects }}</b> 项</span>
            <span class="record-status">{{ record.status }}</span>
          </button>
        </section>

        <section class="trace-detail">
          <div class="section-heading">
            <div><span>SELECTED RECORD</span><h2>{{ selectedRecord.id }}</h2></div>
            <span class="trace-version">MODEL V3.8.2</span>
          </div>
          <div class="trace-image">
            <img :src="surfaceImageUrl" alt="合成历史检测证据图" />
            <i></i><span>ANOMALY / 02</span>
          </div>
          <div class="trace-summary">
            <div><span>批次</span><strong>{{ selectedRecord.batch }}</strong></div>
            <div><span>覆盖长度</span><strong>12.00 m</strong></div>
            <div><span>图像证据</span><strong>3,648 帧</strong></div>
            <div><span>异常候选</span><strong>{{ selectedRecord.defects }} 项</strong></div>
          </div>
          <div class="audit-list">
            <div><span>14:28:16.083</span><strong>采集完成</strong><small>六视角图像索引已冻结</small></div>
            <div><span>14:28:16.169</span><strong>算法完成</strong><small>异常定位与类型识别完成</small></div>
            <div><span>14:31:42.612</span><strong>人工复核</strong><small>确认 2 项，忽略 1 项</small></div>
          </div>
        </section>
      </div>
    </section>

    <section v-else class="demo-view governance-view" data-testid="portfolio-demo-governance">
      <div class="page-heading">
        <div><span>03 / MODEL GOVERNANCE</span><h1>模型与检测链路治理</h1></div>
        <p>把采集、预处理、异常候选、缺陷识别和复核做成可观测、可切换的生产链路。</p>
      </div>

      <div class="pipeline-board">
        <div v-for="(stage, index) in pipelineStages" :key="stage.name" class="pipeline-stage">
          <span>0{{ index + 1 }}</span>
          <div><small>{{ stage.eyebrow }}</small><strong>{{ stage.name }}</strong><p>{{ stage.detail }}</p></div>
          <i></i>
        </div>
      </div>

      <div class="governance-grid">
        <section class="model-registry">
          <div class="section-heading"><div><span>ACTIVE MODELS</span><h2>当前生效模型</h2></div><b>3 ACTIVE</b></div>
          <div class="model-table-head"><span>阶段</span><span>版本</span><span>验证集</span><span>状态</span></div>
          <div v-for="model in models" :key="model.stage" class="model-row">
            <span><i></i>{{ model.stage }}</span><strong>{{ model.version }}</strong><span>{{ model.validation }}</span><b>{{ model.status }}</b>
          </div>
        </section>

        <section class="health-panel">
          <div class="section-heading"><div><span>PIPELINE HEALTH</span><h2>链路健康</h2></div><b>STABLE</b></div>
          <div class="health-ring"><span>99.3<small>%</small></span><p>最近 24 小时可用性</p></div>
          <div class="health-list">
            <div><span>帧入口队列</span><strong>12</strong><small>HEALTHY</small></div>
            <div><span>算法处理端点</span><strong>10 / 12</strong><small>AVAILABLE</small></div>
            <div><span>证据持久化</span><strong>0</strong><small>BACKLOG</small></div>
          </div>
        </section>

        <section class="release-log">
          <div class="section-heading"><div><span>CHANGE CONTROL</span><h2>版本审计</h2></div><b>LAST 30 D</b></div>
          <div v-for="log in releaseLogs" :key="log.version">
            <span>{{ log.date }}</span><strong>{{ log.version }}</strong><p>{{ log.note }}</p><small>{{ log.state }}</small>
          </div>
        </section>
      </div>
    </section>

    <footer class="demo-footer">
      <span>ANONYMIZED INDUSTRIAL VISION DEMONSTRATION</span>
      <span>NO PRODUCTION DATA · NO CLIENT IDENTIFIERS · SYNTHETIC IMAGERY</span>
    </footer>
  </main>
</template>

<script>
const views = [
  { key: 'live', index: '01', label: '实时检测' },
  { key: 'trace', index: '02', label: '历史追溯' },
  { key: 'governance', index: '03', label: '模型治理' },
]

const defects = [
  {
    id: 'd1', code: 'A-01', type: '纵向划伤', confidence: '94.8%', severity: '一般风险',
    position: '2.86 m', positionPercent: 24, size: '18.4 × 1.2 mm', camera: 'CAM 02', cameraNo: 2,
    steps: ['表面区域分割完成', '异常候选定位', '缺陷类型确认'],
  },
  {
    id: 'd2', code: 'A-02', type: '浅表压痕', confidence: '92.1%', severity: '中等风险',
    position: '6.18 m', positionPercent: 52, size: '9.8 × 6.1 mm', camera: 'CAM 04', cameraNo: 4,
    steps: ['表面区域分割完成', '局部形态异常', '多视角证据融合'],
  },
  {
    id: 'd3', code: 'A-03', type: '暗色夹杂', confidence: '88.6%', severity: '待确认',
    position: '10.24 m', positionPercent: 85, size: '3.6 × 3.1 mm', camera: 'CAM 06', cameraNo: 6,
    steps: ['表面区域分割完成', '灰度异常候选', '等待人工复核'],
  },
]

const historyRecords = [
  { id: 'MAT-24-A17', batch: 'DEMO-BATCH-0824', time: '14:28:16', defects: 3, status: '已复核' },
  { id: 'MAT-24-A16', batch: 'DEMO-BATCH-0824', time: '14:16:42', defects: 1, status: '已确认' },
  { id: 'MAT-24-A15', batch: 'DEMO-BATCH-0823', time: '14:04:08', defects: 0, status: '自动通过' },
  { id: 'MAT-24-A14', batch: 'DEMO-BATCH-0823', time: '13:51:27', defects: 2, status: '待复核' },
  { id: 'MAT-24-A13', batch: 'DEMO-BATCH-0823', time: '13:38:59', defects: 1, status: '已确认' },
]

export default {
  name: 'PortfolioDemo',
  data() {
    return {
      views,
      activeView: 'live',
      selectedDefectId: 'd2',
      selectedRecordId: historyRecords[0].id,
      surfaceImageUrl: '/demo/synthetic-line-scan-surface.png',
      defects,
      historyRecords,
      contextItems: [
        { label: '工件 ID', value: 'MAT-24-A17', note: 'DEMO' },
        { label: '生产批次', value: 'DEMO-BATCH-0824', note: 'SHIFT B' },
        { label: '当前区段', value: 'S-04 / 06', note: 'ACTIVE' },
        { label: '覆盖长度', value: '8.42 m', note: '12.00 m' },
        { label: '运行速度', value: '12.6 m/min', note: 'STABLE' },
      ],
      cameras: [
        { no: 1, latency: 72, position: '8% center' },
        { no: 2, latency: 76, position: '22% center' },
        { no: 3, latency: 74, position: '38% center' },
        { no: 4, latency: 81, position: '52% center' },
        { no: 5, latency: 79, position: '69% center' },
        { no: 6, latency: 83, position: '86% center' },
      ],
      runtimeMetrics: [
        { label: '端到端延迟', value: '86', unit: 'ms' },
        { label: '处理吞吐', value: '42.8', unit: 'fps' },
        { label: '待处理帧', value: '12', unit: 'frames' },
        { label: '链路可用性', value: '99.3', unit: '%' },
      ],
      pipelineStages: [
        { eyebrow: 'EDGE', name: '多相机采集', detail: '分流预览与正式检测帧' },
        { eyebrow: 'VISION', name: '表面预处理', detail: 'ROI 定位与有效区域提取' },
        { eyebrow: 'ANOMALY', name: '异常候选', detail: '定位偏离正常分布的区域' },
        { eyebrow: 'DETECTION', name: '缺陷识别', detail: '分类、定位与风险分级' },
        { eyebrow: 'REVIEW', name: '证据闭环', detail: '人工复核与样本回流' },
      ],
      models: [
        { stage: '表面预处理', version: 'PRE-V2.4.1', validation: '2026.08.12', status: 'ACTIVE' },
        { stage: '异常候选', version: 'ANO-V1.9.0', validation: '2026.08.11', status: 'ACTIVE' },
        { stage: '缺陷识别', version: 'DET-V3.8.2', validation: '2026.08.14', status: 'ACTIVE' },
      ],
      releaseLogs: [
        { date: '08.14', version: 'DET-V3.8.2', note: '完成困难负样本回归验证', state: 'ROLLED OUT' },
        { date: '08.11', version: 'ANO-V1.9.0', note: '更新正常分布参考集', state: 'VERIFIED' },
        { date: '08.02', version: 'PRE-V2.4.1', note: '收紧有效表面区域边界', state: 'ROLLED OUT' },
      ],
    }
  },
  computed: {
    selectedDefect() {
      return this.defects.find((item) => item.id === this.selectedDefectId) || this.defects[0]
    },
    selectedRecord() {
      return this.historyRecords.find((item) => item.id === this.selectedRecordId) || this.historyRecords[0]
    },
  },
  methods: {
    selectCameraDefect(cameraNo) {
      const linked = this.defects.find((item) => item.cameraNo === cameraNo)
      if (linked) this.selectedDefectId = linked.id
    },
  },
  mounted() {
    this.previousDocumentTitle = document.title
    document.title = '工业表面视觉检测工作站 / DEMO'
  },
  beforeUnmount() {
    if (this.previousDocumentTitle) document.title = this.previousDocumentTitle
  },
}
</script>

<style scoped>
.demo-workstation {
  --bg: #101211;
  --surface: #171a18;
  --surface-2: #1e211f;
  --line: rgba(235, 238, 232, 0.14);
  --line-strong: rgba(235, 238, 232, 0.28);
  --text: #edf0ea;
  --muted: #919891;
  --dim: #626862;
  --cyan: #82d5ce;
  --amber: #e0a452;
  --amber-soft: rgba(224, 164, 82, 0.14);
  min-height: 100vh;
  padding: 0 30px;
  overflow: hidden;
  color: var(--text);
  background:
    radial-gradient(circle at 74% -20%, rgba(130, 213, 206, 0.08), transparent 32%),
    linear-gradient(180deg, #111412, #0c0e0d 70%);
  font-family: Inter, "SF Pro Display", "PingFang SC", "Microsoft YaHei", sans-serif;
  font-variant-numeric: tabular-nums;
}

button { color: inherit; font: inherit; }

.demo-header {
  height: 86px;
  display: grid;
  grid-template-columns: minmax(290px, 1fr) auto minmax(290px, 1fr);
  align-items: center;
  border-bottom: 1px solid var(--line);
}

.demo-brand { display: flex; align-items: center; gap: 15px; }
.demo-brand > div { display: grid; gap: 4px; }
.demo-brand strong { font-size: 17px; letter-spacing: .16em; }
.demo-brand span:last-child { color: var(--muted); font-size: 11px; letter-spacing: .08em; }
.demo-mark { position: relative; width: 40px; height: 40px; display: grid; place-items: center; border: 1px solid var(--line-strong); border-radius: 50%; }
.demo-mark::before { content: ""; width: 8px; height: 8px; border: 2px solid var(--cyan); border-radius: 50%; }
.demo-mark i { position: absolute; width: 3px; height: 3px; background: var(--cyan); border-radius: 50%; }
.demo-mark i:nth-child(1) { top: 6px; }
.demo-mark i:nth-child(2) { right: 7px; bottom: 9px; }
.demo-mark i:nth-child(3) { left: 7px; bottom: 9px; }

.demo-nav { align-self: stretch; display: flex; }
.demo-nav button { position: relative; min-width: 126px; border: 0; border-left: 1px solid var(--line); background: transparent; color: var(--muted); cursor: pointer; transition: color .25s, background .25s; }
.demo-nav button:last-child { border-right: 1px solid var(--line); }
.demo-nav button span { display: block; margin-bottom: 5px; color: var(--dim); font-size: 9px; letter-spacing: .12em; }
.demo-nav button::after { content: ""; position: absolute; left: 22px; right: 22px; bottom: 0; height: 2px; background: var(--cyan); transform: scaleX(0); transition: transform .25s; }
.demo-nav button:hover, .demo-nav button.active { color: var(--text); background: rgba(255,255,255,.025); }
.demo-nav button.active::after { transform: scaleX(1); }

.demo-meta { justify-self: end; display: flex; align-items: center; gap: 24px; color: var(--muted); font-size: 11px; letter-spacing: .08em; }
.demo-online { display: flex; align-items: center; gap: 8px; color: var(--text); }
.demo-online i, .stream-meta i { width: 7px; height: 7px; border-radius: 50%; background: var(--cyan); box-shadow: 0 0 0 5px rgba(130,213,206,.08); animation: statusPulse 2.2s ease-in-out infinite; }

.demo-disclosure { height: 34px; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid var(--line); color: var(--muted); font-size: 9px; letter-spacing: .11em; }
.demo-disclosure span { color: var(--amber); }
.demo-disclosure p { margin: 0; }

.demo-view { min-height: calc(100vh - 157px); padding: 20px 0 18px; }
.context-strip { display: grid; grid-template-columns: repeat(5, 1fr); border-block: 1px solid var(--line); }
.context-item { position: relative; min-height: 70px; padding: 14px 16px; border-right: 1px solid var(--line); }
.context-item:last-child { border-right: 0; }
.context-item span, .context-item small { display: block; color: var(--muted); font-size: 9px; letter-spacing: .1em; text-transform: uppercase; }
.context-item strong { display: block; margin-top: 9px; font-size: 15px; font-weight: 550; letter-spacing: .03em; }
.context-item small { position: absolute; right: 14px; top: 14px; color: var(--dim); font-size: 8px; }

.live-grid { display: grid; grid-template-columns: minmax(0, 1fr) 360px; gap: 18px; margin-top: 18px; }
.inspection-stage, .evidence-panel, .camera-ribbon, .runtime-panel, .record-list, .trace-detail, .pipeline-board, .model-registry, .health-panel, .release-log { border: 1px solid var(--line); background: rgba(23,26,24,.72); }
.inspection-stage { min-width: 0; padding: 18px; }
.section-heading { min-height: 48px; display: flex; align-items: flex-start; justify-content: space-between; gap: 20px; }
.section-heading > div:first-child > span, .page-heading > div > span { color: var(--cyan); font-size: 8px; letter-spacing: .16em; }
.section-heading h1, .section-heading h2 { margin: 6px 0 0; font-size: 19px; font-weight: 530; letter-spacing: -.02em; }
.stream-meta { display: flex; align-items: center; gap: 10px; color: var(--muted); font-size: 9px; letter-spacing: .1em; }

.scan-frame { position: relative; height: clamp(280px, 34vh, 390px); overflow: hidden; background: #1d201f; }
.scan-frame > img { width: 100%; height: 100%; object-fit: cover; filter: contrast(1.06) brightness(.8) saturate(.72); }
.scan-shade { position: absolute; inset: 0; background: linear-gradient(90deg, rgba(7,8,8,.28), transparent 16%, transparent 84%, rgba(7,8,8,.28)), linear-gradient(180deg, rgba(7,8,8,.12), transparent 55%, rgba(7,8,8,.28)); }
.scan-line { position: absolute; top: 0; bottom: 0; width: 1px; background: var(--cyan); box-shadow: 0 0 18px rgba(130,213,206,.9); animation: scan 6s linear infinite; }
.defect-box { position: absolute; width: 42px; height: 42px; border: 1px solid var(--amber); background: rgba(224,164,82,.05); cursor: pointer; transition: transform .25s, box-shadow .25s, background .25s; }
.defect-box span { position: absolute; left: -1px; bottom: calc(100% + 5px); padding: 3px 6px; background: var(--amber); color: #17130d; font-size: 8px; font-weight: 700; letter-spacing: .08em; }
.defect-box:hover, .defect-box.active { transform: scale(1.12); background: rgba(224,164,82,.16); box-shadow: 0 0 0 5px rgba(224,164,82,.08); }
.defect-box--d1 { left: 23%; top: 38%; width: 26px; height: 58px; }
.defect-box--d2 { left: 51%; top: 55%; width: 50px; height: 43px; }
.defect-box--d3 { left: 84%; top: 35%; width: 34px; height: 34px; }
.frame-corner { position: absolute; width: 18px; height: 18px; border-color: rgba(237,240,234,.48); }
.frame-corner--tl { left: 12px; top: 12px; border-left: 1px solid; border-top: 1px solid; }
.frame-corner--tr { right: 12px; top: 12px; border-right: 1px solid; border-top: 1px solid; }
.frame-corner--bl { left: 12px; bottom: 34px; border-left: 1px solid; border-bottom: 1px solid; }
.frame-corner--br { right: 12px; bottom: 34px; border-right: 1px solid; border-bottom: 1px solid; }
.frame-footer { position: absolute; left: 0; right: 0; bottom: 0; height: 27px; display: flex; align-items: center; justify-content: space-between; padding: 0 12px; background: rgba(9,10,10,.78); color: rgba(237,240,234,.7); font-size: 8px; letter-spacing: .1em; }

.coverage-track { display: grid; grid-template-columns: 125px minmax(0,1fr); column-gap: 20px; margin-top: 18px; }
.coverage-copy { grid-row: 1 / 3; display: grid; align-content: center; border-right: 1px solid var(--line); }
.coverage-copy span { color: var(--muted); font-size: 9px; }
.coverage-copy strong { margin-top: 7px; font-size: 13px; }
.coverage-line { position: relative; height: 16px; margin-top: 5px; border-bottom: 1px solid var(--line-strong); }
.coverage-progress { position: absolute; left: 0; bottom: -1px; width: 70%; height: 1px; background: var(--cyan); }
.coverage-marker { position: absolute; bottom: -4px; width: 7px; height: 7px; padding: 0; border: 0; border-radius: 50%; background: var(--amber); cursor: pointer; transform: translateX(-50%); }
.coverage-marker span { position: absolute; left: 50%; bottom: 11px; color: var(--muted); font-size: 7px; transform: translateX(-50%); }
.coverage-marker.active { box-shadow: 0 0 0 5px rgba(224,164,82,.12); }
.coverage-scale { display: flex; justify-content: space-between; color: var(--dim); font-size: 7px; }

.evidence-panel { padding: 18px; }
.section-heading--compact { min-height: 46px; }
.severity-tag { padding: 6px 9px; border: 1px solid rgba(224,164,82,.38); color: var(--amber); font-size: 8px; letter-spacing: .08em; }
.evidence-image { position: relative; height: 178px; overflow: hidden; background: #171918; }
.evidence-image img { width: 300%; height: 100%; object-fit: cover; max-width: none; filter: brightness(.82) contrast(1.12) saturate(.7); }
.evidence-image--d1 img { transform: translateX(-8%); }
.evidence-image--d2 img { transform: translateX(-33%); }
.evidence-image--d3 img { transform: translateX(-63%); }
.evidence-image i { position: absolute; left: 50%; top: 50%; width: 56px; height: 50px; border: 1px solid var(--amber); transform: translate(-50%,-50%); box-shadow: 0 0 0 999px rgba(8,9,9,.16); }
.evidence-image > span { position: absolute; left: 10px; top: 10px; padding: 4px 6px; background: var(--amber); color: #17130d; font-size: 8px; font-weight: 700; }
.evidence-title { display: flex; justify-content: space-between; align-items: flex-end; padding: 16px 0; border-bottom: 1px solid var(--line); }
.evidence-title > div { display: grid; gap: 5px; }
.evidence-title span, .evidence-metrics dt { color: var(--muted); font-size: 8px; }
.evidence-title strong { font-size: 17px; font-weight: 540; }
.evidence-title b { color: var(--amber); font-size: 22px; font-weight: 500; }
.evidence-metrics { display: grid; grid-template-columns: 1fr 1fr; margin: 0; padding: 13px 0; border-bottom: 1px solid var(--line); }
.evidence-metrics div { padding: 6px 0; }
.evidence-metrics dd { margin: 4px 0 0; font-size: 10px; }
.decision-trail { padding-top: 13px; }
.decision-trail p { margin: 0 0 9px; color: var(--muted); font-size: 8px; letter-spacing: .1em; }
.decision-trail > div { display: grid; grid-template-columns: 24px 1fr 7px; align-items: center; min-height: 28px; border-top: 1px solid var(--line); }
.decision-trail span { color: var(--dim); font-size: 8px; }
.decision-trail strong { font-size: 9px; font-weight: 500; }
.decision-trail i { width: 6px; height: 6px; border-radius: 50%; background: var(--cyan); }

.live-footer-grid { display: grid; grid-template-columns: minmax(0,1fr) 360px; gap: 18px; margin-top: 18px; }
.camera-ribbon, .runtime-panel { padding: 14px 16px; }
.footer-heading { display: flex; justify-content: space-between; margin-bottom: 10px; }
.footer-heading span { font-size: 10px; }
.footer-heading small { color: var(--cyan); font-size: 7px; letter-spacing: .12em; }
.camera-list { display: grid; grid-template-columns: repeat(6,1fr); gap: 8px; }
.camera-list button { min-width: 0; padding: 0 0 7px; border: 0; border-bottom: 1px solid var(--line); background: transparent; text-align: left; cursor: pointer; }
.camera-list button.active { border-color: var(--amber); }
.camera-preview { position: relative; display: block; height: 44px; margin-bottom: 6px; background-image: var(--surface-image); background-size: 650% auto; filter: brightness(.6) contrast(1.1); }
.camera-list button.active .camera-preview { filter: brightness(.86) contrast(1.12); }
.camera-preview i { position: absolute; left: 5px; top: 5px; width: 4px; height: 4px; border-radius: 50%; background: var(--cyan); }
.camera-list strong { font-size: 8px; font-weight: 550; }
.camera-list small { float: right; color: var(--muted); font-size: 7px; }
.runtime-list { display: grid; grid-template-columns: repeat(4,1fr); }
.runtime-list > div { display: grid; padding-left: 12px; border-left: 1px solid var(--line); }
.runtime-list span { color: var(--muted); font-size: 7px; }
.runtime-list strong { margin-top: 7px; font-size: 19px; font-weight: 500; }
.runtime-list small { color: var(--dim); font-size: 7px; }

.page-heading { display: flex; justify-content: space-between; align-items: flex-end; min-height: 80px; padding-bottom: 18px; border-bottom: 1px solid var(--line); }
.page-heading h1 { margin: 7px 0 0; font-size: clamp(28px, 3vw, 44px); font-weight: 500; letter-spacing: -.045em; }
.page-heading > p { max-width: 480px; margin: 0; color: var(--muted); font-size: 12px; line-height: 1.7; }
.trace-filter { display: grid; grid-template-columns: 1.5fr 1fr 1fr auto; margin-top: 18px; border: 1px solid var(--line); }
.trace-filter > div { display: grid; gap: 8px; padding: 16px 18px; border-right: 1px solid var(--line); }
.trace-filter span { color: var(--muted); font-size: 8px; }
.trace-filter strong { font-size: 11px; font-weight: 500; }
.trace-filter button { padding: 0 24px; border: 0; background: var(--cyan); color: #0b1614; cursor: pointer; font-size: 10px; font-weight: 650; }
.trace-filter button span { margin-left: 8px; color: inherit; }
.trace-grid { display: grid; grid-template-columns: .85fr 1.15fr; gap: 18px; margin-top: 18px; }
.record-list { min-height: 590px; padding: 12px 16px; }
.record-table-head, .record-list button { display: grid; grid-template-columns: 1.35fr 1fr .55fr .65fr; gap: 12px; align-items: center; }
.record-table-head { height: 36px; padding: 0 12px; border-bottom: 1px solid var(--line); color: var(--muted); font-size: 8px; }
.record-list button { width: 100%; min-height: 78px; padding: 0 12px; border: 0; border-bottom: 1px solid var(--line); background: transparent; text-align: left; cursor: pointer; }
.record-list button > span:first-child { display: grid; gap: 6px; }
.record-list button strong { font-size: 12px; font-weight: 550; }
.record-list button small, .record-list button > span { color: var(--muted); font-size: 9px; }
.record-list button b { color: var(--amber); font-size: 13px; }
.record-list button.active { background: rgba(130,213,206,.07); box-shadow: inset 2px 0 var(--cyan); }
.record-status { color: var(--cyan) !important; }
.trace-detail { min-height: 590px; padding: 18px; }
.trace-version { padding: 6px 9px; border: 1px solid var(--line-strong); color: var(--muted); font-size: 8px; }
.trace-image { position: relative; height: 245px; overflow: hidden; }
.trace-image img { width: 100%; height: 100%; object-fit: cover; filter: brightness(.74) contrast(1.08); }
.trace-image i { position: absolute; left: 51%; top: 55%; width: 55px; height: 45px; border: 1px solid var(--amber); }
.trace-image > span { position: absolute; left: calc(51% + 56px); top: calc(55% - 1px); padding: 4px 6px; background: var(--amber); color: #17130d; font-size: 8px; }
.trace-summary { display: grid; grid-template-columns: repeat(4,1fr); border-bottom: 1px solid var(--line); }
.trace-summary div { display: grid; gap: 8px; padding: 15px 12px; border-right: 1px solid var(--line); }
.trace-summary div:last-child { border-right: 0; }
.trace-summary span { color: var(--muted); font-size: 8px; }
.trace-summary strong { font-size: 11px; }
.audit-list { padding-top: 11px; }
.audit-list > div { display: grid; grid-template-columns: 110px 100px 1fr; align-items: center; min-height: 46px; border-bottom: 1px solid var(--line); }
.audit-list span, .audit-list small { color: var(--muted); font-size: 8px; }
.audit-list strong { font-size: 10px; font-weight: 550; }

.pipeline-board { display: grid; grid-template-columns: repeat(5,1fr); margin-top: 18px; }
.pipeline-stage { position: relative; min-height: 142px; display: grid; grid-template-columns: 34px 1fr; gap: 10px; padding: 20px 18px; border-right: 1px solid var(--line); }
.pipeline-stage:last-child { border-right: 0; }
.pipeline-stage > span { color: var(--dim); font-size: 8px; }
.pipeline-stage div { display: grid; align-content: start; }
.pipeline-stage small { color: var(--cyan); font-size: 7px; letter-spacing: .12em; }
.pipeline-stage strong { margin-top: 12px; font-size: 14px; font-weight: 540; }
.pipeline-stage p { margin: 8px 0 0; color: var(--muted); font-size: 9px; line-height: 1.5; }
.pipeline-stage > i { position: absolute; right: -4px; top: 50%; z-index: 2; width: 7px; height: 7px; border-top: 1px solid var(--cyan); border-right: 1px solid var(--cyan); transform: rotate(45deg); }
.pipeline-stage:last-child > i { display: none; }
.governance-grid { display: grid; grid-template-columns: 1.5fr .75fr; grid-template-rows: auto auto; gap: 18px; margin-top: 18px; }
.model-registry, .health-panel, .release-log { padding: 18px; }
.section-heading > b { color: var(--cyan); font-size: 8px; letter-spacing: .12em; }
.model-table-head, .model-row { display: grid; grid-template-columns: 1.3fr .8fr .8fr .55fr; align-items: center; gap: 12px; }
.model-table-head { min-height: 32px; color: var(--muted); font-size: 8px; border-bottom: 1px solid var(--line); }
.model-row { min-height: 65px; border-bottom: 1px solid var(--line); font-size: 9px; }
.model-row > span:first-child { display: flex; align-items: center; gap: 8px; color: var(--text); }
.model-row i { width: 6px; height: 6px; border-radius: 50%; background: var(--cyan); }
.model-row strong { font-weight: 550; }
.model-row span { color: var(--muted); }
.model-row b { color: var(--cyan); font-size: 8px; }
.health-panel { grid-column: 2; grid-row: 1 / 3; }
.health-ring { width: 165px; height: 165px; display: grid; place-content: center; margin: 18px auto; border: 1px solid var(--line-strong); border-radius: 50%; box-shadow: inset 0 0 0 14px rgba(130,213,206,.035); text-align: center; }
.health-ring span { font-size: 32px; font-weight: 460; }
.health-ring small { color: var(--cyan); font-size: 12px; }
.health-ring p { margin: 7px 0 0; color: var(--muted); font-size: 8px; }
.health-list div { display: grid; grid-template-columns: 1fr auto; min-height: 52px; align-items: center; border-top: 1px solid var(--line); }
.health-list span { color: var(--muted); font-size: 9px; }
.health-list strong { font-size: 12px; }
.health-list small { grid-column: 1 / -1; margin-top: -12px; color: var(--cyan); font-size: 7px; }
.release-log { grid-column: 1; }
.release-log > div:not(.section-heading) { display: grid; grid-template-columns: 65px 110px 1fr 80px; align-items: center; min-height: 50px; border-top: 1px solid var(--line); }
.release-log span, .release-log p, .release-log small { color: var(--muted); font-size: 8px; }
.release-log strong { font-size: 10px; }
.release-log p { margin: 0; }
.release-log small { color: var(--cyan); }

.demo-footer { height: 23px; display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--line); color: var(--dim); font-size: 7px; letter-spacing: .12em; }

@keyframes scan { from { left: 0; } to { left: 100%; } }
@keyframes statusPulse { 0%,100% { opacity: 1; } 50% { opacity: .45; } }

@media (max-width: 1180px) {
  .demo-workstation { padding-inline: 18px; overflow: auto; }
  .demo-header { grid-template-columns: 1fr auto; }
  .demo-nav { grid-column: 1 / -1; grid-row: 2; height: 52px; border-top: 1px solid var(--line); }
  .demo-nav button { flex: 1; }
  .demo-meta { grid-column: 2; }
  .demo-header { height: 132px; }
  .live-grid, .live-footer-grid { grid-template-columns: 1fr; }
  .context-strip { grid-template-columns: repeat(3,1fr); }
  .context-item:nth-child(3) { border-right: 0; }
  .context-item:nth-child(n+4) { border-top: 1px solid var(--line); }
  .evidence-panel { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  .evidence-panel .section-heading { grid-column: 1 / -1; }
  .decision-trail { grid-column: 2; }
  .trace-grid, .governance-grid { grid-template-columns: 1fr; }
  .health-panel { grid-column: 1; grid-row: auto; }
  .release-log { grid-column: 1; }
}

@media (max-width: 720px) {
  .demo-workstation { padding-inline: 12px; }
  .demo-brand span:last-child, .demo-meta > span:last-child { display: none; }
  .demo-meta { gap: 8px; }
  .demo-nav button { min-width: 0; font-size: 11px; }
  .demo-disclosure p { display: none; }
  .context-strip { grid-template-columns: 1fr 1fr; }
  .context-item:nth-child(2n) { border-right: 0; }
  .context-item:nth-child(3) { border-right: 1px solid var(--line); }
  .live-grid { margin-top: 12px; }
  .inspection-stage, .evidence-panel { padding: 12px; }
  .scan-frame { height: 230px; }
  .coverage-track { grid-template-columns: 1fr; }
  .coverage-copy { grid-row: auto; padding-bottom: 10px; border-right: 0; }
  .evidence-panel { display: block; }
  .camera-list { grid-template-columns: repeat(3,1fr); }
  .runtime-list { grid-template-columns: 1fr 1fr; row-gap: 16px; }
  .page-heading { display: block; }
  .page-heading > p { margin-top: 18px; }
  .trace-filter { grid-template-columns: 1fr 1fr; }
  .trace-filter > div:nth-child(2) { border-right: 0; }
  .trace-filter button { min-height: 48px; }
  .record-list { min-height: auto; }
  .record-table-head, .record-list button { grid-template-columns: 1.2fr .8fr .5fr; }
  .record-table-head span:nth-child(2), .record-list button > span:nth-child(2) { display: none; }
  .trace-summary { grid-template-columns: 1fr 1fr; }
  .pipeline-board { grid-template-columns: 1fr; }
  .pipeline-stage { border-right: 0; border-bottom: 1px solid var(--line); }
  .pipeline-stage > i { display: none; }
  .model-table-head, .model-row { grid-template-columns: 1.2fr .8fr .6fr; }
  .model-table-head span:nth-child(3), .model-row span:nth-child(3) { display: none; }
  .release-log > div:not(.section-heading) { grid-template-columns: 55px 90px 1fr; }
  .release-log small { display: none; }
}

@media (prefers-reduced-motion: reduce) {
  .scan-line, .demo-online i, .stream-meta i { animation: none; }
}
</style>
