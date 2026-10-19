import { useState } from "react";
import type { FormEvent } from "react";
import { fieldsSchema, relationsSchema, initialValues } from "../schemas/profile-schema";
import type { ProfileValues } from "../schemas/profile-schema";
import { getFieldErrors } from "../schemas/get-field-errors";
import LivePreview from "./live-preview";

const ProfileForm = () => {
    const [values, setValues] = useState<ProfileValues>(initialValues);
    const [touched, setTouched] = useState<Record<string, boolean>>({});
    const [savedProfile, setSavedProfile] = useState<ProfileValues>();

    const fieldsResult = fieldsSchema.safeParse(values);
    const relationsResult = relationsSchema.safeParse(values);

    const errors: Record<string, string> = {
        ...(fieldsResult.success ? {} : getFieldErrors(fieldsResult.error)),
        ...(relationsResult.success ? {} : getFieldErrors(relationsResult.error))
    };

    const isValid = fieldsResult.success && relationsResult.success;

    const updateField = (field: keyof ProfileValues, value: string | boolean) => {
        const nextValues = { ...values, [field]: value };

        if (field === "accountType" && value === "personal") {
            nextValues.companyName = '';
        }

        if (field === "role" && value !== "other") {
            nextValues.customRole = '';
        }

        if (field === "newsletter" && value === false) {
            nextValues.frequency = '';
        }

        setValues(nextValues);
        setTouched({ ...touched, [field]: true });
    }

    const handleBlur = (field: keyof ProfileValues) => {
        setTouched({ ...touched, [field]: true });
    }

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setSavedProfile(values);
    }

    const handleReset = () => {
        setValues(initialValues);
        setTouched({});
        setSavedProfile(undefined);
    }

    const showError = (field: string) => {
        if (!touched[field] || !errors[field]) {
            return null;
        }

        return <p className="text-red-700">{errors[field]}</p>;
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <form onSubmit={handleSubmit}>
                <h2 className="font-bold">Profile</h2>
                <hr />

                <div className="mt-2 mb-2">
                    <label htmlFor="fullName" className="block">Full name</label>
                    <input
                        id="fullName"
                        value={values.fullName}
                        onChange={(event) => updateField("fullName", event.target.value)}
                        onBlur={() => handleBlur("fullName")}
                        className="border p-1"
                    />
                    {showError("fullName")}
                </div>

                <div className="mb-2">
                    <label htmlFor="email" className="block">Email</label>
                    <input
                        id="email"
                        type="email"
                        value={values.email}
                        onChange={(event) => updateField("email", event.target.value)}
                        onBlur={() => handleBlur("email")}
                        className="border p-1"
                    />
                    {showError("email")}
                </div>

                <div className="mb-2">
                    <label htmlFor="birthDate" className="block">Birth date</label>
                    <input
                        id="birthDate"
                        type="date"
                        value={values.birthDate}
                        onChange={(event) => updateField("birthDate", event.target.value)}
                        onBlur={() => handleBlur("birthDate")}
                        className="border p-1"
                    />
                    {showError("birthDate")}
                </div>

                <div className="mb-2">
                    <label htmlFor="accountType" className="block">Account type</label>
                    <select
                        id="accountType"
                        value={values.accountType}
                        onChange={(event) => updateField("accountType", event.target.value)}
                        className="border p-1"
                    >
                        <option value="personal">Personal</option>
                        <option value="business">Business</option>
                    </select>
                </div>

                {values.accountType === "business" &&
                    <div className="mb-2">
                        <label htmlFor="companyName" className="block">Company name</label>
                        <input
                            id="companyName"
                            value={values.companyName}
                            onChange={(event) => updateField("companyName", event.target.value)}
                            onBlur={() => handleBlur("companyName")}
                            className="border p-1"
                        />
                        {showError("companyName")}
                    </div>}

                <div className="mb-2">
                    <label htmlFor="role" className="block">Role</label>
                    <select
                        id="role"
                        value={values.role}
                        onChange={(event) => updateField("role", event.target.value)}
                        onBlur={() => handleBlur("role")}
                        className="border p-1"
                    >
                        <option value="">Pick a role</option>
                        <option value="developer">Developer</option>
                        <option value="designer">Designer</option>
                        <option value="manager">Manager</option>
                        <option value="other">Other</option>
                    </select>
                    {showError("role")}
                </div>

                {values.role === "other" &&
                    <div className="mb-2">
                        <label htmlFor="customRole" className="block">Your role</label>
                        <input
                            id="customRole"
                            value={values.customRole}
                            onChange={(event) => updateField("customRole", event.target.value)}
                            onBlur={() => handleBlur("customRole")}
                            className="border p-1"
                        />
                        {showError("customRole")}
                    </div>}

                <div className="mb-2">
                    <label htmlFor="newsletter">
                        <input
                            id="newsletter"
                            type="checkbox"
                            checked={values.newsletter}
                            onChange={(event) => updateField("newsletter", event.target.checked)}
                            className="mr-2"
                        />
                        Newsletter
                    </label>
                </div>

                {values.newsletter &&
                    <div className="mb-2">
                        <label htmlFor="frequency" className="block">Frequency</label>
                        <select
                            id="frequency"
                            value={values.frequency}
                            onChange={(event) => updateField("frequency", event.target.value)}
                            onBlur={() => handleBlur("frequency")}
                            className="border p-1"
                        >
                            <option value="">Pick frequency</option>
                            <option value="daily">Daily</option>
                            <option value="weekly">Weekly</option>
                        </select>
                        {showError("frequency")}
                    </div>}

                <button type="submit" disabled={!isValid} className="border px-2 bg-gray-200 mr-2 disabled:opacity-50">
                    Save
                </button>
                <button type="button" onClick={handleReset} className="border px-2">
                    Reset
                </button>

                {savedProfile && <p className="text-green-700">Profile saved</p>}
            </form>

            <LivePreview values={values} isValid={isValid} />
        </div>
    )
}

export default ProfileForm;
