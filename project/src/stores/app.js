import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
  state: () => ({
    sidebar: {
      opened: true,
      withoutAnimation: false,
      mobileOpen: false
    },
    device: window.innerWidth > 768 ? 'desktop' : 'mobile',
    size: 'default'
  }),

  actions: {
    toggleSidebar() {
      if (this.device === 'mobile') {
        this.sidebar.mobileOpen = !this.sidebar.mobileOpen
      } else {
        this.sidebar.opened = !this.sidebar.opened
        this.sidebar.withoutAnimation = false
      }
    },

    closeSidebar(withoutAnimation) {
      this.sidebar.opened = false
      this.sidebar.mobileOpen = false
      this.sidebar.withoutAnimation = withoutAnimation
    },

    toggleDevice(device) {
      this.device = device
      if (device === 'mobile') {
        this.sidebar.opened = true
        this.sidebar.mobileOpen = false
      }
    },

    setSize(size) {
      this.size = size
    },

    initDevice() {
      const width = window.innerWidth
      this.device = width > 768 ? 'desktop' : 'mobile'
      if (this.device === 'mobile') {
        this.sidebar.opened = true
        this.sidebar.mobileOpen = false
      }
    }
  }
})