{
  "name": "PerformanceRecord",
  "type": "object",
  "properties": {
    "employee_email": {
      "type": "string",
      "description": "The email of the employee this record belongs to"
    },
    "date": {
      "type": "string",
      "format": "date",
      "description": "The date of the performance record"
    },
    "punctuality": {
      "type": "number",
      "minimum": 0,
      "maximum": 10,
      "description": "Punctuality score from 0 to 10"
    },
    "attitude": {
      "type": "number",
      "minimum": 0,
      "maximum": 10,
      "description": "Attitude & behavior score from 0 to 10"
    },
    "responsiveness": {
      "type": "number",
      "minimum": 0,
      "maximum": 10,
      "description": "Responsiveness score from 0 to 10"
    },
    "hr_remarks": {
      "type": "string",
      "description": "Detailed comments from HR"
    }
  },
  "required": [
    "employee_email",
    "date"
  ],
  "rls": {
    "read": {
      "$or": [
        {
          "employee_email": "{{user.email}}"
        },
        {
          "user_condition": {
            "role": "admin"
          }
        }
      ]
    },
    "write": {
      "user_condition": {
        "role": "admin"
      }
    }
  }
}
