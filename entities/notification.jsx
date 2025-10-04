{
  "name": "Notification",
  "type": "object",
  "properties": {
    "recipient_email": {
      "type": "string",
      "description": "Email of the recipient, or 'all' for everyone"
    },
    "subject": {
      "type": "string"
    },
    "body": {
      "type": "string"
    },
    "sent_by": {
      "type": "string",
      "description": "Email of the admin who sent the notification"
    }
  },
  "required": [
    "recipient_email",
    "subject",
    "body",
    "sent_by"
  ],
  "rls": {
    "read": {
      "user_condition": {
        "role": "admin"
      }
    },
    "write": {
      "user_condition": {
        "role": "admin"
      }
    }
  }
}
