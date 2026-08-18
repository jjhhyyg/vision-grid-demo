import { describe, expect, it } from 'vitest'

import PortfolioDemo from '@/views/demo/PortfolioDemo.vue'

function createVm() {
  const vm = PortfolioDemo.data()
  Object.entries(PortfolioDemo.methods || {}).forEach(([name, fn]) => {
    vm[name] = fn.bind(vm)
  })
  Object.entries(PortfolioDemo.computed || {}).forEach(([name, getter]) => {
    Object.defineProperty(vm, name, {
      enumerable: true,
      configurable: true,
      get: () => getter.call(vm),
    })
  })
  return vm
}

describe('PortfolioDemo', () => {
  it('starts in the synthetic live-inspection view', () => {
    const vm = createVm()

    expect(vm.activeView).toBe('live')
    expect(vm.selectedDefect.code).toBe('A-02')
    expect(vm.contextItems.every((item) => !/客户|公司|集团|192\.168|172\.18|10\.\d+/.test(item.value))).toBe(true)
  })

  it('links anonymized camera evidence to a synthetic defect', () => {
    const vm = createVm()

    vm.selectCameraDefect(6)

    expect(vm.selectedDefect.code).toBe('A-03')
    expect(vm.selectedDefect.camera).toBe('CAM 06')
  })

  it('keeps demo records explicitly named and detached from production identities', () => {
    const vm = createVm()

    expect(vm.historyRecords.every((record) => record.batch.startsWith('DEMO-BATCH-'))).toBe(true)
    expect(vm.historyRecords.every((record) => record.id.startsWith('MAT-'))).toBe(true)
  })

  it('uses a neutral browser title while the demo is mounted', () => {
    const vm = createVm()
    document.title = 'Production title'

    PortfolioDemo.mounted.call(vm)

    expect(document.title).toBe('工业表面视觉检测工作站 / DEMO')

    PortfolioDemo.beforeUnmount.call(vm)
    expect(document.title).toBe('Production title')
  })
})
