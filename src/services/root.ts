type BaseRoot = typeof globalThis | Window

//@ts-ignore
interface IRoot extends BaseRoot {
  [x: string]: any
  __cache?: any
}

const Root = ((typeof self === 'object' && self.self === self && self) ||
  (typeof global === 'object' && global.global === global && global) ||
  this) as IRoot

export default Root
