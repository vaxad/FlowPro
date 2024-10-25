import { GenerateFormData } from "./types/generate-form";

export const placeholderData: GenerateFormData = 
{
    "name": "Project01",
    "description": "Project01 description",
    "auth": true,
    "entities": [
        {
            "name": "user",
            "attributes": [
                {
                    "name": "email",
                    "type": "string",
                    "constraint": {
                        "type": "unique"
                    }
                },
                {
                    "name": "password",
                    "type": "string"
                },
                {
                    "name": "createdAt",
                    "type": "Date"
                }
            ]
        },
        {
            "name": "task",
            "attributes": [
                {
                    "name": "description",
                    "type": "string"
                },
                {
                    "name": "title",
                    "type": "string"
                },
                {
                    "name": "sequence",
                    "type": "number"
                }
            ]
        }
    ],
    "relations": [
        {
            "from": "user",
            "to": "task",
            "type": "1-m",
            "name": "UserToTask"
        }
    ]
}