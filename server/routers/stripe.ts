import {
  createCheckoutSession,
  createExpressAccount,
  createLoginLink,
} from "@/lib/stripe/expressAccounts";
import { router, protectedProcedure } from "../trpc";
import { z } from "zod";
import prisma from "@/lib/prismadb";

export const stripeRouter = router({
  createNewAccount: protectedProcedure.mutation(async ({ ctx }) => {
    if (!ctx.session.user.email) {
      throw new Error("No email for user");
    }

    // check if user already has an account
    const accountStripeBind = await prisma.accountStripeBind.findFirst({
      where: {
        userId: ctx.session.user.id,
      },
    });

    // console.log(ctx.session.user);

    if (accountStripeBind) {
      throw new Error("User already has an account");
    }

    const account = await createExpressAccount(ctx.session.user.email);

    // save accountID to user
    await prisma.accountStripeBind.create({
      data: {
        user: {
          connect: {
            id: ctx.session.user.id,
          },
        },
        stripeId: account.id,
      },
    });

    return {
      account,
    };
  }),
  createAccountLink: protectedProcedure.mutation(async ({ ctx }) => {
    // get accountID from user
    const accountStripeBind = await prisma.accountStripeBind.findFirst({
      where: {
        userId: ctx.session.user.id,
      },
    });

    if (!accountStripeBind) {
      throw new Error("No account for user");
    }

    const accountLink = await createLoginLink(accountStripeBind.stripeId);

    return {
      accountLink,
    };
  }),
  testCheckout: protectedProcedure.mutation(async ({ ctx }) => {
    // get accountID from user
    const accountStripeBind = await prisma.accountStripeBind.findFirst({
      where: {
        userId: ctx.session.user.id,
      },
    });

    if (!accountStripeBind) {
      throw new Error("No account for user");
    }

    const purchaseLink = await createCheckoutSession(
      accountStripeBind.stripeId,
      10000
    );

    return {
      purchaseLink,
    };
  }),
});
