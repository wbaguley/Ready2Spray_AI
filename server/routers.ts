import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
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

  // Organization router
  organization: router({
    get: protectedProcedure.query(async ({ ctx }) => {
      const { getOrCreateUserOrganization } = await import("./db");
      return await getOrCreateUserOrganization(ctx.user.id);
    }),
    update: protectedProcedure
      .input(
        z.object({
          name: z.string().optional(),
          address: z.string().optional(),
          city: z.string().optional(),
          state: z.string().optional(),
          zipCode: z.string().optional(),
          phone: z.string().optional(),
          email: z.string().optional(),
          website: z.string().optional(),
          notes: z.string().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const { updateOrganization } = await import("./db");
        const { getOrCreateUserOrganization } = await import("./db");
        const org = await getOrCreateUserOrganization(ctx.user.id);
        return await updateOrganization(org.id, input);
      }),
  }),

  // Customer router
  customers: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      const { getOrCreateUserOrganization, getCustomersByOrgId } = await import("./db");
      const org = await getOrCreateUserOrganization(ctx.user.id);
      return await getCustomersByOrgId(org.id);
    }),
    create: protectedProcedure
      .input((raw: any) => raw)
      .mutation(async ({ ctx, input }) => {
        const { getOrCreateUserOrganization, createCustomer } = await import("./db");
        const org = await getOrCreateUserOrganization(ctx.user.id);
        return await createCustomer({ ...input, orgId: org.id });
      }),
    update: protectedProcedure
      .input((raw: any) => raw)
      .mutation(async ({ input }) => {
        const { updateCustomer } = await import("./db");
        return await updateCustomer(input.id, input);
      }),
    delete: protectedProcedure
      .input((raw: any) => raw)
      .mutation(async ({ input }) => {
        const { deleteCustomer } = await import("./db");
        await deleteCustomer(input.id);
        return { success: true };
      }),
  }),

  // Jobs router
  jobs: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      const { getOrCreateUserOrganization, getJobsByOrgId } = await import("./db");
      const org = await getOrCreateUserOrganization(ctx.user.id);
      return await getJobsByOrgId(org.id);
    }),
    create: protectedProcedure
      .input((raw: any) => raw)
      .mutation(async ({ ctx, input }) => {
        const { getOrCreateUserOrganization, createJob } = await import("./db");
        const org = await getOrCreateUserOrganization(ctx.user.id);
        return await createJob({ ...input, orgId: org.id });
      }),
    update: protectedProcedure
      .input((raw: any) => raw)
      .mutation(async ({ input }) => {
        const { updateJob } = await import("./db");
        return await updateJob(input.id, input);
      }),
    delete: protectedProcedure
      .input((raw: any) => raw)
      .mutation(async ({ input }) => {
        const { deleteJob } = await import("./db");
        await deleteJob(input.id);
        return { success: true };
      }),
  }),

  // Personnel router
  personnel: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      const { getOrCreateUserOrganization, getPersonnelByOrgId } = await import("./db");
      const org = await getOrCreateUserOrganization(ctx.user.id);
      return await getPersonnelByOrgId(org.id);
    }),
    create: protectedProcedure
      .input((raw: any) => raw)
      .mutation(async ({ ctx, input }) => {
        const { getOrCreateUserOrganization, createPersonnel } = await import("./db");
        const org = await getOrCreateUserOrganization(ctx.user.id);
        return await createPersonnel({ ...input, orgId: org.id });
      }),
    update: protectedProcedure
      .input((raw: any) => raw)
      .mutation(async ({ input }) => {
        const { updatePersonnel } = await import("./db");
        return await updatePersonnel(input.id, input);
      }),
    delete: protectedProcedure
      .input((raw: any) => raw)
      .mutation(async ({ input }) => {
        const { deletePersonnel } = await import("./db");
        await deletePersonnel(input.id);
        return { success: true };
      }),
  }),

  // Products router
  products: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      const { getOrCreateUserOrganization, getProductsByOrgId } = await import("./db");
      const org = await getOrCreateUserOrganization(ctx.user.id);
      return await getProductsByOrgId(org.id);
    }),
  }),

  // AI Chat router
  ai: router({
    listConversations: protectedProcedure.query(async ({ ctx }) => {
      const { getOrCreateUserOrganization, getConversationsByOrgId } = await import("./db");
      const org = await getOrCreateUserOrganization(ctx.user.id);
      return await getConversationsByOrgId(org.id);
    }),
    createConversation: protectedProcedure
      .input((raw: any) => raw)
      .mutation(async ({ ctx, input }) => {
        const { getOrCreateUserOrganization, createConversation } = await import("./db");
        const org = await getOrCreateUserOrganization(ctx.user.id);
        return await createConversation({ orgId: org.id, userId: ctx.user.id, ...input });
      }),
    getMessages: protectedProcedure
      .input((raw: any) => raw)
      .query(async ({ input }) => {
        const { getMessagesByConversationId } = await import("./db");
        return await getMessagesByConversationId(input.conversationId);
      }),
    sendMessage: protectedProcedure
      .input((raw: any) => raw)
      .mutation(async ({ ctx, input }) => {
        const { createMessage, getOrCreateUserOrganization, getMessagesByConversationId } = await import("./db");
        const { getClaudeResponse } = await import("./claude");
        
        const org = await getOrCreateUserOrganization(ctx.user.id);
        
        // Save user message
        const userMessage = await createMessage({
          conversationId: input.conversationId,
          role: "user",
          content: input.content,
        });

        // Get conversation history
        const history = await getMessagesByConversationId(input.conversationId);
        const messages = history.slice(-10).map((m: any) => ({
          role: m.role as 'user' | 'assistant',
          content: m.content,
        }));

        // Get AI response with MCP tools
        try {
          const { mcpTools, executeMCPTool } = await import("./mcpTools");
          
          const response = await getClaudeResponse({
            messages,
            systemPrompt: `You are a helpful agricultural operations assistant for Ready2Spray. You help with job scheduling, weather conditions, EPA compliance, and agricultural operations.

You have access to tools to query jobs, customers, personnel, weather, and EPA products. Use these tools when users ask about specific data.

Be concise and practical. When presenting data from tools, format it clearly.`,
            tools: mcpTools,
            maxTokens: 2048,
          });

          let assistantContent = "";
          const toolResults: string[] = [];

          // Process response content and handle tool calls
          for (const block of response.content) {
            if (block.type === 'text') {
              assistantContent += block.text;
            } else if (block.type === 'tool_use') {
              // Execute the tool
              const toolResult = await executeMCPTool(
                block.name,
                block.input,
                { organizationId: org.id, userId: ctx.user.id }
              );
              toolResults.push(`Tool: ${block.name}\nResult: ${JSON.stringify(toolResult, null, 2)}`);
              
              // If tool was used, get follow-up response from Claude with tool results
              if (response.stopReason === 'tool_use') {
                const followUpMessages = [
                  ...messages,
                  {
                    role: 'assistant' as const,
                    content: JSON.stringify(block)
                  },
                  {
                    role: 'user' as const,
                    content: `Tool result: ${JSON.stringify(toolResult)}`
                  }
                ];
                
                const followUpResponse = await getClaudeResponse({
                  messages: followUpMessages,
                  systemPrompt: `You are a helpful agricultural operations assistant for Ready2Spray. Present the tool results in a clear, user-friendly format.`,
                  maxTokens: 2048,
                });
                
                for (const followUpBlock of followUpResponse.content) {
                  if (followUpBlock.type === 'text') {
                    assistantContent += followUpBlock.text;
                  }
                }
              }
            }
          }

          if (!assistantContent && toolResults.length > 0) {
            assistantContent = toolResults.join('\n\n');
          } else if (!assistantContent) {
            assistantContent = "I apologize, but I couldn't generate a response. Please try again.";
          }

          // Save assistant message
          const assistantMessage = await createMessage({
            conversationId: input.conversationId,
            role: "assistant",
            content: assistantContent,
          });

          return { 
            userMessage, 
            assistantMessage,
            usage: response.usage,
          };
        } catch (error: any) {
          console.error('[AI] Error details:', {
            message: error.message,
            stack: error.stack,
            name: error.name,
            cause: error.cause
          });
          // Save error message
          const errorMessage = await createMessage({
            conversationId: input.conversationId,
            role: "assistant",
            content: `I apologize, but I encountered an error: ${error.message}. Please try again.`,
          });
          return { userMessage, assistantMessage: errorMessage };
        }
      }),
  }),

  // Maps router
  maps: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      const { getOrCreateUserOrganization, getMapsByOrgId } = await import("./db");
      const org = await getOrCreateUserOrganization(ctx.user.id);
      return await getMapsByOrgId(org.id);
    }),
    upload: protectedProcedure
      .input((raw: any) => raw)
      .mutation(async ({ ctx, input }) => {
        const { getOrCreateUserOrganization, createMap } = await import("./db");
        const { storagePut } = await import("./storage");
        const org = await getOrCreateUserOrganization(ctx.user.id);

        // Decode base64 and upload to S3
        const base64Data = input.fileData.split(",")[1];
        const buffer = Buffer.from(base64Data, "base64");
        const fileKey = `maps/${org.id}/${Date.now()}-${input.fileName}`;
        const { url } = await storagePut(fileKey, buffer, `application/${input.fileType}`);

        return await createMap({
          orgId: org.id,
          name: input.name,
          fileUrl: url,
          fileKey,
          fileType: input.fileType,
          publicUrl: url,
        });
      }),
    delete: protectedProcedure
      .input((raw: any) => raw)
      .mutation(async ({ input }) => {
        const { deleteMap } = await import("./db");
        await deleteMap(input.id);
        return { success: true };
      }),
  }),

  // Agrian EPA Product Lookup router
  agrian: router({
    searchProducts: protectedProcedure
      .input((raw: any) => raw)
      .query(async ({ input }) => {
        const { searchAgrianProducts } = await import("./agrian");
        return await searchAgrianProducts(input);
      }),
    getProductDetail: protectedProcedure
      .input((raw: any) => raw)
      .query(async ({ input }) => {
        const { getAgrianProductDetail } = await import("./agrian");
        return await getAgrianProductDetail(input.url, input.state, input.commodity);
      }),
  }),
});

export type AppRouter = typeof appRouter;
