import { stripeClient } from "./client";

export const createExpressAccount = async (email: string) => {
  const account = await stripeClient.accounts.create({
    type: "express",
    email,
  });
  return account;
};

export const getAccountById = async (accountId: string) => {
  const account = await stripeClient.accounts.retrieve(accountId);
  return account;
};

export const checkAccountIfVerified = async (accountId: string) => {
  const account = await getAccountById(accountId);
  return account.details_submitted;
};

export const createLoginLink = async (
  accountId: string,
  refresh_url?: string,
  return_url?: string
) => {
  const link = await stripeClient.accountLinks.create({
    account: accountId,
    refresh_url: refresh_url || "http://localhost:3000", // recall the accounts loginlink on this page again
    return_url: return_url || "http://localhost:3000", // on success, redirect to this page
    type: "account_onboarding",
  });
  return link;
};

export const createCheckoutSession = async (
  accountId: string,
  price: number,
  success_url?: string,
  cancel_url?: string
) => {
  // assuming price is already in cents
  const stripeCut = Math.ceil(price * 0.029) + 30;
  const platformCut = 5.0 * 100;

  const session = await stripeClient.checkout.sessions.create({
    // payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: "T-shirt",
          },
          unit_amount: price,
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: success_url || "http://localhost:3000", // on success, redirect to this page
    cancel_url: cancel_url || "http://localhost:3000", // on failure, redirect to this page
    payment_intent_data: {
      application_fee_amount: stripeCut + platformCut,
      transfer_data: {
        destination: accountId,
      },
    },
  });
  return session;
};
