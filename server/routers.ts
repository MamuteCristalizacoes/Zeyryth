import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import {
  getUserColors,
  createColor,
  deleteColor,
  getUserPalettes,
  createPalette,
  deletePalette,
  getAllArtistTags,
  createArtistTag,
  deleteArtistTag,
  getUserTags,
  assignTagToUser,
  removeTagFromUser,
  getUsersByTag,
  getChatMessages,
  createChatMessage,
} from "./db";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  colors: router({
    list: protectedProcedure.query(({ ctx }) =>
      getUserColors(ctx.user.id)
    ),
    create: protectedProcedure
      .input(
        z.object({
          htmlColor: z.string(),
          name: z.string().optional(),
        })
      )
      .mutation(({ ctx, input }) =>
        createColor(ctx.user.id, input.htmlColor, input.name)
      ),
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(({ input }) => deleteColor(input.id)),
  }),

  palettes: router({
    list: protectedProcedure.query(({ ctx }) =>
      getUserPalettes(ctx.user.id)
    ),
    create: protectedProcedure
      .input(
        z.object({
          name: z.string(),
          colors: z.array(z.string()),
          description: z.string().optional(),
          isPublic: z.boolean().optional(),
        })
      )
      .mutation(({ ctx, input }) =>
        createPalette(
          ctx.user.id,
          input.name,
          input.colors,
          input.description,
          input.isPublic
        )
      ),
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(({ input }) => deletePalette(input.id)),
  }),

  tags: router({
    list: publicProcedure.query(() => getAllArtistTags()),
    create: protectedProcedure
      .input(
        z.object({
          name: z.string(),
          description: z.string().optional(),
          icon: z.string().optional(),
          color: z.string().optional(),
        })
      )
      .mutation(({ ctx, input }) => {
        if (ctx.user.role !== 'admin') {
          throw new Error('Only admins can create tags');
        }
        return createArtistTag(input.name, input.description, input.icon, input.color);
      }),
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(({ ctx, input }) => {
        if (ctx.user.role !== 'admin') {
          throw new Error('Only admins can delete tags');
        }
        return deleteArtistTag(input.id);
      }),
    getUserTags: protectedProcedure.query(({ ctx }) =>
      getUserTags(ctx.user.id)
    ),
    assignToUser: protectedProcedure
      .input(
        z.object({
          userId: z.number(),
          tagId: z.number(),
        })
      )
      .mutation(({ ctx, input }) => {
        if (ctx.user.role !== 'admin') {
          throw new Error('Only admins can assign tags');
        }
        return assignTagToUser(input.userId, input.tagId);
      }),
    removeFromUser: protectedProcedure
      .input(
        z.object({
          userId: z.number(),
          tagId: z.number(),
        })
      )
      .mutation(({ ctx, input }) => {
        if (ctx.user.role !== 'admin') {
          throw new Error('Only admins can remove tags');
        }
        return removeTagFromUser(input.userId, input.tagId);
      }),
    getUsersByTag: publicProcedure
      .input(z.object({ tagId: z.number() }))
      .query(({ input }) => getUsersByTag(input.tagId)),
  }),

  chat: router({
    list: publicProcedure.query(() => getChatMessages()),
    send: protectedProcedure
      .input(
        z.object({
          content: z.string(),
          sharedColor: z.string().optional(),
        })
      )
      .mutation(({ ctx, input }) =>
        createChatMessage(ctx.user.id, ctx.user.name || "Artista", input.content, input.sharedColor)
      ),
  }),
});

export type AppRouter = typeof appRouter;
