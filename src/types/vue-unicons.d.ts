declare module 'vue-unicons/dist/icons' {
  import { Component } from 'vue'

  export const uniPlus: Component
  export const uniBell: Component
  export const uniTrashAlt: Component
  export const uniDownload: Component
  export const uniUpload: Component
  export const uniUsersAlt: Component
  export const uniBars: Component
}

declare module 'vue-unicons' {
  import { Plugin, Component } from 'vue'

  interface UniconInstance {
    add(icons: Component[]): void
  }

  const Unicon: UniconInstance & Plugin
  export default Unicon
}
