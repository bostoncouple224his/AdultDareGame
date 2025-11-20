{
  "name": "Player",
  "type": "object",
  "properties": {
    "game_id": {
      "type": "string",
      "description": "Reference to the game"
    },
    "name": {
      "type": "string",
      "description": "Player name"
    },
    "body_features": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "Selected body features"
    },
    "preferences": {
      "type": "object",
      "properties": {
        "act1_do": {
          "type": "boolean",
          "default": false
        },
        "act1_receive": {
          "type": "boolean",
          "default": false
        },
        "act2_do": {
          "type": "boolean",
          "default": false
        },
        "act2_receive": {
          "type": "boolean",
          "default": false
        },
        "act3_do": {
          "type": "boolean",
          "default": false
        },
        "act3_receive": {
          "type": "boolean",
          "default": false
        },
        "act4_do": {
          "type": "boolean",
          "default": false
        }
      },
      "description": "Player preferences for different acts"
    },
    "exclusions": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "Excluded challenge types"
    },
    "opponents": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "Selected opponent names"
    },
    "score": {
      "type": "number",
      "default": 0,
      "description": "Current player score"
    }
  },
  "required": [
    "game_id",
    "name"
  ]
}