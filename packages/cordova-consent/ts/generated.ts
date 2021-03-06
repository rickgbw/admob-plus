// THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.
import { exec } from 'cordova'

export enum NativeActions {
  getStatus = 'getStatus',
  isFormAvailable = 'isFormAvailable',
  loadForm = 'loadForm',
  ready = 'ready',
  requestInfoUpdate = 'requestInfoUpdate',
  reset = 'reset',
  showForm = 'showForm',
}

export enum Events {
  ready = 'consent.ready',
}

export const execAsync = (action: string, args?: any[]) => {
  return new Promise((resolve, reject) => {
    exec(resolve, reject, 'Consent', action, args)
  })
}

export function fireDocumentEvent(eventName: string, data = null) {
  const event = new CustomEvent(eventName, { detail: data })
  document.dispatchEvent(event)
}

export function waitEvent(
  successEvent: string,
  failEvent = '',
): Promise<CustomEvent> {
  return new Promise((resolve, reject) => {
    document.addEventListener(
      successEvent as any,
      (event: CustomEvent) => {
        resolve(event)
      },
      false,
    )

    if (failEvent) {
      document.addEventListener(
        failEvent as any,
        (failedEvent: CustomEvent) => {
          reject(failedEvent)
        },
        false,
      )
    }
  })
}

export const initPlugin = () => {
  document.addEventListener(
    'deviceready',
    () => {
      exec(
        (event) => {
          fireDocumentEvent(event.type, event.data)
        },
        console.error,
        'Consent',
        NativeActions.ready,
      )
    },
    false,
  )
}
