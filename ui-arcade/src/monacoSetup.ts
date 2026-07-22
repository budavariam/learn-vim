// Configures Monaco Web Workers using Vite's ?worker syntax so URLs resolve
// correctly in both dev and production. Must be imported before monaco-editor.
import EditorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'
import TsWorker    from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker'
import JsonWorker  from 'monaco-editor/esm/vs/language/json/json.worker?worker'
import CssWorker   from 'monaco-editor/esm/vs/language/css/css.worker?worker'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
;(window as any).MonacoEnvironment = {
  getWorker(_: unknown, label: string): Worker {
    if (label === 'json')                             return new JsonWorker()
    if (label === 'css' || label === 'scss' || label === 'less') return new CssWorker()
    if (label === 'typescript' || label === 'javascript')        return new TsWorker()
    return new EditorWorker()
  },
}
