type SSEPush = (data: string) => void

let clients: SSEPush[] = []

export function addClient(push: SSEPush) {
  clients.push(push)
  return () => {
    clients = clients.filter((c) => c !== push)
  }
}

export function broadcastChange(data: unknown) {
  clients.forEach((push) => push(JSON.stringify(data)))
}

export function createSSEStream() {
  let controller: ReadableStreamDefaultController

  const readable = new ReadableStream({
    start(c) {
      controller = c
    },
  })

  const push = (data: string) => {
    controller.enqueue(`data: ${data}\n\n`)
  }

  return { readable, push }
}
