import { stripeClient } from "./client";

const endpointSecret = process.env.STRIPE_ENDPOINT_SECRET || "";

const verifyStripreEvent = (body: any, signature: string) => {
  let event;
  try {
    console.log(body, signature, endpointSecret);
    event = stripeClient.webhooks.constructEvent(
      JSON.stringify(body),
      signature,
      endpointSecret
    );
  } catch (err) {
    // @ts-ignore
    console.log(`⚠️  Webhook signature verification failed.`, err.message);
    return null;
  }
  return event;
};

const handleEvents = async (event: any) => {
  // Handle the event
  switch (event.type) {
    case "checkout.session.async_payment_succeeded":
      const paymentIntent = event.data.object;
      console.log("PaymentIntent was successful!");
      console.log(event.data.object);
      break;
    case "checkout.session.async_payment_failed":
      const paymentMethod = event.data.object;
      console.log("PaymentMethod was failed!");
      console.log(event.data.object);
      break;
    default:
      // Unexpected event type
      console.log(`Unhandled event type ${event.type}.`);
  }
};

export const parseStripeEvent = async (body: Buffer, signature: string) => {
  let event = verifyStripreEvent(body, signature);

  if (!event) {
    return null;
  }

  try {
    handleEvents(event);
  } catch (err) {
    console.log(err);
  }

  return event;
};
