{
  "name": "Incentive",
  "type": "object",
  "properties": {
    "employee_email": {
      "type": "string",
      "description": "The email of the employee"
    },
    "type": {
      "type": "string",
      "enum": [
        "bonus",
        "performance_incentive",
        "project_completion",
        "monthly_reward",
        "annual_bonus",
        "other"
      ],
      "description": "Type of incentive"
    },
    "amount": {
      "type": "number",
      "description": "Incentive amount"
    },
    "description": {
      "type": "string",
      "description": "Description of why the incentive was given"
    },
    "date_awarded": {
      "type": "string",
      "format": "date",
      "description": "Date when incentive was awarded"
    },
    "approved_by": {
      "type": "string",
      "description": "Email of the approving authority"
    }
  },
  "required": [
    "employee_email",
    "type",
    "amount",
    "description",
    "date_awarded"
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
