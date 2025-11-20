{
  "name": "Challenge",
  "type": "object",
  "properties": {
    "game_id": {
      "type": "string",
      "description": "Reference to the game"
    },
    "challenger_name": {
      "type": "string",
      "description": "Name of the challenger"
    },
    "opponents": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "Names of opponents in this challenge"
    },
    "dare_text": {
      "type": "string",
      "description": "The generated dare challenge"
    },
    "level": {
      "type": "string",
      "description": "Level this challenge was from"
    },
    "round": {
      "type": "number",
      "description": "Round number"
    },
    "is_active": {
      "type": "boolean",
      "default": true,
      "description": "Whether this is an active card"
    },
    "points": {
      "type": "number",
      "description": "Points awarded for this challenge"
    },
    "status": {
      "type": "string",
      "enum": [
        "pending",
        "completed",
        "rejected",
        "skipped"
      ],
      "default": "pending",
      "description": "Challenge status"
    },
    "duration": {
      "type": "number",
      "description": "Duration in seconds"
    }
  },
  "required": [
    "game_id",
    "challenger_name",
    "dare_text"
  ]
}