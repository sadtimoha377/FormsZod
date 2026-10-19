import type { ProfileValues } from "../schemas/profile-schema";

type LivePreviewProps = {
    values: ProfileValues;
    isValid: boolean;
}

const LivePreview = ({ values, isValid }: LivePreviewProps) => {
    return (
        <div>
            <h2 className="font-bold">Live preview</h2>
            <hr />
            <p className="mt-2">Form is {isValid ? "valid" : "not valid yet"}</p>
            <pre className="border p-2 mt-2 bg-gray-100 overflow-auto">{JSON.stringify(values, null, 2)}</pre>
        </div>
    )
}

export default LivePreview;
