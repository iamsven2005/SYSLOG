/**
 * broadcast.ts - 2025-05-26 by sven.tan
 *
 * Description:
 *   This module provides an in-memory event broadcasting system that allows components or services
 *   to subscribe to events on specific channels and receive notifications when events are published.
 *   This system is designed to be simple and effective for single-server setups, but for production
 *   environments with multi-server setups, a more robust solution like Redis should be used.
 *
 * Key Functions:
 *   - `subscribe(channel: string, listener: Listener)`: Subscribes to an event channel and provides the listener with updates on the channel.
 *   - `publish(channel: string, data: T)`: Publishes an event with the specified data to the given channel, notifying all subscribers.
 *   - `getListenerCount(channel: string)`: Returns the number of active listeners subscribed to the specified channel.
 *   - `clearAllListeners()`: Clears all listeners, typically for testing or cleanup purposes.
 *
 * Behavior:
 *   - `subscribe`: When subscribing to a channel, the system adds the listener to the list of listeners for the given channel. 
 *     If the channel already has an event that was previously published, the listener is immediately called with the last event's data.
 *   - `publish`: When publishing an event, the system broadcasts the event to all active listeners on that channel. 
 *     It also stores the last event sent on that channel, which is sent to any new subscribers.
 *   - `getListenerCount`: Returns the number of listeners currently subscribed to a specific channel.
 *   - `clearAllListeners`: Clears all event listeners from all channels, useful for cleanup or testing.
 *
 * Example Usage:
 *   - Subscribe to an event channel:
 *     ```ts
 *     const unsubscribe = subscribe("channel-name", (data) => {
 *       console.log("Received event data:", data)
 *     })
 *     ```
 *   - Publish an event to the channel:
 *     ```ts
 *     publish("channel-name", { message: "Hello, world!" })
 *     ```
 *   - Get the listener count:
 *     ```ts
 *     const count = getListenerCount("channel-name")
 *     console.log("Listener count:", count)
 *     ```
 *   - Unsubscribe from the channel:
 *     ```ts
 *     unsubscribe()
 *     ```
 *
 * Notes:
 *   - This event bus is designed to work in-memory, making it ideal for single-server scenarios.
 *   - For multi-server or production environments, it is recommended to replace this system with a distributed message broker such as Redis or Kafka.
 *   - The system stores the last event sent to each channel, allowing new subscribers to receive the most recent event immediately upon subscribing.
 */
type Listener<T = unknown> = (data: T) => void

interface EventBus {
  [channel: string]: {
    listeners: Listener[];
    lastEvent?: unknown;
  };
}

// Store event listeners by channel
const eventBus: EventBus = {}

// Subscribe to a channel
export function subscribe(channel: string, listener: Listener) {
  if (!eventBus[channel]) {
    eventBus[channel] = { listeners: [] }
  }

  eventBus[channel].listeners.push(listener)

  // Send the last event to new subscribers (useful for late joiners)
  if (eventBus[channel].lastEvent) {
    listener(eventBus[channel].lastEvent)
  }

  // Return unsubscribe function
  return () => {
    eventBus[channel].listeners = eventBus[channel].listeners.filter((l) => l !== listener)
  }
}

// Publish an event to a channel
export function publish<T = unknown>(channel: string, data: T) {
  if (!eventBus[channel]) {
    eventBus[channel] = { listeners: [] }
  }

  eventBus[channel].lastEvent = data

  eventBus[channel].listeners.forEach((listener) => {
    try {
      listener(data)
    } catch (error) {
      console.error(`Error in event listener for channel ${channel}:`, error)
    }
  })
}

// Get active listener count for a channel
export function getListenerCount(channel: string): number {
  return eventBus[channel]?.listeners.length || 0
}

// Clear all listeners for testing/cleanup
export function clearAllListeners() {
  Object.keys(eventBus).forEach((channel) => {
    eventBus[channel].listeners = []
  })
}
