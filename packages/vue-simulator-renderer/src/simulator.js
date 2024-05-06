import {
  reactive
} from 'vue'
import {
  AssetLoader
} from '@cc/lowcode-utils'

const loader = new AssetLoader()

function createSimulatorRenderer() {
  const simulator = reactive({
  })
  simulator.loadAsyncLibrary = async (asyncLibraryMap) => {
    await loader.loadAsyncLibrary(asyncLibraryMap)
  }
  return simulator
}

export default createSimulatorRenderer()