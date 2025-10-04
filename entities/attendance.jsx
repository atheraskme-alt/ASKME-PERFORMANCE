{
  "name": "Attendance",
  "type": "object",
  "properties": {
    "employee_email": {
      "type": "string",
      "description": "The email of the employee"
    },
    "date": {
      "type": "string",
      "format": "date",
      "description": "The attendance date"
    },
    "status": {
      "type": "string",
      "enum": [
        "present",
        "absent",
        "late",
        "half_day"
      ],
      "description": "Attendance status"
    },
    "check_in_time": {
      "type": "string",
      "description": "Check-in time (HH:MM format)"
    },
    "check_out_time": {
      "type": "string",
      "description": "Check-out time (HH:MM format)"
    },
    "hours_worked": {
      "type": "number",
      "description": "Total hours worked"
    },
    "notes": {
      "type": "string",
      "description": "Additional notes about attendance"
    }
  },
  "required": [
    "employee_email",
    "date",
    "status"
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
