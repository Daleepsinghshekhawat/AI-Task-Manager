const { z } = require("zod");

// Reusable title schema for validation
const titleSchema = z
  .string()
  .min(1, { message: "Title must not be empty" })
  .refine((val) => val.trim().length > 0, {
    message: "Title cannot be empty or whitespace only",
  });

// Schema for creating new tasks (title required)
const createTaskSchema = z.object({
  title: titleSchema,
  description: z.string().optional().nullable(),
  priority: z
    .enum(["Low", "Medium", "High"], {
      errorMap: () => ({ message: "Priority must be Low, Medium, or High" }),
    })
    .optional(),
  deadline: z
    .string()
    .nullable()
    .optional()
    .refine(
      (val) => {
        if (!val) return true;
        const date = new Date(val);
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Ignore time part for today's date
        return date >= today;
      },
      { message: "Deadline cannot be in the past" },
    ),
  completed: z.boolean().optional(),
});

// Schema for updating tasks (all fields optional for partial updates)
const updateTaskSchema = z
  .object({
    title: titleSchema.optional(),
    description: z.string().optional().nullable(),
    priority: z
      .enum(["Low", "Medium", "High"], {
        errorMap: () => ({ message: "Priority must be Low, Medium, or High" }),
      })
      .optional(),
    deadline: z
      .string()
      .nullable()
      .optional()
      .refine(
        (val) => {
          if (!val) return true;
          const date = new Date(val);
          const today = new Date();
          today.setHours(0, 0, 0, 0); // Ignore time part for today's date
          return date >= today;
        },
        { message: "Deadline cannot be in the past" },
      ),
    completed: z.boolean().optional(),
  })
  .strict();

module.exports = { createTaskSchema, updateTaskSchema };
