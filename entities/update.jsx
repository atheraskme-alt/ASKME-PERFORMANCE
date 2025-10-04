{
  "name": "Update",
  "type": "object",
  "properties": {
    "title": {
      "type": "string"
    },
    "content": {
      "type": "string"
    },
    "acknowledged_by": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "List of user emails who have acknowledged the update"
    }
  },
  "required": [
    "title",
    "content"
  ],
  "rls": {
    "read": {
      "created_by": "{{user.email}}"
    },
    "write": {
      "created_by": "{{user.email}}"
    }
  }
}
