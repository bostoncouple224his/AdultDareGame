{
  "name": "Game",
  "type": "object",
  "properties": {
    "mode_icebreaker": {
      "type": "boolean",
      "default": false,
      "description": "Whether Icebreaker cards are activated"
    },
    "mode_intense": {
      "type": "boolean",
      "default": false,
      "description": "Whether intense cards are activated"
    },
    "mode_short": {
      "type": "boolean",
      "default": false,
      "description": "Whether short game mode is enabled"
    },
    "toys": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "List of available toys"
    },
    "player_names": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "Names of all players"
    },
    "turn_order": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "Current turn order (player names)"
    },
    "current_level": {
      "type": "string",
      "enum": [
        "icebreaker",
        "level1",
        "level2",
        "level3",
        "level4",
        "completed"
      ],
      "default": "icebreaker",
      "description": "Current game level"
    },
    "current_round": {
      "type": "number",
      "default": 1,
      "description": "Current round within the level"
    },
    "current_player_index": {
      "type": "number",
      "default": 0,
      "description": "Index of current challenger in turn_order"
    },
    "scores": {
      "type": "object",
      "description": "Player scores as key-value pairs"
    },
    "status": {
      "type": "string",
      "enum": [
        "setup",
        "in_progress",
        "completed"
      ],
      "default": "setup",
      "description": "Game status"
    },
    "terms_accepted": {
      "type": "boolean",
      "default": false,
      "description": "Whether terms of use were accepted"
    }
  },
  "required": [
    "player_names"
  ]
}