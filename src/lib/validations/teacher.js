import { z } from "zod";

export const teacherSchema = z.object({
	firstName: z.string().min(1, "First name is required"),
	lastName: z.string().min(1, "Last name is required"),
	email: z.string().email("Invalid email address"),
	phone: z.string().min(10, "Valid phone number required"),
	dob: z.string(),
	gender: z.string(),
	employeeId: z.string().min(1, "Employee ID is required"),
	designation: z.string(),
	department: z.string(),
	basicSalary: z.string().transform(Number),
	username: z.string(),
	password: z.string().min(6),
	role: z.literal("TEACHER"),
	schoolId: z.string(), // Yeh hum session se lenge
});
