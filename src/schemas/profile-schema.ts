import { z } from "zod";

export type ProfileValues = {
    fullName: string;
    email: string;
    birthDate: string;
    accountType: "personal" | "business";
    companyName: string;
    role: "" | "developer" | "designer" | "manager" | "other";
    customRole: string;
    newsletter: boolean;
    frequency: "" | "daily" | "weekly";
}

export const initialValues: ProfileValues = {
    fullName: '',
    email: '',
    birthDate: '',
    accountType: "personal",
    companyName: '',
    role: '',
    customRole: '',
    newsletter: false,
    frequency: ''
}

export const getAge = (birthDate: string): number => {
    const birth = new Date(birthDate);
    const today = new Date();

    let age = today.getFullYear() - birth.getFullYear();
    const monthDifference = today.getMonth() - birth.getMonth();

    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birth.getDate())) {
        age = age - 1;
    }

    return age;
}

export const fieldsSchema = z.object({
    fullName: z.string().min(3, "Full name must have at least 3 characters"),
    email: z.email("Wrong email format"),
    birthDate: z.string()
        .min(1, "Birth date is required")
        .refine((value) => getAge(value) >= 18, "You must be at least 18 years old"),
    role: z.enum(["developer", "designer", "manager", "other"], { message: "Choose your role" })
});

export const relationsSchema = z.object({
    accountType: z.enum(["personal", "business"]),
    companyName: z.string(),
    role: z.string(),
    customRole: z.string(),
    newsletter: z.boolean(),
    frequency: z.string()
}).superRefine((data, ctx) => {
    if (data.accountType === "business" && data.companyName.trim().length < 2) {
        ctx.addIssue({
            code: "custom",
            message: "Company name is required for a business account",
            path: ["companyName"]
        });
    }

    if (data.role === "other" && data.customRole.trim().length < 2) {
        ctx.addIssue({
            code: "custom",
            message: "Describe your role",
            path: ["customRole"]
        });
    }

    if (data.newsletter && !data.frequency) {
        ctx.addIssue({
            code: "custom",
            message: "Choose how often you want letters",
            path: ["frequency"]
        });
    }
})
