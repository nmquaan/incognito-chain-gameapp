import GameData from '../data/GameData'

export default class ThemeHelper {
  static getTotal() {
    return 19;
  }

  static getCurrentTheme() {
    if (GameData.getThemeID() == 0)
      return this.getThemeDay();
    else
      return this.getThemeWood();
  }

  static getThemeWood() {
    return {
      "id": 1,
      "name": "Wood",
      "background": {
        "sprite": "img_back.png",
        "color": 0xFFFFFF,
      },
      "grid": {
        "colors": [
          0x422817,
          0x50321E
        ],
        "color_mainline": 0x2C1004,
        "color_subline": 0x3C1E0A
      },
      "block": {
        "sprite": "block_wood",
        "color_default": 0xFFFFFF,
        "color_dragging": 0xF0B482,
        "color_highlight": 0x000000,
        "colors_on_grid": [
          0xFFFFFF,
          0xFFFFFF,
          0xFFFFFF,
          0xFFFFFF,
          0xFFFFFF,
          0xFFFFFF,
          0xFFFFFF,
          0xFFFFFF,
          0xFFFFFF
        ]
      },
      "text_color": "#FFFFFF",
      "score_color": "#FFFFFF",
      "bestscore_color": "#A7A8AA",
      "ui_color": {
        "common_button": "FFFFFF",
        "common_popup_bg": 0x15728e,
        "common_title": "FFFFFF",
        "common_text": "5B3E3E",
        "home_play": "ff3b30",
        "home_theme": "54c7fd",
        "home_leaderboard": "54c7fd",
        "pause_home": "495a90",
        "pause_sound": "c79c62",
        "pause_resume": "e6624d",
        "pause_restart": "cb87c3"
      }
    };
  }

  static getThemeDay() {
    return {
      "id": 0,
      "name": "Light",
      "background": {
        "sprite": "",
        "color": 0xFAF8EF
      },
      "grid": {
        "colors": [
          0xE4E9EE,
          0xFFFFFF
        ],
        "color_mainline": 0x000000,
        "color_subline": 0xB9B9B9
      },
      "block": {
        "sprite": "",
        "color_default": 0x2E59B1,
        "color_dragging": 0x4099F5,
        "color_highlight": 0x000000,
        "colors_on_grid": [
          0x417EFB,
          0x407CF5,
          0x3E79F0,
          0x3D76EA,
          0x3B73E4,
          0x3970DE,
          0x386DD8,
          0x366AD2,
          0x3567CD
        ]
      },
      "text_color": "#5B3E3E",
      "score_color": "#5B3E3E",
      "bestscore_color": "#969595",
      "ui_color": {
        "common_button": 0x000000,
        "common_popup_bg": 0x63D6B4,
        "common_title": 0xFFFFFF,
        "common_text": 0x5B3E3E,
        "home_play": 0xff3b30,
        "home_theme": 0x54c7fd,
        "home_leaderboard": 0x54c7fd,
        "pause_home": 0x495a90,
        "pause_sound": 0xc79c62,
        "pause_resume": 0xe6624d,
        "pause_restart": 0xcb87c3,
        "game_rotate": 0xffffff
      }
    };
  }
}
