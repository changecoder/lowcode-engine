import { defineComponent, ref, onMounted, inject } from 'vue'

export default defineComponent({
  name: 'SimulatorView',
  setup() {
    const iframe = ref<any>(null)
    const host = inject('host') as any

    onMounted(() => {
      host.mountFrame(iframe.value)
    })

    return () => <iframe ref={iframe}></iframe>
  }
})