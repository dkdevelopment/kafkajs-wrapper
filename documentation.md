# Kafka wrapper documentation

## Getting started
First off you need to initialize Kafka wrapper. Make it in some start script of your server.
```typescript
import { initKafka } from 'kafka-wrapper'

Promise.resolve().then(async () => {
  await initKafka()
  // congrats you can start your work
})
```
Function accepts the config that is the same as in the module kafkajs. <br/>
You can find few lines setup in demos.

## Expanding the Commands/Events architecture (only typescript)
If you want to add some commands / events, you need to declare in some of your type files the extension of the global type, that we have produced.

In the following example we are creating the communication commands. So when service receives the `message.send` command should also respond with `message.sent` event. The philosophy behind this is that we can react from one of our consumers with sending email to e.g. offline recipent.
```typescript
declare global {
  interface Commands {
    'message.send': SomeMessageRequest
  }

  interface Events {
    'message.sent': SomeMessage
  }
}

interface SomeMessage {
  author: string
  receiver: string
  text: string
  date: Date
}

interface SomeMessageRequest extends Omit<SomeMessage, 'date'> {}
```